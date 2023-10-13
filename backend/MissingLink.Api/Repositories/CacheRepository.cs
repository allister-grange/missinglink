using System;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace missinglink.Repository
{
  public class CacheRepository : ICacheRepository
  {
    private readonly IDatabase _database;

    public CacheRepository(ConnectionMultiplexer redisConnection)
    {
      _database = redisConnection.GetDatabase();
    }

    public T Get<T>(string key)
    {
      var data = _database.StringGet(key);
      if (data.IsNullOrEmpty)
        return default;

      return JsonConvert.DeserializeObject<T>(data);
    }

    public void Set<T>(string key, T value, TimeSpan? expiry = null)
    {
      var jsonData = JsonConvert.SerializeObject(value);
      _database.StringSet(key, jsonData, expiry);
    }

    public void Remove(string key)
    {
      _database.KeyDelete(key);
    }

    public void Set<T>(string key, T value)
    {
      var jsonData = JsonConvert.SerializeObject(value);
      _database.StringSet(key, jsonData);
    }
  }

}