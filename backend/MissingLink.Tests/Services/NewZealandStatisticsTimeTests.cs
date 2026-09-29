using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using missinglink.Contexts;
using missinglink.Models;
using missinglink.Repository;
using missinglink.Services;
using missinglink.Utils;
using Moq;
using Xunit;

public class NewZealandStatisticsTimeTests
{
  [Fact]
  public void ServiceStatisticTimestampUsesTimezoneNaivePostgresColumn()
  {
    var options = new DbContextOptionsBuilder<ServiceContext>()
      .UseNpgsql("Host=localhost;Database=test")
      .Options;
    using var context = new ServiceContext(options);
    var timestampProperty = context.Model
      .FindEntityType(typeof(ServiceStatistic))!
      .FindProperty(nameof(ServiceStatistic.Timestamp));

    Assert.Equal("timestamp without time zone", timestampProperty!.GetColumnType());
  }

  [Fact]
  public void FromUtcReturnsNewZealandWallClockTimeDuringDaylightSaving()
  {
    var utcTime = new DateTime(2023, 12, 31, 23, 0, 0, DateTimeKind.Utc);

    var newZealandTime = NewZealandTime.FromUtc(utcTime);

    Assert.Equal(new DateTime(2024, 1, 1, 12, 0, 0), newZealandTime);
    Assert.Equal(DateTimeKind.Unspecified, newZealandTime.Kind);
  }

  [Fact]
  public void StatisticDtoSerializesTimestampWithNewZealandOffset()
  {
    var statistic = new ServiceStatistic
    {
      Timestamp = new DateTime(2024, 1, 1, 12, 0, 0)
    };

    var json = JsonSerializer.Serialize(ServiceStatisticDto.From(statistic));

    Assert.Contains("2024-01-01T12:00:00+13:00", json);
  }

  [Fact]
  public async Task UpdateStatisticsStoresNewZealandWallClockTimestamps()
  {
    var repository = new Mock<IServiceRepository>();
    var cacheRepository = new Mock<ICacheRepository>();
    var dateTimeProvider = new Mock<IDateTimeProvider>();
    var storedTimestamps = new List<DateTime>();
    dateTimeProvider
      .Setup(provider => provider.UtcNow)
      .Returns(new DateTime(2023, 12, 31, 23, 0, 0, DateTimeKind.Utc));
    repository
      .Setup(repo => repo.AddStatisticAsync(It.IsAny<ServiceStatistic>()))
      .Callback<ServiceStatistic>(statistic => storedTimestamps.Add(statistic.Timestamp))
      .Returns(Task.CompletedTask);

    var serviceApi = new ServiceAPI(
      Mock.Of<ILogger<AtAPIService>>(),
      repository.Object,
      cacheRepository.Object,
      dateTimeProvider.Object);

    await serviceApi.UpdateStatisticsWithLatestServices(new List<Service>(), 1);

    Assert.Equal(2, storedTimestamps.Count);
    Assert.All(storedTimestamps, timestamp =>
    {
      Assert.Equal(new DateTime(2024, 1, 1, 12, 0, 0), timestamp);
      Assert.Equal(DateTimeKind.Unspecified, timestamp.Kind);
    });
  }
}
