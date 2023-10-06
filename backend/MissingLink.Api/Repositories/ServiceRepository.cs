using System;
using System.Collections.Generic;
using missinglink.Contexts;
using missinglink.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace missinglink.Repository
{
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

    public void DeleteAllServices()
    {
      _dbContext.Services.RemoveRange(_dbContext.Services);
      _dbContext.SaveChanges();
    }

    public List<Service> GetThreeWorstServicesForThisWeek(string providerId)
    {
      DateTime lastWeek = DateTime.Now.AddDays(-7);

      var query = (from ss in _dbContext.ServiceStatistics
                   join s in _dbContext.Services on new { ss.BatchId, ss.ProviderId } equals new { s.BatchId, s.ProviderId }
                   where ss.Timestamp >= lastWeek && ss.ProviderId == providerId
                   group s by new { s.ServiceName, s.RouteLongName } into g
                   orderby g.Average(s => s.Delay) descending
                   select new Service
                   {
                     ServiceName = g.Key.ServiceName,
                     RouteLongName = g.Key.RouteLongName,
                     Delay = (int)g.Average(s => s.Delay)

                   }).Take(3);

      return query.ToList();
    }

  }
}

