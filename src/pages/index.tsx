import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { InfoCard } from "@/components/InfoCard";
import { BusContainer } from "@/types/BusTypes";
import dynamic from "next/dynamic";
import { Graph } from "@/components/Graph";
import useScrollPosition from "@react-hook/window-scroll";
import useMetlinkApi from "@/hooks/useMetlinkApi";

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

  console.log(buses);

  return (
    <div className={styles.container}>
      <Head>
        <title>MissingLink</title>
        <meta
          name="description"
          content="A visualisation tool for MetLink's bus times"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.new_main}>
        <nav className={styles.nav_top_container}>
          <ul className={styles.nav}>
            <li className={styles.nav_link}>
              <a href="#">At a glance</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Map</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Stats</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Tables</a>
            </li>
          </ul>
        </nav>

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
          </div>
        </div>

        <div className={styles.map_container}>
          <BusMapClientSide buses={buses} />
        </div>

        <div className={styles.center_container}>
          <Graph />
        </div>

        <nav
          className={`${styles.side_nav_container} ${
            scrollY > 60 && styles.side_nav_container_show
          }`}
        >
          <ul className={styles.side_nav}>
            <li className={styles.nav_link}>
              <a href="#">At a glance</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Map</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Stats</a>
            </li>
            <li className={styles.nav_link}>
              <a href="#">Tables</a>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
};

export default Home;
