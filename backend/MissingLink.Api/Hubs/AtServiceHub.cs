using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using missinglink.Services;

public class AtServiceHub : Hub
{
  private readonly List<string> connectionIds = new List<string>();
  private readonly IHubContext<AtServiceHub> _hubContext;
  private readonly ILogger<AtServiceHub> _logger;
  private readonly IServiceScopeFactory _serviceScopeFactory;
  public AtServiceHub(IHubContext<AtServiceHub> hubContext, ILogger<AtServiceHub> logger,
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

    var periodicTimer = new PeriodicTimer(TimeSpan.FromSeconds(60));
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
          var _atAPIService = scope.ServiceProvider.GetService<AtAPIService>();

          // get service updates
          var services = await _atAPIService.FetchLatestTripDataFromUpstreamService();
          // ship them to the user
          await _hubContext.Clients.All.SendAsync("ServiceUpdatesAT", services);
          _logger.LogInformation("Sent out Metlink updates using SSE to " + connectionIds.Count + " clients");
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