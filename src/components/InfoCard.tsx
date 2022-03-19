import React from "react";
import styles from "../styles/CardStyles.module.css";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import Tilt from "react-parallax-tilt";

interface InfoCardProps {
  title: string;
  numbers?: boolean;
  blueColor?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  numbers = false,
  blueColor = false,
}) => {
  const value = 0.66;

  return (
    <Tilt>
      {/* <div className={`${styles.card_container} ${styles.info_container}`}>
        <h2 className={styles.info_title}>{title}</h2>
        {numbers ? (
          <h3
            style={{
              fontSize: "4rem",
              marginTop: "2rem",
              marginLeft: "2rem",
              color: "var(--color-secondary)",
            }}
          >
            72{" "}
            <span
              style={{
                fontSize: "2rem",
                marginLeft: ".5rem",
                color: "var(--color-grey-light-1)",
              }}
            >
              /
            </span>
            <span
              style={{
                fontSize: "1.8rem",
                marginLeft: ".5rem",
                color: "var(--color-grey-light-1)",
              }}
            >
              256
            </span>
          </h3>
        ) : (
          <CircularProgressbar
            value={value}
            maxValue={1}
            text={`${value * 100}%`}
            className={styles.progress_bar}
          />
        )}
      </div> */}
      <div
        className={`${styles.card_container} ${styles.info_container} ${
          blueColor && styles.blue_background
        }`}
      >
        {numbers ? (
          <h3
            className={`${styles.info_number} && ${
              blueColor && styles.info_number_blue
            }`}
          >
            72{" "}
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
              256
            </span>
          </h3>
        ) : (
          <CircularProgressbar
            value={value}
            maxValue={1}
            text={`${value * 100}%`}
            className={styles.progress_bar}
          />
        )}
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
          reporting it’s time
        </p>
      </div>
    </Tilt>
  );
};
