import React from "react";
import styles from "@/styles/PodiumStyles.module.css";
import { PodiumCard } from "./PodiumCard";

interface PodiumContainerProps {}

export const PodiumContainer: React.FC<PodiumContainerProps> = ({}) => {
  return (
    <div className={styles.podium_container}>
      <PodiumCard>first place</PodiumCard>
      <PodiumCard>second place</PodiumCard>
      <PodiumCard>third place</PodiumCard>
    </div>
  );
};
