using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Models;
using missinglink.Services;

[ApiController]
public abstract class BaseServicesController<TService> : ControllerBase where TService : IBaseServiceAPI
{
  protected readonly ILogger _logger;
  protected readonly TService _apiService;

  public BaseServicesController(ILogger logger, TService apiService)
  {
    _logger = logger;
    _apiService = apiService;
  }

  [HttpGet("services")]
  public List<Service> GetNewestServices()
  {
    _logger.LogInformation("Fetching services request");
    var services = _apiService.GetLatestServices();

    if (services == null || services.Count == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<Service>();
    }

    _logger.LogInformation("Found " + services.Count + " services");
    return services;
  }

  [HttpGet("serviceNames")]
  public List<string> GetServiceNames()
  {
    _logger.LogInformation("Fetching list of services in the databases");
    var services = _apiService.GetServiceNames();

    if (services == null || services.Count == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<string>();
    }

    _logger.LogInformation("Found " + services.Count + " services");
    return services;
  }

  [HttpGet("statistics")]
  public IActionResult GetServiceStatisticsByDate(string startDate, string endDate)
  {
    _logger.LogInformation("Fetching statistics with startDate of: " + startDate + " and endDate of:" + endDate);
    List<ServiceStatistic> stats = null;

    if (String.IsNullOrEmpty(startDate) || String.IsNullOrEmpty(endDate))
    {
      return BadRequest("You must provide a startState and endData query string");
    }

    DateTime startDateInput;
    DateTime endDateInput;

    try
    {
      startDateInput = DateTime.ParseExact(startDate, "yyyy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);
      endDateInput = DateTime.ParseExact(endDate, "yyyy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);

      stats = _apiService.GetServiceStatisticsByDate(startDateInput, endDateInput);
    }
    catch (System.FormatException e)
    {
      _logger.LogError($"Your date inputs were formatted incorrectly {e}");
      return BadRequest("Your date inputs were formatted incorrectly");
    }
    _logger.LogInformation("Parsed dates: " + startDateInput + " " + endDateInput);
    if (stats == null || stats.Count == 0)
    {
      throw new Exception("ServiceStatistic table in database not populated.");
    }

    return Ok(stats);
  }

  [HttpGet("worstServices")]
  public IEnumerable<dynamic> GetWorstServicesForThisWeek()
  {
    _logger.LogInformation("Fetching three worst services for this week");
    var services = _apiService.GetWorstServicesForThisWeek();

    if (services == null || services.Count() == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<Service>();
    }

    _logger.LogInformation("Found " + services.Count() + " services");
    return services;
  }

  [HttpGet("bestServices")]
  public IEnumerable<dynamic> GetBestServicesForThisWeek()
  {
    _logger.LogInformation("Fetching three best services for this week");
    var services = _apiService.GetBestServicesForThisWeek();

    if (services == null || services.Count() == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<Service>();
    }

    _logger.LogInformation("Found " + services.Count() + " services");
    return services;
  }

  [HttpGet("mostRecentStatistics")]
  public IActionResult GetMostRecentStatistics()
  {
    _logger.LogInformation("Fetching the most recent statistics");
    var statistics = _apiService.GetMostRecentStatistics();

    if (statistics == null)
    {
      _logger.LogWarning("Services table in database not populated");
      StatusCode(500, "Internal Server Error: Services table in database not populated");
    }

    _logger.LogInformation("Returning statistics with batch id of " + statistics.BatchId);
    return Ok(statistics);
  }

  [HttpGet("servicesByNameAndTimeRange")]
  public ServiceAverageTimesDTO GetServicesByServiceNameAndTimeRange(string serviceName, TimeRange timeRange)
  {
    _logger.LogInformation($"Fetching services with name ${serviceName} with time range of ${timeRange}");
    var services = _apiService.GetServicesByServiceNameAndTimeRange(serviceName, timeRange);

    if (services == null)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new ServiceAverageTimesDTO();
    }

    _logger.LogInformation("Success on fetching average time of services");
    return services;
  }
}
