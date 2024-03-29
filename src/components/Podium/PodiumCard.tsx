import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { formatDelay } from "@/helpers/convertors";

interface PodiumCardProps {
  style?: React.CSSProperties;
  place?: number;
  delay?: number;
  serviceName?: string;
  routeLongName?: string;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({
  style,
  place,
  delay,
  routeLongName,
  serviceName,
}) => {
  return (
    <div className={styles.podium_card} style={{ ...style }}>
      <h3 className={styles.podium_card__number}>{place}</h3>

      <span className={styles.podium_card__line}></span>

      <div className={styles.podium_card__container}>
        <h3 className={styles.podium_card__title}>{serviceName}</h3>
        <p className={styles.podium_card__delay}>
          Average disruption of: {delay ? formatDelay(delay) : ""}
        </p>
        <p className={styles.podium_card__route_name}>
          {routeLongName === serviceName ? "" : routeLongName}
        </p>
      </div>
    </div>
  );
};
