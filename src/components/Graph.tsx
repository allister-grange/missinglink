import React, { useState } from "react";
import chartOptions, {
  parseServiceStatsIntoTimeArrays,
} from "@/helpers/chartHelpers";
import useServiceStatisticApi from "@/hooks/useServiceStatisticApi";
import styles from "@/styles/Graph.module.css";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GraphColorLegend } from "./GraphColorLegend";

const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

const Graph: React.FC = ({}) => {
  const { serviceStatistics, isLoading, getServiceStatsData } =
    useServiceStatisticApi();
  const [startDate, setStartDate] = useState<Date>(yesterdayDate);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [hoveringLegendBadge, setHoveringLegendBadge] = useState<
    string | undefined
  >();

  const {
    totalTrips,
    cancelledTrips,
    delayedTrips,
    earlyTrips,
    notReportingTimeTrips,
    onTimeTrips,
    totalDisruptedTrips,
  } = parseServiceStatsIntoTimeArrays(serviceStatistics);

  const graphData = {
    datasets: [
      {
        label: "Total Trips",
        data: totalTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "totalTrips"
            ? "#acabab"
            : "#a2d2ff",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Cancelled Trips",
        data: cancelledTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "cancelledTrips"
            ? "#acabab"
            : "#3f37c9",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Late Trips",
        data: delayedTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "lateTrips"
            ? "#acabab"
            : "#d62828",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "On Time Trips",
        data: onTimeTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "onTimeTrips"
            ? "#acabab"
            : "#8ac926",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Early Trips",
        data: earlyTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "earlyTrips"
            ? "#acabab"
            : "#87986a",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Not Reporting Time Trips",
        data: notReportingTimeTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "unknownTrips"
            ? "#acabab"
            : "#dda15e",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Total Disrupted Trips",
        data: totalDisruptedTrips,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "disruptedTrips"
            ? "#acabab"
            : "#fcbf49",
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
              getServiceStatsData(date, endDate);
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
              getServiceStatsData(startDate, date);
              setEndDate(date);
            }
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Graph);
