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
        onMouseEnter={() => onHoverBadge("totalServices")}
        onMouseLeave={onLeaveBadge}
      >
        total trips
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#d62828" }}
        onMouseEnter={() => onHoverBadge("lateServices")}
        onMouseLeave={onLeaveBadge}
      >
        late trips
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#3f37c9" }}
        onMouseEnter={() => onHoverBadge("cancelledServices")}
        onMouseLeave={onLeaveBadge}
      >
        cancelled trips
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#8ac926" }}
        onMouseEnter={() => onHoverBadge("onTimeServices")}
        onMouseLeave={onLeaveBadge}
      >
        on time trips
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#87986a" }}
        onMouseEnter={() => onHoverBadge("earlyServices")}
        onMouseLeave={onLeaveBadge}
      >
        early trips
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#dda15e" }}
        onMouseEnter={() => onHoverBadge("unknownServices")}
        onMouseLeave={onLeaveBadge}
      >
        not reporting time
      </p>
      <p
        className={styles.color_association}
        style={{ background: "#fcbf49" }}
        onMouseEnter={() => onHoverBadge("disruptedServices")}
        onMouseLeave={onLeaveBadge}
      >
        total disrupted trips
      </p>
    </div>
  );
};
