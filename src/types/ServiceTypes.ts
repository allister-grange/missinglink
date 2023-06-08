export type BusStop = {
  id: number;
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_desc: string;
  zone_id: string;
  stop_lat: number;
  stop_lon: number;
  location_type: 0;
  parent_station: string;
  stop_url: string;
  stop_timezone: string;
};

export type StopPrediction = {
  stop_id: string;
  service_id: string;
  delay: string;
  bus: Bus;
};

export type BusStatus =
  | "LATE"
  | "UNKNOWN"
  | "EARLY"
  | "ONTIME"
  | "CANCELLED"
  | "ALL"
  | null;

export type BusContainer = {
  lateBuses: Bus[];
  cancelledBuses: Bus[];
  earlyBuses: Bus[];
  onTimeBuses: Bus[];
  unknownBuses: Bus[];
  allBuses: Bus[];
};

export type Bus = {
  vehicleId: number;
  vehicle_id: number;
  status: BusStatus;
  stopId: string;
  delay: number;
  routeDescription: string;
  routeLongName: string;
  routeShortName: string;
  routeId: string;
  lat: number;
  long: number;
  bearing: number;
};

export type ServiceStatistic = {
  batchId: number;
  delayedBuses: number;
  totalBuses: number;
  cancelledBuses: number;
  earlyBuses: number;
  onTimeBuses: number;
  notReportingTimeBuses: number;
  timestamp: string;
};

export type BusType =
  | "totalBuses"
  | "cancelledBuses"
  | "delayedBuses"
  | "earlyBuses"
  | "onTimeBuses"
  | "notReportingTimeBuses"
  | "totalDisruptedServices";

export default BusStop;
