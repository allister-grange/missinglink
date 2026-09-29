using System;

namespace missinglink.Utils
{
  public static class NewZealandTime
  {
    private static readonly TimeZoneInfo TimeZone =
      TimeZoneInfo.FindSystemTimeZoneById("Pacific/Auckland");

    public static DateTime FromUtc(DateTime utcDateTime)
    {
      var utc = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
      var nzDateTime = TimeZoneInfo.ConvertTimeFromUtc(utc, TimeZone);
      return DateTime.SpecifyKind(nzDateTime, DateTimeKind.Unspecified);
    }

    public static DateTimeOffset ToDateTimeOffset(DateTime nzWallClockTime)
    {
      var wallClockTime = DateTime.SpecifyKind(nzWallClockTime, DateTimeKind.Unspecified);
      return new DateTimeOffset(wallClockTime, TimeZone.GetUtcOffset(wallClockTime));
    }
  }
}
