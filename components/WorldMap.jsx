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
    const rad = Math.PI / 180;
    const deg = 180 / Math.PI;

    // Calculate Julian date
    const julianDate = date.getTime() / 86400000 + 2440587.5;
    const days = julianDate - 2451545.0;

    // Calculate solar parameters
    const L = (280.46 + 0.9856474 * days) % 360;
    const g = (357.528 + 0.9856003 * days) % 360;
    const lambda = L + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad);
    const epsilon = 23.439 - 0.0000004 * days;
    const ra =
      Math.atan2(
        Math.cos(epsilon * rad) * Math.sin(lambda * rad),
        Math.cos(lambda * rad)
      ) * deg;
    const dec =
      Math.asin(Math.sin(epsilon * rad) * Math.sin(lambda * rad)) * deg;

    // Calculate Greenwich mean sidereal time
    const gmst = (18.697374558 + 24.06570982441908 * days) % 24;

    // Calculate hour angle
    const ha =
      (gmst + date.getUTCHours() + date.getUTCMinutes() / 60 + ra / 15) * 15 -
      180;

    const coords = [];
    for (let lat = -90; lat <= 90; lat += 2) {
      const cosLHA =
        (Math.sin(-0.83 * rad) - Math.sin(lat * rad) * Math.sin(dec * rad)) /
        (Math.cos(lat * rad) * Math.cos(dec * rad));
      if (cosLHA < -1 || cosLHA > 1) {
        // Sun is always above or below horizon at this latitude
        continue;
      }
      const lng = ((ha - Math.acos(cosLHA) * deg + 360) % 360) - 180;
      coords.push([lat, lng]);
    }

    // Ensure the polygon is closed
    if (coords.length > 0) {
      coords.push([90, coords[coords.length - 1][1]]);
      coords.unshift([-90, coords[0][1]]);
    }

    return coords;
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
          html: `<div class="bg-blue-500 text-white px-2 py-1 rounded-full shadow-md">${i}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
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
              color: "rgba(255, 255, 255, 0.4)",
              weight: 1,
              fill: false,
              dashArray: "5, 5",
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
