import React from "react";
import { BusContainer } from "@/types/ServiceTypes";
import { InfoCard } from "./InfoCard";
import styles from "@/styles/CardStyles.module.css";

interface InfoCardsContainerProps {
  buses: BusContainer;
  isLoadingInitialData: boolean;
}

function getPercentage(denominator: number, numerator: number) {
  const percentage = Math.floor((denominator / numerator) * 100);
  return Number.isNaN(percentage) ? 0 : percentage;
}

export const InfoCardsContainer: React.FC<InfoCardsContainerProps> = ({
  buses,
  isLoadingInitialData,
}) => {
  return (
    <>
      <InfoCard
        title={"Cancelled"}
        busesNumber={buses.cancelledBuses.length}
        totalBusesNumber={buses.allBuses.length}
        includeSubNumber={false}
        isLoading={isLoadingInitialData}
        description={
          "How many Metlink services are reported on their alerts as cancelled today"
        }
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Late"}
          blueColor={true}
          busesNumber={buses.lateBuses.length}
          totalBusesNumber={buses.allBuses.length}
          isLoading={isLoadingInitialData}
          description={`${getPercentage(
            buses.lateBuses.length,
            buses.allBuses.length
          )}% of services are running over 2 minutes late`}
        />
      </div>
      <InfoCard
        title={"Early"}
        busesNumber={buses.earlyBuses.length}
        totalBusesNumber={buses.allBuses.length}
        isLoading={isLoadingInitialData}
        description={`${getPercentage(
          buses.earlyBuses.length,
          buses.allBuses.length
        )}% of services are running at least a minute and a half ahead of schedule`}
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Not Reporting"}
          blueColor={true}
          busesNumber={buses.unknownBuses.length}
          isLoading={isLoadingInitialData}
          totalBusesNumber={buses.allBuses.length}
          description={`${getPercentage(
            buses.unknownBuses.length,
            buses.allBuses.length
          )}% of services are not reporting their delay or location`}
        />
      </div>
    </>
  );
};
