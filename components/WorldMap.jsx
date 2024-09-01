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
        const label = L.divIcon({
          className: "hour-label",
          html: `<div class="bg-blue-500 text-white px-2 py-1 rounded shadow text-sm flex items-center justify-center" style="width: 30px; height: 20px;">${i}</div>`,
          iconSize: [30, 20],
          iconAnchor: [15, 10],
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
    <div className="w-full h-screen">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        minZoom={2}
        maxZoom={5}
        zoomControl={true}
        attributionControl={true}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
      >
        <MapSetup />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                fillColor: "#000",
                fillOpacity: 0.3,
                color: "#666",
                weight: 1,
              }}
            />
            <Polygon
              positions={terminatorCoords}
              pathOptions={{
                fillColor: "#fff",
                fillOpacity: 0.1,
                color: "#666",
                weight: 1,
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
              color: "#666",
              weight: 1,
              fill: false,
              opacity: 0.5,
            }}
          />
        ))}
      </MapContainer>
      <div className="absolute top-2 left-2 bg-white p-2 rounded shadow z-[1000]">
        <h2 className="text-lg font-semibold">Sydney Time</h2>
        <p>{getSydneyTime()}</p>
      </div>
    </div>
  );
};

export default WorldMap;
