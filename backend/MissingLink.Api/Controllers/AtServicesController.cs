using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Services;

[Route("api/v1/at")]
public class AtServicesController : BaseServicesController<IBaseServiceAPI>
{
  public AtServicesController(ILogger<AtServicesController> logger, IBaseServiceAPI service)
      : base(logger, service) { }
}
