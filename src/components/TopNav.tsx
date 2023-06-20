/* eslint-disable @next/next/no-html-link-for-pages */
import styles from "@/styles/NavStyles.module.css";
import React, { RefObject } from "react";
import { WeatherIconSunny } from "./icons/WeatherIconSunny";
import { WeatherData } from "@/types/weather";
import { WeatherIconCloudy } from "./icons/WeatherIconCloudy";
import { WeatherIconRainy } from "./icons/WeatherIconRainy";

interface TopNavProps {
  atAGlanceRef: RefObject<HTMLDivElement>;
  mapRef: RefObject<HTMLDivElement>;
  statsRef: RefObject<HTMLDivElement>;
  tablesRef: RefObject<HTMLDivElement>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  city: string;
}

const fetcher = async (cityName: string) => {
  try {
    const res = await fetch(`/api/weather?city=${cityName}`);
    let data = (await res.json()) as WeatherData;

    if (Object.keys(data).length === 0) {
      throw new Error("That city does not exists");
    }

    return data;
  } catch (error) {
    throw new Error(error as string);
  }
};

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
  const [weatherData, setWeatherData] = React.useState<
    undefined | WeatherData
  >();

  React.useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherData = await fetcher(city);
      setWeatherData(weatherData);
    };

    fetchWeatherData();
  }, [city]);

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

  let weatherIcon;

  switch (weatherData?.condition) {
    case "sunny":
      weatherIcon = <WeatherIconSunny fontSize=".5rem" />;
      break;
    case "partly cloudy":
      weatherIcon = <WeatherIconCloudy fontSize=".5rem" />;
      break;
    case "cloudy":
      weatherIcon = <WeatherIconCloudy fontSize=".5rem" />;
      break;
    case "rain":
      weatherIcon = <WeatherIconRainy fontSize=".5rem" />;
      break;
  }

  return (
    <nav
      className={`${styles.nav_container} ${
        visible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.nav}>
        <div className={styles.weather}>
          {weatherIcon}
          <p>{weatherData?.currentTemp && `${weatherData?.currentTemp}°`}</p>
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
          {/* <button
            className={
              styles.city_button +
              " " +
              (city === "auckland" ? styles.city_button__active : "")
            }
            onClick={() => setCity("auckland")}
          >
            Auckland
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
