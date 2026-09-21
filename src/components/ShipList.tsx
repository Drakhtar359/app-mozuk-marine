import React from 'react';
import { Ship } from '../types/vessel';
import { Ship as ShipIcon, Calendar, Scale, Trash2, Users, FileCheck, Wrench, ChevronRight, Anchor } from 'lucide-react';

interface ShipListProps {
  ships: Ship[];
  onSelectShip: (ship: Ship) => void;
  onRemoveShip: (shipId: string) => void;
}

export const ShipList: React.FC<ShipListProps> = ({
  ships,
  onSelectShip,
  onRemoveShip,
}) => {
  if (ships.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 my-6">
        <ShipIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="font-extrabold text-white text-lg mb-1">No Vessels Registered in Fleet</h3>
        <p className="text-xs max-w-md mx-auto">
          Click the <strong className="text-cyan-400">"+ Add Ship"</strong> button above to register a vessel into your fleet portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white text-lg flex items-center gap-2">
          <Anchor className="w-5 h-5 text-cyan-400" />
          Fleet Directory & Vessel Operations Portal
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {ships.length} {ships.length === 1 ? 'Vessel' : 'Vessels'}
          </span>
        </h2>
        <span className="text-xs text-slate-400">Select a vessel to access crew, docs & repair logs</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ships.map((ship) => {
          const openRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed').length;
          const urgentRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed' && m.priority === 'urgent').length;

          return (
            <div
              key={ship.id}
              onClick={() => onSelectShip(ship)}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition hover:shadow-cyan-950/30 cursor-pointer group flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-xl text-white group-hover:text-cyan-400 transition">
                        {ship.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-400 font-bold text-xs">
                        {ship.imo}
                      </span>
                      {ship.flag && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs">
                          🇲🇿 {ship.flag}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-medium flex items-center gap-3 mt-1.5 flex-wrap">
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
                </div>

                {/* Operations Summary Badges */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  {/* Crew Badge */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      <Users className="w-3 h-3 text-cyan-400" /> Crew
                    </div>
                    <div className="font-extrabold text-white text-sm">
                      {ship.crew.length} <span className="text-[10px] text-slate-400 font-normal">Members</span>
                    </div>
                  </div>

                  {/* Documents Badge */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      <FileCheck className="w-3 h-3 text-emerald-400" /> Documents
                    </div>
                    <div className="font-extrabold text-white text-sm">
                      {ship.documents.length} <span className="text-[10px] text-slate-400 font-normal">Certs</span>
                    </div>
                  </div>

                  {/* Maintenance Badge */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      <Wrench className="w-3 h-3 text-amber-400" /> Open Repairs
                    </div>
                    <div className={`font-extrabold text-sm ${openRepairsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {openRepairsCount} {urgentRepairsCount > 0 && <span className="text-[10px] text-rose-400 font-bold">({urgentRepairsCount} urgent)</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShip(ship);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold hover:bg-cyan-900 transition flex items-center gap-1 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500"
                >
                  View Vessel Profile & Operations <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShip(ship.id);
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                  title="Remove vessel from fleet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
