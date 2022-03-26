import React, { RefObject } from "react";
import styles from "@/styles/NavStyles.module.css";
import { ThemeChanger } from "./ThemeChanger";

interface SideBarNavProps {
  scrollY: number;
  atAGlanceRef: RefObject<HTMLDivElement>;
  mapRef: RefObject<HTMLDivElement>;
  statsRef: RefObject<HTMLDivElement>;
  tablesRef: RefObject<HTMLDivElement>;
}

export const SideBarNav: React.FC<SideBarNavProps> = ({
  scrollY,
  atAGlanceRef,
  mapRef,
  statsRef,
  tablesRef,
}) => {
  const leftArrow = <span style={{ marginLeft: "4px" }}>←</span>;

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
      <ul className={styles.side_nav}>
        <li className={styles.nav_link}>
          <a onClick={atAGlanceScroll}>
            At a glance{scrollY < 1300 && leftArrow}
          </a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={mapScroll}>
            Map{scrollY > 1300 && scrollY < 2350 && leftArrow}
          </a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={statsScroll}>
            Stats{scrollY > 2350 && scrollY < 3250 && leftArrow}
          </a>
        </li>
        <li className={styles.nav_link}>
          <a onClick={tablesScroll}>Timetable{scrollY > 3250 && leftArrow}</a>
        </li>
        <li className={styles.nav_link}>
          <ThemeChanger />
        </li>
      </ul>
    </nav>
  );
};
