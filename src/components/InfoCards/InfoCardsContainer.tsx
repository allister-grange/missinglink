import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import styles from "@/styles/CardStyles.module.css";
import { ServiceStatistic } from "@/types/ServiceTypes";
import React from "react";
import useSWR from "swr";
import { InfoCard } from "./InfoCard";

interface InfoCardsContainerProps {
  city: string;
}

function getPercentage(denominator: number, numerator: number) {
  const percentage = Math.floor((denominator / numerator) * 100);
  return Number.isNaN(percentage) ? 0 : percentage;
}

export const InfoCardsContainer: React.FC<InfoCardsContainerProps> = ({
  city,
}) => {
  const { data, isLoading } = useSWR<ServiceStatistic>(
    `${API_URL}/api/v1/${getServiceProviderFromCity(
      city
    )}/mostRecentStatistics`,
    fetcher
  );

  let totalServices;
  if (!data) {
    totalServices = 0;
  } else {
    totalServices = data.totalServices;
  }

  return (
    <>
      <InfoCard
        title={"Cancelled"}
        servicesNumber={data ? data.cancelledServices : 0}
        totalServicesNumber={totalServices}
        includeSubNumber={false}
        isLoading={isLoading}
        description={
          "How many services are reported on alerts as cancelled today"
        }
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Late"}
          blueColor={true}
          servicesNumber={data ? data.delayedServices : 0}
          totalServicesNumber={totalServices}
          isLoading={isLoading}
          description={`${getPercentage(
            data ? data.delayedServices : 0,
            totalServices
          )}% of trips are running over 2 and a half minutes late`}
        />
      </div>
      <InfoCard
        title={"Early"}
        servicesNumber={data ? data.earlyServices : 0}
        totalServicesNumber={totalServices}
        isLoading={isLoading}
        description={`${getPercentage(
          data ? data.earlyServices : 0,
          totalServices
        )}% of trips are running at least a minute and a half ahead of schedule`}
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Not Reporting"}
          blueColor={true}
          servicesNumber={data ? data.notReportingTimeServices : 0}
          isLoading={isLoading}
          totalServicesNumber={totalServices}
          description={`${getPercentage(
            data ? data.notReportingTimeServices : 0,
            totalServices
          )}% of trips are not reporting their delay or location`}
        />
      </div>
    </>
  );
};
