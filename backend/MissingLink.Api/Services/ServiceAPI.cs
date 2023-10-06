using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using missinglink.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using missinglink.Repository;
using System.Text.Json;

namespace missinglink.Services
{
  public class ServiceAPI : IServiceAPI
  {
    private readonly ILogger<AtAPIService> _logger;
    private readonly IServiceRepository _serviceRepository;
    private readonly JsonSerializerOptions options = new JsonSerializerOptions
    {
      PropertyNameCaseInsensitive = true
    };

    public ServiceAPI(ILogger<AtAPIService> logger, IServiceRepository serviceRepository)
    {
      _logger = logger;
      _serviceRepository = serviceRepository;
    }


    public async Task<int> GenerateNewBatchId()
    {
      int lastBatchId = await _serviceRepository.GetLatestBatchId();
      return lastBatchId + 1;
    }

    public void DeleteAllServices()
    {
      _serviceRepository.DeleteAllServices();
    }

    public async Task UpdateServicesWithLatestData(List<Service> allServices)
    {
      try
      {
        await _serviceRepository.AddServicesAsync(allServices);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while updates services in the db");
        throw ex;
      }
    }

    public List<Service> GetWorstServicesForPastWeek(string providerId)
    {
      try
      {
        var services = _serviceRepository.GetThreeWorstServicesForThisWeek(providerId);
        return services;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while updates services in the db");
        throw ex;
      }
    }

    public async Task UpdateStatisticsWithLatestServices(List<Service> allServices, int newBatchId)
    {
      var newServiceStatistic = new ServiceStatistic();

      if (allServices == null)
      {
        throw new ArgumentException("The service table must be empty");
      }

      var providers = new string[] { "Metlink", "AT" };

      foreach (var provider in providers)
      {
        newServiceStatistic.DelayedServices = allServices.Where(service => service.Status == "LATE" && service.ProviderId == provider).Count();
        newServiceStatistic.EarlyServices = allServices.Where(service => service.Status == "EARLY" && service.ProviderId == provider).Count();
        newServiceStatistic.NotReportingTimeServices = allServices.Where(service => service.Status == "UNKNOWN" && service.ProviderId == provider).Count();
        newServiceStatistic.OnTimeServices = allServices.Where(service => service.Status == "ONTIME" && service.ProviderId == provider).Count();
        newServiceStatistic.CancelledServices = allServices.Where(service => service.Status == "CANCELLED" && service.ProviderId == provider).Count();
        newServiceStatistic.TotalServices = allServices.Where(service => service.Status != "CANCELLED" && service.ProviderId == provider).Count();
        DateTime utcTime = DateTime.UtcNow;
        TimeZoneInfo serverZone = TimeZoneInfo.FindSystemTimeZoneById("NZ");
        DateTime currentDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, serverZone);
        newServiceStatistic.Timestamp = currentDateTime;
        newServiceStatistic.BatchId = newBatchId;
        newServiceStatistic.ProviderId = provider;
        await _serviceRepository.AddStatisticAsync(newServiceStatistic);
      }
    }
  }
}
