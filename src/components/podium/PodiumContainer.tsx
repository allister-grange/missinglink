import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { PodiumCard } from "./PodiumCard";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";

interface PodiumContainerProps {
  city: string;
}

type WorstPerformingServices = {
  serviceName: string;
  averageDelay: number;
};

async function getWorstPerformingServices(city: string) {
  try {
    const servicesRes = await fetch(
      `${API_URL}/api/v1/updates/worstServices?providerId=${getServiceProviderFromCity(
        city,
        true
      )}`
    );

    const services = await await servicesRes.json();
    return services;
  } catch {
    console.error("Error fetching worst performing services from API");
  }
}

export const PodiumContainer: React.FC<PodiumContainerProps> = ({ city }) => {
  const [worstServices, setWorstServices] = React.useState<
    WorstPerformingServices[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const services = (await getWorstPerformingServices(
        city
      )) as WorstPerformingServices[];
      const roundedDownServices = services.map((thing) => {
        return { ...thing, averageDelay: Math.floor(thing.averageDelay) };
      });
      setWorstServices(roundedDownServices);
    };

    fetchData();
  }, [city]);

  return (
    <div className={styles.podium_container}>
      <PodiumCard
        style={{ flexBasis: "20%", flexShrink: "0", background: "#C1C1C1" }}
        place={2}
        delay={worstServices[1].averageDelay}
        serviceName={worstServices[1].serviceName}
      />
      <PodiumCard
        style={{ flexBasis: "60%", fontSize: "1rem", background: "#FFD01E" }}
        place={1}
        delay={worstServices[0].averageDelay}
        serviceName={worstServices[0].serviceName}
      />
      <PodiumCard
        style={{ flexBasis: "20%", flexShrink: "0", background: "#FFAB68" }}
        place={3}
        delay={worstServices[2].averageDelay}
        serviceName={worstServices[2].serviceName}
      />
    </div>
  );
};
