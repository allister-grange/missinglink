import { Graph } from "@/components/Graph";
import { InfoCard } from "@/components/InfoCard";
import { SideBarNav } from "@/components/SideBarNav";
import { Timetable } from "@/components/Timetable";
import { TopNav } from "@/components/TopNav";
import useMetlinkApi from "@/hooks/useMetlinkApi";
import styles from "@/styles/Home.module.css";
import useScrollPosition from "@react-hook/window-scroll";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRef } from "react";
import { ClipLoader } from "react-spinners";

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

          <button
            className={styles.refresh_data_button}
            onClick={refreshAPIBusData}
          >
            {isRefreshingData ? (
              <ClipLoader color="var(--color-secondary)" size={20} />
            ) : (
              "refresh data"
            )}
          </button>

          <div className={styles.card_container}>
            <InfoCard
              title={"Late Buses"}
              blueColor={true}
              busesNumber={buses.lateBuses.length}
              totalBusesNumber={buses.allBuses.length}
              isLoading={isLoadingInitialData}
              description={`${Math.floor(
                (buses.lateBuses.length / buses.allBuses.length) * 100
              )}% of buses are running over 2 minutes late`}
            />
            <div className={styles.card_move_up}>
              <InfoCard
                title={"Cancelled"}
                busesNumber={buses.cancelledBuses.length}
                totalBusesNumber={buses.allBuses.length}
                includeSubNumber={false}
                isLoading={isLoadingInitialData}
                description={
                  "This is the number of how many services of Metlink's are cancelled right now (incl buses and trains)"
                }
              />
            </div>
            <InfoCard
              title={"Early"}
              busesNumber={buses.earlyBuses.length}
              totalBusesNumber={buses.allBuses.length}
              isLoading={isLoadingInitialData}
              description={`${Math.floor(
                (buses.earlyBuses.length / buses.allBuses.length) * 100
              )}% of buses are running at least a minute and a half ahead of schedule`}
            />
            <div className={styles.card_move_up}>
              <InfoCard
                title={"Not Reporting"}
                blueColor={true}
                busesNumber={buses.unknownBuses.length}
                isLoading={isLoadingInitialData}
                totalBusesNumber={buses.allBuses.length}
                description={`${Math.floor(
                  (buses.unknownBuses.length / buses.allBuses.length) * 100
                )}% of buses are not reporting their delay or location`}
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

          <div className={styles.table_container} ref={tablesRef}>
            <div className={styles.table_title_container}>
              <h1 className={styles.sub_title}>Timetables&nbsp;&nbsp;🔎</h1>
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
      <footer className={styles.footer}>
        <div>
          <h2 className={styles.copyright}>
            &copy; whatever year it is lol; all rights reserved
          </h2>
          <h3 className={styles.copyright_name}>Allister Grange</h3>
        </div>
        <ul className={styles.footer_list}>
          <li className={styles.footer_link}>
            <a href="https://opendata.metlink.org.nz/apis">MetLink API</a>
          </li>
          <li className={styles.footer_link}>
            <a href="https://github.com/allister-grange/missinglink">
              Code for this site
            </a>
          </li>
          <li className={styles.footer_link}>
            <a href="https://allistergrange.com">My Website</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
