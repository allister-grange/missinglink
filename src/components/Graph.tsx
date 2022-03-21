import React from "react";
import { ChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import useBusStatisticApi from "@/hooks/useBusStatisticApi";
import { BusStatistic, BusType } from "@/types/BusTypes";
import { DataPoint } from "@/types/types";

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
      display: false
      // labels: {
      //   font: {
      //     size: 20,
      //   },
      // },
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
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Cancelled Services",
        data: cancelledBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Late Buses",
        data: delayedBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "On Time Buses",
        data: onTimeBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "cyan",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Early Buses",
        data: earlyBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "magenta",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Not Reporting Time Buses",
        data: notReportingTimeBuses,
        fill: false,
        backgroundColor: "#999",
        borderColor: "yellow",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Total Disrupted Services",
        data: totalDisruptedServices,
        fill: false,
        backgroundColor: "#999",
        borderColor: "red",
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
      <Line data={data} options={options} />
    </div>
  );
};
