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
      <div className="mozuk-glass-card rounded-2xl p-12 text-center text-[var(--text-muted)] my-6">
        <ShipIcon className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3" />
        <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-lg mb-1">
          No Vessels Registered in Fleet
        </h3>
        <p className="text-xs max-w-md mx-auto">
          Click the <strong className="text-[var(--color-primary)]">"+ Register Vessel"</strong> button above to add a ship to your Mozuk Marine fleet portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
          <Anchor className="w-5 h-5 text-[var(--color-primary)]" />
          Registered Fleet Directory
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-bg-alt)] text-[var(--text-muted)] font-semibold border border-[var(--color-glass-border)]">
            {ships.length} {ships.length === 1 ? 'Vessel' : 'Vessels'}
          </span>
        </h2>
        <span className="text-xs text-[var(--text-muted)] hidden sm:inline">Select a vessel to view its profile, crew & maintenance</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ships.map((ship) => {
          const openRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed').length;
          const urgentRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed' && m.priority === 'urgent').length;

          return (
            <div
              key={ship.id}
              onClick={() => onSelectShip(ship)}
              className="mozuk-glass-card rounded-2xl p-5 transition cursor-pointer group flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition">
                        {ship.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-mono text-[var(--color-primary)] font-bold text-xs">
                        {ship.imo}
                      </span>
                      {ship.flag && (
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[var(--text-muted)] font-medium text-xs">
                          🇲🇿 {ship.flag}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-3 mt-1.5 flex-wrap">
                      {ship.type && (
                        <span className="text-[var(--text-main)] font-semibold">{ship.type}</span>
                      )}
                      {ship.builtYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[var(--text-dim)]" /> Built {ship.builtYear}
                        </span>
                      )}
                      {ship.grossTonnage && (
                        <span className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-[var(--text-dim)]" /> {ship.grossTonnage.toLocaleString()} GT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations Summary Badges */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  {/* Crew Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase mb-0.5">
                      <Users className="w-3 h-3 text-[var(--color-primary)]" /> Crew
                    </div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-sm">
                      {ship.crew.length} <span className="text-[10px] text-[var(--text-muted)] font-normal">Members</span>
                    </div>
                  </div>

                  {/* Documents Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase mb-0.5">
                      <FileCheck className="w-3 h-3 text-emerald-400" /> Documents
                    </div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-sm">
                      {ship.documents.length} <span className="text-[10px] text-[var(--text-muted)] font-normal">Certs</span>
                    </div>
                  </div>

                  {/* Maintenance Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase mb-0.5">
                      <Wrench className="w-3 h-3 text-amber-400" /> Open Repairs
                    </div>
                    <div className={`font-['Space_Grotesk',sans-serif] font-extrabold text-sm ${openRepairsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {openRepairsCount} {urgentRepairsCount > 0 && <span className="text-[10px] text-rose-400 font-bold">({urgentRepairsCount} urgent)</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-glass-border)] text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShip(ship);
                  }}
                  className="px-3.5 py-1.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1"
                >
                  View Vessel Profile & Operations <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShip(ship.id);
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border border-rose-800/40 transition"
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
