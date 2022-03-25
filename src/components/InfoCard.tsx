import React from "react";
import styles from "../styles/CardStyles.module.css";
import Tilt from "react-parallax-tilt";
import { useSpring, config, animated, Interpolation } from "react-spring";

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
  description,
}) => {
  const busPercentage = (busesNumber / totalBusesNumber) * 100;
  let dividerBarColor;

  if (busPercentage <= 10) {
    dividerBarColor = blueColor ? "white" : "var(--color-secondary)";
  } else if (busPercentage > 10 && busPercentage <= 20) {
    dividerBarColor = "coral";
  } else {
    dividerBarColor = "red";
  }

  const { number } = useSpring({
    from: { number: 0 },
    number: busesNumber,
    delay: Math.random() * 300 + 50,
    config: config.molasses,
  });

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
              {number.to((val) => Math.floor(val))}
            </animated.h3>
            <h3 className={styles.sub_number}>{includeSubNumberElement}</h3>
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
