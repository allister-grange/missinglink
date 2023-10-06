using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
  public async Task<List<Service>> GetNewestServices()
  {
    _logger.LogInformation("Fetching services request");
    var services = await _apiService.GetLatestServices();

    if (services == null || services.Count == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<Service>();
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
      startDateInput = DateTime.Parse(startDate);
      endDateInput = DateTime.Parse(endDate);

      stats = _apiService.GetServiceStatisticsByDate(startDateInput, endDateInput);
    }
    catch (System.FormatException e)
    {
      _logger.LogError($"Your date inputs were formatted incorrectly {e.ToString()}");
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
  public IEnumerable<dynamic> GetThreeWorstServicesForThisWeek()
  {
    _logger.LogInformation("Fetching three worst services for this week");
    var services = _apiService.GetThreeWorstServicesForThisWeek();

    if (services == null || services.Count() == 0)
    {
      _logger.LogWarning("Services table in database not populated.");
      return new List<Service>();
    }

    _logger.LogInformation("Found " + services.Count() + " services");
    return services;
  }
}
