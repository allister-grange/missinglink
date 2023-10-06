using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

namespace missinglink.Services
{
  public interface IBaseServiceAPI
  {
    Task<List<Service>> FetchLatestTripDataFromUpstreamService();
    Task<List<Service>> GetLatestServices();
    List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate, DateTime endDate);
    List<Service> GetThreeWorstServicesForThisWeek();
  }
}
