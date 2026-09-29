using System;
using missinglink.Utils;

namespace missinglink.Models
{
  public class ServiceStatisticDto
  {
    public int BatchId { get; set; }
    public string ProviderId { get; set; }
    public int DelayedServices { get; set; }
    public int TotalServices { get; set; }
    public int CancelledServices { get; set; }
    public int EarlyServices { get; set; }
    public int OnTimeServices { get; set; }
    public int NotReportingTimeServices { get; set; }
    public DateTimeOffset Timestamp { get; set; }

    public static ServiceStatisticDto From(ServiceStatistic statistic)
    {
      return new ServiceStatisticDto
      {
        BatchId = statistic.BatchId,
        ProviderId = statistic.ProviderId,
        DelayedServices = statistic.DelayedServices,
        TotalServices = statistic.TotalServices,
        CancelledServices = statistic.CancelledServices,
        EarlyServices = statistic.EarlyServices,
        OnTimeServices = statistic.OnTimeServices,
        NotReportingTimeServices = statistic.NotReportingTimeServices,
        Timestamp = NewZealandTime.ToDateTimeOffset(statistic.Timestamp)
      };
    }
  }
}
