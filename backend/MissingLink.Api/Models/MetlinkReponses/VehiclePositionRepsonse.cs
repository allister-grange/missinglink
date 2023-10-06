using System.Collections.Generic;
using Newtonsoft.Json;

namespace missinglink.Models.Metlink.VehiclePosition
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

  public class Trip
  {
    [JsonProperty("start_time")]
    public string StartTime { get; set; }

    [JsonProperty("trip_id")]
    public string TripId { get; set; }

    [JsonProperty("direction_id")]
    public int DirectionId { get; set; }

    [JsonProperty("route_id")]
    public string RouteId { get; set; }

    [JsonProperty("schedule_relationship")]
    public int ScheduleRelationship { get; set; }

    [JsonProperty("start_date")]
    public string StartDate { get; set; }
  }

  public class Position
  {
    [JsonProperty("bearing")]
    public double Bearing { get; set; }

    [JsonProperty("latitude")]
    public double Latitude { get; set; }

    [JsonProperty("longitude")]
    public double Longitude { get; set; }
  }

  public class VehiclePositionId
  {
    [JsonProperty("id")]
    public string Id { get; set; }
  }

  public class VehiclePosition
  {
    // [JsonProperty("id")]
    // public string Id { get; set; }

    [JsonProperty("trip")]
    public Trip Trip { get; set; }

    [JsonProperty("position")]
    public Position Position { get; set; }

    [JsonProperty("vehicle")]
    public VehiclePositionId Vehicle { get; set; }

    [JsonProperty("timestamp")]
    public int Timestamp { get; set; }
  }

  public class VehiclePositionHolder
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("vehicle")]
    public VehiclePosition VehiclePosition { get; set; }
  }

  public class VehiclePositionResponse
  {
    [JsonProperty("header")]
    public Header Header { get; set; }

    [JsonProperty("entity")]
    public List<VehiclePositionHolder> VehiclePositions { get; set; }

    public VehiclePositionResponse()
    {
      VehiclePositions = new List<VehiclePositionHolder>();
    }
  }

}