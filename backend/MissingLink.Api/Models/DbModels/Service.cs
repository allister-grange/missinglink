using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace missinglink.Models
{
  public class Service
  {

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string VehicleId { get; set; }
    public int BatchId { get; set; }

    // 22 bus or JVL train etc
    public string ServiceName { get; set; }

    // Metlink or AT etc
    public string ProviderId { get; set; }
    public string VehicleType { get; set; }
    public string Status { get; set; }
    public int Delay { get; set; }
    public string TripId { get; set; }
    public string RouteId { get; set; }
    public string RouteDescription { get; set; }
    public string RouteShortName { get; set; }
    public string RouteLongName { get; set; }
    public double Lat { get; set; }
    public double Long { get; set; }
    public double Bearing { get; set; }
  }
}