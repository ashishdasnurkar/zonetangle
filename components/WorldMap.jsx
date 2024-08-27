"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WorldMap = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getDayNightPath = () => {
    const date = currentTime;
    const lat =
      Math.asin(
        0.397731 *
          Math.sin(
            0.98565 * (date.getUTCDate() - 80) +
              1.914 * Math.sin(0.98565 * (date.getUTCDate() - 8))
          )
      ) *
      (180 / Math.PI);
    const lng = -15 * (date.getUTCHours() + date.getUTCMinutes() / 60 - 12);
    return [lat, lng];
  };

  const [dayNightLat, dayNightLng] = getDayNightPath();

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

  const DayNightOverlay = () => {
    const map = useMap();

    useEffect(() => {
      const overlay = L.rectangle(
        [
          [-90, dayNightLng],
          [90, dayNightLng + 180],
        ],
        {
          color: "rgba(0, 0, 0, 0.3)",
          fillOpacity: 0.3,
          weight: 0,
          pane: "overlayPane",
        }
      ).addTo(map);

      return () => {
        map.removeLayer(overlay);
      };
    }, [map, dayNightLng]);

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
        <DayNightOverlay />
        {[...Array(24)].map((_, i) => (
          <Rectangle
            key={i}
            bounds={[
              [-90, -180 + 15 * i],
              [90, -180 + 15 * (i + 1)],
            ]}
            pathOptions={{
              color: "rgba(255, 255, 255, 0.2)",
              weight: 1,
              fill: false,
            }}
          />
        ))}
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white bg-opacity-70 p-2 rounded">
        Current Time: {currentTime.toUTCString()}
      </div>
    </div>
  );
};

export default WorldMap;
