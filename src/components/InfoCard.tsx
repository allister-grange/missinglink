import React from "react";
import styles from "@/styles/CardStyles.module.css";
import Tilt from "react-parallax-tilt";
import { useSpring, config, animated } from "react-spring";
import { ClipLoader } from "react-spinners";

interface InfoCardProps {
  title: string;
  blueColor?: boolean;
  servicesNumber: number;
  totalServicesNumber: number;
  includeSubNumber?: false;
  description: string;
  isLoading: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  blueColor = false,
  includeSubNumber = true,
  servicesNumber,
  totalServicesNumber,
  description,
  isLoading,
}) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: servicesNumber,
    delay: Math.random() * 300 + 50,
    config: config.molasses,
  });

  let numberToDisplay;

  if (servicesNumber < 10) {
    numberToDisplay = servicesNumber;
  } else {
    numberToDisplay = number.to((val) => Math.floor(val));
  }

  const includeSubNumberElement = includeSubNumber && (
    <span>
      /{" "}
      {totalServicesNumber === 0
        ? Math.floor(Math.random() * (200 - 100 + 1) + 100)
        : totalServicesNumber}
    </span>
  );

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div
        className={`${styles.card_container} ${styles.info_container} ${
          blueColor && styles.card_container_blue
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
