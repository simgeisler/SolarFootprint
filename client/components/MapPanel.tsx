"use client";

import { useMemo } from "react";
import { MapContainer, Polygon, Polyline, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
import L from "leaflet";

type LatLng = { lat: number; lon: number };

type Props = {
  clickedPoint: LatLng | null;
  polygon: LatLng[];
  drawingMode: boolean;
  drawingPoints: LatLng[];
  hoverPoint: LatLng | null;
  shakeDrawButton: boolean;
  onMapClick: (point: LatLng, snappedToStart?: boolean) => void;
  onMouseMove: (point: LatLng) => void;
  onToggleDrawingMode: () => void;
  onCompleteDrawing: () => void;
  onClearDrawing: () => void;
};

function ClickHandler({
  drawingMode,
  drawingPoints,
  onMapClick,
  onMouseMove,
}: {
  drawingMode: boolean;
  drawingPoints: LatLng[];
  onMapClick: (point: LatLng, snappedToStart?: boolean) => void;
  onMouseMove: (point: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      if (drawingMode && drawingPoints.length >= 3) {
        const first = drawingPoints[0];
        const firstPx = L.point(
          e.target.latLngToContainerPoint(L.latLng(first.lat, first.lon)).x,
          e.target.latLngToContainerPoint(L.latLng(first.lat, first.lon)).y,
        );
        const clickPx = L.point(e.containerPoint.x, e.containerPoint.y);
        const pixelDistance = firstPx.distanceTo(clickPx);

        if (pixelDistance <= 20) {
          onMapClick(first, true);
          return;
        }
      }

      onMapClick({ lat: e.latlng.lat, lon: e.latlng.lng }, false);
    },
    mousemove(e) {
      onMouseMove({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPanel({
  clickedPoint,
  polygon,
  drawingMode,
  drawingPoints,
  hoverPoint,
  shakeDrawButton,
  onMapClick,
  onMouseMove,
  onToggleDrawingMode,
  onCompleteDrawing,
  onClearDrawing,
}: Props) {
  const polygonPoints = useMemo(() => polygon.map((p) => [p.lat, p.lon] as [number, number]), [polygon]);
  const drawingPolyline = useMemo(() => {
    const base = drawingPoints.map((p) => [p.lat, p.lon] as [number, number]);
    if (drawingMode && hoverPoint && drawingPoints.length > 0) {
      return [...base, [hoverPoint.lat, hoverPoint.lon] as [number, number]];
    }
    return base;
  }, [drawingMode, drawingPoints, hoverPoint]);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <div className="absolute left-0 top-0 z-[500] w-full bg-white/80 px-4 py-2 text-center text-xs font-medium text-[#1B3022] backdrop-blur-sm">
        Analiz için bir binaya tıklayın veya "Serbest Çizim Modu" butonuna tıklayarak kendi alanınızı oluşturun.
      </div>
      <div className="absolute right-3 top-12 z-[500] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onToggleDrawingMode}
          className={`rounded-lg bg-[#F4D03F] px-4 py-2 text-sm font-semibold text-[#1f3f2a] ${shakeDrawButton ? "animate-shake" : ""}`}
        >
          {drawingMode ? "Serbest Çizimi Kapat" : "Serbest Çizim Modu"}
        </button>
        {drawingMode ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCompleteDrawing}
              className="rounded-lg bg-[#82C47C] px-3 py-2 text-xs font-semibold text-[#10301f]"
            >
              Çizimi Tamamla
            </button>
            <button
              type="button"
              onClick={onClearDrawing}
              className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1f3f2a]"
            >
              Temizle
            </button>
          </div>
        ) : null}
      </div>
      <MapContainer
        center={[39.93, 32.85]}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className={`${drawingMode ? "map-draw-cursor" : "map-select-cursor"} map-dark`}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler drawingMode={drawingMode} drawingPoints={drawingPoints} onMapClick={onMapClick} onMouseMove={onMouseMove} />
        {polygonPoints.length >= 3 ? (
          <Polygon
            positions={polygonPoints}
            pathOptions={{ color: "#1B3022", fillColor: "#82C47C", fillOpacity: 0.28, weight: 2.5 }}
          />
        ) : null}
        {drawingPoints.length > 0 ? <Polyline positions={drawingPolyline} pathOptions={{ color: "#1B3022", weight: 3 }} /> : null}
      </MapContainer>
    </div>
  );
}
