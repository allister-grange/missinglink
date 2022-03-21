type FetchStatus = "LOADING" | "SUCCESS" | "ERROR" | "IDLE";

export type ShowingInfoHolder = {
  showingWhyInfo: boolean;
  showingHowInfo: boolean;
  showingFaqInfo: boolean;
};

export default FetchStatus;

// {x: "date", y: "value"}
export type DataPoint = {
  x: string;
  y: number;
};
