using Newtonsoft.Json;

namespace missinglink.Models.Metlink
{
  public class RouteResponse
  {
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("route_id")]
    public string RouteId { get; set; }

    [JsonProperty("agency_id")]
    public string AgencyId { get; set; }

    [JsonProperty("route_short_name")]
    public string RouteShortName { get; set; }

    [JsonProperty("route_long_name")]
    public string RouteLongName { get; set; }

    [JsonProperty("route_desc")]
    public string RouteDesc { get; set; }

    [JsonProperty("route_type")]
    public int RouteType { get; set; }

    [JsonProperty("route_color")]
    public string RouteColor { get; set; }

    [JsonProperty("route_text_color")]
    public string RouteTextColor { get; set; }

    [JsonProperty("route_url")]
    public string RouteUrl { get; set; }
  }
}