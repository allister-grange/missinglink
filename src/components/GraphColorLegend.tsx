import React from "react";
import styles from "@/styles/Graph.module.css";

interface GraphColorLegendProps {
  setHoveringLegendBadge: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export const GraphColorLegend: React.FC<GraphColorLegendProps> = ({
  setHoveringLegendBadge,
}) => {
  const onHoverBadge = (badge: string) => {
    setHoveringLegendBadge(badge);
  };

  const onLeaveBadge = () => {
    setHoveringLegendBadge(undefined);
  };

  return (
    <div className={styles.color_legend_container}>
      <p
        className={styles.color_association}
        style={{ background: "#a2d2ff" }}
        onMouseEnter={() => onHoverBadge("totalBuses")}
        onMouseLeave={onLeaveBadge}
      >
        total services
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#d62828" }}
        onMouseEnter={() => onHoverBadge("lateBuses")}
        onMouseLeave={onLeaveBadge}
      >
        late services
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#3f37c9" }}
        onMouseEnter={() => onHoverBadge("cancelledBuses")}
        onMouseLeave={onLeaveBadge}
      >
        cancelled services
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#8ac926" }}
        onMouseEnter={() => onHoverBadge("onTimeBuses")}
        onMouseLeave={onLeaveBadge}
      >
        on time services
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#87986a" }}
        onMouseEnter={() => onHoverBadge("earlyBuses")}
        onMouseLeave={onLeaveBadge}
      >
        early services
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#dda15e" }}
        onMouseEnter={() => onHoverBadge("unknownBuses")}
        onMouseLeave={onLeaveBadge}
      >
        not reporting time
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#fcbf49" }}
        onMouseEnter={() => onHoverBadge("disruptedBuses")}
        onMouseLeave={onLeaveBadge}
      >
        total disrupted services
      </p>
    </div>
  );
};
