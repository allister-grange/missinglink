import React from "react";
import styles from "@/styles/WeatherStyles.module.css";

interface WeatherIconSunShowerProps {
  fontSize: string;
}

export const WeatherIconSunShower: React.FC<WeatherIconSunShowerProps> = ({
  fontSize,
}) => {
  return (
    <div className="icon sun-shower" style={{ fontSize }}>
      <div className={styles.cloud}></div>
      <div className={styles.sun}>
        <div className={styles.rays}></div>
      </div>
      <div className={styles.rain}></div>
    </div>
  );
};
