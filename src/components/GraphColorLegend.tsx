import React from "react";
import styles from "@/styles/Graph.module.css";

interface GraphColorLegendProps {}

export const GraphColorLegend: React.FC<GraphColorLegendProps> = ({}) => {
  return (
    <div className={styles.color_legend_container}>
      <p>
        <span
          className={styles.color_association}
          style={{ background: "#a2d2ff" }}
        >
          total buses
        </span>
      </p>
      <p>
        <span
          className={styles.color_association}
          style={{ background: "#d62828" }}
        >
          late buses
        </span>
      </p>
      <p>
        <span
          className={styles.color_association}
          style={{ background: "#3f37c9" }}
        >
          cancelled services
        </span>
      </p>
      <p>
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
  );
};
