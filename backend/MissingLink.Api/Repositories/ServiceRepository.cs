using System;
using System.Collections.Generic;
using missinglink.Contexts;
using missinglink.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using missinglink.Repository;

public class ServiceRepository : IServiceRepository
{
  private readonly ServiceContext _dbContext;

  public ServiceRepository(ServiceContext dbContext)
  {
    _dbContext = dbContext;
  }

  public Service GetById(int id)
  {
    return _dbContext.Services.Find(id);
  }

  public List<Service> GetByBatchId(int batchId)
  {
    return _dbContext.Services.Where((service) => service.BatchId == batchId).ToList();
  }

  public List<Service> GetByBatchIdAndProvider(int batchId, string serviceProviderId)
  {
    return _dbContext.Services.Where((service) => service.BatchId == batchId
      && service.ProviderId == serviceProviderId).ToList();
  }

  public List<Service> GetAll()
  {
    return _dbContext.Services.ToList();
  }

  public void Add(Service service)
  {
    _dbContext.Services.Add(service);
    _dbContext.SaveChanges();
  }

  public void Update(Service service)
  {
    _dbContext.Services.Update(service);
    _dbContext.SaveChanges();
  }

  public void Delete(Service service)
  {
    _dbContext.Services.Remove(service);
    _dbContext.SaveChanges();
  }

  public List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate,
    DateTime endDate)
  {
    return _dbContext.ServiceStatistics
        .Where(stat => stat.Timestamp >= startDate && stat.Timestamp <= endDate)
        .ToList();
  }

  public List<ServiceStatistic> GetServiceStatisticsByDateAndProvider(DateTime startDate,
    DateTime endDate, string serviceProviderId)
  {
    return _dbContext.ServiceStatistics
        .Where(stat => stat.Timestamp >= startDate && stat.Timestamp <= endDate
          && stat.ProviderId == serviceProviderId)
        .ToList();
  }

  public async Task AddStatisticAsync(ServiceStatistic statistic)
  {
    await _dbContext.ServiceStatistics.AddAsync(statistic);
    await _dbContext.SaveChangesAsync();
  }

  public async Task AddServicesAsync(List<Service> services)
  {
    await _dbContext.Services.AddRangeAsync(services);
    await _dbContext.SaveChangesAsync();
  }

  public async Task<int> GetLatestBatchId()
  {
    var batchIdsQuery = _dbContext.ServiceStatistics
        .OrderByDescending(s => s.BatchId)
        .Select(s => s.BatchId)
        .Take(1);

    return await batchIdsQuery.FirstOrDefaultAsync();
  }

  public List<Service> GetWorstServicesForThisWeek(string providerId, int numberOfServicesToReturn = 3)
  {
    DateTime lastWeek = DateTime.Now.AddDays(-7);

    // Fetch all services in the past week that aren't schools
    var services = (from ss in _dbContext.ServiceStatistics
                    join s in _dbContext.Services on new { ss.BatchId, ss.ProviderId } equals new { s.BatchId, s.ProviderId }
                    where ss.Timestamp >= lastWeek && ss.ProviderId == providerId
                        && !s.RouteLongName.Contains("school") && !s.RouteLongName.Contains("School")
                        && !s.RouteLongName.Contains("College") && !s.RouteLongName.Contains("college")
                        && !s.RouteLongName.Contains("Intermediate") && !s.RouteLongName.Contains("intermediate")
                    select new Service
                    {
                      ServiceName = s.ServiceName,
                      RouteLongName = s.RouteLongName,
                      Delay = s.Delay
                    }).ToList();


    // group all services into a list of matching services names
    var servicesGroupedByServiceName = services.GroupBy(s => s.ServiceName).Select(group => new
    GroupedService
    {
      ServiceName = group.Key,
      Services = group.ToList(),
      MAD = 0
    })
    .ToList();

    // calculate the mean average deviation for each service 
    foreach (var serviceGroup in servicesGroupedByServiceName)
    {
      int mad = (int)Math.Floor(serviceGroup.Services.Average(s => Math.Abs(s.Delay - serviceGroup.Services.Average(x => x.Delay))));
      serviceGroup.MAD = mad;
    }

    // get the 3 services with the worst MAD scores
    var worstServices = servicesGroupedByServiceName.OrderByDescending(kv => kv.MAD).Take(numberOfServicesToReturn).Select(kv => new Service
    {
      ServiceName = kv.ServiceName,
      Delay = kv.MAD,
      RouteLongName = kv.Services[0].RouteLongName
    }).ToList();

    return worstServices;
  }

  public List<string> GetServiceNamesByProviderId(string providerId)
  {
    return _dbContext.Services
        .Where(s => s.ProviderId == providerId && s.ServiceName != null)
        .Select(s => s.ServiceName)
        .Distinct()
        .ToList();
  }

  public ServiceAverageTimesDTO GetServicesByServiceNameAndTimeRange(string providerId, string serviceName, TimeRange timeRange)
  {
    TimeZoneInfo nzTimeZone = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time");
    DateTime currentNZTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, nzTimeZone);

    DateTime startDate = currentNZTime;

    switch (timeRange)
    {
      case TimeRange.OneMonth:
        startDate = startDate.AddMonths(-1);
        break;
      case TimeRange.OneWeek:
        startDate = startDate.AddDays(-7);
        break;
      case TimeRange.OneDay:
        startDate = startDate.AddDays(-1);
        break;
      case TimeRange.AllTime:
      default:
        startDate = DateTime.MinValue;
        break;
    }

    var services = _dbContext.Services
        .Where(s => s.ProviderId == providerId && s.ServiceName == serviceName && s.ServiceName != null)
        .Join(_dbContext.ServiceStatistics,
              service => service.BatchId,
              stat => stat.BatchId,
              (service, stat) => new { Service = service, Stat = stat })
        .Where(joined => joined.Stat.Timestamp >= startDate)
        .Select(joined => joined.Service)
        .ToList();

    var latestService = services.Max(s => s.Delay);
    var earliestService = services.Min(s => s.Delay);
    var sumOfDelays = services.Sum(item => Math.Abs(item.Delay));
    int totalAbsoluteDeviation = (int)Math.Floor((double)sumOfDelays / services.Count);

    return new ServiceAverageTimesDTO()
    {
      LatestTime = latestService,
      EarliestTime = earliestService,
      AverageDisruptionTime = totalAbsoluteDeviation
    };
  }

  public ServiceStatistic GetMostRecentStatisticsByProviderId(string providerId)
  {
    return _dbContext.ServiceStatistics
        .Where(stat => stat.ProviderId == providerId)
        .OrderByDescending(stat => stat.BatchId)
        .FirstOrDefault();
  }
  private class GroupedService
  {
    public string ServiceName { get; set; }
    public List<Service> Services { get; set; }
    public int MAD { get; set; }
  }

}
