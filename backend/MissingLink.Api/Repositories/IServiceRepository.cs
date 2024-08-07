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
    Task<int> GetLatestBatchId();
    List<Service> GetByBatchId(int batchId);
    List<Service> GetByBatchIdAndProvider(int batchId, string serviceProviderId);
    List<Service> GetWorstServicesForThisWeek(string providerId, int numberOfServicesToReturn);
    List<Service> GetBestServicesForThisWeek(string providerId, int numberOfServicesToReturn);
    List<string> GetServiceNamesByProviderId(string providerId);
    ServiceAverageTimesDTO GetServicesByServiceNameAndTimeRange(string providerId, string serviceName, TimeRange timeRange);
    ServiceStatistic GetMostRecentStatisticsByProviderId(string providerId);
  }
}
