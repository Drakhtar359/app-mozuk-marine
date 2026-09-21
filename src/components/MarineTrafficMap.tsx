import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship } from '../types/vessel';
import { Compass, Radio, MapPin } from 'lucide-react';

interface MarineTrafficMapProps {
  ships: Ship[];
  focusedShipId?: string;
  onSelectShip: (ship: Ship) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Underway':
      return '#38bdf8'; // Sky Blue
    case 'Moored / In Port':
      return '#34d399'; // Emerald
    case 'At Anchor':
      return '#fbbf24'; // Amber
    default:
      return '#c084fc'; // Purple
  }
};

export const MarineTrafficMap: React.FC<MarineTrafficMapProps> = ({
  ships,
  focusedShipId,
  onSelectShip,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Create map centered on global maritime view
    const map = L.map(mapContainerRef.current, {
      center: [10, 30],
      zoom: 3,
      zoomControl: true,
      attributionControl: false,
    });

    // High-precision Dark Matter tile layer for maritime vessel tracking
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Markers whenever ships change or focus changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    ships.forEach((ship) => {
      const { latitude, longitude, status, speedKnots, headingDegrees, destination, lastAisUpdate } = ship.location;
      const color = getStatusColor(status);
      const isFocused = ship.id === focusedShipId;

      // Custom Leaflet DivIcon SVG marker
      const customIcon = L.divIcon({
        className: 'custom-ship-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="
              width: ${isFocused ? '36px' : '28px'};
              height: ${isFocused ? '36px' : '28px'};
              border-radius: 50%;
              background-color: ${color}22;
              border: 2px solid ${color};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 12px ${color}aa;
              transform: rotate(${headingDegrees}deg);
              transition: all 0.3s ease;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="${color}" stroke="#090d16" stroke-width="2">
                <polygon points="12,2 19,21 12,17 5,21" />
              </svg>
            </div>
            <div style="
              position: absolute;
              left: ${isFocused ? '40px' : '32px'};
              white-space: nowrap;
              background-color: rgba(9, 13, 22, 0.9);
              border: 1px solid ${color}88;
              color: #ffffff;
              padding: 2px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(0,0,0,0.8);
            ">
              ${ship.name} (${ship.imo})
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; color: #f8fafc;">
          <div style="font-weight: 800; font-size: 14px; color: #38bdf8; margin-bottom: 2px;">
            ${ship.name}
          </div>
          <div style="font-family: monospace; font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">
            ${ship.imo} ${ship.type ? '• ' + ship.type : ''}
          </div>
          <div style="font-size: 11px; line-height: 1.5; color: #94a3b8;">
            <div><strong>Status:</strong> <span style="color: ${color}; font-weight: 700;">${status}</span></div>
            <div><strong>Exact Position:</strong> ${latitude}° N, ${longitude}° E</div>
            <div><strong>Speed / Heading:</strong> ${speedKnots} kts @ ${headingDegrees}°</div>
            <div><strong>Destination:</strong> ${destination}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Last AIS Update: ${lastAisUpdate}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'leaflet-dark-popup',
      });

      marker.on('click', () => {
        onSelectShip(ship);
      });

      markersRef.current[ship.id] = marker;

      // If focused, fly to exact coordinates
      if (isFocused) {
        map.flyTo([latitude, longitude], 8, { duration: 1.5 });
        marker.openPopup();
      }
    });
  }, [ships, focusedShipId]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden mb-6 relative shadow-2xl">
      {/* Map Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-white text-base">Leaflet MarineTraffic Live AIS Map</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> High Precision Coordinates
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Underway
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> In Port
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Anchored
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[420px] bg-[#090d16] z-10"
      />
    </div>
  );
};
