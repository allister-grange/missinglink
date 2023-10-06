using System.Collections.Generic;
using Newtonsoft.Json;
public class Attributes
{
  [JsonProperty("agency_id")]
  public string AgencyId { get; set; }

  [JsonProperty("route_id")]
  public string RouteId { get; set; }

  [JsonProperty("route_long_name")]
  public string RouteLongName { get; set; }

  [JsonProperty("route_short_name")]
  public string RouteShortName { get; set; }

  [JsonProperty("route_type")]
  public int RouteType { get; set; }
}

public class Datum
{
  [JsonProperty("type")]
  public string Type { get; set; }

  [JsonProperty("id")]
  public string Id { get; set; }

  [JsonProperty("attributes")]
  public Attributes Attributes { get; set; }
}

public class AtRouteResponse
{
  [JsonProperty("data")]
  public List<Datum> Data { get; set; }
}

