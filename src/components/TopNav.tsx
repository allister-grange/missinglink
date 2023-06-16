/* eslint-disable @next/next/no-html-link-for-pages */
import React, { RefObject } from "react";
import styles from "@/styles/NavStyles.module.css";
import { ThemeChanger } from "@/components/ThemeChanger";
import Link from "next/link";

interface TopNavProps {
  atAGlanceRef: RefObject<HTMLDivElement>;
  mapRef: RefObject<HTMLDivElement>;
  statsRef: RefObject<HTMLDivElement>;
  tablesRef: RefObject<HTMLDivElement>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  city: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  atAGlanceRef,
  mapRef,
  statsRef,
  tablesRef,
  city,
  setCity,
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
    <nav className={styles.nav_container}>
      <div className={styles.nav}>
        <a href="/" className={styles.nav_title}>
          MissingLink
        </a>
        <ul className={styles.inner_nav_bubble}>
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
        <div>
          <button
            style={{ background: city === "wellington" ? "green" : undefined }}
            onClick={() => setCity("wellington")}
          >
            wellington
          </button>
          <button
            style={{ background: city === "auckland" ? "green" : undefined }}
            onClick={() => setCity("auckland")}
          >
            auckland
          </button>
        </div>
      </div>
    </nav>
  );
};
