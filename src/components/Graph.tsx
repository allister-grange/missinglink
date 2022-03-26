import React, { useState } from "react";
import chartOptions, {
  parseBusStatsIntoTimeArrays,
} from "@/helpers/chartHelpers";
import useBusStatisticApi from "@/hooks/useBusStatisticApi";
import styles from "@/styles/Graph.module.css";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GraphColorLegend } from "./GraphColorLegend";

const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

export const Graph: React.FC = ({}) => {
  const { busStatistics, isLoading, getBusStatsData } = useBusStatisticApi();
  const [startDate, setStartDate] = useState<Date>(yesterdayDate);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [hoveringLegendBadge, setHoveringLegendBadge] = useState<
    string | undefined
  >();

  const {
    totalBuses,
    cancelledBuses,
    delayedBuses,
    earlyBuses,
    notReportingTimeBuses,
    onTimeBuses,
    totalDisruptedServices,
  } = parseBusStatsIntoTimeArrays(busStatistics);

  const graphData = {
    datasets: [
      {
        label: "Total Buses",
        data: totalBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "totalBuses"
            ? "#acabab"
            : "#a2d2ff",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Cancelled Services",
        data: cancelledBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "cancelledBuses"
            ? "#acabab"
            : "#3f37c9",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Late Buses",
        data: delayedBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "lateBuses"
            ? "#acabab"
            : "#d62828",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "On Time Buses",
        data: onTimeBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "onTimeBuses"
            ? "#acabab"
            : "#fcbf49",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Early Buses",
        data: earlyBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "earlyBuses"
            ? "#acabab"
            : "#87986a",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Not Reporting Time Buses",
        data: notReportingTimeBuses,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "unknownBuses"
            ? "#acabab"
            : "#dda15e",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Total Disrupted Services",
        data: totalDisruptedServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "disruptedBuses"
            ? "#acabab"
            : "#8ac926",
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div>
      <GraphColorLegend setHoveringLegendBadge={setHoveringLegendBadge} />
      <Line data={graphData} options={chartOptions} />
      <div className={styles.datepicker_wrapper}>
        <p>showing data from </p>
        <DatePicker
          wrapperClassName="date_picker"
          selected={startDate}
          dateFormat="dd/MM/yyyy p"
          showTimeSelect
          onChange={(date: Date | null) => {
            if (date && endDate) {
              getBusStatsData(date, endDate);
              setStartDate(date);
            }
          }}
        />
        <p>to</p>
        <DatePicker
          wrapperClassName="date_picker"
          selected={endDate}
          dateFormat="dd/MM/yyyy p"
          showTimeSelect
          onChange={(date: Date | null) => {
            if (date && startDate) {
              getBusStatsData(startDate, date);
              setEndDate(date);
            }
          }}
        />
      </div>
    </div>
  );
};
