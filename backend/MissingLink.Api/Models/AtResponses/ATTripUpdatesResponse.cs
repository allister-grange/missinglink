using System.Collections.Generic;
using Newtonsoft.Json;

namespace missinglink.Models.AT
{
  public class Arrival
  {
    [JsonProperty("delay")]
    public int Delay { get; set; }

    [JsonProperty("time")]
    public int Time { get; set; }
  }

  public class Departure
  {
    [JsonProperty("delay")]
    public int Delay { get; set; }

    [JsonProperty("time")]
    public int Time { get; set; }
  }

  public class Entity
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("trip_update")]
    public TripUpdate TripUpdate { get; set; }

    [JsonProperty("is_deleted")]
    public bool IsDeleted { get; set; }
  }

  public class Header
  {
    [JsonProperty("timestamp")]
    public double Timestamp { get; set; }

    [JsonProperty("gtfs_realtime_version")]
    public string GtfsRealtimeVersion { get; set; }

    [JsonProperty("incrementality")]
    public int Incrementality { get; set; }
  }

  public class Response
  {
    [JsonProperty("header")]
    public Header Header { get; set; }

    [JsonProperty("entity")]
    public List<Entity> Entity { get; set; }
  }

  public class AtTripUpdatesResponse
  {
    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("response")]
    public Response Response { get; set; }
  }

  public class StopTimeUpdate
  {
    [JsonProperty("stop_sequence")]
    public int StopSequence { get; set; }

    [JsonProperty("arrival")]
    public Arrival Arrival { get; set; }

    [JsonProperty("departure")]
    public Departure Departure { get; set; }

    [JsonProperty("stop_id")]
    public string StopId { get; set; }

    [JsonProperty("schedule_relationship")]
    public int ScheduleRelationship { get; set; }
  }

  public class Trip
  {
    [JsonProperty("trip_id")]
    public string TripId { get; set; }

    [JsonProperty("start_time")]
    public string StartTime { get; set; }

    [JsonProperty("start_date")]
    public string StartDate { get; set; }

    [JsonProperty("schedule_relationship")]
    public int ScheduleRelationship { get; set; }

    [JsonProperty("route_id")]
    public string RouteId { get; set; }

    [JsonProperty("direction_id")]
    public int DirectionId { get; set; }
  }

  public class TripUpdate
  {
    [JsonProperty("trip")]
    public Trip Trip { get; set; }

    [JsonProperty("timestamp")]
    public int Timestamp { get; set; }

    [JsonProperty("delay")]
    public int Delay { get; set; }

    [JsonProperty("stop_time_update")]
    public StopTimeUpdate StopTimeUpdate { get; set; }

    [JsonProperty("vehicle")]
    public Vehicle Vehicle { get; set; }
  }

  public class Vehicle
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("label")]
    public string Label { get; set; }
  }


}
