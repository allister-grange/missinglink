import { Footer } from "@/components/Footer";
import Graph from "@/components/Graph";
import { InfoCardsContainer } from "@/components/InfoCardsContainer";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServicesMapClientSide = dynamic(
  () => import("@/components/ServicesMap"),
  {
    ssr: false,
  }
);

const Home: NextPage = () => {
  const scrollY = useScrollPosition(10 /*fps*/);
  const { buses, refreshAPIBusData, error, status, dispatch } = useMetlinkApi();

  const atAGlanceRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);
  const toastId = useRef<React.ReactText | null>(null);

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
        <title>Missing Link</title>
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
          <TopNav
            atAGlanceRef={atAGlanceRef}
            mapRef={mapRef}
            statsRef={statsRef}
            tablesRef={tablesRef}
          />
        </div>

        <div className={styles.center_container}>
          <div className={styles.heading_container}>
            <h1 className={styles.heading}>Missing Link ✌</h1>
            <h3 className={styles.sub_heading}>
              A site to provide you with statistics, graphs and maps on how
              Metlink&apos;s services are doing, today and in the past
            </h3>
            {/* No longer needed as I moved to SSE (keeping in case it uses too much data) */}
            {/* <RefreshButton
              refreshAPIBusData={refreshAPIBusData}
              isRefreshingData={status === "REFRESHING"}
            /> */}
          </div>

          <div className={styles.card_container}>
            <InfoCardsContainer
              buses={buses}
              isLoadingInitialData={status === "LOADING"}
            />
          </div>
          <div className={styles.map_container} ref={mapRef}>
            <ServicesMapClientSide buses={buses} />
          </div>

          <div className={styles.graph_container} ref={statsRef}>
            <div className={styles.graph_title_container}>
              <h1 className={styles.sub_title}>Statistics ✍️</h1>
              <p className={styles.description}>
                Every 20 minutes I take a sit-rep of how Metlink&apos;s services
                are doing
              </p>
              <p className={styles.sub_description}>
                *Determining the number of cancelled services is a bit tricky.
                Presently, I&apos;m using service announcements to calculate the
                total. The cancelled services are then incorporated into the
                &quot;total services&quot; statistic, which explains why there
                are approximately 200 services operating during the night. These
                200 services represent all the services that Metlink cancelled
                for the next day, that are being announced at midnight.
              </p>
            </div>
            <Graph />
          </div>

          <div className={styles.table_container} ref={tablesRef}>
            <div className={styles.table_title_container}>
              <h1 className={styles.sub_title}>Timetables 🔎</h1>
              <p className={styles.description}>
                A quick view of the status of all the buses currently running.
                If the time is 0m:00s on a service, it usually means that
                it&apos;s not reporting it&apos;s time
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
