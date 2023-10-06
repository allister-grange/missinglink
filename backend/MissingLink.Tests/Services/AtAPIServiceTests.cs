using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using missinglink.Models;
using missinglink.Services;
using missinglink.Repository;
using missinglink.Utils;
using Microsoft.Extensions.Configuration;
using Moq.Protected;
using System.Net;
using System.Text;
using Microsoft.Extensions.Options;

public class AtAPIServiceTests
{
  private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
  private readonly Mock<ILogger<AtAPIService>> _mockLogger;
  private readonly Mock<IServiceRepository> _mockServiceRepository;
  private Mock<IOptions<AtApiConfig>> _mockAtConfig;

  public AtAPIServiceTests()
  {
    _mockHttpClientFactory = new Mock<IHttpClientFactory>();
    _mockLogger = new Mock<ILogger<AtAPIService>>();
    _mockServiceRepository = new Mock<IServiceRepository>();
    _mockAtConfig = new Mock<IOptions<AtApiConfig>>();
    PrepareMocks();
  }


  // Test that the first vehicle in the example JSON looks okay
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_ReturnsExpectedResultForFirstEntry()
  {
    // Arrange
    var mockDateTimeProvider = new Mock<IDateTimeProvider>();
    mockDateTimeProvider.Setup(dtp => dtp.UtcNow).Returns(new DateTime(2023, 9, 29, 23, 59, 59));
    var atApiService = new AtAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockAtConfig.Object, _mockServiceRepository.Object, mockDateTimeProvider.Object);

    // Act
    var services = await atApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Test total services count
    Assert.Equal(546, services.Count());

    // Test the details from the first vehicle in the trip updates
    Service service = services.First();
    Assert.Equal(215, service.Bearing);
    Assert.Equal(0, service.Delay);
    Assert.Equal(-36.925583333333336, service.Lat);
    Assert.Equal(174.786545, service.Long);
    Assert.Equal("AT", service.ProviderId);
    Assert.Equal("ONE", service.RouteDescription);
    Assert.Equal("ONE-201", service.RouteId);
    Assert.Equal("ONE", service.RouteLongName);
    Assert.Equal("ONE", service.RouteShortName);
    Assert.Equal("ONE", service.ServiceName);
    Assert.Equal("UNKNOWN", service.Status);
    Assert.Equal("51100306140-20230927142708_v106.28", service.TripId);
    Assert.Equal("59593", service.VehicleId);
    Assert.Equal("TRAIN", service.VehicleType);
  }

  // Test that a vehicle for tomorrows date (in this case, 30/09/2023) is not included in the services
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_DoesntReturnTomorrowsServices()
  {
    // Arrange
    var mockDateTimeProvider = new Mock<IDateTimeProvider>();
    mockDateTimeProvider.Setup(dtp => dtp.UtcNow).Returns(new DateTime(2023, 9, 29, 23, 59, 59));
    var atApiService = new AtAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockAtConfig.Object, _mockServiceRepository.Object, mockDateTimeProvider.Object);

    // Act
    var services = await atApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Test total services count
    Assert.Equal(546, services.Count());

    // Make sure that a trip that is tomorrow isn't in the list of services
    Assert.Null(services.FirstOrDefault(service => service.TripId == "51100306163-20230927142708_v106.29"));
  }

  // Test that a vehicle for a trip that hasn't started yet isn't included in the services
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_DoesntReturnATripThatHasntStarted()
  {
    // Arrange
    var mockDateTimeProvider = new Mock<IDateTimeProvider>();
    mockDateTimeProvider.Setup(dtp => dtp.UtcNow).Returns(new DateTime(2023, 9, 29, 22, 10, 00));
    var atApiService = new AtAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockAtConfig.Object, _mockServiceRepository.Object, mockDateTimeProvider.Object);

    // Act
    var services = await atApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Make sure that a trip that hasn't started yet isn't included in the services
    Assert.Null(services.FirstOrDefault(service => service.TripId == "51100306181-20230927142708_v106.28"));
  }

  // Test that vehicle IDs do not get duplicated in the services
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_DoesntReturnTripsForTheSameVehicle()
  {
    // Arrange
    var mockDateTimeProvider = new Mock<IDateTimeProvider>();
    mockDateTimeProvider.Setup(dtp => dtp.UtcNow).Returns(new DateTime(2023, 9, 29, 22, 10, 00));
    var atApiService = new AtAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockAtConfig.Object, _mockServiceRepository.Object, mockDateTimeProvider.Object);

    // Act
    var services = await atApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Make sure that no vehicle is counted twice in the services
    var duplicateVehicleIds = services.GroupBy(s => s.VehicleId)
                                      .Where(g => g.Count() > 1)
                                      .Select(g => g.Key)
                                      .ToList();
    Assert.Empty(duplicateVehicleIds);
  }

  // Test that if AT returns an error on the API calls, that we continue without issue
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_CanHandleUpstreamError()
  {
    // Arrange
    PrepareHttpMockToFail();
    var mockDateTimeProvider = new Mock<IDateTimeProvider>();
    mockDateTimeProvider.Setup(dtp => dtp.UtcNow).Returns(new DateTime(2023, 9, 29, 22, 10, 00));
    var atApiService = new AtAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockAtConfig.Object, _mockServiceRepository.Object, mockDateTimeProvider.Object);

    // Act
    var services = await atApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);
    Assert.Empty(services);
  }

  private void PrepareMocks()
  {
    _mockAtConfig.Setup(config => config.Value)
          .Returns(new AtApiConfig
          {
            BaseUrl = "https://api.at.govt.nz",
            TripUpdatesEndpoint = "/realtime/legacy/tripupdates",
            ServiceAlertsEndpoint = "/realtime/legacy/servicealerts",
            VehicleLocationsEndpoint = "/realtime/legacy/vehiclelocations",
            RoutesEndpoint = "/gtfs/v3/routes",
            ApiKey1 = "XXX",
            ApiKey2 = "XXX"
          });

    var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
    var tripUpdatesJson = File.ReadAllText("AT/trip_updates.json");
    var routesJson = File.ReadAllText("AT/routes.json");
    var serviceAlertsJson = File.ReadAllText("AT/service_alerts.json");
    var vehicleLocationsJson = File.ReadAllText("AT/vehicle_locations.json");

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.TripUpdatesEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(tripUpdatesJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.ServiceAlertsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(serviceAlertsJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.VehicleLocationsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(vehicleLocationsJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.RoutesEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(routesJson, Encoding.UTF8, "application/json"),
        });

    var client = new HttpClient(mockHttpMessageHandler.Object);
    _mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(client);
  }

  private void PrepareHttpMockToFail()
  {
    var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

    mockHttpMessageHandler
      .Protected()
      .Setup<Task<HttpResponseMessage>>(
          "SendAsync",
          ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
              $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.TripUpdatesEndpoint}"),
          ItExpr.IsAny<CancellationToken>()
      )
      .ReturnsAsync(new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.InternalServerError,
      });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.ServiceAlertsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.InternalServerError,
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.VehicleLocationsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.InternalServerError,
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockAtConfig.Object.Value.BaseUrl}{_mockAtConfig.Object.Value.RoutesEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.InternalServerError,
        });


    var client = new HttpClient(mockHttpMessageHandler.Object);
    _mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(client);

  }

}
