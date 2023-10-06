using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using missinglink.Services;

public class MetlinkServiceHub : Hub
{
  private readonly List<string> connectionIds = new List<string>();
  private readonly IHubContext<MetlinkServiceHub> _hubContext;
  private readonly ILogger<MetlinkServiceHub> _logger;
  private readonly IServiceScopeFactory _serviceScopeFactory;
  public MetlinkServiceHub(IHubContext<MetlinkServiceHub> hubContext, ILogger<MetlinkServiceHub> logger,
    IServiceScopeFactory serviceScopeFactory)
  {
    _hubContext = hubContext;
    _serviceScopeFactory = serviceScopeFactory;
    StartTimer();
    _logger = logger;
  }

  private async Task StartTimer()
  {
    await SendServicesUpdate();

    var periodicTimer = new PeriodicTimer(TimeSpan.FromSeconds(30));
    while (await periodicTimer.WaitForNextTickAsync())
    {
      await SendServicesUpdate();
    }
  }
  public async Task SendServicesUpdate()
  {
    if (connectionIds.Count > 0)
    {
      try
      {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
          var _metlinkAPIService = scope.ServiceProvider.GetService<MetlinkAPIService>();

          // get service updates
          var services = await _metlinkAPIService.FetchLatestTripDataFromUpstreamService();
          // ship them to the user
          await _hubContext.Clients.All.SendAsync("ServiceUpdatesMetlink", services);
          _logger.LogInformation("Sent out AT updates using SSE to " + connectionIds.Count + " clients");
        }
      }
      catch
      {
        Console.WriteLine("Failed to send out update, there's an issue with the API");
      }
    }
  }

  public override async Task OnConnectedAsync()
  {
    connectionIds.Add(Context.ConnectionId);
    await base.OnConnectedAsync();
  }

  public override async Task OnDisconnectedAsync(Exception exception)
  {
    connectionIds.Remove(Context.ConnectionId);
    await base.OnDisconnectedAsync(exception);
  }

}