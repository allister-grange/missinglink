using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Services;

[Route("api/v1/metro")]
public class MetroServicesController : BaseServicesController<IBaseServiceAPI>
{
  public MetroServicesController(ILogger<MetroServicesController> logger, IBaseServiceAPI service)
      : base(logger, service) { }
}
