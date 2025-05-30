import { Footer } from "@/components/Footer";
import { InfoCardsContainer } from "@/components/InfoCards/InfoCardsContainer";
import { PodiumContainer } from "@/components/Podium/PodiumContainer";
import { ServiceBreakdown } from "@/components/ServiceBreakdown/ServiceBreakdown";
import { Timetable } from "@/components/Timetable";
import { API_URL } from "@/constants";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { sortServicesResponseByStatus } from "@/helpers/sorters";
import styles from "@/styles/Home.module.css";
import { Service, ServiceContainer } from "@/types/ServiceTypes";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
const ServicesMapClientSide = dynamic(
  () => import("@/components/ServicesMap"),
  {
    ssr: false,
  }
);
const TopNavClientSide = dynamic(() => import("@/components/TopNav"), {
  ssr: false,
});
const TripsGraphClientSide = dynamic(
  () => import("@/components/StatsGraph/TripsGraph"),
  {
    ssr: false,
  }
);
const ToastClientSide = dynamic(() => import("@/components/Toast"), {
  ssr: false,
});

interface HomeProps {
  city: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = (await res.json()) as Service[];
  const sortedServices = sortServicesResponseByStatus(json);
  return sortedServices;
};

const Home: NextPage<HomeProps> = ({ city }) => {
  let { data: services, error } = useSWR<ServiceContainer>(
    city
      ? `${API_URL}/api/v1/${getServiceProviderFromCity(city)}/services`
      : null,
    fetcher
  );

  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;

    const isIOS = /iPad|iPhone|Macintosh|iPod/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge|OPR/.test(userAgent);

    if (!isIOS && !isChrome) {
      setShowEmoji(true);
    }
  }, []);

  const atAGlanceRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const breakdownRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container} ref={atAGlanceRef}>
      <Head>
        <title>MissingLink</title>
        <meta
          name="og:description"
          content="An overview of public transport in NZ"
        />
        <meta property="og:image" content={"/preview.png"} />
        <meta
          property="og:title"
          content="MissingLink - An overview of public transport in NZ"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.main}>
        <ToastClientSide error={error} />
        <div className={styles.nav_top_container}>
          <TopNavClientSide
            atAGlanceRef={atAGlanceRef}
            mapRef={mapRef}
            statsRef={statsRef}
            tablesRef={tablesRef}
            city={city}
          />
        </div>

        <div className={styles.center_container}>
          <div className={styles.heading_container}>
            <h1 className={styles.heading}>
              Missing Link{" "}
              {showEmoji ? (
                <Image
                  src="/victory.svg"
                  alt="Victory Emoji"
                  width={1}
                  height={1}
                  style={{
                    display: "inline",
                    height: "1em",
                    width: "auto",
                  }}
                />
              ) : (
                "✌️"
              )}
            </h1>
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
            <InfoCardsContainer city={city} />
          </div>

          <div className={styles.graph_container} ref={statsRef}>
            <div className={styles.graph_title_container}>
              <h2 className={styles.sub_title}>Statistics ✍️</h2>
              <p className={styles.description}>
                Every 15 minutes I take a sit-rep of how Metlink&apos;s services
                are doing
              </p>
              <p className={styles.sub_description}>
                Data for {city.charAt(0).toUpperCase() + city.slice(1)} begins
                from {city === "auckland" ? "20-06-2023" : "12-08-2021"}, all
                times displayed are in NZST
              </p>
              <p className={styles.sub_description__minor}>
                {city === "wellington" && (
                  <>
                    As of 20-06-2023, the updated definition of a late service
                    now allows for a 2 and a half minute grace period instead of
                    the previous 2 minute threshold
                  </>
                )}
              </p>
            </div>
            <TripsGraphClientSide city={city} />
          </div>

          <div className={styles.map_container} ref={mapRef}>
            <ServicesMapClientSide services={services} city={city} />
          </div>

          <div className={styles.podium_container}>
            <h2 className={styles.sub_title}>Leaderboard 🏅</h2>
            <p className={styles.description}>
              The leading services this week, updated every 15 minutes
            </p>
            {city === "wellington" && (
              <p className={styles.sub_description}>
                This excludes school buses (which are always the worst, they run
                infrequently and at high traffic times)
              </p>
            )}
            <PodiumContainer city={city} />
          </div>

          <div className={styles.breakdown_container} ref={breakdownRef}>
            <div className={styles.table_title_container}>
              <h2 className={styles.sub_title}>Service Breakdown 🚌</h2>
              <p className={styles.description}>
                Drill down into the performance of a single service
              </p>
            </div>

            <ServiceBreakdown city={city} />
          </div>

          <div className={styles.table_container} ref={tablesRef}>
            <div className={styles.table_title_container}>
              <h2 className={styles.sub_title}>Timetables 🔎</h2>
              <p className={styles.description}>
                A quick view of the status of all the current trips. If the time
                is 0m:00s on a service, it usually means that it&apos;s not
                reporting its time
              </p>
            </div>
            <Timetable serviceDataToDisplay={services?.allServices} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const { query } = context;
  const city = (query.city as string) || "wellington";

  return {
    props: {
      city,
    },
  };
};

export default Home;
