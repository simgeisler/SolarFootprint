import "./globals.css";
import "leaflet/dist/leaflet.css";

import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "SolarFootprint",
  description: "Solar potential decision support portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
