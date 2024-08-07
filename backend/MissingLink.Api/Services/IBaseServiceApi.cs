using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

namespace missinglink.Services
{
  public interface IBaseServiceAPI
  {
    Task<List<Service>> FetchLatestTripDataFromUpstreamService();
    List<Service> GetLatestServices();
    List<ServiceStatistic> GetServiceStatisticsByDate(DateTime startDate, DateTime endDate);
    ServiceStatistic GetMostRecentStatistics();
    List<Service> GetWorstServicesForThisWeek();
    List<Service> GetBestServicesForThisWeek();
    List<string> GetServiceNames();
    ServiceAverageTimesDTO GetServicesByServiceNameAndTimeRange(string serviceName, TimeRange timeRange);
  }
}
