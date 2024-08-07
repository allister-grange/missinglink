import { WeatherIconCloudy } from "@/components/Icons/WeatherIconCloudy";
import { WeatherIconRainy } from "@/components/Icons/WeatherIconRainy";
import { WeatherIconSunny } from "@/components/Icons/WeatherIconSunny";
import { fetcher } from "@/helpers/fetcher";
import styles from "@/styles/NavStyles.module.css";
import { WeatherData } from "@/types/weather";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import React, { RefObject } from "react";
import useSWR from "swr";

interface TopNavProps {
  atAGlanceRef: RefObject<HTMLDivElement>;
  mapRef: RefObject<HTMLDivElement>;
  statsRef: RefObject<HTMLDivElement>;
  tablesRef: RefObject<HTMLDivElement>;
  city: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  atAGlanceRef,
  mapRef,
  statsRef,
  tablesRef,
  city,
}) => {
  const router = useRouter();
  const innerNavBubbleRef = React.useRef<HTMLDivElement>(null);
  const cityNavDivRef = React.useRef<HTMLDivElement>(null);
  const [navPillBackgroundPosition, setNavPillBackgroundPosition] =
    React.useState({
      left: 0,
      width: 0,
      animate: false,
    });
  const [cityPillBackgroundPosition, setCityNavPillBackgroundPosition] =
    React.useState({
      left: 0,
      width: 0,
      animate: false,
    });
  const [prevScrollPos, setPrevScrollPos] = React.useState(0);
  const [navBarVisible, setNavBarVisible] = React.useState(true);
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useSWR<WeatherData>(
    city ? `/api/weather?city=${city}` : null,
    fetcher
  );
  // needs to be set into state as I need to set the value based off of a system theme on the first load
  const [themeIcon, setThemeIcon] = React.useState("🌚");

  React.useEffect(() => {
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setThemeIcon("☀️");
    } else {
      setThemeIcon("🌚");
    }
  }, [theme]);

  const weatherData = data;

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

  const onLinkMouseEnter = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    isCity: boolean
  ) => {
    const linkRect = (e.target as HTMLAnchorElement).getBoundingClientRect();

    let boundingRect;
    if (isCity) {
      boundingRect = cityNavDivRef.current!.getBoundingClientRect();
    } else {
      boundingRect = innerNavBubbleRef.current!.getBoundingClientRect();
    }

    const offsetX = linkRect.left - boundingRect.left;
    const width = linkRect.width;

    if (isCity) {
      setCityNavPillBackgroundPosition({ left: offsetX, width, animate: true });
    } else {
      setNavPillBackgroundPosition({ left: offsetX, width, animate: true });
    }
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
        setNavPillBackgroundPosition({
          left: 0,
          width: 0,
          animate: false,
        });
        setCityNavPillBackgroundPosition({
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

  function changeCity(city: string) {
    setCookie(null, "preferredCity", city, {
      path: "/",
      maxAge: 2147483647,
      secure: true,
    });
    router.push("/" + city);
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
              onMouseOver={(e) => onLinkMouseEnter(e, false)}
            >
              At a glance
            </a>
            <a
              className={styles.nav_link}
              onClick={mapScroll}
              onMouseOver={(e) => onLinkMouseEnter(e, false)}
            >
              Map
            </a>
            <a
              className={styles.nav_link}
              onClick={statsScroll}
              onMouseOver={(e) => onLinkMouseEnter(e, false)}
            >
              Stats
            </a>
            <a
              className={styles.nav_link}
              onClick={tablesScroll}
              onMouseOver={(e) => onLinkMouseEnter(e, false)}
            >
              Timetable
            </a>
            <a
              className={styles.nav_link}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              onMouseOver={(e) => onLinkMouseEnter(e, false)}
            >
              {themeIcon}
            </a>
          </div>
          <span
            className={styles.nav_link__pill}
            style={{
              left: `${navPillBackgroundPosition.left}px`,
              width: `${navPillBackgroundPosition.width}px`,
              transition: navPillBackgroundPosition.animate
                ? "transform .3s ease, width .3s ease, left .3s ease"
                : "",
            }}
          ></span>
        </div>
        <div className={styles.city_picker} ref={cityNavDivRef}>
          <button
            className={
              styles.city_button +
              " " +
              (city === "wellington" ? styles.city_button__active : "")
            }
            onClick={() => changeCity("wellington")}
            onMouseOver={(e) => onLinkMouseEnter(e, true)}
          >
            Wellington
          </button>
          <button
            className={
              styles.city_button +
              " " +
              (city === "auckland" ? styles.city_button__active : "")
            }
            onClick={() => changeCity("auckland")}
            onMouseOver={(e) => onLinkMouseEnter(e, true)}
          >
            Auckland
          </button>
          <span
            className={styles.city_button__pill}
            style={{
              left: `${cityPillBackgroundPosition.left}px`,
              width: `${cityPillBackgroundPosition.width}px`,
              transition: cityPillBackgroundPosition.animate
                ? "transform .3s ease, width .3s ease, left .3s ease"
                : "",
            }}
          ></span>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
