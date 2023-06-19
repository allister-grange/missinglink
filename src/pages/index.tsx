import { Footer } from "@/components/Footer";
import Graph from "@/components/Graph";
import { InfoCardsContainer } from "@/components/InfoCardsContainer";
import { Timetable } from "@/components/Timetable";
import useServiceApi from "@/hooks/useServiceApi";
import styles from "@/styles/Home.module.css";
import useScrollPosition from "@react-hook/window-scroll";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServicesMapClientSide = dynamic(
  () => import("@/components/ServicesMap"),
  {
    ssr: false,
  }
);

const TopNavClientSide = dynamic(() => import("@/components/TopNav"), {
  ssr: false,
});

const localStorageCityKey = "city";

const Home: NextPage = () => {
  const scrollY = useScrollPosition(10 /*fps*/);
  const [city, setCity] = React.useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem(localStorageCityKey) || "wellington"
      : "wellington"
  );
  const { services, refreshAPIServicesData, error, status, dispatch } =
    useServiceApi(city);

  const atAGlanceRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);
  const toastId = useRef<React.ReactText | null>(null);

  React.useEffect(() => {
    if (typeof window !== undefined) {
      window.localStorage.setItem(localStorageCityKey, city);
    }
  }, [city]);

  if (error) {
    toastId.current = toast.info(
      "There's an error with either my API or Metlink's, please try again later",
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    dispatch({ type: "REJECTED", error: false });
  }

  return (
    <div className={styles.container} ref={atAGlanceRef}>
      <Head>
        <title>MissingLink</title>
        <meta
          name="og:description"
          content="A visualisation tool for Metlink's services times"
        />
        <meta property="og:image" content={"/preview.png"} />
        <meta property="og:title" content="MissingLink - A pulse on Metlink" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ToastContainer limit={1} style={{ fontSize: "1.8rem" }} />

        <div className={styles.nav_top_container}>
          <TopNavClientSide
            atAGlanceRef={atAGlanceRef}
            mapRef={mapRef}
            statsRef={statsRef}
            tablesRef={tablesRef}
            city={city}
            setCity={setCity}
          />
        </div>

        <div className={styles.center_container}>
          <div className={styles.heading_container}>
            <h1 className={styles.heading}>Missing Link ✌</h1>
            <h3 className={styles.sub_heading}>
              A site to provide you with statistics, graphs and maps on how New
              Zealand&apos;s public transport services are doing, today and in
              the past
            </h3>
            {/* No longer needed as I moved to SSE (keeping in case it uses too much data) */}
            {/* <RefreshButton
              refreshAPIBusData={refreshAPIBusData}
              isRefreshingData={status === "REFRESHING"}
            /> */}
          </div>

          <div className={styles.card_container}>
            <InfoCardsContainer
              services={services}
              isLoadingInitialData={status === "LOADING"}
            />
          </div>
          <div className={styles.map_container} ref={mapRef}>
            <ServicesMapClientSide services={services} />
          </div>

          <div className={styles.graph_container} ref={statsRef}>
            <div className={styles.graph_title_container}>
              <h1 className={styles.sub_title}>Statistics ✍️</h1>
              <p className={styles.description}>
                Every 20 minutes I take a sit-rep of how Metlink&apos;s services
                are doing
              </p>
              <p className={styles.sub_description}>
                Data for {city.charAt(0).toUpperCase() + city.slice(1)} begins
                from {city === "auckland" ? "20-06-2023" : "12-08-2021"}
                {city === "wellington" && (
                  <>
                    <br />
                    Prior to 20-06-2023, a service was considered late if it was
                    over 2 minutes, not the 3 that is counted now
                  </>
                )}
              </p>
            </div>
            <Graph />
          </div>

          <div className={styles.table_container} ref={tablesRef}>
            <div className={styles.table_title_container}>
              <h1 className={styles.sub_title}>Timetables 🔎</h1>
              <p className={styles.description}>
                A quick view of the status of all the services currently
                running. If the time is 0m:00s on a service, it usually means
                that it&apos;s not reporting it&apos;s time
              </p>
              <Timetable serviceDataToDisplay={services.allServices} />
            </div>
          </div>
        </div>

        {/* <div
          className={`${styles.side_nav_container} ${
            scrollY > 60 && styles.side_nav_container_show
          }`}
        >
          <SideBarNav
            scrollY={scrollY}
            atAGlanceRef={atAGlanceRef}
            mapRef={mapRef}
            statsRef={statsRef}
            tablesRef={tablesRef}
          />
        </div> */}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
