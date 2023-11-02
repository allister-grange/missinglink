import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "@/styles/ServiceBreakdown.module.css";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import useSWR from "swr";
import { ClipLoader } from "react-spinners";

interface ServiceSearchProps {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  city: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  setTimeRange: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

export const ServiceSearch: React.FC<ServiceSearchProps> = ({
  searchValue,
  setSearchValue,
  setSelectedService,
  setTimeRange,
  isLoading,
  city,
}) => {
  const [filteredServiceNames, setFilteredServiceNames] = useState<string[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const serviceNamesResponse = useSWR<string[]>(
    `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/serviceNames`,
    fetcher
  );

  const onServiceNameSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowDropdown(true);
  };

  const onSelectService = (serviceName: string) => {
    setSearchValue(serviceName);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (serviceNamesResponse.data) {
      setFilteredServiceNames(
        serviceNamesResponse.data.filter((name) =>
          name.toLowerCase().startsWith(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, serviceNamesResponse.data]);

  const triggerFetchServices = () => {
    setSelectedService(searchValue);
    setShowDropdown(false);
  };

  const onTimeRangeSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(parseInt(e.target.value));
  };

  return (
    <div className={styles.serviceNameSelector_container}>
      <input
        className={styles.serviceNameSelector}
        placeholder={
          serviceNamesResponse.data
            ? "Search for a service"
            : "Loading services..."
        }
        value={searchValue}
        disabled={!serviceNamesResponse.data}
        onChange={onServiceNameSearchChange}
        onKeyDown={handleKeyDown}
      />
      {searchValue && filteredServiceNames.length > 0 && showDropdown && (
        <div className={styles.autocompleteDropdown}>
          {filteredServiceNames.map((name) => (
            <div key={name} onClick={() => onSelectService(name)}>
              {name}
            </div>
          ))}
        </div>
      )}
      <select
        onChange={onTimeRangeSelectChange}
        className={styles.timeRangeSelector}
      >
        <option value={3}>Today</option>
        <option value={2}>This week</option>
        <option value={1}>This month</option>
        <option value={0}>All time</option>
      </select>
      <button
        className={styles.loadServicesButton}
        onClick={triggerFetchServices}
        disabled={!serviceNamesResponse.data}
      >
        {isLoading ? (
          <ClipLoader size={19} color={"var(--color-grey-light-3)"} />
        ) : (
          "Load statistics"
        )}
      </button>
    </div>
  );
};
