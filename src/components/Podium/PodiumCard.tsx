import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { formatDelay } from "@/helpers/convertors";
import { ClipLoader } from "react-spinners";

interface PodiumCardProps {
  style?: React.CSSProperties;
  place?: number;
  delay?: number;
  serviceName?: string;
  routeLongName?: string;
  isSmallerCard: boolean;
  isLoadingData: boolean;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({
  style,
  place,
  delay,
  routeLongName,
  serviceName,
  isSmallerCard,
  isLoadingData,
}) => {
  return (
    <div
      className={`
        ${styles.podium_card} 
        ${
          isSmallerCard ? styles.podium_card__small : styles.podium_card__large
        }`}
      style={{ ...style }}
    >
      <h3 className={styles.podium_card__number}>{place}</h3>

      <span className={styles.podium_card__line}></span>

      <div className={styles.podium_card__container}>
        <h3 className={styles.podium_card__title}>
          {isLoadingData ? (
            <ClipLoader size={isSmallerCard ? 35 : 60} color="white" />
          ) : (
            serviceName
          )}
        </h3>
        <p className={styles.podium_card__delay}>
          Average delay of: {delay ? formatDelay(delay) : ""}
        </p>
        <p className={styles.podium_card__route_name}>
          {routeLongName === serviceName ? "" : routeLongName}
        </p>
      </div>
    </div>
  );
};
