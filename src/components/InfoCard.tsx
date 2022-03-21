import React from "react";
import styles from "../styles/CardStyles.module.css";
import Tilt from "react-parallax-tilt";
import useScrollPosition from "@react-hook/window-scroll";

interface InfoCardProps {
  title: string;
  blueColor?: boolean;
  busesNumber: number;
  totalBusesNumber: number;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  blueColor = false,
  busesNumber,
  totalBusesNumber,
}) => {
  const scrollY = useScrollPosition(60 /*fps*/);
  const busPercentage = (busesNumber / totalBusesNumber) * 100;
  let dividerBarColor;

  if (busPercentage <= 10) {
    dividerBarColor = blueColor ? "white" : "var(--color-secondary)";
  } else if (busPercentage > 10 && busPercentage <= 20) {
    dividerBarColor = "coral";
  } else {
    dividerBarColor = "red";
  }

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div
        className={`${styles.card_container} ${styles.info_container} ${
          blueColor && styles.blue_background
        }`}
      >
        <div className={styles.padding}>
          <div style={{ transform: `translateY(${scrollY / 30}%)` }}>
            <h3
              className={`${styles.info_number} && ${
                blueColor && styles.info_number_blue
              }`}
            >
              {busesNumber}
              <span
                style={{
                  fontSize: "3rem",
                  marginLeft: ".5rem",
                  color: "var(--color-grey-light-1)",
                }}
              >
                /
              </span>
              <span
                style={{
                  fontSize: "3rem",
                  marginLeft: ".5rem",
                  color: "var(--color-grey-light-1)",
                }}
              >
                {totalBusesNumber}
              </span>
            </h3>
            <div
              className={styles.line_divider}
              style={{
                backgroundColor: dividerBarColor,
              }}
            ></div>
          </div>
          <h2
            className={`${styles.info_title} ${
              blueColor && styles.info_title_blue
            }`}
          >
            {title}
          </h2>
          <p
            className={`${styles.info_description} ${
              blueColor && styles.info_description_blue
            }`}
          >
            A late bus is a bus that is running over 2 minutes late and is
            reporting it&apos;s time
          </p>
        </div>
      </div>
    </Tilt>
  );
};
