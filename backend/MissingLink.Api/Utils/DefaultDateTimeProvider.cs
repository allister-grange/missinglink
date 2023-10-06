using System;

namespace missinglink.Utils
{
  public class DefaultDateTimeProvider : IDateTimeProvider
  {
    public DateTime UtcNow => DateTime.UtcNow;
  }
}