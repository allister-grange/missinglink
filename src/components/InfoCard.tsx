import React from "react";
import styles from "../styles/CardStyles.module.css";
import Tilt from "react-parallax-tilt";
import useScrollPosition from "@react-hook/window-scroll";

interface InfoCardProps {
  title: string;
  blueColor?: boolean;
  busesNumber: number;
  totalBusesNumber: number;
  includeSubNumber?: false;
  description: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  blueColor = false,
  includeSubNumber = true,
  busesNumber,
  totalBusesNumber,
  description
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
          <div>
            <h3
              className={`${styles.info_number} && ${
                blueColor && styles.info_number_blue
              }`}
            >
              {busesNumber}
              {includeSubNumber && (
                <>
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
                </>
              )}
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
            {description}
          </p>
        </div>
      </div>
    </Tilt>
  );
};
