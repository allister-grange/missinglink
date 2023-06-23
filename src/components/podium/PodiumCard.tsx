import React from "react";
import styles from "@/styles/PodiumStyles.module.css";

interface PodiumCardProps {}

export const PodiumCard: React.FC<PodiumCardProps> = ({}) => {
  return (
    <div className={styles.podium_card}>
      <h3 className={styles.podium_card__title}>1</h3>

      <span className={styles.podium_card__line}></span>

      <div className={styles.podium_card__container}>
        <div className={styles.podium_card__subtitle}>Blackbirds</div>
        <div className={styles.podium_card__delay}>1000</div>
      </div>
    </div>
  );
};
