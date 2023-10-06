using System;

namespace missinglink.Models
{
  public class ServiceStatistic
  {
    public int BatchId { get; set; }

    public string ProviderId { get; set; }

    public int DelayedServices { get; set; }

    public int TotalServices { get; set; }

    public int CancelledServices { get; set; }

    public int EarlyServices { get; set; }

    public int OnTimeServices { get; set; }

    public int NotReportingTimeServices { get; set; }

    public DateTime Timestamp { get; set; }
  }
}