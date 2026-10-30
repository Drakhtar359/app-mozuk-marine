import React from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome?: () => void;
  onGoToCompanyProfile?: () => void;
  attemptedPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <div className="py-12 md:py-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
      {/* 404 Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full mozuk-glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[var(--color-glass-border)] shadow-2xl"
      >
        {/* Subtle decorative background glow circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#28ada4]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#7b0b76]/5 blur-3xl pointer-events-none" />

        {/* Nautical Radar / Compass Animation with perfectly circular matching container */}
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          {/* Outer radar ping ring */}
          <div className="absolute inset-0 rounded-full border border-[#28ada4]/40 animate-ping pointer-events-none" />
          {/* Concentric radar rings */}
          <div className="absolute -inset-1 rounded-full border border-[#28ada4]/20 pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-[#7b0b76]/35 pointer-events-none" />
          {/* Center circular icon badge - rounded-full to avoid square corners covering the circle */}
          <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-glass-border)] flex items-center justify-center shadow-lg relative z-10">
            <Compass className="w-10 h-10 text-[#28ada4]" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7b0b76]/15 border border-[#7b0b76]/35 text-[#7b0b76] text-xs font-extrabold uppercase tracking-wider mb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Coordinates Lost • 404 Error</span>
        </div>

        {/* 404 Big Heading */}
        <h1 className="font-['Montserrat',sans-serif] font-black text-6xl md:text-8xl tracking-tight text-[var(--text-main)] mb-3">
          4<span className="text-[#28ada4]">0</span>4
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-3">
          Vessel Course Not Found
        </h2>

        <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
          The waypoint, IMO registry number, or fleet directory page you are attempting to locate is not charting in our marine system or may have changed course.
        </p>
      </motion.div>
    </div>
  );
};
