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

  const getDayNightPath = () => {
    const sydneyOffset = 10; // Sydney is UTC+10
    const sydneyHours = currentTime.getUTCHours() + sydneyOffset;
    const lat =
      Math.asin(
        0.397731 *
          Math.sin(
            0.98565 * (currentTime.getUTCDate() - 80) +
              1.914 * Math.sin(0.98565 * (currentTime.getUTCDate() - 8))
          )
      ) *
      (180 / Math.PI);
    const lng = -15 * (sydneyHours + currentTime.getUTCMinutes() / 60 - 12);
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
          L.marker([80, -172.5 + 15 * i], { icon: label }).addTo(map)
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
        <DayNightOverlay />
        <HourLabels />
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
      <div className="absolute top-2 left-4 bg-white bg-opacity-70 p-2 rounded">
        Sydney Time: {getSydneyTime()}
      </div>
    </div>
  );
};

export default WorldMap;
