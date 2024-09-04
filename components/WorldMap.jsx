"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WorldMap = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminatorCoords, setTerminatorCoords] = useState([]);
  const currentUTCHour = currentTime.getUTCHours();

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
        const isCurrentHour = i === currentUTCHour;
        const label = L.divIcon({
          className: "hour-label",
          html: `<div class="bg-blue-500 text-white px-2 py-1 rounded-full shadow-md ${
            isCurrentHour ? "border-2 border-yellow-400" : ""
          }" style="${
            isCurrentHour
              ? "width: 34px; height: 34px;"
              : "width: 30px; height: 30px;"
          } display: flex; align-items: center; justify-content: center;">${i}</div>`,
          iconSize: isCurrentHour ? [38, 38] : [34, 34],
          iconAnchor: isCurrentHour ? [19, 19] : [17, 17],
        });
        labels.push(
          L.marker([77, -172.5 + 15 * i], { icon: label }).addTo(map)
        );
      }

      return () => {
        labels.forEach((label) => map.removeLayer(label));
      };
    }, [map, currentUTCHour]);

    return null;
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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          noWrap={true}
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
        />
        {terminatorCoords && terminatorCoords.length > 0 && (
          <>
            <Polygon
              positions={[
                ...terminatorCoords,
                [90, 180],
                [90, -180],
                [-90, -180],
                [-90, 180],
              ]}
              pathOptions={{
                fillColor: "#4a5568",
                fillOpacity: 0.3,
                color: "#f6e05e",
                weight: 2,
              }}
            />
            <Polygon
              positions={terminatorCoords}
              pathOptions={{
                fillColor: "#f6e05e",
                fillOpacity: 0.1,
                color: "#f6e05e",
                weight: 2,
              }}
            />
          </>
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
              color:
                i === currentUTCHour
                  ? "rgba(255, 255, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.4)",
              weight: i === currentUTCHour ? 2 : 1,
              fill: false,
              dashArray: i === currentUTCHour ? null : "5, 5",
            }}
          />
        ))}
      </MapContainer>
      <div className="absolute top-2 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-1">Sydney Time</h2>
        <p className="text-lg text-blue-900">{getSydneyTime()}</p>
      </div>
    </div>
  );
};

export default WorldMap;
