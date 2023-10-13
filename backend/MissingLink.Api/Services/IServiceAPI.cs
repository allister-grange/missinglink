using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

namespace missinglink.Services
{
  public interface IServiceAPI
  {
    Task<int> GenerateNewBatchId();
    Task UpdateServicesWithLatestData(List<Service> allServices);
    Task UpdateStatisticsWithLatestServices(List<Service> allServices, int newBatchId);
  }
}
