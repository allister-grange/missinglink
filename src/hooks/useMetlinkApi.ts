import { useEffect, useState, useCallback } from "react";
import { Bus, BusContainer } from "../types/BusTypes";
import fetchData from "./fetchData";
const API_URL = "https://missinglink.backend.allistergrange.com";

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

const useMetlinkApi = () => {
  const [buses, setBuses] = useState<BusContainer>({
    cancelledBuses: [],
    earlyBuses: [],
    onTimeBuses: [],
    unknownBuses: [],
    allBuses: [],
    lateBuses: [],
  });
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const fetchBuses = useCallback(async () => {
    setIsLoadingInitialData(true);
    const response = await fetchData<Bus>(
      `${API_URL}/BusPredictions/busTripUpdates`
    );

    if (response.error) {
      setError(true);
    }

    const { data } = response;
    if (!data) {
      setError(true);
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
    setBuses(sortedBuses);
    setIsLoadingInitialData(false);
  }, []);

  const refreshAPIBusData = useCallback(async () => {
    setIsRefreshingData(true);
    try {
      const res = await fetch(`${API_URL}/BusPredictions/busTripUpdates`, {
        method: "POST",
      });
      if (res.ok) {
        fetchBuses();
      } else {
        setError(true);
        return;
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsRefreshingData(false);
    }
    setIsRefreshingData(false);
  }, [fetchBuses]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return {
    buses,
    refreshAPIBusData,
    isRefreshingData,
    isLoadingInitialData,
    error,
    setError,
  };
};

export default useMetlinkApi;
