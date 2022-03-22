import React from "react";
import { ChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import useBusStatisticApi from "@/hooks/useBusStatisticApi";
import { BusStatistic, BusType } from "@/types/BusTypes";
import { DataPoint } from "@/types/types";
import styles from "@/styles/Graph.module.css";

const options: ChartOptions = {
  maintainAspectRatio: false,
  color: "blue",
  scales: {
    x: {
      type: "time",
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 15,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const Graph: React.FC = ({}) => {
  const { busStatistics, isLoading, getBusStatsData } = useBusStatisticApi();

  // TODO think of a better way to do the following two methods
  const parseBusStats = (busType: BusType): DataPoint[] => {
    const res = [] as DataPoint[];
    type BusKey = keyof BusStatistic;

    busStatistics.forEach((stat) => {
      if (busType === "totalDisruptedServices") {
        res.push({
          x: stat.timestamp,
          y: stat.cancelledBuses + stat.delayedBuses + stat.earlyBuses,
        });
      } else {
        res.push({
          x: stat.timestamp,
          y: stat[busType as BusKey] as number,
        });
      }
    });

    return res;
  };

  const allBuses = parseBusStats("totalBuses");
  const cancelledBuses = parseBusStats("cancelledBuses");
  const delayedBuses = parseBusStats("delayedBuses");
  const earlyBuses = parseBusStats("earlyBuses");
  const notReportingTimeBuses = parseBusStats("notReportingTimeBuses");
  const onTimeBuses = parseBusStats("onTimeBuses");
  const totalDisruptedServices = parseBusStats("totalDisruptedServices");

  const data = {
    datasets: [
      {
        label: "Total Buses",
        data: allBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#a2d2ff",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Cancelled Services",
        data: cancelledBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#3f37c9",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Late Buses",
        data: delayedBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#d62828",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "On Time Buses",
        data: onTimeBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#fcbf49",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Early Buses",
        data: earlyBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#87986a",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Not Reporting Time Buses",
        data: notReportingTimeBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#dda15e",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Total Disrupted Services",
        data: totalDisruptedServices,
        fill: false,
        backgroundColor: "#999",
        borderColor: "#8ac926",
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  // want the data in this format: const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];

  return (
    <div
      style={{
        maxWidth: "1300px",
        marginLeft: "auto",
        marginRight: "auto",
        height: "100%",
      }}
    >
      <div className={styles.color_legend_container}>
        <p style={{ width: "min-content" }}>
          <span
            className={styles.color_association}
            style={{ background: "#a2d2ff" }}
          >
            total buses
          </span>
        </p>
        <p style={{ width: "min-content" }}>
          <span
            className={styles.color_association}
            style={{ background: "#d62828" }}
          >
            late buses
          </span>
        </p>
        <p style={{ width: "min-content" }}>
          <span
            className={styles.color_association}
            style={{ background: "#3f37c9" }}
          >
            cancelled services
          </span>
        </p>
        <p style={{ width: "min-content" }}>
          <span
            className={styles.color_association}
            style={{ background: "#fcbf49" }}
          >
            on time buses
          </span>{" "}
        </p>
        <p>
          <span
            className={styles.color_association}
            style={{ background: "#87986a" }}
          >
            early buses
          </span>
        </p>
        <p>
          <span
            className={styles.color_association}
            style={{ background: "#dda15e" }}
          >
            not reporting time
          </span>{" "}
        </p>
        <p>
          <span
            className={styles.color_association}
            style={{ background: "#8ac926" }}
          >
            total disrupted services
          </span>
        </p>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};
