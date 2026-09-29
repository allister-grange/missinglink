import { API_URL } from "@/constants";
import chartOptions, {
  parseServiceStatsIntoTimeArrays,
} from "@/helpers/chartHelpers";
import { getServiceProviderFromCity } from "@/helpers/convertors";
import { fetcher } from "@/helpers/fetcher";
import {
  formatDateForBackend,
  formatDateTimeDaysAgoForInput,
  formatDateForInput,
} from "@/helpers/time";
import styles from "@/styles/Graph.module.css";
import { ServiceStatistic } from "@/types/ServiceTypes";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import useSWR from "swr";
import { GraphColorLegend } from "./GraphColorLegend";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip);

type GraphPageProps = {
  city: string;
};

const Graph: React.FC<GraphPageProps> = ({ city }) => {
  const [startDate, setStartDate] = useState<string>(() =>
    formatDateTimeDaysAgoForInput(1)
  );
  const [endDate, setEndDate] = useState<string>(() =>
    formatDateForInput(new Date())
  );
  const [hoveringLegendBadge, setHoveringLegendBadge] = useState<
    string | undefined
  >();
  const servicerProvider = getServiceProviderFromCity(city);

  let { data: serviceStatistics } = useSWR<ServiceStatistic[]>(
    city && startDate && endDate
      ? `${API_URL}/api/v1/${servicerProvider}/statistics?startDate=${encodeURIComponent(
          formatDateForBackend(startDate)
        )}&endDate=${encodeURIComponent(formatDateForBackend(endDate, true))}`
      : null,
    fetcher
  );

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
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.date_picker}
        />
        <p>to</p>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.date_picker}
        />
      </div>
    </div>
  );
};

export default React.memo(Graph);
