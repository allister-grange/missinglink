import { ServiceStatistic } from "@/types/ServiceTypes";
import { DataPoint } from "@/types/types";

const newZealandTimeZone = "Pacific/Auckland";
const graphTickDateFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: newZealandTimeZone,
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const graphTooltipDateFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: newZealandTimeZone,
  dateStyle: "medium",
  timeStyle: "short",
  hourCycle: "h23",
});

export const chartOptions: any = {
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
        callback: (value: string | number) =>
          graphTickDateFormatter.format(Number(value)),
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (items: Array<{ parsed: { x: number } }>) =>
          items.length
            ? graphTooltipDateFormatter.format(items[0].parsed.x)
            : "",
      },
    },
  },
};

export const parseServiceStatsIntoTimeArrays = (
  serviceStatistics?: ServiceStatistic[]
) => {
  type ServiceKey = keyof ServiceStatistic;

  const totalTrips = [] as DataPoint[];
  const cancelledTrips = [] as DataPoint[];
  const delayedTrips = [] as DataPoint[];
  const earlyTrips = [] as DataPoint[];
  const notReportingTimeTrips = [] as DataPoint[];
  const onTimeTrips = [] as DataPoint[];
  const totalDisruptedTrips = [] as DataPoint[];

  serviceStatistics?.forEach((stat: ServiceStatistic) => {
    totalTrips.push({
      x: stat.timestamp,
      y: stat["totalServices" as ServiceKey] as number,
    });
    cancelledTrips.push({
      x: stat.timestamp,
      y: stat["cancelledServices" as ServiceKey] as number,
    });
    delayedTrips.push({
      x: stat.timestamp,
      y: stat["delayedServices" as ServiceKey] as number,
    });
    earlyTrips.push({
      x: stat.timestamp,
      y: stat["earlyServices" as ServiceKey] as number,
    });
    notReportingTimeTrips.push({
      x: stat.timestamp,
      y: stat["notReportingTimeServices" as ServiceKey] as number,
    });
    onTimeTrips.push({
      x: stat.timestamp,
      y: stat["onTimeServices" as ServiceKey] as number,
    });
    totalDisruptedTrips.push({
      x: stat.timestamp,
      y: stat.cancelledServices + stat.delayedServices + stat.earlyServices,
    });
  });

  return {
    totalTrips,
    cancelledTrips,
    delayedTrips,
    earlyTrips,
    notReportingTimeTrips,
    onTimeTrips,
    totalDisruptedTrips,
  };
};

export default chartOptions;
