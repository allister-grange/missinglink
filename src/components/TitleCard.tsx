import React from "react";
import styles from "../styles/CardStyles.module.css";

interface TitleCardProps {}

export const TitleCard: React.FC<TitleCardProps> = ({}) => {
  return (
    <div
      className={`${styles.title_card_container} ${styles.card_container} ${styles.title}`}
    >
      <h1 className={styles.title}>Welcome, this is MissingLink!</h1>
      <p className={styles.message}>
        I wanted to make a site to visualise the ‘health’ status of all the
        MetLink buses in Wellington, this is is my attempt.
        <br />
        <br />
        You can see the code for the site here.
      </p>
    </div>
  );
};
