import React, { useState } from 'react';
import { Ship } from '../types/vessel';
import { fetchLiveVesselByImo } from '../services/marineTraffic';
import { Ship as ShipIcon, Compass, MapPin, RefreshCw, Trash2, ExternalLink, Radio, Calendar, Scale, Anchor } from 'lucide-react';

interface ShipListProps {
  ships: Ship[];
  onUpdateShipLocation: (shipId: string, updatedLocation: any) => void;
  onRemoveShip: (shipId: string) => void;
  onSelectShipOnMap: (ship: Ship) => void;
}

export const ShipList: React.FC<ShipListProps> = ({
  ships,
  onUpdateShipLocation,
  onRemoveShip,
  onSelectShipOnMap,
}) => {
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const handleRefreshAIS = async (ship: Ship) => {
    setRefreshingId(ship.id);
    try {
      const vesselData = await fetchLiveVesselByImo(ship.name, ship.imo);
      onUpdateShipLocation(ship.id, vesselData.location);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Underway':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'Moored / In Port':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'At Anchor':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-purple-950 text-purple-400 border-purple-800';
    }
  };

  if (ships.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 my-6">
        <ShipIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="font-extrabold text-white text-lg mb-1">No Ships Registered Yet</h3>
        <p className="text-xs max-w-md mx-auto">
          Click the <strong className="text-cyan-400">"+ Add Ship"</strong> button above to enter your vessel's Name & IMO number. The system will pull its live location directly from MarineTraffic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white text-lg flex items-center gap-2">
          Registered Fleet
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {ships.length} Ships
          </span>
        </h2>
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live MarineTraffic AIS Synced
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ships.map((ship) => (
          <div
            key={ship.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between"
          >
            {/* Header: Name, IMO, Badges */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-white">{ship.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-cyan-400 font-bold text-xs">
                      {ship.imo}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-3 mt-1">
                    {ship.type && (
                      <span className="text-slate-300 font-semibold">{ship.type}</span>
                    )}
                    {ship.builtYear && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" /> Built {ship.builtYear}
                      </span>
                    )}
                    {ship.grossTonnage && (
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-slate-500" /> {ship.grossTonnage.toLocaleString()} GT
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadgeClass(
                    ship.location.status
                  )}`}
                >
                  {ship.location.status}
                </span>
              </div>

              {/* MarineTraffic Live AIS Location Panel */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 my-3 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <MapPin className="w-3.5 h-3.5" /> MarineTraffic Location
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Updated: {ship.location.lastAisUpdate.split(' ')[1]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Coordinates (Lat/Lng)</div>
                    <div className="font-mono text-white font-extrabold mt-0.5">
                      {ship.location.latitude}° N, {ship.location.longitude}° E
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Speed & Heading</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {ship.location.speedKnots} kts @ {ship.location.headingDegrees}°
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-[11px]">
                  <span className="text-slate-400">Destination: </span>
                  <strong className="text-cyan-300">{ship.location.destination}</strong>
                  {ship.location.currentPort && (
                    <div className="text-slate-400 mt-0.5">
                      Port: <strong className="text-emerald-400">{ship.location.currentPort}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => onSelectShipOnMap(ship)}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <Compass className="w-4 h-4" /> Focus on Map
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRefreshAIS(ship)}
                  disabled={refreshingId === ship.id}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 font-semibold"
                  title="Re-pull AIS position from MarineTraffic"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingId === ship.id ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh AIS</span>
                </button>

                <button
                  onClick={() => onRemoveShip(ship.id)}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                  title="Remove ship"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
