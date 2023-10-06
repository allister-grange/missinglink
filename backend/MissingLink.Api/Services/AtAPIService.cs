using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using missinglink.Models;
using missinglink.Utils;
using Microsoft.Extensions.Logging;
using missinglink.Repository;
using missinglink.Models.AT;
using Newtonsoft.Json;
using missinglink.Models.AT.ServiceAlert;
using Microsoft.Extensions.Options;

namespace missinglink.Services
{
  public class AtAPIService : IBaseServiceAPI
  {
    private readonly HttpClient _httpClient;
    private readonly ILogger<AtAPIService> _logger;
    private readonly IServiceRepository _serviceRepository;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly AtApiConfig _atApiConfig;

    public AtAPIService(ILogger<AtAPIService> logger, IHttpClientFactory clientFactory,
                        IOptions<AtApiConfig> atApiConfigOptions, IServiceRepository serviceRepository,
                        IDateTimeProvider dateTimeProvider)
    {
      _httpClient = clientFactory.CreateClient("ATService");
      _logger = logger;
      _serviceRepository = serviceRepository;
      _dateTimeProvider = dateTimeProvider;
      _atApiConfig = atApiConfigOptions.Value;
    }
    public async Task<List<Service>> FetchLatestTripDataFromUpstreamService()
    {
      // Get all the trips 
      var tripUpdatesTask = FetchDataFromATApi<AtTripUpdatesResponse, Entity>(
        $"{_atApiConfig.BaseUrl}{_atApiConfig.TripUpdatesEndpoint}",
        res => res.Response.Entity
      );

      var cancelledTask = FetchDataFromATApi<AtServiceAlert, ServiceAlertEntity>(
          $"{_atApiConfig.BaseUrl}{_atApiConfig.ServiceAlertsEndpoint}",
          res => res.Response.Entity
      );

      var positionsTask = FetchDataFromATApi<AtVehiclePositionResponse, PositionResponseEntity>(
          $"{_atApiConfig.BaseUrl}{_atApiConfig.VehicleLocationsEndpoint}",
          res => res.Response.Entity
      );

      var routesTask = FetchDataFromATApi<AtRouteResponse, Datum>(
          $"{_atApiConfig.BaseUrl}{_atApiConfig.RoutesEndpoint}",
          res => res.Data
      );

      await Task.WhenAll(tripUpdatesTask, cancelledTask, positionsTask, routesTask);

      var tripUpdates = tripUpdatesTask.Result;
      var positions = positionsTask.Result;
      var routes = routesTask.Result;
      var cancellations = cancelledTask.Result;

      tripUpdates.RemoveAll(trip => trip.TripUpdate == null);

      var allServicesParsed = ParseATResponsesIntoServices(tripUpdates, positions, routes);

      // cancelled services are matched against the trip updates, so I'm only including 
      // cancellations for current trips, not ones tomorrow etc
      // this means I grab the cancellations, then I remove the trip updates so they're not 
      // counted twice
      var cancelledServicesToBeAdded = GetCancelledServicesToBeAdded(cancellations, routes, tripUpdates);

      foreach (var cancellation in cancellations)
      {
        var tripUpdateId = cancellation.Alert.InformedEntity.FirstOrDefault(informedEntity => informedEntity.Trip?.TripId != null);

        if (tripUpdateId == null)
        {
          continue;
        }

        tripUpdates.RemoveAll((trip) => trip.TripUpdate.Trip.TripId == tripUpdateId.Trip.TripId);
      }

      allServicesParsed.AddRange(cancelledServicesToBeAdded);

      return allServicesParsed;
    }


    private async Task<List<TResponseEntity>> FetchDataFromATApi<TResponse, TResponseEntity>(string apiUrl, Func<TResponse, List<TResponseEntity>> entitySelector)
    {
      try
      {
        var response = await MakeAPIRequest(apiUrl);
        if (response.IsSuccessStatusCode)
        {
          var responseStream = await response.Content.ReadAsStringAsync();
          var deserializedResponse = JsonConvert.DeserializeObject<TResponse>(responseStream);
          return entitySelector(deserializedResponse);
        }
        else
        {
          _logger.LogError($"Error making API call to: {apiUrl}");
          return new List<TResponseEntity>();
        }
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while fetching data from the AT api");
        return new List<TResponseEntity>();
      }
    }

    private List<Service> ParseATResponsesIntoServices(List<Entity> tripUpdates,
      List<PositionResponseEntity> positions, List<Datum> routes)
    {
      DateTime currentUtc = _dateTimeProvider.UtcNow;

      TimeZoneInfo nzTimeZone = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time");
      DateTime nzDateTime = TimeZoneInfo.ConvertTime(currentUtc, nzTimeZone);
      string formattedDate = nzDateTime.ToString("yyyyMMdd");
      string formattedTime = nzDateTime.ToString("HH:mm:ss");

      var newServices = new List<Service>();

      // when vehicle ids match, we want to grab the one with the latest start time
      var tripUpdatesWithUniqueVehicleIds = tripUpdates.GroupBy(e => e.TripUpdate?.Vehicle?.Id)
            .Select(g => g.OrderByDescending(e => e.TripUpdate.Trip.StartTime).First())
            .ToList();

      // we aren't interested in trip updates for tomorrow (why does AT include this??)
      var tripUpdatesOnlyToday = tripUpdatesWithUniqueVehicleIds
          .Where(trip =>
          {
            return trip.TripUpdate.Trip.StartDate == formattedDate && trip.TripUpdate.Trip.StartTime.CompareTo(formattedTime) < 0;
          })
          .ToList();

      foreach (var trip in tripUpdatesOnlyToday)
      {
        var newService = new Service();

        // find route the trip is on 
        var routeForTrip = routes.FirstOrDefault(route => route.Id == trip.TripUpdate.Trip?.RouteId);

        if (routeForTrip != null)
        {
          newService.RouteId = routeForTrip.Id;
          newService.RouteDescription = routeForTrip.Attributes.RouteLongName;
          newService.RouteShortName = routeForTrip.Attributes.RouteShortName;
          newService.RouteLongName = routeForTrip.Attributes.RouteLongName;
          newService.ServiceName = routeForTrip.Attributes.RouteShortName;
        }

        // find the position of the service in the trip
        var positionForTrip = positions.FirstOrDefault(position => position.Id == trip.TripUpdate?.Vehicle?.Id);

        if (positionForTrip != null)
        {
          newService.Lat = positionForTrip.Vehicle.Position.Latitude;
          newService.Long = positionForTrip.Vehicle.Position.Longitude;
          newService.Bearing = positionForTrip.Vehicle.Position.Bearing;
        }

        newService.Delay = trip.TripUpdate.Delay;
        if (newService.Delay > 180)
        {
          newService.Status = "LATE";
        }
        else if (newService.Delay < -90)
        {
          newService.Status = "EARLY";
        }
        else if (newService.Delay == 0)
        {
          newService.Status = "UNKNOWN";
        }
        else
        {
          newService.Status = "ONTIME";
        }

        newService.ProviderId = "AT";
        newService.TripId = trip.Id;
        newService.VehicleId = trip.TripUpdate.Vehicle?.Id;
        newService.VehicleType = GetVehicleType(routeForTrip.Attributes.RouteType);

        newServices.Add(newService);
      }

      return newServices;
    }

    private List<Service> GetCancelledServicesToBeAdded(List<ServiceAlertEntity> cancelledServices, List<Datum> routes, List<Entity> tripUpdates)
    {
      var cancelledServicesToBeAdded = new List<Service>();

      foreach (var cancellation in cancelledServices)
      {
        if (cancellation.Alert.Effect != "NO_SERVICE")
        {
          continue;
        }

        var tripUpdateId = cancellation.Alert.InformedEntity.FirstOrDefault(informedEntity => informedEntity.Trip?.TripId != null);

        if (tripUpdateId == null)
        {
          continue;
        }

        // make sure the active period matches the current time.....
        var tripFoundInTripUpdates = tripUpdates.Find(trip => trip.TripUpdate.Trip.TripId == tripUpdateId.Trip.TripId);

        if (tripFoundInTripUpdates == null)
        {
          _logger.LogInformation("Found a cancellation with a tripID that isn't in the tripupdates for AT");
          continue;
        }

        var route = routes.Find(route => route.Id == tripFoundInTripUpdates.TripUpdate.Trip.RouteId);

        if (route == null)
        {
          _logger.LogInformation("Found a route with an that isn't in the tripupdates for AT");
          continue;
        }

        var cancelledService = new Service()
        {
          Status = "CANCELLED",
          TripId = tripUpdateId.Trip.TripId,
          RouteId = route.Id,
          RouteDescription = route.Attributes.RouteLongName,
          RouteShortName = route.Attributes.RouteShortName,
          RouteLongName = route.Attributes.RouteLongName,
          ProviderId = "AT",
          VehicleType = GetVehicleType(route.Attributes.RouteType)
        };

        cancelledServicesToBeAdded.Add(cancelledService);
      }

      return cancelledServicesToBeAdded;
    }

    private string GetVehicleType(int routeType)
    {
      switch (routeType)
      {
        case 3:
          return "BUS";
        case 2:
          return "TRAIN";
        case 4:
          return "FERRY";
        case 712:
          return "BUS";
        default:
          return "BUS";
      }
    }

    public async Task<List<Service>> GetLatestServices()
    {
      try
      {
        var batchId = await _serviceRepository.GetLatestBatchId();
        return _serviceRepository.GetByBatchIdAndProvider(batchId, "AT");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the latest services for AT");
        return new List<Service>();
      }
    }

    public List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate, DateTime endDate)
    {
      try
      {
        return _serviceRepository.GetServiceStatisticsByDateAndProvider(startDate, endDate, "AT");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the service statistics for AT");
        return new List<ServiceStatistic>();
      }
    }

    public List<Service> GetThreeWorstServicesForThisWeek()
    {
      try
      {
        return _serviceRepository.GetThreeWorstServicesForThisWeek("AT");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the service statistics for AT");
        return new List<Service>();
      }
    }

    private async Task<HttpResponseMessage> MakeAPIRequest(string url)
    {
      // We want to bounce between 2 api keys to keep the usage down
      Random random = new Random();
      int randomNumber = random.Next(2);
      var metlinkApiKey = randomNumber == 0 ? _atApiConfig.ApiKey1 : _atApiConfig.ApiKey2;

      var attempts = 5;

      while (attempts > 0)
      {
        try
        {
          var request = new HttpRequestMessage(
            HttpMethod.Get, url);
          request.Headers.Add("Accept", "application/json");
          request.Headers.Add("Ocp-Apim-Subscription-Key", metlinkApiKey);
          var response = await _httpClient.SendAsync(request);

          if (response.IsSuccessStatusCode)
          {
            _logger.LogInformation("Success calling " + url);
            return response;
          }
        }
        catch (HttpRequestException ex)
        {
          _logger.LogWarning(ex, $"Failed attempt {5 - attempts + 1} calling {url}.");
        }
        attempts--;
      }

      _logger.LogError($"Failed all attempts to call {url}.");
      throw new HttpRequestException($"Failed to retrieve data from AT API {url} after 5 attempts.");
    }
  }

}
