using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Models;
using missinglink.Services;
using Moq;
using Xunit;

namespace YourTestProject.Tests.Controllers
{
  public class AtServicesControllerTests
  {

    private readonly Mock<ILogger<AtServicesController>> _loggerMock;
    private readonly Mock<IBaseServiceAPI> _atApiServiceMock;
    private readonly AtServicesController _controller;

    public AtServicesControllerTests()
    {
      _loggerMock = new Mock<ILogger<AtServicesController>>();
      _atApiServiceMock = new Mock<IBaseServiceAPI>();
      _controller = new AtServicesController(_loggerMock.Object, _atApiServiceMock.Object);
    }

    [Fact]
    public void GetNewestServices_ReturnsPopulatedList()
    {
      // Arrange
      var expectedServices = new List<Service>
            {
                new Service {  },
                new Service {  }
            };
      _atApiServiceMock.Setup(api => api.GetLatestServices()).Returns(expectedServices);
      var controller = new AtServicesController(_loggerMock.Object, _atApiServiceMock.Object);

      // Act
      var result = controller.GetNewestServices();

      // Assert
      Assert.NotNull(result);
      Assert.Equal(2, result.Count);
    }

    [Fact]
    public void GetNewestServices_ReturnsEmptyList_WhenDatabaseIsEmpty()
    {
      // Arrange
      _atApiServiceMock.Setup(api => api.GetLatestServices()).Returns(new List<Service>());
      var controller = new AtServicesController(_loggerMock.Object, _atApiServiceMock.Object);

      // Act
      var result = controller.GetNewestServices();

      // Assert
      Assert.NotNull(result);
      Assert.Empty(result);
    }

    [Theory]
    [InlineData("2023/08/01 00:00:00", "2023/08/31 23:59:00")]
    public void GetServiceStatisticsByDate_ValidInputs_ReturnsStatistics(string startDate, string endDate)
    {
      // Arrange
      var date1 = new DateTime(2023, 8, 01, 0, 0, 0, DateTimeKind.Unspecified);
      var date2 = new DateTime(2023, 8, 31, 23, 59, 0, DateTimeKind.Unspecified);
      var stat1 = new ServiceStatistic { Timestamp = new DateTime(2023, 8, 20) };
      var stat2 = new ServiceStatistic { Timestamp = new DateTime(2023, 8, 22) };

      var expectedStatistics = new List<ServiceStatistic> { stat1, stat2 };
      _atApiServiceMock.Setup(service => service.GetServiceStatisticsByDate(date1, date2)).Returns(expectedStatistics);

      // Act
      var actionResult = _controller.GetServiceStatisticsByDate(startDate, endDate);

      // Assert
      Assert.IsType<OkObjectResult>(actionResult);
      var result = (OkObjectResult)actionResult;
      Assert.NotNull(result.Value);
      var returnedStatistics = Assert.IsType<List<ServiceStatisticDto>>(result.Value);
      Assert.Equal(2, returnedStatistics.Count);
      Assert.Equal(TimeSpan.FromHours(12), returnedStatistics[0].Timestamp.Offset);
      Assert.Equal(stat1.Timestamp, returnedStatistics[0].Timestamp.DateTime);
    }

    [Theory]
    [InlineData(null, "2023/08/31 23:59:00")]
    [InlineData("2023/08/01 00:00:00", null)]
    public void GetServiceStatisticsByDate_MissingInputs_ReturnsBadRequest(string startDate, string endDate)
    {
      // Act
      var result = _controller.GetServiceStatisticsByDate(startDate, endDate);

      // Assert
      var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
      Assert.Equal("You must provide a startState and endData query string", badRequestResult.Value);
    }

    [Theory]
    [InlineData("invalid-date", "2023/08/31 23:59:00")]
    [InlineData("2023/08/01 00:00:00", "invalid-date")]
    public void GetServiceStatisticsByDate_InvalidDateInputs_ReturnsBadRequest(string startDate, string endDate)
    {
      // Act
      var result = _controller.GetServiceStatisticsByDate(startDate, endDate);

      // Assert
      var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
      Assert.Equal("Your date inputs were formatted incorrectly", badRequestResult.Value);
    }
  }
}
