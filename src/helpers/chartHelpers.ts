import { ServiceStatistic } from "@/types/ServiceTypes";
import { DataPoint } from "@/types/types";

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
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const parseServiceStatsIntoTimeArrays = (
  serviceStatistics: ServiceStatistic[]
) => {
  type ServiceKey = keyof ServiceStatistic;

  const totalServices = [] as DataPoint[];
  const cancelledServices = [] as DataPoint[];
  const delayedServices = [] as DataPoint[];
  const earlyServices = [] as DataPoint[];
  const notReportingTimeServices = [] as DataPoint[];
  const onTimeServices = [] as DataPoint[];
  const totalDisruptedServices = [] as DataPoint[];

  serviceStatistics.forEach((stat: ServiceStatistic) => {
    totalServices.push({
      x: stat.timestamp,
      y: stat["totalServices" as ServiceKey] as number,
    });
    cancelledServices.push({
      x: stat.timestamp,
      y: stat["cancelledServices" as ServiceKey] as number,
    });
    delayedServices.push({
      x: stat.timestamp,
      y: stat["delayedServices" as ServiceKey] as number,
    });
    earlyServices.push({
      x: stat.timestamp,
      y: stat["earlyServices" as ServiceKey] as number,
    });
    notReportingTimeServices.push({
      x: stat.timestamp,
      y: stat["notReportingTimeServices" as ServiceKey] as number,
    });
    onTimeServices.push({
      x: stat.timestamp,
      y: stat["onTimeServices" as ServiceKey] as number,
    });
    totalDisruptedServices.push({
      x: stat.timestamp,
      y: stat.cancelledServices + stat.delayedServices + stat.earlyServices,
    });
  });

  return {
    totalServices,
    cancelledServices,
    delayedServices,
    earlyServices,
    notReportingTimeServices,
    onTimeServices,
    totalDisruptedServices,
  };
};

export default chartOptions;
