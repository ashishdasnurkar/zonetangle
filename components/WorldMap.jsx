"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WorldMap = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminatorCoords, setTerminatorCoords] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTerminatorCoords(calculateTerminator(currentTime));
  }, [currentTime]);

  const getSydneyTime = () => {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const HourLabels = () => {
    const map = useMap();

    useEffect(() => {
      const labels = [];
      for (let i = 0; i < 24; i++) {
        const label = L.divIcon({
          className: "hour-label",
          html: `<div class="bg-white bg-opacity-70 px-1 rounded">${i}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        labels.push(
          L.marker([77, -172.5 + 15 * i], { icon: label }).addTo(map)
        );
      }

      return () => {
        labels.forEach((label) => map.removeLayer(label));
      };
    }, [map]);

    return null;
  };

  return (
    <div className="w-full h-screen pt-10">
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
      >
        <MapSetup />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          noWrap={true}
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
        />
        {terminatorCoords.length > 0 && (
          <Polygon
            positions={[
              ...terminatorCoords,
              [90, 180],
              [90, -180],
              [-90, -180],
              [-90, 180],
            ]}
            pathOptions={{
              color: "rgba(0, 0, 0, 0.3)",
              fillOpacity: 0.3,
              weight: 0,
            }}
          />
        )}
        <HourLabels />
        {[...Array(24)].map((_, i) => (
          <Polygon
            key={i}
            positions={[
              [-90, -180 + 15 * i],
              [90, -180 + 15 * i],
              [90, -180 + 15 * (i + 1)],
              [-90, -180 + 15 * (i + 1)],
            ]}
            pathOptions={{
              color: "rgba(255, 255, 255, 0.2)",
              weight: 1,
              fill: false,
            }}
          />
        ))}
      </MapContainer>
      <div className="absolute top-2 left-4 bg-white bg-opacity-70 p-2 rounded">
        Sydney Time: {getSydneyTime()}
      </div>
    </div>
  );
};

export default WorldMap;
