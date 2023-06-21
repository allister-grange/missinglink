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
  const innerNavBubbleRef = React.useRef<HTMLDivElement>(null);
  const [pillBackgroundPosition, setPillBackgroundPosition] = React.useState({
    left: 0,
    width: 0,
    animate: false,
  });

  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [navBarVisible, setNavBarVisible] = React.useState(true);
  const [weatherData, setWeatherData] = React.useState<
    undefined | WeatherData
  >();

  const atAGlanceScroll = () => {
    handleLinkClick();
    atAGlanceRef.current!.scrollIntoView({ behavior: "smooth" });
  };
  const mapScroll = () => {
    handleLinkClick();
    mapRef.current!.scrollIntoView({ behavior: "smooth" });
  };
  const statsScroll = () => {
    handleLinkClick();
    statsRef.current!.scrollIntoView({ behavior: "smooth" });
  };
  const tablesScroll = () => {
    handleLinkClick();
    tablesRef.current!.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherData = await fetcher(city);
      setWeatherData(weatherData);
    };

    fetchWeatherData();
  }, [city]);

  const onLinkMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const linkRect = (e.target as HTMLAnchorElement).getBoundingClientRect();
    const innerNavBubbleRect =
      innerNavBubbleRef.current!.getBoundingClientRect();

    const offsetX = linkRect.left - innerNavBubbleRect.left;
    const width = linkRect.width;

    setPillBackgroundPosition({ left: offsetX, width, animate: true });
  };

  // yeah yeah, imperative code sucks I know..
  // all css/js is better than me importing some random open source lib
  const handleLinkClick = () => {
    const checkbox = document.getElementById(
      "hamburger-toggle"
    ) as HTMLInputElement;
    checkbox.checked = !checkbox.checked;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setNavBarVisible(visible);
      if (!visible) {
        setPillBackgroundPosition({
          left: 0,
          width: 0,
          animate: false,
        });
      }
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
        navBarVisible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.nav}>
        <div className={styles.weather}>
          {weatherIcon}
          <p>{weatherData?.currentTemp && `${weatherData?.currentTemp}°`}</p>
        </div>
        <div
          className={`${styles.inner_nav_bubble} ${styles.hamburger_menu}`}
          ref={innerNavBubbleRef}
        >
          <input
            type="checkbox"
            id="hamburger-toggle"
            className={styles.hamburger_toggle}
          />{" "}
          <label htmlFor="hamburger-toggle" className={styles.hamburger_label}>
            <span className={styles.hamburger_lines}></span>
          </label>
          <div className={styles.link_container}>
            <a
              className={styles.nav_link}
              onClick={atAGlanceScroll}
              onMouseOver={onLinkMouseEnter}
            >
              At a glance
            </a>
            <a
              className={styles.nav_link}
              onClick={mapScroll}
              onMouseOver={onLinkMouseEnter}
            >
              Map
            </a>
            <a
              className={styles.nav_link}
              onClick={statsScroll}
              onMouseOver={onLinkMouseEnter}
            >
              Stats
            </a>
            <a
              className={styles.nav_link}
              onClick={tablesScroll}
              onMouseOver={onLinkMouseEnter}
            >
              Timetable
            </a>
          </div>
          <span
            className={styles.nav_link__pill}
            style={{
              left: `${pillBackgroundPosition.left}px`,
              width: `${pillBackgroundPosition.width}px`,
              transition: pillBackgroundPosition.animate
                ? "transform .3s ease, width .3s ease, left .3s ease"
                : "",
            }}
          ></span>
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
