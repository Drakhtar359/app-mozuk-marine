import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Anchor, ArrowLeft, Building2, Ship as ShipIcon, Search, AlertCircle } from 'lucide-react';
import { Ship } from '../types/vessel';

interface NotFoundPageProps {
  onGoHome: () => void;
  onGoToCompanyProfile: () => void;
  ships?: Ship[];
  onSelectShip?: (ship: Ship) => void;
  attemptedPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onGoToCompanyProfile,
  ships = [],
  onSelectShip,
  attemptedPath,
}) => {
  const currentPath = attemptedPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

  return (
    <div className="py-12 md:py-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4">
      {/* 404 Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full mozuk-glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[var(--color-glass-border)] shadow-2xl"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#28ada4]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#7b0b76]/5 blur-3xl pointer-events-none" />

        {/* Nautical Radar / Compass Animation */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#28ada4]/30 animate-ping pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-[#7b0b76]/30 pointer-events-none" />
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] flex items-center justify-center shadow-lg relative z-10">
            <Compass className="w-10 h-10 text-[#28ada4]" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7b0b76]/15 border border-[#7b0b76]/35 text-[#7b0b76] text-xs font-extrabold uppercase tracking-wider mb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Coordinates Lost • 404 Error</span>
        </div>

        {/* 404 Big Heading */}
        <h1 className="font-['Space_Grotesk',sans-serif] font-black text-6xl md:text-8xl tracking-tight text-[var(--text-main)] mb-3">
          4<span className="text-[#28ada4]">0</span>4
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-3">
          Vessel Course Not Found
        </h2>

        <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed mb-6">
          The waypoint, IMO registry number, or fleet directory page you are attempting to locate is not charting in our marine system or may have changed course.
        </p>

        {/* Attempted Path Box */}
        {currentPath && currentPath !== '/' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] font-mono text-xs text-[var(--text-muted)] mb-8">
            <Anchor className="w-3.5 h-3.5 text-[#7b0b76] shrink-0" />
            <span>Uncharted Route:</span>
            <code className="text-[var(--text-main)] font-bold">{currentPath}</code>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onGoHome}
            className="px-6 py-3 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Fleet Directory
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onGoToCompanyProfile}
            className="px-6 py-3 rounded-full btn-mozuk-secondary font-bold text-xs flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-[#28ada4]" /> Company Profile
          </motion.button>
        </div>

        {/* Registered Fleet Quick Shortcuts */}
        {ships.length > 0 && onSelectShip && (
          <div className="mt-10 pt-8 border-t border-[var(--color-glass-border)] text-left">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Or navigate directly to an active vessel in the fleet:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ships.slice(0, 6).map((ship) => (
                <button
                  key={ship.id}
                  onClick={() => onSelectShip(ship)}
                  className="bg-[var(--color-bg)] hover:bg-[var(--color-surface)] border border-[var(--color-glass-border)] hover:border-[#28ada4] rounded-xl p-3 text-left transition group cursor-pointer flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-[var(--text-main)] truncate group-hover:text-[#28ada4] transition">
                      {ship.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                      IMO: {ship.imo || 'N/A'} • {ship.type || 'Vessel'}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#7b0b76] text-white shrink-0 group-hover:scale-105 transition-transform">
                    <ShipIcon className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
