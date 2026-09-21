import React, { useState } from 'react';
import { Vessel } from '../types/vessel';
import { Navigation, Compass, MapPin, ExternalLink, Info } from 'lucide-react';

interface InteractiveFleetMapProps {
  fleet: Vessel[];
  onSelectVessel: (vessel: Vessel) => void;
  selectedVesselId?: string;
}

// Convert geographic lat/lng to SVG map coordinates (0..800, 0..420)
// Longitude: -180 to 180 -> 0 to 800
// Latitude: 80 to -70 -> 0 to 420 (Mercator-ish approximation)
function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 800;
  // Invert latitude because SVG Y goes down
  const y = ((85 - lat) / 160) * 420;
  return { x, y };
}

export const InteractiveFleetMap: React.FC<InteractiveFleetMapProps> = ({
  fleet,
  onSelectVessel,
  selectedVesselId,
}) => {
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);

  // Key global ports for map reference
  const ports = [
    { name: 'Rotterdam', lat: 51.92, lng: 4.47 },
    { name: 'Singapore', lat: 1.35, lng: 103.81 },
    { name: 'Ras Tanura', lat: 26.65, lng: 50.15 },
    { name: 'Ningbo', lat: 29.86, lng: 121.54 },
    { name: 'Maputo', lat: -25.96, lng: 32.58 },
    { name: 'Durban', lat: -29.85, lng: 31.02 },
    { name: 'Beira', lat: -19.84, lng: 34.85 },
    { name: 'Tokyo Bay', lat: 35.53, lng: 139.77 },
    { name: 'Pemba', lat: -12.97, lng: 40.51 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Underway':
        return '#38bdf8'; // Sky blue
      case 'In Port':
        return '#34d399'; // Emerald
      case 'Anchored':
        return '#fbbf24'; // Amber
      case 'Maintenance':
        return '#c084fc'; // Purple
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden mb-6 relative">
      {/* Map Header bar */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-white text-base">Global Fleet AIS Live Map</h2>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Interactive Vessel Tracker
          </span>
        </div>
        
        {/* Map Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="text-slate-300">Underway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">In Port</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Anchored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span className="text-slate-300">Maintenance</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full aspect-[2/1] min-h-[380px] bg-[#070b14] overflow-hidden select-none">
        {/* Background Grid & World Continent Silhouettes */}
        <svg className="w-full h-full" viewBox="0 0 800 420">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
            </pattern>
            {/* Pulsing glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="#070b14" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Equator & Prime Meridian lines */}
          <line x1="0" y1="223" x2="800" y2="223" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="400" y1="0" x2="400" y2="420" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          <text x="750" y="218" fill="#475569" fontSize="9" fontWeight="bold">EQUATOR 0°</text>

          {/* Stylized Simplified Continents */}
          {/* North America */}
          <path d="M 120 70 L 220 60 L 250 120 L 190 170 L 140 140 L 90 90 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* South America */}
          <path d="M 220 185 L 290 200 L 270 310 L 220 340 L 200 230 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* Europe */}
          <path d="M 390 60 L 460 50 L 470 100 L 410 110 L 380 80 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* Africa */}
          <path d="M 380 120 L 470 120 L 510 200 L 460 300 L 400 280 L 370 170 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* Asia */}
          <path d="M 480 40 L 720 40 L 750 160 L 660 190 L 580 140 L 490 110 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* Australia */}
          <path d="M 670 250 L 750 250 L 740 320 L 660 310 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

          {/* Major Seaport Markers */}
          {ports.map((port) => {
            const pos = projectCoords(port.lat, port.lng);
            return (
              <g key={port.name} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle r="2.5" fill="#64748b" opacity="0.8" />
                <text y="9" fontSize="8" fill="#64748b" textAnchor="middle" fontWeight="500">
                  {port.name}
                </text>
              </g>
            );
          })}

          {/* Shipping Route Vectors for Underway Vessels */}
          {fleet.map((v) => {
            if (v.voyage.status !== 'Underway') return null;
            const pos = projectCoords(v.voyage.latitude, v.voyage.longitude);
            // Project heading vector
            const angleRad = ((v.voyage.headingDegrees - 90) * Math.PI) / 180;
            const vecX = pos.x + Math.cos(angleRad) * 28;
            const vecY = pos.y + Math.sin(angleRad) * 28;

            return (
              <g key={`route-${v.id}`}>
                {/* Heading line */}
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={vecX}
                  y2={vecY}
                  stroke={getStatusColor(v.voyage.status)}
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                  opacity="0.8"
                />
              </g>
            );
          })}

          {/* Vessel Position Markers */}
          {fleet.map((vessel) => {
            const pos = projectCoords(vessel.voyage.latitude, vessel.voyage.longitude);
            const isSelected = vessel.id === selectedVesselId;
            const isHovered = hoveredVessel?.id === vessel.id;
            const statusColor = getStatusColor(vessel.voyage.status);

            return (
              <g
                key={vessel.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectVessel(vessel)}
                onMouseEnter={() => setHoveredVessel(vessel)}
                onMouseLeave={() => setHoveredVessel(null)}
              >
                {/* Outer Ring Pulse for Selected or Underway */}
                {(isSelected || isHovered || vessel.voyage.status === 'Underway') && (
                  <circle
                    r={isSelected || isHovered ? '16' : '10'}
                    fill="none"
                    stroke={statusColor}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Vessel Base Glow Halo */}
                <circle
                  r={isSelected ? '12' : '8'}
                  fill={statusColor}
                  opacity={isSelected || isHovered ? '0.4' : '0.2'}
                  filter="url(#glow)"
                />

                {/* Vessel Shape Marker (Triangle oriented by heading for underway, Circle for port/anchor) */}
                {vessel.voyage.status === 'Underway' ? (
                  <g transform={`rotate(${vessel.voyage.headingDegrees})`}>
                    <polygon
                      points="0,-8 6,8 0,5 -6,8"
                      fill={statusColor}
                      stroke="#090d16"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  <circle
                    r={isSelected ? '7' : '5'}
                    fill={statusColor}
                    stroke="#090d16"
                    strokeWidth="1.5"
                  />
                )}

                {/* Label text next to vessel */}
                <text
                  x="10"
                  y="3"
                  fontSize="10"
                  fontWeight={isSelected || isHovered ? '800' : '600'}
                  fill={isSelected || isHovered ? '#ffffff' : '#cbd5e1'}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  {vessel.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Vessel Detail Popover Card */}
        {hoveredVessel && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md w-72 text-xs text-slate-200 pointer-events-none z-20 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="font-bold text-sm text-white">{hoveredVessel.name}</div>
              <span
                className="px-2 py-0.5 rounded font-semibold text-[10px]"
                style={{
                  backgroundColor: getStatusColor(hoveredVessel.voyage.status) + '22',
                  color: getStatusColor(hoveredVessel.voyage.status),
                  border: `1px solid ${getStatusColor(hoveredVessel.voyage.status)}66`,
                }}
              >
                {hoveredVessel.voyage.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-medium text-slate-100">{hoveredVessel.particulars.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IMO / Flag:</span>
                <span className="font-medium text-slate-100">{hoveredVessel.particulars.imo} ({hoveredVessel.particulars.flag})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-medium text-cyan-300 truncate max-w-[170px]">{hoveredVessel.voyage.origin.split(' ')[0]} → {hoveredVessel.voyage.destination.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed / Heading:</span>
                <span className="font-bold text-white">{hoveredVessel.voyage.speedKnots} kts @ {hoveredVessel.voyage.headingDegrees}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="font-mono text-slate-300">{hoveredVessel.voyage.latitude.toFixed(2)}°, {hoveredVessel.voyage.longitude.toFixed(2)}°</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
              <span>Click vessel to open full specifications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
