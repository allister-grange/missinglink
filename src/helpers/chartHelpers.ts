import { BusStatistic, BusType } from "@/types/BusTypes";
import { DataPoint } from "@/types/types";

export const chartOptions: any = {
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

export const parseBusStatsIntoTimeArrays = (
  busStatistics: BusStatistic[]
) => {
  type BusKey = keyof BusStatistic;

  const totalBuses = [] as DataPoint[];
  const cancelledBuses = [] as DataPoint[];
  const delayedBuses = [] as DataPoint[];
  const earlyBuses = [] as DataPoint[];
  const notReportingTimeBuses = [] as DataPoint[];
  const onTimeBuses = [] as DataPoint[];
  const totalDisruptedServices = [] as DataPoint[];

  busStatistics.forEach((stat: BusStatistic) => {
    totalBuses.push({
      x: stat.timestamp,
      y: stat["totalBuses" as BusKey] as number,
    });
    cancelledBuses.push({
      x: stat.timestamp,
      y: stat["cancelledBuses" as BusKey] as number,
    });
    delayedBuses.push({
      x: stat.timestamp,
      y: stat["delayedBuses" as BusKey] as number,
    });
    earlyBuses.push({
      x: stat.timestamp,
      y: stat["earlyBuses" as BusKey] as number,
    });
    notReportingTimeBuses.push({
      x: stat.timestamp,
      y: stat["notReportingTimeBuses" as BusKey] as number,
    });
    onTimeBuses.push({
      x: stat.timestamp,
      y: stat["onTimeBuses" as BusKey] as number,
    });
    totalDisruptedServices.push({
      x: stat.timestamp,
      y: stat.cancelledBuses + stat.delayedBuses + stat.earlyBuses,
    });
  });

  return {
    totalBuses,
    cancelledBuses,
    delayedBuses,
    earlyBuses,
    notReportingTimeBuses,
    onTimeBuses,
    totalDisruptedServices,
  }
};

export default chartOptions;
