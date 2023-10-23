import React, { ChangeEvent } from "react";
import useSWR from "swr";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import styles from "@/styles/ServiceBreakdown.module.css";

interface ServiceBreakdownProps {
  city: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ city }) => {
  const [selectedService, setSelectedService] = React.useState("");
  const serviceNamesResponse = useSWR<string[]>(
    `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/serviceNames`,
    fetcher
  );
  const serviceDataResponse = useSWR(
    selectedService
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city
        )}/servicesByNameAndTimeRange?serviceName=${selectedService}&timeRange=3`
      : null, // This ensures the API is not called when the selectedService is empty
    fetcher
  );

  const serviceNames = serviceNamesResponse.data;
  let toDisplay;

  React.useEffect(() => {}, [selectedService]);

  function onServiceNameSelectorChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedService(e.target.value);
  }

  if (serviceNames && serviceNames.length > 0) {
    toDisplay = (
      <div className={styles.serviceNameSelector_container}>
        <select
          className={styles.serviceNameSelector}
          placeholder="Pick a service"
          onChange={onServiceNameSelectorChange}
        >
          {serviceNames.map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    toDisplay = <h1>loading.....</h1>;
  }

  return <div>{toDisplay}</div>;
};
