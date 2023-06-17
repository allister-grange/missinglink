import React from "react";
import styles from "@/styles/WeatherStyles.module.css";

interface WeatherIconRainyProps {
  fontSize: string;
}

export const WeatherIconRainy: React.FC<WeatherIconRainyProps> = ({
  fontSize,
}) => {
  return (
    <div className={styles.icon + " " + styles.rainy} style={{ fontSize }}>
      <div className={styles.cloud}></div>
      <div className={styles.rain}></div>
    </div>
  );
};
