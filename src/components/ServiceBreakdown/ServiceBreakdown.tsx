import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import styles from "@/styles/ServiceBreakdown.module.css";
import { ServiceAverageTimesDTO } from "@/types/ServiceTypes";
import React, { useState } from "react";
import useSWR from "swr";
import { ServiceDataCard } from "./ServiceDataCard";
import { ServiceSearch } from "./ServiceSearch";

interface ServiceBreakdownProps {
  city: string;
}

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ city }) => {
  const [selectedService, setSelectedService] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [timeRange, setTimeRange] = useState(3);

  const { data, isLoading } = useSWR<ServiceAverageTimesDTO>(
    selectedService
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city
        )}/servicesByNameAndTimeRange?serviceName=${selectedService}&timeRange=${timeRange}`
      : null, // This ensures the API is not called when the selectedService is empty
    fetcher
  );

  return (
    <div>
      <ServiceSearch
        city={city}
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        setSelectedService={setSelectedService}
        setTimeRange={setTimeRange}
        isLoading={isLoading}
      />
      {data && (
        <div className={styles.dataCardContainer}>
          <ServiceDataCard
            title="Earliest"
            description="The earliest this service was recorded"
            number={data?.earliestTime}
          />
          <ServiceDataCard
            title="Average disruption time"
            description="The average time this service was late or early"
            number={data?.averageDisruptionTime}
          />
          <ServiceDataCard
            title="Latest"
            description="The latest this service was recorded"
            number={data?.latestTime}
          />
        </div>
      )}
    </div>
  );
};
