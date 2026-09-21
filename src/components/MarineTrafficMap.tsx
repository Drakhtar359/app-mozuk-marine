import React, { useState } from 'react';
import { Ship } from '../types/vessel';
import { Compass, MapPin, Radio, ExternalLink } from 'lucide-react';

interface MarineTrafficMapProps {
  ships: Ship[];
  focusedShipId?: string;
  onSelectShip: (ship: Ship) => void;
}

// Convert geographic lat/lng to SVG map coordinates (0..800, 0..420)
function projectCoords(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 800;
  const y = ((85 - lat) / 160) * 420;
  return { x, y };
}

export const MarineTrafficMap: React.FC<MarineTrafficMapProps> = ({
  ships,
  focusedShipId,
  onSelectShip,
}) => {
  const [hoveredShip, setHoveredShip] = useState<Ship | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Underway':
        return '#38bdf8'; // Sky blue
      case 'Moored / In Port':
        return '#34d399'; // Emerald
      case 'At Anchor':
        return '#fbbf24'; // Amber
      default:
        return '#c084fc';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden mb-6 relative shadow-2xl">
      {/* Map Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-white text-base">MarineTraffic AIS Global Vessel Map</h2>
        </div>

        <div className="flex items-center gap-3 text-xs">
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

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[2/1] min-h-[360px] bg-[#070b14] overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 800 420">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
            </pattern>
          </defs>

          {/* Grid */}
          <rect width="100%" height="100%" fill="#070b14" />
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* Equator & Meridian */}
          <line x1="0" y1="223" x2="800" y2="223" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="400" y1="0" x2="400" y2="420" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />

          {/* Continents */}
          <path d="M 120 70 L 220 60 L 250 120 L 190 170 L 140 140 L 90 90 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <path d="M 220 185 L 290 200 L 270 310 L 220 340 L 200 230 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <path d="M 390 60 L 460 50 L 470 100 L 410 110 L 380 80 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <path d="M 380 120 L 470 120 L 510 200 L 460 300 L 400 280 L 370 170 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <path d="M 480 40 L 720 40 L 750 160 L 660 190 L 580 140 L 490 110 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          <path d="M 670 250 L 750 250 L 740 320 L 660 310 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

          {/* Heading vectors for ships */}
          {ships.map((ship) => {
            const pos = projectCoords(ship.location.latitude, ship.location.longitude);
            if (ship.location.status !== 'Underway') return null;

            const angleRad = ((ship.location.headingDegrees - 90) * Math.PI) / 180;
            const vecX = pos.x + Math.cos(angleRad) * 26;
            const vecY = pos.y + Math.sin(angleRad) * 26;

            return (
              <line
                key={`vector-${ship.id}`}
                x1={pos.x}
                y1={pos.y}
                x2={vecX}
                y2={vecY}
                stroke={getStatusColor(ship.location.status)}
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />
            );
          })}

          {/* Ships */}
          {ships.map((ship) => {
            const pos = projectCoords(ship.location.latitude, ship.location.longitude);
            const isFocused = ship.id === focusedShipId;
            const isHovered = hoveredShip?.id === ship.id;
            const color = getStatusColor(ship.location.status);

            return (
              <g
                key={ship.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-all"
                onClick={() => onSelectShip(ship)}
                onMouseEnter={() => setHoveredShip(ship)}
                onMouseLeave={() => setHoveredShip(null)}
              >
                {(isFocused || isHovered) && (
                  <circle
                    r="14"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}

                {ship.location.status === 'Underway' ? (
                  <g transform={`rotate(${ship.location.headingDegrees})`}>
                    <polygon
                      points="0,-7 5,7 0,4 -5,7"
                      fill={color}
                      stroke="#070b14"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  <circle r="6" fill={color} stroke="#070b14" strokeWidth="1.5" />
                )}

                <text
                  x="10"
                  y="3"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isFocused || isHovered ? '#ffffff' : '#cbd5e1'}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  {ship.name} ({ship.imo})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Popup */}
        {hoveredShip && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md w-72 text-xs text-slate-200 pointer-events-none z-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="font-bold text-sm text-white">{hoveredShip.name}</div>
              <span className="font-mono text-cyan-400 font-bold text-[10px]">{hoveredShip.imo}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">MarineTraffic Status:</span>
                <span className="font-bold text-emerald-400">{hoveredShip.location.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="font-mono text-slate-100">{hoveredShip.location.latitude}° N, {hoveredShip.location.longitude}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed / Heading:</span>
                <span className="font-bold text-white">{hoveredShip.location.speedKnots} kts @ {hoveredShip.location.headingDegrees}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="font-medium text-cyan-300 truncate max-w-[150px]">{hoveredShip.location.destination}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
