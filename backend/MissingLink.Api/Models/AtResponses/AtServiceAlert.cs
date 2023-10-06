using System.Collections.Generic;
using Newtonsoft.Json;

namespace missinglink.Models.AT.ServiceAlert
{
  public class ActivePeriod
  {
    [JsonProperty("start")]
    public int Start { get; set; }

    [JsonProperty("end")]
    public int? End { get; set; }
  }

  public class Alert
  {
    [JsonProperty("cause")]
    public string Cause { get; set; }

    [JsonProperty("effect")]
    public string Effect { get; set; }

    [JsonProperty("header_text")]
    public HeaderText HeaderText { get; set; }

    [JsonProperty("active_period")]
    public List<ActivePeriod> ActivePeriod { get; set; }

    [JsonProperty("informed_entity")]
    public List<InformedEntity> InformedEntity { get; set; }

    [JsonProperty("description_text")]
    public DescriptionText DescriptionText { get; set; }
  }

  public class DescriptionText
  {
    [JsonProperty("translation")]
    public List<Translation> Translation { get; set; }
  }

  public class ServiceAlertEntity
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("alert")]
    public Alert Alert { get; set; }

    [JsonProperty("timestamp")]
    public string Timestamp { get; set; }
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

  public class HeaderText
  {
    [JsonProperty("translation")]
    public List<Translation> Translation { get; set; }
  }

  public class InformedEntity
  {
    [JsonProperty("stop_id")]
    public string StopId { get; set; }

    [JsonProperty("trip")]
    public InformedIdentityTrip Trip { get; set; }
  }

  public class InformedIdentityTrip
  {
    [JsonProperty("trip_id")]
    public string TripId { get; set; }
  }

  public class Response
  {
    [JsonProperty("header")]
    public Header Header { get; set; }

    [JsonProperty("entity")]
    public List<ServiceAlertEntity> Entity { get; set; }
  }

  public class AtServiceAlert
  {
    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("response")]
    public Response Response { get; set; }
  }

  public class Translation
  {
    [JsonProperty("text")]
    public string Text { get; set; }

    [JsonProperty("language")]
    public string Language { get; set; }
  }

}
