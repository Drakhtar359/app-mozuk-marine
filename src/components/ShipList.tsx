import React from 'react';
import { motion } from 'framer-motion';
import { Ship } from '../types/vessel';
import { Ship as ShipIcon, Calendar, Scale, Trash2, Users, FileCheck, Wrench, ChevronRight, Anchor, Navigation, ExternalLink, Plus } from 'lucide-react';

interface ShipListProps {
  ships: Ship[];
  onSelectShip: (ship: Ship) => void;
  onRemoveShip: (shipId: string) => void;
  onRegisterVessel?: () => void;
}

export const ShipList: React.FC<ShipListProps> = ({
  ships,
  onSelectShip,
  onRemoveShip,
  onRegisterVessel,
}) => {
  if (ships.length === 0) {
    return (
      <div className="mozuk-glass-card rounded-2xl p-12 text-center text-[var(--text-muted)] my-6">
        <ShipIcon className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3 opacity-60" />
        <h3 className="font-heading font-bold text-[var(--text-main)] text-lg mb-1">
          No Vessels Registered in Fleet
        </h3>
        <p className="text-xs max-w-md mx-auto leading-relaxed mb-4">
          Register a ship to manage fleet profile, crew roster, technical documents, and work orders.
        </p>
        {onRegisterVessel && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRegisterVessel}
            className="px-4 py-2.5 rounded-full btn-mozuk-primary font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register Vessel
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
          <Anchor className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
          Registered Fleet Directory
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] hidden md:inline font-medium">Select a vessel to view its profile, crew & maintenance</span>
          {onRegisterVessel && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRegisterVessel}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Register Vessel
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ships.map((ship) => {
          const openRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed').length;
          const urgentRepairsCount = ship.maintenance.filter((m) => m.status !== 'completed' && m.priority === 'urgent').length;
          const imoDigits = ship.imo ? ship.imo.replace(/\D/g, '') : '';
          const marineTrafficUrl = imoDigits
            ? `https://www.marinetraffic.com/en/ais/details/ships/imo:${imoDigits}`
            : `https://www.marinetraffic.com/en/ais/index/ships/all/keyword:${encodeURIComponent(ship.name)}`;

          return (
            <motion.div
              key={ship.id}
              whileHover={{ y: -2, scale: 1.008 }}
              whileTap={{ scale: 0.995 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => onSelectShip(ship)}
              className="mozuk-glass-card rounded-2xl p-5 transition cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Header */}
              <div>
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Ship Type */}
                      <div className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-0.5">
                        {ship.type || 'Container Ship'}
                      </div>

                      {/* Ship Name */}
                      <h3 className="font-heading font-extrabold text-2xl text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition leading-tight">
                        {ship.name}
                      </h3>

                      {/* IMO Number */}
                      <div className="font-mono text-xs font-bold text-[var(--text-muted)] mt-1">
                        {ship.imo}
                      </div>
                    </div>

                    {/* Track Button on top right linking to MarineTraffic */}
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={marineTrafficUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold transition shrink-0 mt-0.5 shadow-sm"
                      title={`Track ${ship.name} (${ship.imo}) on MarineTraffic`}
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                      <span>Track</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </motion.a>
                  </div>

                  {/* Vessel Metadata Line */}
                  <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-3 mt-2 flex-wrap">
                    {ship.flag && (
                      <span>Flag: <strong className="text-[var(--text-main)]">{ship.flag}</strong></span>
                    )}
                    {ship.classification && (
                      <span>
                        Class: <strong className="text-[var(--text-main)]">{ship.classification}</strong>
                      </span>
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

                {/* Operations Summary Badges */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  {/* Crew Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center transition group-hover:border-[var(--color-glass-border-hover)]">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-0.5">
                      <Users className="w-3 h-3 text-[var(--color-primary)]" /> Crew
                    </div>
                    <div className="font-heading font-extrabold text-[var(--text-main)] text-sm">
                      {ship.crew.length} <span className="text-[10px] text-[var(--text-muted)] font-normal">Members</span>
                    </div>
                  </div>

                  {/* Documents Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center transition group-hover:border-[var(--color-glass-border-hover)]">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-0.5">
                      <FileCheck className="w-3 h-3 text-emerald-400" /> Documents
                    </div>
                    <div className="font-heading font-extrabold text-[var(--text-main)] text-sm">
                      {ship.documents.length} <span className="text-[10px] text-[var(--text-muted)] font-normal">Certs</span>
                    </div>
                  </div>

                  {/* Maintenance Badge */}
                  <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-2.5 text-center transition group-hover:border-[var(--color-glass-border-hover)]">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-0.5">
                      <Wrench className="w-3 h-3 text-amber-400" /> Open Repairs
                    </div>
                    <div className={`font-heading font-extrabold text-sm ${openRepairsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {openRepairsCount} {urgentRepairsCount > 0 && <span className="text-[10px] text-rose-400 font-bold">({urgentRepairsCount} urgent)</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-glass-border)] text-xs">
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShip(ship);
                  }}
                  className="px-3.5 py-1.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1"
                >
                  View Vessel Profile & Operations <ChevronRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShip(ship.id);
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border border-rose-800/40 transition"
                  title="Remove vessel from fleet"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
