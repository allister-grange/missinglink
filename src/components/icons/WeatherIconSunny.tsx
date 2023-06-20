import React from "react";
import styles from "@/styles/WeatherStyles.module.css";

interface WeatherIconSunnyProps {
  fontSize: string;
}

export const WeatherIconSunny: React.FC<WeatherIconSunnyProps> = ({
  fontSize,
}) => {
  return (
    <div className={styles.icon + " " + styles.sunny} style={{ fontSize }}>
      <div className={styles.sun}>
        <div className={styles.rays}></div>
      </div>
    </div>
  );
};
