import React from "react";
import styles from "@/styles/CardStyles.module.css";
import Tilt from "react-parallax-tilt";
import { useSpring, config, animated } from "react-spring";
import { ClipLoader } from "react-spinners";

interface InfoCardProps {
  title: string;
  blueColor?: boolean;
  busesNumber: number;
  totalBusesNumber: number;
  includeSubNumber?: false;
  description: string;
  isLoading: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  blueColor = false,
  includeSubNumber = true,
  busesNumber,
  totalBusesNumber,
  description,
  isLoading,
}) => {
  const busPercentage = (busesNumber / totalBusesNumber) * 100;

  const { number } = useSpring({
    from: { number: 0 },
    number: busesNumber,
    delay: Math.random() * 300 + 50,
    config: config.molasses,
  });

  let numberToDisplay;

  if (busesNumber < 30) {
    numberToDisplay = busesNumber;
  } else {
    numberToDisplay = number.to((val) => Math.floor(val));
  }

  const includeSubNumberElement = includeSubNumber && (
    <span>/ {totalBusesNumber}</span>
  );

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div
        className={`${styles.card_container} ${styles.info_container} ${
          blueColor && styles.blue_background
        }`}
      >
        <div className={styles.padding}>
          <div>
            <animated.h3
              className={`${styles.info_number} && ${
                blueColor && styles.info_number_blue
              }`}
            >
              {isLoading ? (
                <ClipLoader size={65} color={blueColor ? "white" : "black"} />
              ) : (
                numberToDisplay
              )}
            </animated.h3>
            <h3
              className={styles.sub_number}
              style={{
                color: blueColor
                  ? "var(--color-grey-light-1)"
                  : "var(--color-grey-light-2)",
              }}
            >
              {includeSubNumberElement}
            </h3>
            <div
              className={styles.line_divider}
              style={{
                backgroundColor: blueColor ? "white" : "var(--color-secondary)",
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
