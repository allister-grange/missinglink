import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { formatDelay } from "@/helpers/convertors";

interface PodiumCardProps {
  style?: React.CSSProperties;
  place: number;
  delay: number;
  serviceName: string;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({
  style,
  place,
  delay,
  serviceName,
}) => {
  return (
    <div className={styles.podium_card} style={{ ...style }}>
      <h3 className={styles.podium_card__number}>{place}</h3>

      <span className={styles.podium_card__line}></span>

      <div className={styles.podium_card__container}>
        <div className={styles.podium_card__title}>{serviceName}</div>
        <div className={styles.podium_card__delay}>
          Average delay of: {formatDelay(delay)}
        </div>
      </div>
    </div>
  );
};
