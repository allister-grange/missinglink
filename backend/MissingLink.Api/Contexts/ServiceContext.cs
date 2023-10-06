using Microsoft.EntityFrameworkCore;
using missinglink.Models;

namespace missinglink.Contexts
{
  public class ServiceContext : DbContext
  {
    public DbSet<Service> Services { get; set; }
    public DbSet<ServiceStatistic> ServiceStatistics { get; set; }
    public ServiceContext(DbContextOptions<ServiceContext> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      // Configure table names
      modelBuilder.Entity<Service>().ToTable("services");
      modelBuilder.Entity<ServiceStatistic>().ToTable("service_statistics")
      .HasKey(m => new { m.BatchId, m.ProviderId });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      optionsBuilder.EnableSensitiveDataLogging();
    }

  }
}