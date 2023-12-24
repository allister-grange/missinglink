import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { PodiumCard } from "./PodiumCard";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import useSWR from "swr";
import { fetcher } from "@/helpers/fetcher";

interface PodiumContainerProps {
  city: string;
}

type WorstPerformingServices = {
  serviceName: string;
  delay: number;
  routeLongName: string;
};

export const PodiumContainer: React.FC<PodiumContainerProps> = ({ city }) => {
  const { data } = useSWR<WorstPerformingServices[]>(
    city
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city,
          true
        )}/worstServices`
      : null,
    fetcher
  );

  let worstServicesLoaded = false;
  let worstServices: WorstPerformingServices[] = [];

  if (data && data.length > 0) {
    // round down the delay
    worstServices = data.map((service) => {
      return { ...service, delay: Math.floor(service.delay) };
    });
    worstServicesLoaded = true;
  }

  return (
    <div className={styles.podium_container}>
      <PodiumCard
        style={{
          flexBasis: "20%",
          flexShrink: "0",
          background: "var(--color-podium-2)",
          maxWidth: "30rem",
        }}
        place={2}
        delay={worstServicesLoaded ? worstServices[1].delay : undefined}
        routeLongName={
          worstServicesLoaded ? worstServices[1].routeLongName : undefined
        }
        serviceName={worstServicesLoaded ? worstServices[1].serviceName : ""}
      />
      <PodiumCard
        style={{
          flexBasis: "60%",
          fontSize: "1rem",
          background: "var(--color-podium-1)",
        }}
        place={1}
        delay={worstServicesLoaded ? worstServices[0].delay : undefined}
        routeLongName={
          worstServicesLoaded ? worstServices[0].routeLongName : undefined
        }
        serviceName={worstServicesLoaded ? worstServices[0].serviceName : ""}
      />
      <PodiumCard
        style={{
          flexBasis: "20%",
          flexShrink: "0",
          background: "var(--color-podium-3)",
          maxWidth: "30rem",
        }}
        place={3}
        delay={worstServicesLoaded ? worstServices[2].delay : undefined}
        routeLongName={
          worstServicesLoaded ? worstServices[2].routeLongName : undefined
        }
        serviceName={worstServicesLoaded ? worstServices[2].serviceName : ""}
      />
    </div>
  );
};
