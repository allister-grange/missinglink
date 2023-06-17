import React from "react";
import { ServiceContainer } from "@/types/ServiceTypes";
import { InfoCard } from "./InfoCard";
import styles from "@/styles/CardStyles.module.css";

interface InfoCardsContainerProps {
  services: ServiceContainer;
  isLoadingInitialData: boolean;
}

function getPercentage(denominator: number, numerator: number) {
  const percentage = Math.floor((denominator / numerator) * 100);
  return Number.isNaN(percentage) ? 0 : percentage;
}

export const InfoCardsContainer: React.FC<InfoCardsContainerProps> = ({
  services,
  isLoadingInitialData,
}) => {
  return (
    <>
      <InfoCard
        title={"Cancelled"}
        servicesNumber={services.cancelledServices.length}
        totalServicesNumber={services.allServices.length}
        includeSubNumber={false}
        isLoading={isLoadingInitialData}
        description={
          "How many services are reported on alerts as cancelled today"
        }
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Late"}
          blueColor={true}
          servicesNumber={services.lateServices.length}
          totalServicesNumber={services.allServices.length}
          isLoading={isLoadingInitialData}
          description={`${getPercentage(
            services.lateServices.length,
            services.allServices.length
          )}% of services are running over 2 and a half minutes late`}
        />
      </div>
      <InfoCard
        title={"Early"}
        servicesNumber={services.earlyServices.length}
        totalServicesNumber={services.allServices.length}
        isLoading={isLoadingInitialData}
        description={`${getPercentage(
          services.earlyServices.length,
          services.allServices.length
        )}% of services are running at least a minute and a half ahead of schedule`}
      />
      <div className={styles.card_move_up}>
        <InfoCard
          title={"Not Reporting"}
          blueColor={true}
          servicesNumber={services.unknownServices.length}
          isLoading={isLoadingInitialData}
          totalServicesNumber={services.allServices.length}
          description={`${getPercentage(
            services.unknownServices.length,
            services.allServices.length
          )}% of services are not reporting their delay or location`}
        />
      </div>
    </>
  );
};
