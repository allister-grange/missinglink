import React from "react";
import styles from "@/styles/NavStyles.module.css";

interface SideBarNavProps {
  scrollY: number;
}

export const SideBarNav: React.FC<SideBarNavProps> = ({ scrollY }) => {
  const leftArrow = <span style={{ marginLeft: "4px" }}>←</span>;

  return (
    <nav>
      <ul className={styles.side_nav}>
        <li className={styles.nav_link}>
          <a href="#">At a glance{scrollY < 1050 && leftArrow}</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Map</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Stats{scrollY > 1200 && leftArrow}</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Tables</a>
        </li>
      </ul>
    </nav>
  );
};
