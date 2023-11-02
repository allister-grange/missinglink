import { API_URL } from "@/constants";
import {
  calculateMAD,
  convertTimeRangeEnumToString,
  getServiceProviderFromCity,
} from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import { Service } from "@/types/ServiceTypes";
import React, { useState } from "react";
import useSWR from "swr";
import { ServiceSearch } from "./ServiceSearch";
import { ServiceDataCard } from "./ServiceDataCard";
import styles from "@/styles/ServiceBreakdown.module.css";

interface ServiceBreakdownProps {
  city: string;
}

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ city }) => {
  const [selectedService, setSelectedService] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [timeRange, setTimeRange] = useState(3);

  const { data, isLoading } = useSWR<Service[]>(
    selectedService
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city
        )}/servicesByNameAndTimeRange?serviceName=${selectedService}&timeRange=${timeRange}`
      : null, // This ensures the API is not called when the selectedService is empty
    fetcher
  );

  let delays: number[] | undefined;
  if (data) {
    delays = data.map((service) => service.delay);
  }

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
      {delays && (
        <div className={styles.dataCardContainer}>
          <ServiceDataCard
            title="Earliest"
            description="The earliest this service was recorded"
            number={Math.min(...delays)}
          />
          <ServiceDataCard
            title="Average disruption time"
            description="The average time this service was late or early"
            number={calculateMAD(delays)}
          />
          <ServiceDataCard
            title="Latest"
            description="The latest this service was recorded"
            number={Math.max(...delays)}
          />
        </div>
      )}
    </div>
  );
};
