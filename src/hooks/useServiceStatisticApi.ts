import { API_URL } from "@/constants";
import { useEffect, useState, useCallback } from "react";
import { ServiceStatistic } from "@/types/ServiceTypes";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { formatDateForBackend } from "@/helpers/time";

const useMetlinkApi = (city: string) => {
  const [serviceStatistics, setServiceStatistics] = useState<
    ServiceStatistic[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const servicerProvider = getServiceProviderFromCity(city);

  const fetchServiceStatistics = useCallback(async () => {
    setIsLoading(true);

    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    let todaysDate = new Date();

    const todaysDateString = formatDateForBackend(todaysDate);
    const yesterdayDateString = formatDateForBackend(yesterdayDate);

    let res: any;
    try {
      res = await fetch(
        `${API_URL}/api/v1/${servicerProvider}/statistics?startDate=${yesterdayDateString}&endDate=${todaysDateString}`
      );
    } catch {
      return;
    }
    const data = await res.json();

    setServiceStatistics(data);
    setIsLoading(false);
  }, [servicerProvider]);

  const getServiceStatsData = async (startDate: Date, endDate: Date) => {
    let res: any;
    try {
      res = await fetch(
        `${API_URL}/api/v1/${servicerProvider}/statistics?startDate=${formatDateForBackend(
          startDate
        )}&endDate=${formatDateForBackend(endDate)}`
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
