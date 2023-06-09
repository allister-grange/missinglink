export type ServiceStop = {
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
  service: Service;
};

export type ServiceStatus =
  | "LATE"
  | "UNKNOWN"
  | "EARLY"
  | "ONTIME"
  | "CANCELLED"
  | "ALL"
  | null;

export type ServiceContainer = {
  lateServices: Service[];
  cancelledServices: Service[];
  earlyServices: Service[];
  onTimeServices: Service[];
  unknownServices: Service[];
  allServices: Service[];
};

export type Service = {
  vehicleId: number;
  vehicle_id: number;
  status: ServiceStatus;
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
  delayedServices: number;
  totalServices: number;
  cancelledServices: number;
  earlyServices: number;
  onTimeServices: number;
  notReportingTimeServices: number;
  timestamp: string;
};

export type ServiceType =
  | "totalServices"
  | "cancelledServices"
  | "delayedServices"
  | "earlyServices"
  | "onTimeServices"
  | "notReportingTimeServices"
  | "totalDisruptedServices";

export default ServiceStop;
