import React, { useEffect, useState } from "react";
import styles from "@/styles/RefreshButton.module.css";
import { ClipLoader } from "react-spinners";

interface RefreshButtonProps {
  refreshAPIBusData: () => Promise<void>;
  isRefreshingData: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  isRefreshingData,
  refreshAPIBusData,
}) => {
  const [showingCount, setShowingCount] = useState(false);
  const [count, setCount] = useState<number | undefined>();

  useEffect(() => {
    if (count === 0) {
      setCount(undefined);
      setShowingCount(false);
    }

    if (!count) return undefined;

    const intervalId = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    if (count === 10) {
      refreshAPIBusData();
    }

    // clear interval on re-render to avoid memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, [count, refreshAPIBusData]);

  let updateButtonDisplay;

  if (isRefreshingData) {
    updateButtonDisplay = (
      <ClipLoader color="var(--color-secondary)" size={20} />
    );
  } else if (showingCount) {
    updateButtonDisplay = count;
  } else {
    updateButtonDisplay = "refresh data";
  }

  const handleClick = () => {
    if (!count) {
      setCount(10);
    } else {
      setShowingCount(true);
    }
  };

  return (
    <button className={styles.refresh_data_button} onClick={handleClick}>
      {updateButtonDisplay}
    </button>
  );
};
