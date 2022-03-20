import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { TitleCard } from "@/components/TitleCard";
import { InfoCard } from "@/components/InfoCard";
import { BusContainer } from "@/types/BusTypes";
import dynamic from "next/dynamic";
import { Graph } from "@/components/Graph";
import useScrollPosition from "@react-hook/window-scroll";

const BusMapClientSide = dynamic(() => import("@/components/BusMap"), {
  ssr: false,
});

const Home: NextPage = () => {
  const scrollY = useScrollPosition(10 /*fps*/);

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
            <li>At a glance</li>
            <li>Map</li>
            <li>Stats</li>
            <li>Tables</li>
          </ul>
        </nav>

        <div className={styles.center_container}>
          <h1 className={styles.heading}>Missing Link ✌</h1>
          <h3 className={styles.sub_heading}>
            A site to provide you with statistics, graphs and maps on how
            MetLink&apos;s services are doing, today and in the past
          </h3>

          <div className={styles.card_container}>
            <InfoCard title={"Late Buses"} blueColor={true} busesNumber={67} totalBusesNumber={234}/>
            <div style={{ marginTop: "-25rem" }}>
              <InfoCard title={"Early"} busesNumber={10} totalBusesNumber={234}/>
            </div>
          </div>
        </div>

        <div className={styles.map_container}>
          <BusMapClientSide buses={{} as BusContainer} />
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
            <li>At a glance</li>
            <li>Map</li>
            <li>Stats</li>
            <li>Tables</li>
          </ul>
        </nav>
      </main>
    </div>
  );
};

export default Home;
