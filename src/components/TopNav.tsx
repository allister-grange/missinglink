/* eslint-disable @next/next/no-html-link-for-pages */
import styles from "@/styles/NavStyles.module.css";
import React, { RefObject } from "react";
import { WeatherIconSunny } from "./icons/WeatherIconSunny";

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
  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`${styles.nav_container} ${
        visible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.nav}>
        <div className={styles.weather}>
          <WeatherIconSunny fontSize=".5rem" />
          <p>17.3°</p>
        </div>
        <div className={styles.inner_nav_bubble}>
          <a className={styles.nav_link} onClick={atAGlanceScroll}>
            At a glance
          </a>
          <a className={styles.nav_link} onClick={mapScroll}>
            Map
          </a>
          <a className={styles.nav_link} onClick={statsScroll}>
            Stats
          </a>
          <a className={styles.nav_link} onClick={tablesScroll}>
            Timetable
          </a>
          <span className={styles.nav_link__pill}></span>
        </div>
        <div className={styles.city_picker}>
          <button
            className={
              styles.city_button +
              " " +
              (city === "wellington" ? styles.city_button__active : "")
            }
            onClick={() => setCity("wellington")}
          >
            Wellington
          </button>
          <button
            className={
              styles.city_button +
              " " +
              (city === "auckland" ? styles.city_button__active : "")
            }
            onClick={() => setCity("auckland")}
          >
            Auckland
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
