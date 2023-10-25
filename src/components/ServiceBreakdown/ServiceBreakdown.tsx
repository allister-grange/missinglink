import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import { Service } from "@/types/ServiceTypes";
import React, { useState } from "react";
import useSWR from "swr";
import { ServiceSearch } from "./ServiceSearch";

interface ServiceBreakdownProps {
  city: string;
}

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ city }) => {
  const [selectedService, setSelectedService] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [timeRange, setTimeRange] = useState(3);

  const serviceDataResponse = useSWR<Service[]>(
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
      />
      {serviceDataResponse.data && (
        <div>
          {serviceDataResponse.data.map((service) => service.vehicleId)}
        </div>
      )}
    </div>
  );
};
