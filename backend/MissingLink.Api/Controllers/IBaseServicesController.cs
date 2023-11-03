using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using missinglink.Models;

public interface IBaseServiceController
{
  Task<List<Service>> GetLatestServices();
  List<ServiceStatistic> GetServiceStatisticsByDate(DateTime start, DateTime end);
  ServiceStatistic GetMostRecentStatistics();
  List<Service> GetThreeWorstServicesForThisWeek();
  List<string> GetServiceNames();
  List<Service> GetServicesByServiceNameAndTimeRange(string serviceName, TimeRange timeRange);
}
