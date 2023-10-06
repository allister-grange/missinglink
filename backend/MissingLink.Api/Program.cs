using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace missinglink
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var host = WebHost.CreateDefaultBuilder(args)
        .ConfigureServices(services => services.AddAutofac())
        .UseStartup<Startup>()
        .UseUrls("http://localhost:5002", "https://localhost:5001")
        .Build();

      host.Run();
    }
  }
}
