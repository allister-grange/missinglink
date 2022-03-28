import React from "react";
import { BusContainer } from "@/types/BusTypes";
import { InfoCard } from "./InfoCard";
import styles from "@/styles/CardStyles.module.css";

interface InfoCardsContainerProps {
  buses: BusContainer;
  isLoadingInitialData: boolean;
}

export const InfoCardsContainer: React.FC<InfoCardsContainerProps> = ({
  buses,
  isLoadingInitialData,
}) => {
  return (
    <>
      <InfoCard
        title={"Late Buses"}
        blueColor={true}
        busesNumber={buses.lateBuses.length}
        totalBusesNumber={buses.allBuses.length}
        isLoading={isLoadingInitialData}
        description={`${Math.floor(
          (buses.lateBuses.length / buses.allBuses.length) * 100
        )}% of buses are running over 2 minutes late`}
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Cancelled"}
          busesNumber={buses.cancelledBuses.length}
          totalBusesNumber={buses.allBuses.length}
          includeSubNumber={false}
          isLoading={isLoadingInitialData}
          description={
            "This is the number of how many services of Metlink's are cancelled right now (incl buses and trains)"
          }
        />
      </div>
      <InfoCard
        title={"Early"}
        busesNumber={buses.earlyBuses.length}
        totalBusesNumber={buses.allBuses.length}
        isLoading={isLoadingInitialData}
        description={`${Math.floor(
          (buses.earlyBuses.length / buses.allBuses.length) * 100
        )}% of buses are running at least a minute and a half ahead of schedule`}
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Not Reporting"}
          blueColor={true}
          busesNumber={buses.unknownBuses.length}
          isLoading={isLoadingInitialData}
          totalBusesNumber={buses.allBuses.length}
          description={`${Math.floor(
            (buses.unknownBuses.length / buses.allBuses.length) * 100
          )}% of buses are not reporting their delay or location`}
        />
      </div>
    </>
  );
};
