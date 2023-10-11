import { convertSecondsToMinutesSentence } from "@/helpers/convertors";
import styles from "@/styles/Map.module.css";
import { Service, ServiceContainer } from "@/types/ServiceTypes";
import { LatLngExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";

interface ServiceMapProps {
  services: ServiceContainer;
  city: string;
}

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZ3JhbmdlYWwiLCJhIjoiY2t0bDBkZmYzMXJnZjJvazR4ZmI1azNiZSJ9.6J8GPehMI5L0ammIaJz0bw";
const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`;

const iconBackground = `
width: 100%;
height: 100%;
background-color: rgb(117, 207, 240);
border-radius: 50%;
`;

function ChangeMapView({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}

const getMapMarker = (service: Service, index: number) => {
  let color = "black";
  let delayMessage = "I am on time!";

  if (service.delay >= 150) {
    color = "#fc4444";
    delayMessage = convertSecondsToMinutesSentence(service.delay);
  } else if (service.delay >= 120) {
    color = "#fc9744";
    delayMessage = convertSecondsToMinutesSentence(service.delay);
  } else if (service.delay <= -120) {
    color = "#6675c1";
    delayMessage = convertSecondsToMinutesSentence(service.delay);
  } else if (service.delay <= -180) {
    color = "#5044fc";
    delayMessage = convertSecondsToMinutesSentence(service.delay);
  }

  const icon = divIcon({
    className: "my-custom-pin",
    iconAnchor: [8, 6],
    iconSize: [15, 15],
    popupAnchor: [0, 0],
    html: `
    <div style="${iconBackground}">
      <svg style="transform:rotate(${
        service.bearing - 90
      }deg" fill="${color}" version="1.1" id="Capa_1" viewBox="0 0 268.831 268.832" xml:space="preserve">
        <g>
          <path d="M223.255,83.659l-80-79.998c-4.881-4.881-12.797-4.881-17.678,0l-80,80c-4.883,4.882-4.883,12.796,0,17.678   c2.439,2.44,5.64,3.661,8.839,3.661s6.397-1.221,8.839-3.661l58.661-58.661v213.654c0,6.903,5.597,12.5,12.5,12.5   c6.901,0,12.5-5.597,12.5-12.5V42.677l58.661,58.659c4.883,4.881,12.797,4.881,17.678,0   C228.137,96.455,228.137,88.541,223.255,83.659z"/>
        </g>
      </svg>
    </div>
    `,
  });

  return (
    <Marker
      position={[service.lat, service.long]}
      key={service.vehicleId ? service.vehicleId : index}
      icon={icon}
    >
      <Popup>
        <h1>
          {service.routeShortName} | {service.routeLongName}
        </h1>
        <h2>{delayMessage}</h2>
      </Popup>
    </Marker>
  );
};

const wellingtonCoordinates: LatLngExpression = [-41.276825, 174.7787];
const aucklandCoordinates: LatLngExpression = [-36.84846, 174.7633];

const ServicesMap: React.FC<ServiceMapProps> = ({
  services,
  city,
}: ServiceMapProps) => {
  let centerLatLong: LatLngExpression | undefined;

  switch (city) {
    case "wellington":
      centerLatLong = wellingtonCoordinates;
      break;
    case "auckland":
      centerLatLong = aucklandCoordinates;
      break;
  }

  return (
    <MapContainer
      center={centerLatLong}
      zoom={11}
      zoomControl={false}
      scrollWheelZoom={false}
      className={styles.map_container}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        url={URL}
        attribution={ATTRIBUTION}
        className={styles.leaflet_tile_pane}
      />
      <ZoomControl position="topright" />
      <ChangeMapView coords={centerLatLong!} />
      {services.allServices.map((service: Service, index) =>
        getMapMarker(service, index)
      )}
    </MapContainer>
  );
};

export default ServicesMap;
