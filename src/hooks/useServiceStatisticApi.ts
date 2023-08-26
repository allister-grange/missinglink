import { API_URL } from "@/constants";
import { useEffect, useState, useCallback } from "react";
import { ServiceStatistic } from "@/types/ServiceTypes";
import { getServiceProviderFromCity } from "@/helpers/convertors";

const useMetlinkApi = (city: string) => {
  const [serviceStatistics, setServiceStatistics] = useState<
    ServiceStatistic[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const servicerProvider = getServiceProviderFromCity(city);

  const fetchServiceStatistics = useCallback(async () => {
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
        `${API_URL}/api/v1/${servicerProvider}/statistics?startDate=${earlierDateString}&endDate=${laterDateString}`
      );
    } catch {
      return;
    }
    const data = await res.json();

    setServiceStatistics(data);
    setIsLoading(false);
  }, [servicerProvider]);

  const getServiceStatsData = async (startDate: Date, endDate: Date) => {
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
        `${API_URL}/api/v1/${servicerProvider}/statistics?startDate=${startDateString}&endDate=${endDateString}`
      );
    } catch {
      return;
    }

    const data = await res.json();
    setServiceStatistics(data);
  };

  useEffect(() => {
    fetchServiceStatistics();
  }, [fetchServiceStatistics]);

  return {
    serviceStatistics,
    isLoading,
    getServiceStatsData,
  };
};

export default useMetlinkApi;
