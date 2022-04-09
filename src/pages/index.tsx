import { Footer } from "@/components/Footer";
import Graph from "@/components/Graph";
import { InfoCardsContainer } from "@/components/InfoCardsContainer";
import { RefreshButton } from "@/components/RefreshButton";
import { SideBarNav } from "@/components/SideBarNav";
import { Timetable } from "@/components/Timetable";
import { TopNav } from "@/components/TopNav";
import useMetlinkApi from "@/hooks/useMetlinkApi";
import styles from "@/styles/Home.module.css";
import useScrollPosition from "@react-hook/window-scroll";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BusMapClientSide = dynamic(() => import("@/components/BusMap"), {
  ssr: false,
});

const Home: NextPage = () => {
  const scrollY = useScrollPosition(10 /*fps*/);
  const {
    buses,
    refreshAPIBusData,
    isRefreshingData,
    isLoadingInitialData,
    error,
    setError,
  } = useMetlinkApi();
  const [isClientSide, setIsClientSide] = useState(false);

  const atAGlanceRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);
  const toastId = useRef<React.ReactText | null>(null);

  useEffect(() => setIsClientSide(true), []);

  if (isClientSide) {
    ReactGA.initialize("UA-185842430-1");
    ReactGA.pageview(window.location.pathname);
  }

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
    setError(false);
  }

  return (
    <div className={styles.container} ref={atAGlanceRef}>
      <Head>
        <title>Missing Link</title>
        <meta
          name="og:description"
          content="A visualisation tool for MetLink's bus services times"
        />
        <meta property="og:image" content={"/preview.png"} />
        <meta
          property="og:title"
          content="MissingLink - A pulse on MetService"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.new_main}>
        <ToastContainer limit={1} style={{ fontSize: "1.8rem" }} />

        <div className={styles.nav_top_container}>
          <TopNav
            atAGlanceRef={atAGlanceRef}
            mapRef={mapRef}
            statsRef={statsRef}
            tablesRef={tablesRef}
          />
        </div>

        <div className={styles.center_container}>
          <h1 className={styles.heading}>Missing Link ✌</h1>
          <h3 className={styles.sub_heading}>
            A site to provide you with statistics, graphs and maps on how
            MetLink&apos;s services are doing, today and in the past
          </h3>

          <RefreshButton
            refreshAPIBusData={refreshAPIBusData}
            isRefreshingData={isRefreshingData}
          />

          <div className={styles.card_container}>
            <InfoCardsContainer
              buses={buses}
              isLoadingInitialData={isLoadingInitialData}
            />
          </div>
          <div className={styles.map_container} ref={mapRef}>
            <BusMapClientSide buses={buses} />
          </div>

          <div className={styles.graph_container} ref={statsRef}>
            <div className={styles.graph_title_container}>
              <h1 className={styles.sub_title}>Statistics ✍️</h1>
              <p className={styles.description}>
                Every 20 minutes I take a sit-rep of how MetLink&apos;s buses
                are doing
              </p>
            </div>
            <Graph />
          </div>

          <div className={styles.table_container} ref={tablesRef}>
            <div className={styles.table_title_container}>
              <h1 className={styles.sub_title}>Timetables 🔎</h1>
              <p className={styles.description}>
                A quick view of the status of all the buses currently running.
                If the time is 0m:00s on a bus, it usually means that it&apos;s
                not reporting it&apos;s time
              </p>
              <Timetable busDataToDisplay={buses.allBuses} />
            </div>
          </div>
        </div>

        <div
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
