using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using missinglink.Services;

[Route("api/v1/metlink")]
public class MetlinkServicesController : BaseServicesController<IBaseServiceAPI>
{
  public MetlinkServicesController(ILogger<MetlinkServicesController> logger, IBaseServiceAPI service)
      : base(logger, service) { }
}
