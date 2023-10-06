using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Models;
using missinglink.Services;
using Moq;
using Xunit;

namespace YourTestProject.Tests.Controllers
{
  public class MetlinkServicesControllerTests
  {

    private readonly Mock<ILogger<MetlinkServicesController>> _loggerMock;
    private readonly Mock<IBaseServiceAPI> _metlinkApiServiceMock;
    private readonly MetlinkServicesController _controller;

    public MetlinkServicesControllerTests()
    {
      _loggerMock = new Mock<ILogger<MetlinkServicesController>>();
      _metlinkApiServiceMock = new Mock<IBaseServiceAPI>();
      _controller = new MetlinkServicesController(_loggerMock.Object, _metlinkApiServiceMock.Object);
    }

    [Fact]
    public async Task GetNewestServices_ReturnsPopulatedList()
    {
      // Arrange
      var expectedServices = new List<Service>
            {
                new Service {  },
                new Service {  }
            };
      _metlinkApiServiceMock.Setup(api => api.GetLatestServices()).ReturnsAsync(expectedServices);
      var controller = new MetlinkServicesController(_loggerMock.Object, _metlinkApiServiceMock.Object);

      // Act
      var result = await controller.GetNewestServices();

      // Assert
      Assert.NotNull(result);
      Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetNewestServices_ReturnsEmptyList_WhenDatabaseIsEmpty()
    {
      // Arrange
      _metlinkApiServiceMock.Setup(api => api.GetLatestServices()).ReturnsAsync(new List<Service>());
      var controller = new MetlinkServicesController(_loggerMock.Object, _metlinkApiServiceMock.Object);

      // Act
      var result = await controller.GetNewestServices();

      // Assert
      Assert.NotNull(result);
      Assert.Empty(result);
    }

    [Theory]
    [InlineData("2023-08-01", "2023-08-31")]
    public void GetServiceStatisticsByDate_ValidInputs_ReturnsStatistics(string startDate, string endDate)
    {
      // Arrange
      var date1 = new DateTime(2023, 8, 01);
      var date2 = new DateTime(2023, 8, 31);
      var stat1 = new ServiceStatistic();
      var stat2 = new ServiceStatistic();
      stat1.Timestamp = new DateTime(2023, 8, 20);
      stat2.Timestamp = new DateTime(2023, 8, 22);

      var expectedStatistics = new List<ServiceStatistic> { stat1, stat2 };
      _metlinkApiServiceMock.Setup(service => service.GetServiceStatisticsByDate(date1, date2)).Returns(expectedStatistics);

      // Act
      var actionResult = _controller.GetServiceStatisticsByDate(startDate, endDate);

      // Assert
      Assert.IsType<OkObjectResult>(actionResult);
      var result = (OkObjectResult)actionResult;
      Assert.NotNull(result.Value);
      Assert.Equal(expectedStatistics, result.Value);
    }

    [Theory]
    [InlineData(null, "2023-08-31")]
    [InlineData("2023-08-01", null)]
    public void GetServiceStatisticsByDate_MissingInputs_ReturnsBadRequest(string startDate, string endDate)
    {
      // Act
      var result = _controller.GetServiceStatisticsByDate(startDate, endDate);

      // Assert
      var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
      Assert.Equal("You must provide a startState and endData query string", badRequestResult.Value);
    }

    [Theory]
    [InlineData("invalid-date", "2023-08-31")]
    [InlineData("2023-08-01", "invalid-date")]
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
