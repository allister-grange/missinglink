using System;

namespace missinglink.Utils
{
  public interface IDateTimeProvider
  {
    DateTime UtcNow { get; }
  }
}