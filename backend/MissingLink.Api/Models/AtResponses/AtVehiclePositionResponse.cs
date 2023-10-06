using System.Collections.Generic;
using Newtonsoft.Json;
public class PositionResponseEntity
{
  [JsonProperty("id")]
  public string Id { get; set; }

  [JsonProperty("vehicle")]
  public Vehicle Vehicle { get; set; }

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

public class Position
{
  [JsonProperty("latitude")]
  public double Latitude { get; set; }

  [JsonProperty("longitude")]
  public double Longitude { get; set; }

  [JsonProperty("speed")]
  public double Speed { get; set; }

  [JsonProperty("bearing")]
  public double Bearing { get; set; }
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


public class Response
{
  [JsonProperty("header")]
  public Header Header { get; set; }

  [JsonProperty("entity")]
  public List<PositionResponseEntity> Entity { get; set; }
}

public class AtVehiclePositionResponse
{
  [JsonProperty("status")]
  public string Status { get; set; }

  [JsonProperty("response")]
  public Response Response { get; set; }
}

public class Vehicle
{
  [JsonProperty("trip")]
  public Trip Trip { get; set; }

  [JsonProperty("position")]
  public Position Position { get; set; }

  [JsonProperty("timestamp")]
  public int Timestamp { get; set; }
}

