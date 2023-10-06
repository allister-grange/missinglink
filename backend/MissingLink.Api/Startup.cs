using Autofac;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using missinglink.Contexts;
using missinglink.Controllers;
using missinglink.Repository;
using missinglink.Services;
using missinglink.Utils;

namespace missinglink
{
  public class Startup
  {
    public Startup(IWebHostEnvironment env)
    {
      // Configuration = configuration;
      var builder = new ConfigurationBuilder()
    .SetBasePath(env.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    public IConfigurationRoot Configuration { get; private set; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddHttpClient();

      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "missinglink", Version = "v1" });
      });

      services.Configure<MetlinkApiConfig>(Configuration.GetSection("MetlinkApiConfig"));
      services.Configure<AtApiConfig>(Configuration.GetSection("AtApiConfig"));

      services.AddDbContext<ServiceContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString("Postgres")));

      services.AddScoped<IServiceRepository, ServiceRepository>();
      services.AddScoped<IDateTimeProvider, DefaultDateTimeProvider>();

      services.AddScoped<IServiceAPI, ServiceAPI>();

      services.AddControllers().AddControllersAsServices();

      services.AddSingleton<MetlinkServiceHub>();
      services.AddSignalR();
    }

    public void ConfigureContainer(ContainerBuilder builder)
    {
      builder.RegisterType<MetlinkAPIService>();
      builder.RegisterType<AtAPIService>();
      builder.RegisterType<ServiceAPI>();

      builder.Register(c => new AtServicesController(c.Resolve<ILogger<AtServicesController>>(), c.Resolve<AtAPIService>())).InstancePerLifetimeScope();
      builder.Register(c => new MetlinkServicesController(c.Resolve<ILogger<MetlinkServicesController>>(), c.Resolve<MetlinkAPIService>())).InstancePerLifetimeScope();
      builder.RegisterType<UpdateServicesController>().InstancePerLifetimeScope();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseForwardedHeaders(new ForwardedHeadersOptions
      {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
      });

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "missinglink v1"));
        app.UseCors(builder => builder
          .WithOrigins("http://localhost:3000")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials());
      }
      else
      {
        app.UseCors(builder => builder
                  .WithOrigins("https://missinglink.allistergrange.com",
                    "https://www.missinglink.allistergrange.com",
                    "https://www.missinglink.link", "https://missinglink.link")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
        app.UseHttpsRedirection();
      }

      app.UseRouting();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<MetlinkServiceHub>("/servicehub/metlink", options =>
      {
        options.Transports = HttpTransportType.ServerSentEvents;
      });
        endpoints.MapHub<AtServiceHub>("/servicehub/at", options =>
      {
        options.Transports = HttpTransportType.ServerSentEvents;
      });
      });

    }
  }
}
