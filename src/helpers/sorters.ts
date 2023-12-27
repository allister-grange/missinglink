import { ServiceContainer, Service } from "@/types/ServiceTypes";

export const sortServicesByRoute = (
  service: ServiceContainer
): ServiceContainer => {
  const sort = (serviceArray: Service[]) => {
    serviceArray.sort((a, b) => {
      if (!a.routeShortName || !b.routeShortName) {
        return Number.MAX_VALUE;
      }
      return a.routeShortName.localeCompare(b.routeShortName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  };
  sort(service.allServices);
  sort(service.cancelledServices);
  sort(service.earlyServices);
  sort(service.lateServices);
  sort(service.onTimeServices);
  sort(service.unknownServices);

  return service;
};

export const sortServicesResponseByStatus = (data: Service[]) => {
  const serviceHolder: ServiceContainer = {
    cancelledServices: [],
    earlyServices: [],
    onTimeServices: [],
    unknownServices: [],
    allServices: [],
    lateServices: [],
  };

  for (let i = 0; i < data.length; i += 1) {
    const service = data[i];
    service.vehicleId = service.vehicle_id;
    if (service.status === "EARLY") {
      serviceHolder.earlyServices.push(service);
    } else if (service.status === "LATE") {
      serviceHolder.lateServices.push(service);
    } else if (service.status === "ONTIME") {
      serviceHolder.onTimeServices.push(service);
    } else if (service.status === "UNKNOWN") {
      serviceHolder.unknownServices.push(service);
    } else if (service.status === "CANCELLED") {
      serviceHolder.cancelledServices.push(service);
    }

    if (service.status !== "CANCELLED") {
      serviceHolder.allServices.push(service);
    }
  }

  const sortedServices = sortServicesByRoute(serviceHolder);
  return sortedServices;
};
