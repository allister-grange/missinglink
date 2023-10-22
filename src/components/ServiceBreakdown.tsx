import React from "react";
import useSWR from "swr";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import styles from "@/styles/ServiceBreakdown.module.css";

interface ServiceBreakdownProps {
  city: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ city }) => {
  const { data, error, isLoading } = useSWR<string[]>(
    `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/serviceNames`,
    fetcher
  );

  const serviceNames = data;
  let toDisplay;

  if (serviceNames && serviceNames.length > 0) {
    toDisplay = (
      <div className={styles.serviceNameSelector_container}>
        <select
          className={styles.serviceNameSelector}
          placeholder="Pick a service"
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
