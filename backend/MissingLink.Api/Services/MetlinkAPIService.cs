using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using missinglink.Models.Metlink;
using missinglink.Models.Metlink.VehiclePosition;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using missinglink.Repository;
using missinglink.Models;
using Microsoft.Extensions.Options;

namespace missinglink.Services
{
  public class MetlinkAPIService : IBaseServiceAPI
  {
    private readonly HttpClient _httpClient;
    private readonly ILogger<MetlinkAPIService> _logger;
    private readonly IServiceRepository _serviceRepository;
    private readonly MetlinkApiConfig _apiConfig;

    public MetlinkAPIService(ILogger<MetlinkAPIService> logger, IHttpClientFactory clientFactory,
      IOptions<MetlinkApiConfig> apiConfig, IServiceRepository metlinkServiceRepository)
    {
      _httpClient = clientFactory.CreateClient("metlinkService");
      _logger = logger;
      _apiConfig = apiConfig.Value;
      _serviceRepository = metlinkServiceRepository;
    }

    public async Task<List<Service>> FetchLatestTripDataFromUpstreamService()
    {
      var cancelledServicesTask = GetCancelledServicesFromMetlink();

      var tripUpdatesTask = FetchDataFromMetlinkApi(
        $"{_apiConfig.BaseUrl}{_apiConfig.TripUpdatesEndpoint}",
        () => new MetlinkTripUpdatesResponse()
      );

      var tripsTask = FetchDataFromMetlinkApi(
        $"{_apiConfig.BaseUrl}{_apiConfig.TripsEndpoint}",
        () => new List<MetlinkTripResponse>()
      );

      var routesTask = FetchDataFromMetlinkApi(
        $"{_apiConfig.BaseUrl}{_apiConfig.RoutesEndpoint}",
        () => new List<RouteResponse>()
      );

      var positionsTask = FetchDataFromMetlinkApi(
        $"{_apiConfig.BaseUrl}{_apiConfig.VehiclePositionsEndpoint}",
        () => new VehiclePositionResponse()
      );

      await Task.WhenAll(tripUpdatesTask, tripsTask, routesTask, positionsTask, cancelledServicesTask);

      var tripUpdates = tripUpdatesTask.Result.Trips;
      var trips = tripsTask.Result;
      var routes = routesTask.Result;
      var positions = positionsTask.Result.VehiclePositions;
      var cancelledServices = cancelledServicesTask.Result;

      var allServices = ParseServicesFromTripUpdates(tripUpdates);

      allServices = MergeServicesWithRoutesAndPositions(allServices, trips, routes, positions);

      var cancelledServicesToBeAdded = GetCancelledServicesToBeAdded(cancelledServices, routes);

      allServices.AddRange(cancelledServicesToBeAdded);

      allServices.ForEach((service) =>
      {
        service.ProviderId = "Metlink";
        service.ServiceName = service.RouteShortName;
        if (int.TryParse(service.RouteShortName, out _))
        {
          service.VehicleType = "BUS";
        }
        else
        {
          service.VehicleType = "TRAIN";
        }
      });

      return allServices;
    }

    private List<Service> GetCancelledServicesToBeAdded(List<MetlinkCancellationResponse> cancelledServices, List<RouteResponse> routes)
    {
      var cancelledServicesToBeAdded = new List<Service>();

      foreach (var cancellation in cancelledServices)
      {
        var route = routes.Find(route => route.RouteId == cancellation.RouteId);

        if (route != null)
        {
          var cancelledService = new Service()
          {
            Status = "CANCELLED",
            TripId = cancellation.TripId,
            RouteId = route.RouteId,
            RouteDescription = route.RouteDesc,
            RouteShortName = route.RouteShortName,
            RouteLongName = route.RouteLongName,
          };

          cancelledServicesToBeAdded.Add(cancelledService);
        }
      }

      return cancelledServicesToBeAdded;
    }


    private List<Service> ParseServicesFromTripUpdates(List<TripUpdateHolder> tripUpdates)
    {
      List<Service> allServices = new List<Service>();

      tripUpdates.ToList().ForEach(trip =>
      {
        var service = new Service();

        service.VehicleId = trip.TripUpdate.Vehicle.Id;
        int delay = trip.TripUpdate.StopTimeUpdate.Arrival.Delay;
        if (delay > 150)
        {
          service.Status = "LATE";
        }
        else if (delay < -90)
        {
          service.Status = "EARLY";
        }
        else if (delay == 0)
        {
          service.Status = "UNKNOWN";
        }
        else
        {
          service.Status = "ONTIME";
        }
        service.TripId = trip.TripUpdate.Trip.TripId;
        service.Delay = trip.TripUpdate.StopTimeUpdate.Arrival.Delay;
        if (allServices.Find(toFind => service.VehicleId == toFind.VehicleId) == null)
        {
          allServices.Add(service);
        }
      });

      return allServices;
    }

    private List<Service> MergeServicesWithRoutesAndPositions(List<Service> services, List<MetlinkTripResponse> trips, List<RouteResponse> routes, List<VehiclePositionHolder> positions)
    {
      var updatedServices = new List<Service>(services);

      foreach (var service in services)
      {
        var tripThatServiceIsOn = trips.Find(trip => trip.TripId == service.TripId);
        var positionForService = positions.Find(pos => pos.VehiclePosition.Vehicle.Id == service.VehicleId);
        var routeThatServiceIsOn = routes.Find(route => route.RouteId == tripThatServiceIsOn?.RouteId);

        if (routeThatServiceIsOn != null)
        {
          service.RouteId = routeThatServiceIsOn.RouteId;
          service.RouteDescription = routeThatServiceIsOn.RouteDesc;
          service.RouteShortName = routeThatServiceIsOn.RouteShortName;
          service.RouteLongName = routeThatServiceIsOn.RouteLongName;
        }
        else
        {
          _logger.LogError($"Route that the service {service.VehicleId} is on is null");
        }

        if (positionForService != null)
        {
          service.Bearing = positionForService.VehiclePosition.Position.Bearing;
          service.Lat = positionForService.VehiclePosition.Position.Latitude;
          service.Long = positionForService.VehiclePosition.Position.Longitude;
        }
        else
        {
          _logger.LogError($"Position for service {service.VehicleId} is null");
        }
      }

      return updatedServices;
    }

    private async Task<List<MetlinkCancellationResponse>> GetCancelledServicesFromMetlink()
    {
      DateTime utcTime = DateTime.UtcNow;
      TimeZoneInfo serverZone = TimeZoneInfo.FindSystemTimeZoneById("NZ");
      DateTime currentDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, serverZone);

      string startDate = currentDateTime.ToString("yyyy-MM-dd") + "T00%3A00%3A00";
      string endDate = currentDateTime.ToString("yyyy-MM-dd") + "T23%3A59%3A59";
      string query = "?date_start=" + startDate + "&date_end=" + endDate;

      try
      {
        var response = await MakeAPIRequest("https://api.opendata.metlink.org.nz/v1/trip-cancellations" + query);
        List<MetlinkCancellationResponse> res = null;

        if (response.IsSuccessStatusCode)
        {
          var responseStream = await response.Content.ReadAsStringAsync();
          res = JsonConvert.DeserializeObject<List<MetlinkCancellationResponse>>(responseStream);
        }
        else
        {
          _logger.LogError("Error making API call to: GetServicesFromStopId");
        }

        return res;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the cancelled for Metlink");
        return new List<MetlinkCancellationResponse>();
      }
    }

    private async Task<T> FetchDataFromMetlinkApi<T>(string url, Func<T> defaultResultFactory)
    {
      try
      {
        var response = await MakeAPIRequest(url);
        T result = defaultResultFactory();

        if (response.IsSuccessStatusCode)
        {
          var responseStream = await response.Content.ReadAsStringAsync();
          result = JsonConvert.DeserializeObject<T>(responseStream);
        }
        else
        {
          _logger.LogError($"Error making API call to: {url}");
        }

        return result;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while fetching data from the AT api");
        return defaultResultFactory();
      }
    }

    public async Task<List<Service>> GetLatestServices()
    {
      try
      {
        var batchId = await _serviceRepository.GetLatestBatchId();
        return _serviceRepository.GetByBatchIdAndProvider(batchId, "Metlink");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the latest services for Metlink");
        return new List<Service>();
      }
    }

    public List<Service> GetThreeWorstServicesForThisWeek()
    {
      try
      {
        return _serviceRepository.GetThreeWorstServicesForThisWeek("Metlink");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Failed to retrieve the service statistics for Metlink");
        return new List<Service>();
      }
    }

    public List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate, DateTime endDate)
    {
      return _serviceRepository.GetServiceStatisticsByDateAndProvider(startDate, endDate, "Metlink");
    }

    private async Task<HttpResponseMessage> MakeAPIRequest(string url)
    {
      var attempts = 5;
      while (attempts > 0)
      {
        try
        {

          var request = new HttpRequestMessage(
            HttpMethod.Get, url);
          request.Headers.Add("Accept", "application/json");
          request.Headers.Add("x-api-key", _apiConfig.ApiKey);
          var response = await _httpClient.SendAsync(request);

          if (response.IsSuccessStatusCode)
          {
            Console.WriteLine("Success calling " + url);
            return response;
          }
          Console.WriteLine("Failed calling " + url);
          attempts--;
        }
        catch (HttpRequestException ex)
        {
          _logger.LogWarning(ex, $"Failed attempt {5 - attempts + 1} calling {url}.");
        }
      }

      _logger.LogError($"Failed all attempts to call {url}.");
      throw new HttpRequestException($"Failed to retrieve data from Metlink API {url} after 5 attempts.");
    }

  }
}
