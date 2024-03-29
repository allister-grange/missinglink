﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using missinglink.Contexts;

namespace missinglink.Migrations
{
    [DbContext(typeof(ServiceContext))]
    partial class ServiceContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.8")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("missinglink.Models.MetlinkService", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text");

                    b.Property<int>("BatchId")
                        .HasColumnType("integer");

                    b.Property<double>("Bearing")
                        .HasColumnType("double precision");

                    b.Property<int>("Delay")
                        .HasColumnType("integer");

                    b.Property<double>("Lat")
                        .HasColumnType("double precision");

                    b.Property<double>("Long")
                        .HasColumnType("double precision");

                    b.Property<string>("ProviderId")
                        .HasColumnType("text");

                    b.Property<string>("RouteDescription")
                        .HasColumnType("text");

                    b.Property<string>("RouteId")
                        .HasColumnType("text");

                    b.Property<string>("RouteLongName")
                        .HasColumnType("text");

                    b.Property<string>("RouteShortName")
                        .HasColumnType("text");

                    b.Property<string>("ServiceName")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.Property<string>("TripId")
                        .HasColumnType("text");

                    b.Property<string>("VehicleId")
                        .HasColumnType("text");

                    b.Property<string>("VehicleType")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("services");
                });

            modelBuilder.Entity("missinglink.Models.ServiceStatistic", b =>
                {
                    b.Property<int>("BatchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("CancelledServices")
                        .HasColumnType("integer");

                    b.Property<int>("DelayedServices")
                        .HasColumnType("integer");

                    b.Property<int>("EarlyServices")
                        .HasColumnType("integer");

                    b.Property<int>("NotReportingTimeServices")
                        .HasColumnType("integer");

                    b.Property<int>("OnTimeServices")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("TotalServices")
                        .HasColumnType("integer");

                    b.HasKey("BatchId");

                    b.ToTable("service_statistics");
                });
#pragma warning restore 612, 618
        }
    }
}
