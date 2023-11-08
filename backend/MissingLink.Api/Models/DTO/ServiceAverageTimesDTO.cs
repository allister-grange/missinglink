using System;

namespace missinglink.Models
{
  public class ServiceAverageTimesDTO
  {
    public int EarliestTime { get; set; }
    public int AverageDisruptionTime { get; set; }
    public int LatestTime { get; set; }

  }
}