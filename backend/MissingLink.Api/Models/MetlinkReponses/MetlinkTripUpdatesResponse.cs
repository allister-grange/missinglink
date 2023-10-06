using System.Collections.Generic;
using Newtonsoft.Json;

namespace missinglink.Models.Metlink
{

  public class Header
  {
    [JsonProperty("gtfsRealtimeVersion")]
    public string GtfsRealtimeVersion { get; set; }

    [JsonProperty("incrementality")]
    public int Incrementality { get; set; }

    [JsonProperty("timestamp")]
    public int Timestamp { get; set; }
  }

  public class Arrival
  {
    [JsonProperty("delay")]
    public int Delay { get; set; }

    [JsonProperty("time")]
    public int Time { get; set; }
  }

  public class StopTimeUpdate
  {
    [JsonProperty("schedule_relationship")]
    public int ScheduleRelationship { get; set; }

    [JsonProperty("stop_sequence")]
    public int StopSequence { get; set; }

    [JsonProperty("arrival")]
    public Arrival Arrival { get; set; }

    [JsonProperty("stop_id")]
    public string StopId { get; set; }
  }

  public class Trip
  {
    [JsonProperty("schedule_relationship")]
    public int ScheduleRelationship { get; set; }

    [JsonProperty("start_time")]
    public string StartTime { get; set; }

    [JsonProperty("trip_id")]
    public string TripId { get; set; }
  }

  public class Vehicle
  {
    [JsonProperty("id")]
    public string Id { get; set; }
  }
  public class TripUpdate
  {
    [JsonProperty("stop_time_update")]
    public StopTimeUpdate StopTimeUpdate { get; set; }

    [JsonProperty("trip")]
    public Trip Trip { get; set; }

    [JsonProperty("vehicle")]
    public Vehicle Vehicle { get; set; }

    [JsonProperty("timestamp")]
    public int Timestamp { get; set; }
  }

  public class TripUpdateHolder
  {
    [JsonProperty("trip_update")]
    public TripUpdate TripUpdate { get; set; }

    [JsonProperty("id")]
    public string Id { get; set; }
  }

  public class MetlinkTripUpdatesResponse
  {
    [JsonProperty("header")]
    public Header Header { get; set; }

    [JsonProperty("entity")]
    public List<TripUpdateHolder> Trips { get; set; }

    public MetlinkTripUpdatesResponse()
    {
      Trips = new List<TripUpdateHolder>();
    }
  }

}