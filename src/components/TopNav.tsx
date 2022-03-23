import React, { RefObject } from "react";
import styles from "@/styles/NavStyles.module.css";

interface TopNavProps {
  atAGlanceRef: RefObject<HTMLDivElement>;
  mapRef: RefObject<HTMLDivElement>;
  statsRef: RefObject<HTMLDivElement>;
  tablesRef: RefObject<HTMLDivElement>;
}

export const TopNav: React.FC<TopNavProps> = ({
  atAGlanceRef,
  mapRef,
  statsRef,
  tablesRef,
}) => {
  const atAGlanceScroll = () =>
    atAGlanceRef.current!.scrollIntoView({ behavior: "smooth" });
  const mapScroll = () =>
    mapRef.current!.scrollIntoView({ behavior: "smooth" });
  const statsScroll = () =>
    statsRef.current!.scrollIntoView({ behavior: "smooth" });
  const tablesScroll = () =>
    tablesRef.current!.scrollIntoView({ behavior: "smooth" });

  return (
    <nav>
      <ul className={styles.nav}>
        <li className={styles.nav_link}>
          <a onClick={atAGlanceScroll}>At a glance</a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={mapScroll}>Map</a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={statsScroll}>Stats</a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={tablesScroll}>Timetable</a>
        </li>
      </ul>
    </nav>
  );
};
