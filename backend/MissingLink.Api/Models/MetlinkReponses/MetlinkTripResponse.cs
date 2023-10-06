
using Newtonsoft.Json;

namespace missinglink.Models.Metlink
{
  public class MetlinkTripResponse
  {
    [JsonProperty("route_id")]
    public string RouteId { get; set; }

    [JsonProperty("service_id")]
    public string ServiceId { get; set; }

    [JsonProperty("trip_id")]
    public string TripId { get; set; }

    [JsonProperty("trip_headsign")]
    public string TripHeadsign { get; set; }

    [JsonProperty("direction_id")]
    public int DirectionId { get; set; }

    [JsonProperty("block_id")]
    public string BlockId { get; set; }

    [JsonProperty("shape_id")]
    public string ShapeId { get; set; }

    [JsonProperty("wheelchair_accessible")]
    public int WheelchairAccessible { get; set; }

    [JsonProperty("bikes_allowed")]
    public int BikesAllowed { get; set; }

    [JsonProperty("date")]
    public string Date { get; set; }
  }
}