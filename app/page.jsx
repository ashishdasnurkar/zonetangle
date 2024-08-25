import React from "react";
import dynamic from "next/dynamic";

const WorldMapWithNoSSR = dynamic(() => import("../components/WorldMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  return (
    <div className="w-full h-screen">
      <WorldMapWithNoSSR />
    </div>
  );
}
