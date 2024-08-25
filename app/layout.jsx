import React from "react";
import "./globals.css";

export const metadata = {
  title: "World Map with Day/Night Visualization",
  description: "A world map showing day/night cycle and time zones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
