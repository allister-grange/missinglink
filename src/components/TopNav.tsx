import React from "react";
import styles from "@/styles/NavStyles.module.css";

interface TopNavProps {}

export const TopNav: React.FC<TopNavProps> = ({}) => {
  return (
    <nav>
      <ul className={styles.nav}>
        <li className={styles.nav_link}>
          <a href="#">At a glance</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Map</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Stats</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Tables</a>
        </li>
      </ul>
    </nav>
  );
};
