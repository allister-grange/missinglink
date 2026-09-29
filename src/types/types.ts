type FetchStatus = "LOADING" | "SUCCESS" | "ERROR" | "IDLE";

export type ShowingInfoHolder = {
  showingWhyInfo: boolean;
  showingHowInfo: boolean;
  showingFaqInfo: boolean;
};

export default FetchStatus;

// {x: timestamp in milliseconds, y: value}
export type DataPoint = {
  x: number;
  y: number;
};
