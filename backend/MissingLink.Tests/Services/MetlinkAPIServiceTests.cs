using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using missinglink.Models;
using missinglink.Services;
using missinglink.Repository;
using Microsoft.Extensions.Configuration;
using Moq.Protected;
using System.Net;
using System.Text;
using Microsoft.Extensions.Options;

public class MetlinkAPIServiceTests
{
  private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
  private Mock<IOptions<MetlinkApiConfig>> _mockMetlinkConfig;
  private readonly Mock<ILogger<MetlinkAPIService>> _mockLogger;
  private readonly Mock<IServiceRepository> _mockServiceRepository;
  public MetlinkAPIServiceTests()
  {
    _mockHttpClientFactory = new Mock<IHttpClientFactory>();
    _mockLogger = new Mock<ILogger<MetlinkAPIService>>();
    _mockServiceRepository = new Mock<IServiceRepository>();
    _mockMetlinkConfig = new Mock<IOptions<MetlinkApiConfig>>();
    PrepareMocks();
  }

  // Test that the first vehicle in the example JSON looks okay
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_ReturnsExpectedResultForFirstEntry()
  {
    // Arrange
    var metlinkApiService = new MetlinkAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockMetlinkConfig.Object, _mockServiceRepository.Object);

    // Act
    var services = await metlinkApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Test total services count
    Assert.Equal(190, services.Count());

    // Test the details from the first vehicle in the trip updates
    Service service = services.First();
    Assert.Equal(54, service.Bearing);
    Assert.Equal(96, service.Delay);
    Assert.Equal(-41.1279259, service.Lat);
    Assert.Equal(175.0496826, service.Long);
    Assert.Equal("Metlink", service.ProviderId);
    Assert.Equal("Petone - Lower Hutt - Upper Hutt - Emerald Hill", service.RouteDescription);
    Assert.Equal("1100", service.RouteId);
    Assert.Equal("Emerald Hill - Upper Hutt - Lower Hutt - Petone", service.RouteLongName);
    Assert.Equal("110", service.RouteShortName);
    Assert.Equal("110", service.ServiceName);
    Assert.Equal("ONTIME", service.Status);
    Assert.Equal("110__0__719__TZM__404__404_20230924", service.TripId);
    Assert.Equal("3316", service.VehicleId);
    Assert.Equal("BUS", service.VehicleType);
  }

  // Test that the correct amount of each status is returned
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_ReturnsCorrectStatusCount()
  {
    // Arrange
    var metlinkApiService = new MetlinkAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockMetlinkConfig.Object, _mockServiceRepository.Object);

    // Act
    var services = await metlinkApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);

    // Test total services count
    Assert.Equal(190, services.Count());
    Assert.Equal(44, services.Where(service => service.Status == "LATE").Count());
    Assert.Equal(101, services.Where(service => service.Status == "CANCELLED").Count());
    Assert.Equal(5, services.Where(service => service.Status == "EARLY").Count());
    Assert.Equal(28, services.Where(service => service.Status == "ONTIME").Count());
    Assert.Equal(12, services.Where(service => service.Status == "UNKNOWN").Count());
  }

  // Test that if Metlink returns an error on the API calls, that we continue without issue
  [Fact]
  public async Task FetchLatestTripDataFromUpstreamService_CanHandleUpstreamError()
  {
    // Arrange
    PrepareHttpMockToFail();
    var metlinkApiService = new MetlinkAPIService(_mockLogger.Object, _mockHttpClientFactory.Object, _mockMetlinkConfig.Object, _mockServiceRepository.Object);

    // Act
    var services = await metlinkApiService.FetchLatestTripDataFromUpstreamService();

    // Assert
    Assert.NotNull(services);
    Assert.IsType<List<Service>>(services);
    Assert.Empty(services);
  }

  private void PrepareMocks()
  {
    _mockMetlinkConfig.Setup(config => config.Value)
              .Returns(new MetlinkApiConfig
              {
                BaseUrl = "https://api.opendata.metlink.org.nz",
                TripUpdatesEndpoint = "/v1/gtfs-rt/tripupdates",
                TripsEndpoint = "/v1/gtfs/trips",
                RoutesEndpoint = "/v1/gtfs/routes",
                VehiclePositionsEndpoint = "/v1/gtfs-rt/vehiclepositions",
                TripCancellationsEndpoint = "/v1/trip-cancellations"
              });

    var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
    var tripUpdatesJson = File.ReadAllText("metlink/trip_updates.json");
    var routesJson = File.ReadAllText("metlink/routes.json");
    var cancellationsJson = File.ReadAllText("metlink/cancellations.json");
    var tripsJson = File.ReadAllText("metlink/trips.json");
    var vehiclePositionsJson = File.ReadAllText("metlink/vehicle_positions.json");

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripUpdatesEndpoint}"),
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
            ItExpr.Is<HttpRequestMessage>(request =>
            request.Method == HttpMethod.Get &&
            request.RequestUri!.GetLeftPart(UriPartial.Path) ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripCancellationsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(cancellationsJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.VehiclePositionsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(vehiclePositionsJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request =>
            request.Method == HttpMethod.Get &&
            request.RequestUri!.GetLeftPart(UriPartial.Path) ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripsEndpoint}"),
            ItExpr.IsAny<CancellationToken>()
        )
        .ReturnsAsync(new HttpResponseMessage
        {
          StatusCode = HttpStatusCode.OK,
          Content = new StringContent(tripsJson, Encoding.UTF8, "application/json"),
        });

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.RoutesEndpoint}"),
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

  public void PrepareHttpMockToFail()
  {
    var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

    mockHttpMessageHandler
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.Is<HttpRequestMessage>(request => request.RequestUri!.ToString() ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripUpdatesEndpoint}"),
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
            ItExpr.Is<HttpRequestMessage>(request =>
            request.Method == HttpMethod.Get &&
            request.RequestUri!.GetLeftPart(UriPartial.Path) ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripCancellationsEndpoint}"),
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
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.VehiclePositionsEndpoint}"),
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
            ItExpr.Is<HttpRequestMessage>(request =>
            request.Method == HttpMethod.Get &&
            request.RequestUri!.GetLeftPart(UriPartial.Path) ==
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.TripsEndpoint}"),
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
                $"{_mockMetlinkConfig.Object.Value.BaseUrl}{_mockMetlinkConfig.Object.Value.RoutesEndpoint}"),
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
