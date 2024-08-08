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

type ServicePerformanceSummary = {
  serviceName: string;
  delay: number;
  routeLongName: string;
};

export const PodiumContainer: React.FC<PodiumContainerProps> = ({ city }) => {
  const { data: worstPerformersData } = useSWR<ServicePerformanceSummary[]>(
    city
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city,
          true
        )}/worstServices`
      : null,
    fetcher
  );
  const { data: bestPerformersData } = useSWR<ServicePerformanceSummary[]>(
    city
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(
          city,
          true
        )}/bestServices`
      : null,
    fetcher
  );

  let worstServicesLoaded = false;
  let worstServices: ServicePerformanceSummary[] = [];

  if (worstPerformersData && worstPerformersData.length > 0) {
    // round down the delay
    worstServices = worstPerformersData.map((service) => {
      return { ...service, delay: Math.floor(service.delay) };
    });
    worstServicesLoaded = true;
  }

  let bestServicesLoaded = false;
  let bestServices: ServicePerformanceSummary[] = [];

  if (bestPerformersData && bestPerformersData.length > 0) {
    // round down the delay
    bestServices = bestPerformersData.map((service) => {
      return { ...service, delay: Math.floor(service.delay) };
    });
    bestServicesLoaded = true;
  }

  return (
    <>
      <div className={styles.podium_container}>
        <h3 className={styles.podium_container__title}>Winners</h3>
        <div className={styles.podium_container__cards}>
          <PodiumCard
            style={{
              flexBasis: "23%",
              flexShrink: "0",
              background: "var(--color-podium-2)",
            }}
            place={2}
            delay={bestServicesLoaded ? bestServices[1].delay : undefined}
            routeLongName={
              bestServicesLoaded ? bestServices[1].routeLongName : undefined
            }
            serviceName={bestServicesLoaded ? bestServices[1].serviceName : ""}
          />
          <PodiumCard
            style={{
              flexBasis: "40%",
              flexShrink: "0",
              fontSize: "1rem",
              background: "var(--color-podium-1)",
            }}
            place={1}
            delay={bestServicesLoaded ? bestServices[0].delay : undefined}
            routeLongName={
              bestServicesLoaded ? bestServices[0].routeLongName : undefined
            }
            serviceName={bestServicesLoaded ? bestServices[0].serviceName : ""}
          />
          <PodiumCard
            style={{
              flexBasis: "23%",
              flexShrink: "0",
              background: "var(--color-podium-3)",
            }}
            place={3}
            delay={bestServicesLoaded ? bestServices[2].delay : undefined}
            routeLongName={
              bestServicesLoaded ? bestServices[2].routeLongName : undefined
            }
            serviceName={bestServicesLoaded ? bestServices[2].serviceName : ""}
          />
        </div>
      </div>
      <div className={styles.podium_container}>
        <h3 className={styles.podium_container__title}>Losers </h3>
        <div className={styles.podium_container__cards}>
          <PodiumCard
            style={{
              flexBasis: "23%",
              flexShrink: "0",
              background: "var(--color-podium-2)",
            }}
            place={2}
            delay={worstServicesLoaded ? worstServices[1].delay : undefined}
            routeLongName={
              worstServicesLoaded ? worstServices[1].routeLongName : undefined
            }
            serviceName={
              worstServicesLoaded ? worstServices[1].serviceName : ""
            }
          />
          <PodiumCard
            style={{
              flexBasis: "40%",
              flexShrink: "0",
              fontSize: "1rem",
              background: "var(--color-podium-1)",
            }}
            place={1}
            delay={worstServicesLoaded ? worstServices[0].delay : undefined}
            routeLongName={
              worstServicesLoaded ? worstServices[0].routeLongName : undefined
            }
            serviceName={
              worstServicesLoaded ? worstServices[0].serviceName : ""
            }
          />
          <PodiumCard
            style={{
              flexBasis: "20%",
              flexShrink: "0",
              background: "var(--color-podium-3)",
            }}
            place={3}
            delay={worstServicesLoaded ? worstServices[2].delay : undefined}
            routeLongName={
              worstServicesLoaded ? worstServices[2].routeLongName : undefined
            }
            serviceName={
              worstServicesLoaded ? worstServices[2].serviceName : ""
            }
          />
        </div>
      </div>
    </>
  );
};
