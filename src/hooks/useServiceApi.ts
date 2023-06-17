import { useEffect, useCallback, useReducer } from "react";
import { Service, ServiceContainer } from "@/types/ServiceTypes";
import fetchData from "./fetchData";
import { API_URL } from "@/constants";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const sortServicesByRoute = (service: ServiceContainer): ServiceContainer => {
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

const sortServicesResponseByStatus = (data: Service[]) => {
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

type State = {
  services: ServiceContainer;
  status: "IDLE" | "LOADING" | "REJECTED" | "RESOLVED" | "REFRESHING";
  error?: boolean;
};

type Action =
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "RESOLVED"; results: ServiceContainer }
  | { type: "REJECTED"; error: boolean }
  | { type: "REFRESHING" };

const asyncReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "IDLE": {
      return { status: "IDLE", services: state.services };
    }
    case "LOADING": {
      return { status: "LOADING", services: state.services };
    }
    case "REFRESHING": {
      return { status: "REFRESHING", services: state.services };
    }
    case "RESOLVED": {
      return { status: "RESOLVED", services: action.results };
    }
    case "REJECTED": {
      return {
        status: "REJECTED",
        error: action.error,
        services: state.services,
      };
    }
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
};

const getServiceProviderFromCity = (city: string) => {
  let serviceProvider = "";

  switch (city) {
    case "wellington":
      serviceProvider = "metlink";
      break;
    case "auckland":
      serviceProvider = "at";
      break;
    default:
      serviceProvider = "metlink;";
  }

  return serviceProvider;
};

const useServiceApi = (city: string) => {
  const [state, dispatch] = useReducer(asyncReducer, {
    status: "IDLE",
    services: {
      cancelledServices: [],
      earlyServices: [],
      onTimeServices: [],
      unknownServices: [],
      allServices: [],
      lateServices: [],
    },
  });

  const fetchServices = useCallback(
    async (isRefreshing: boolean) => {
      if (!isRefreshing) {
        dispatch({ type: "LOADING" });
      }
      const response = await fetchData<Service>(
        `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/services`
      );

      if (response.error) {
        dispatch({ type: "REJECTED", error: response.error });
        return;
      }

      const { data } = response;
      if (!data) {
        dispatch({ type: "REJECTED", error: true });
        return;
      }

      const sortedServices = sortServicesResponseByStatus(data);
      dispatch({ type: "RESOLVED", results: sortedServices });
    },
    [city]
  );

  const refreshAPIServicesData = useCallback(async () => {
    dispatch({ type: "REFRESHING" });
    try {
      const res = await fetch(
        `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/update`,
        {
          method: "POST",
        }
      );
      if (res.ok) {
        fetchServices(true);
      } else {
        dispatch({ type: "REJECTED", error: true });
        return;
      }
    } catch {
      dispatch({ type: "REJECTED", error: true });
    }
  }, [fetchServices, city]);

  useEffect(() => {
    fetchServices(false);
  }, [fetchServices, city]);

  useEffect(() => {
    let connection: HubConnection | undefined = undefined;

    const connectToHub = async () => {
      const firstLetterCapitalCity =
        getServiceProviderFromCity(city).charAt(0) +
        getServiceProviderFromCity(city).slice(1);
      connection = await new HubConnectionBuilder()
        .withUrl(`${API_URL}/servicehub/${firstLetterCapitalCity}`)
        .withAutomaticReconnect()
        .build();

      connection.on(
        `ServiceUpdates${getServiceProviderFromCity(city)}`,
        (data: Service[]) => {
          const sortedServices = sortServicesResponseByStatus(data);
          dispatch({ type: "RESOLVED", results: sortedServices });
        }
      );

      connection.start();
    };

    connectToHub();
    return () => {
      connection?.stop();
    };
  }, [city]);

  return { ...state, refreshAPIServicesData, dispatch };
};

export default useServiceApi;
