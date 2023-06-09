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
    totalServices,
    cancelledServices,
    delayedServices,
    earlyServices,
    notReportingTimeServices,
    onTimeServices,
    totalDisruptedServices,
  } = parseServiceStatsIntoTimeArrays(serviceStatistics);

  const graphData = {
    datasets: [
      {
        label: "Total Services",
        data: totalServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "totalServices"
            ? "#acabab"
            : "#a2d2ff",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Cancelled Services",
        data: cancelledServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "cancelledServices"
            ? "#acabab"
            : "#3f37c9",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Late Services",
        data: delayedServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "lateServices"
            ? "#acabab"
            : "#d62828",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "On Time Services",
        data: onTimeServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "onTimeServices"
            ? "#acabab"
            : "#8ac926",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Early Services",
        data: earlyServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "earlyServices"
            ? "#acabab"
            : "#87986a",
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: "Not Reporting Time Services",
        data: notReportingTimeServices,
        fill: false,
        backgroundColor: "white",
        borderColor:
          hoveringLegendBadge && hoveringLegendBadge != "unknownServices"
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
          hoveringLegendBadge && hoveringLegendBadge != "disruptedServices"
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
