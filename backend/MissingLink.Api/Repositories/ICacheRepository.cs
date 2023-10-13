using System;

namespace missinglink.Repository
{
  public interface ICacheRepository
  {
    T Get<T>(string key);
    void Set<T>(string key, T value, TimeSpan? expiry = null);
    void Set<T>(string key, T value);
    void Remove(string key);
  }
}