import React from "react";
import styles from "@/styles/ServiceBreakdown.module.css";
import convertSecondsToMinutes from "@/helpers/convertors";

interface ServiceDataCardProps {
  title: string;
  description: string;
  number: number;
}

export const ServiceDataCard: React.FC<ServiceDataCardProps> = ({
  title,
  description,
  number,
}) => {
  return (
    <div className={styles.dataCard}>
      <p className={styles.dataCardTitle}>{title}</p>
      <p className={styles.dataCardDescription}>{description}</p>
      <p className={styles.dataCardNumber}>
        {convertSecondsToMinutes(number, false)}
      </p>
    </div>
  );
};
