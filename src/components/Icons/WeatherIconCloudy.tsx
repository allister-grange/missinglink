import React from "react";
import styles from "@/styles/WeatherStyles.module.css";

interface WeatherIconCloudyProps {
  fontSize: string;
}

export const WeatherIconCloudy: React.FC<WeatherIconCloudyProps> = ({
  fontSize,
}) => {
  return (
    <div className={styles.icon + " " + styles.cloudy} style={{ fontSize }}>
      <div className={styles.cloud}></div>
      <div className={styles.cloud}></div>
    </div>
  );
};
