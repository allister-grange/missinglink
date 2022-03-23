import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { InfoCard } from "@/components/InfoCard";
import { BusContainer } from "@/types/BusTypes";
import dynamic from "next/dynamic";
import { Graph } from "@/components/Graph";
import useScrollPosition from "@react-hook/window-scroll";
import useMetlinkApi from "@/hooks/useMetlinkApi";
import { SideBarNav } from "@/components/SideBarNav";
import { TopNav } from "@/components/TopNav";
import { useRef } from "react";
import { Timetable } from "@/components/Timetable";

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

  const atAGlanceRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container} ref={atAGlanceRef}>
      <Head>
        <title>MissingLink</title>
        <meta
          name="description"
          content="A visualisation tool for MetLink's bus times"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.new_main}>
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

          <div className={styles.card_container}>
            <InfoCard
              title={"Late Buses"}
              blueColor={true}
              busesNumber={67}
              totalBusesNumber={234}
            />
            <div className={styles.card_move_up}>
              <InfoCard
                title={"Early"}
                busesNumber={10}
                totalBusesNumber={234}
              />
            </div>
            <InfoCard title={"Early"} busesNumber={10} totalBusesNumber={234} />
            <div className={styles.card_move_up}>
              <InfoCard
                title={"Early"}
                blueColor={true}
                busesNumber={10}
                totalBusesNumber={234}
              />
            </div>
          </div>
          <div className={styles.map_container} ref={mapRef}>
            <BusMapClientSide buses={buses} />
          </div>

          <div className={styles.graph_container} ref={statsRef}>
            <div className={styles.graph_title_container}>
              <h1 className={styles.sub_title}>Statistics&nbsp;&nbsp;✍️</h1>
              <p className={styles.description}>
                Every 20 minutes I take a sit-rep of how MetLink&apos;s buses
                are doing
              </p>
            </div>
            <Graph />
          </div>

          <div className={styles.table_container} ref={statsRef}>
            <div className={styles.table_title_container}>
              <h1 className={styles.sub_title}>Timetables&nbsp;&nbsp;🔎</h1>
              <p className={styles.description}>
                A quick view of the status of all the buses currently running, if the time is 0m:00s
                on a bus, it usually means that it&apos;s not reporting
                it&apos;s time
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
    </div>
  );
};

export default Home;
