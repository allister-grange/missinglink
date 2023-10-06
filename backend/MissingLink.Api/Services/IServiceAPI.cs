using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

namespace missinglink.Services
{
  public interface IServiceAPI
  {
    Task<int> GenerateNewBatchId();
    void DeleteAllServices();
    Task UpdateServicesWithLatestData(List<Service> allServices);
    List<Service> GetWorstServicesForPastWeek(string providerId);
    Task UpdateStatisticsWithLatestServices(List<Service> allServices, int newBatchId);
  }
}
