using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

namespace missinglink.Repository
{
  public interface IServiceRepository
  {
    Service GetById(int id);
    void Add(Service service);
    void Update(Service service);
    void Delete(Service service);
    List<Service> GetAll();
    List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate, DateTime endDate);
    List<ServiceStatistic> GetServiceStatisticsByDateAndProvider(DateTime startDate, DateTime endDate, string serviceProviderId);
    Task AddStatisticAsync(ServiceStatistic statistic);
    Task AddServicesAsync(List<Service> services);
    void DeleteAllServices();
    Task<int> GetLatestBatchId();
    List<Service> GetByBatchId(int batchId);
    List<Service> GetByBatchIdAndProvider(int batchId, string serviceProviderId);
    List<Service> GetThreeWorstServicesForThisWeek(string providerId);
  }
}
