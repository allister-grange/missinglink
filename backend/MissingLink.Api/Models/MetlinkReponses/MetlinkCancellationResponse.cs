using Newtonsoft.Json;

namespace missinglink.Models.Metlink
{
  public class MetlinkCancellationResponse
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("date_created")]
    public string DateCreated { get; set; }

    [JsonProperty("date_updated")]
    public string DateUpdated { get; set; }

    [JsonProperty("trip_id")]
    public string TripId { get; set; }

    [JsonProperty("route_id")]
    public string RouteId { get; set; }

    [JsonProperty("trip_date_start")]
    public string TripDateStart { get; set; }

    [JsonProperty("trip_date_end")]
    public string TripDateEnd { get; set; }

    [JsonProperty("direction_id")]
    public int DirectionId { get; set; }

    [JsonProperty("reinstated")]
    public int Reinstated { get; set; }

    [JsonProperty("part_cancellation")]
    public int PartCancellation { get; set; }
  }
}