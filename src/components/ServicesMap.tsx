import { convertSecondsToMinutesSentence } from "@/helpers/convertSecondsToMinutes";
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
background-color: #75CFF0;
border-radius: 50%;
`;

function ChangeMapView({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}

const getMapMarker = (service: Service) => {
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
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 185.343 185.343" style="enable-background:new 0 0 185.343 185.343; transform:rotate(${
      service.bearing - 90
    }deg)" xml:space="preserve">
    <g>
		<path style="fill:${color};" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
			l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
			c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"/>
    </g>
    </svg>
    </div>
  `,
  });

  return (
    <Marker
      position={[service.lat, service.long]}
      key={service.vehicleId}
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
  let centerLatLong;

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
      {services.allServices.map((service: Service) => getMapMarker(service))}
    </MapContainer>
  );
};

export default ServicesMap;
