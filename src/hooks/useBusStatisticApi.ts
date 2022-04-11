import { API_URL } from "@/constants";
import { useEffect, useState, useCallback } from "react";
import { BusStatistic } from "@/types/BusTypes";

const useMetlinkApi = () => {
  const [busStatistics, setBusStatistics] = useState<BusStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBusStatistics = useCallback(async () => {
    setIsLoading(true);

    const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
    const laterDateString = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);

    const earlierDate = new Date(Date.now() - tzoffset);
    earlierDate.setDate(earlierDate.getDate() - 1);
    const earlierDateString = earlierDate.toISOString().slice(0, -1);

    let res: any;
    try {
      res = await fetch(
        `${API_URL}/BusPredictions/busStatistics?startDate=${earlierDateString}&endDate=${laterDateString}`
      );
    } catch {
      return;
    }
    const data = await res.json();

    setBusStatistics(data);
    setIsLoading(false);
  }, []);

  const getBusStatsData = async (startDate: Date, endDate: Date) => {
    const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds

    const startDateString = new Date(startDate.getTime() - tzoffset)
      .toISOString()
      .slice(0, -1);
    const endDateString = new Date(endDate.getTime() - tzoffset)
      .toISOString()
      .slice(0, -1);

    let res: any;
    try {
      res = await fetch(
        `${API_URL}/BusPredictions/busStatistics?startDate=${startDateString}&endDate=${endDateString}`
      );
    } catch {
      return;
    }

    const data = await res.json();
    setBusStatistics(data);
  };

  useEffect(() => {
    fetchBusStatistics();
  }, [fetchBusStatistics]);

  return {
    busStatistics,
    isLoading,
    getBusStatsData,
  };
};

export default useMetlinkApi;
