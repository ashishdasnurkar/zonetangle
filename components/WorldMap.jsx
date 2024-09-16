"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import tzlookup from "tz-lookup";

const WorldMap = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminatorCoords, setTerminatorCoords] = useState([]);
  const currentLocalHour = currentTime.getHours();
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const coords = calculateTerminator(currentTime);
    setTerminatorCoords(coords);
  }, [currentTime]);

  const getLocalTime = () => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZoneName: "short",
    }).format(currentTime);
  };

  const calculateTerminator = (date) => {
    // ... (keep the existing calculateTerminator function)
  };

  const MapSetup = () => {
    const map = useMap();
    useEffect(() => {
      map.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
      map.fitBounds([
        [-60, -180],
        [60, 180],
      ]);
    }, [map]);
    return null;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const timezone = tzlookup(lat, lng);
        setSelectedLocation({ lat, lng, timezone });
      },
    });
    return null;
  };

  const HourLabels = () => {
    // ... (keep the existing HourLabels component)
  };

  const getLocalHourOffset = () => {
    return -new Date().getTimezoneOffset() / 60;
  };

  const getSelectedLocationTime = () => {
    if (!selectedLocation) return null;
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: selectedLocation.timezone,
    };
    return new Intl.DateTimeFormat(undefined, options).format(currentTime);
  };

  return (
    <div className="w-full h-screen pt-10 bg-gradient-to-b from-blue-200 to-blue-400">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "calc(100% - 2.5rem)", width: "100%" }}
        minZoom={2}
        maxZoom={5}
        zoomControl={false}
        attributionControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
        className="rounded-lg shadow-xl"
      >
        <MapSetup />
        <MapClickHandler />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          noWrap={true}
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
        />
        {/* ... (keep existing polygons and hour labels) */}
      </MapContainer>
      <div className="absolute top-2 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-1">Local Time</h2>
        <p className="text-lg text-blue-900">{getLocalTime()}</p>
        {selectedLocation && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-blue-700">
              Selected Location
            </h3>
            <p className="text-md text-blue-900">
              Lat: {selectedLocation.lat.toFixed(2)}, Lng:{" "}
              {selectedLocation.lng.toFixed(2)}
            </p>
            <p className="text-md text-blue-900">
              Time: {getSelectedLocationTime()}
            </p>
            <p className="text-md text-blue-900">
              Timezone: {selectedLocation.timezone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
