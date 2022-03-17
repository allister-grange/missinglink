import type { NextPage } from 'next';
import Head from 'next/head';
import styles from "@/styles/Home.module.css";
import { TitleCard } from '@/components/TitleCard';
import { InfoCard } from '@/components/InfoCard';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MissingLink</title>
        <meta name="description" content="A visualisation tool for MetLink's bus times" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.info_grid}>
          <TitleCard />

          <InfoCard title={'Late'}/>
          <InfoCard title={'On Time'}/>
          <InfoCard title={'All buses'}/>
          <InfoCard title={'Cancelled'}/>
        </div>
        
        <div className={styles.map}>

        </div>

      </main>
    </div>
  )
}

export default Home
