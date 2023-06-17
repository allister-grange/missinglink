import React from "react";
import styles from "@/styles/WeatherStyles.module.css";

interface WeatherIconThunderStormProps {
  fontSize: string;
}

export const WeatherIconThunderStorm: React.FC<
  WeatherIconThunderStormProps
> = ({ fontSize }) => {
  return (
    <div className="icon thunder-storm" style={{ fontSize }}>
      <div className={styles.cloud}></div>
      <div className={styles.lighting}>
        <div className={styles.bolt}></div>
        <div className={styles.bolt}></div>
      </div>
    </div>
  );
};
