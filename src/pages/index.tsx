import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { TitleCard } from "@/components/TitleCard";
import { InfoCard } from "@/components/InfoCard";
import { BusContainer } from "@/types/BusTypes";
import dynamic from "next/dynamic";
import { Graph } from "@/components/Graph";

const BusMapClientSide = dynamic(() => import("@/components/BusMap"), {
  ssr: false,
});

const Home: NextPage = () => {
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
      {/* 
      <main className={styles.main}>
        <div className={styles.info_grid}>
          <TitleCard />

          <InfoCard title={"Late"} numbers={true} />
          <InfoCard title={"Early"} />
          <InfoCard title={"On time"} />
          <InfoCard title={"Cancelled"} />
          <InfoCard title={"All Buses"} />
          <InfoCard title={"Cancelled"} />
        </div>

        <div className={styles.divide} />

        <div className={styles.display_grid}>
          <BusMapClientSide buses={{} as BusContainer} />
          <Graph />
        </div>
      </main> */}

      <main className={styles.new_main}>
        <nav className={styles.nav_container}>
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
            <InfoCard title={"Late Buses"} numbers={true} blueColor={true} />
            <div style={{ marginTop: "-15rem" }}>
              <InfoCard title={"Early"} numbers={true} />
            </div>
          </div>
        </div>

        <div className={styles.map_container}>
          <BusMapClientSide buses={{} as BusContainer} />
        </div>

        <div className={styles.center_container}>
          <div className={styles.card_container}>
            <InfoCard title={"Late Buses"} numbers={true} blueColor={true} />
            <div style={{ marginTop: "-15rem" }}>
              <InfoCard title={"Early"} numbers={true} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
