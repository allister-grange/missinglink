import { useEffect, useCallback, useReducer } from "react";
import { Bus, BusContainer } from "@/types/BusTypes";
import fetchData from "./fetchData";
import { API_URL } from "@/constants";

const sortBusArrayByRoute = (buses: Bus[]) => {
  buses.sort((a, b) => {
    if (!a.routeShortName || !b.routeShortName) {
      return Number.MAX_VALUE;
    }
    return a.routeShortName.localeCompare(b.routeShortName, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
};

const sortBuses = (buses: BusContainer): BusContainer => {
  sortBusArrayByRoute(buses.allBuses);
  sortBusArrayByRoute(buses.cancelledBuses);
  sortBusArrayByRoute(buses.earlyBuses);
  sortBusArrayByRoute(buses.lateBuses);
  sortBusArrayByRoute(buses.onTimeBuses);
  sortBusArrayByRoute(buses.unknownBuses);
  sortBusArrayByRoute(buses.unknownBuses);

  return buses;
};

type State = {
  buses: BusContainer;
  status: "IDLE" | "LOADING" | "REJECTED" | "RESOLVED" | "REFRESHING";
  error?: boolean;
};

type Action =
  | { type: "IDLE" }
  | { type: "LOADING" }
  | { type: "RESOLVED"; results: BusContainer }
  | { type: "REJECTED"; error: boolean }
  | { type: "REFRESHING" };

const asyncReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "IDLE": {
      return { status: "IDLE", buses: state.buses };
    }
    case "LOADING": {
      return { status: "LOADING", buses: state.buses };
    }
    case "REFRESHING": {
      return { status: "REFRESHING", buses: state.buses };
    }
    case "RESOLVED": {
      return { status: "RESOLVED", buses: action.results };
    }
    case "REJECTED": {
      return { status: "REJECTED", error: action.error, buses: state.buses };
    }
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
};

const useMetlinkApi = () => {
  const [state, dispatch] = useReducer(asyncReducer, {
    status: "IDLE",
    buses: {
      cancelledBuses: [],
      earlyBuses: [],
      onTimeBuses: [],
      unknownBuses: [],
      allBuses: [],
      lateBuses: [],
    },
  });

  const fetchBuses = useCallback(async (isRefreshing: boolean) => {
    if(!isRefreshing) {
      dispatch({ type: "LOADING" });
    }
    const response = await fetchData<Bus>(
      `${API_URL}/updates`
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

    const busesHolder: BusContainer = {
      cancelledBuses: [],
      earlyBuses: [],
      onTimeBuses: [],
      unknownBuses: [],
      allBuses: [],
      lateBuses: [],
    };

    for (let i = 0; i < data.length; i += 1) {
      const bus = data[i];
      bus.vehicleId = bus.vehicle_id;
      if (bus.status === "EARLY") {
        busesHolder.earlyBuses.push(bus);
      } else if (bus.status === "LATE") {
        busesHolder.lateBuses.push(bus);
      } else if (bus.status === "ONTIME") {
        busesHolder.onTimeBuses.push(bus);
      } else if (bus.status === "UNKNOWN") {
        busesHolder.unknownBuses.push(bus);
      } else if (bus.status === "CANCELLED") {
        busesHolder.cancelledBuses.push(bus);
      }

      if (bus.status !== "CANCELLED") {
        busesHolder.allBuses.push(bus);
      }
    }

    const sortedBuses = sortBuses(busesHolder);
    dispatch({ type: "RESOLVED", results: sortedBuses });
  }, []);

  const refreshAPIBusData = useCallback(async () => {
    dispatch({type: "REFRESHING"});
    try {
      const res = await fetch(`${API_URL}/updates`, {
        method: "POST",
      });
      if (res.ok) {
        fetchBuses(true);
      } else {
        dispatch({ type: "REJECTED", error: true });
        return;
      }
    } catch {
      dispatch({ type: "REJECTED", error: true });
    }
  }, [fetchBuses]);

  useEffect(() => {
    fetchBuses(false);
  }, [fetchBuses]);

  return { ...state, refreshAPIBusData, dispatch };
};

export default useMetlinkApi;
