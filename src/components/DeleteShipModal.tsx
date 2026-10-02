import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship } from '../types/vessel';
import { AlertTriangle, Trash2, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DeleteShipModalProps {
  isOpen: boolean;
  ship: Ship | null;
  onClose: () => void;
  onConfirmDelete: (shipId: string) => void;
}

export const DeleteShipModal: React.FC<DeleteShipModalProps> = ({
  isOpen,
  ship,
  onClose,
  onConfirmDelete,
}) => {
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const [isCompleted, setIsCompleted] = useState(false);
  const isHoldingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION = 5000; // 5 seconds in milliseconds

  // Reset state when modal opens or closes
  useEffect(() => {
    setHoldProgress(0);
    setIsCompleted(false);
    isHoldingRef.current = false;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isOpen, ship]);

  const handleStartHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isCompleted) return;

    isHoldingRef.current = true;
    const startTime = Date.now();

    const updateProgress = () => {
      if (!isHoldingRef.current) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(progress);

      if (elapsed >= HOLD_DURATION) {
        isHoldingRef.current = false;
        setIsCompleted(true);
        if (ship) {
          onConfirmDelete(ship.id);
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const handleStopHold = () => {
    if (isCompleted) return;
    isHoldingRef.current = false;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setHoldProgress(0);
  };

  if (!isOpen || !ship) return null;

  const secondsRemaining = Math.max(0, ((HOLD_DURATION - (holdProgress / 100) * HOLD_DURATION) / 1000)).toFixed(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleStopHold}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative z-10 bg-[var(--color-bg-alt)] border border-rose-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-rose-950/20 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                    Delete Vessel Profile
                  </h3>
                  <p className="text-[11px] text-rose-400 font-bold">
                    {ship.name} ({ship.imo})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleStopHold();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-500 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Warning: Permanent Deletion
                </div>
                <p className="text-[var(--text-main)] font-semibold leading-relaxed">
                  Are you sure you want to delete the ship? All data associated with the vessel will be permanently deleted.
                </p>
              </div>

              <div className="text-xs text-[var(--text-muted)] space-y-1 bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-glass-border)] font-mono">
                <div className="flex justify-between">
                  <span>Vessel Name:</span>
                  <strong className="text-[var(--text-main)]">{ship.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>IMO Number:</span>
                  <strong className="text-[var(--text-main)]">{ship.imo}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Crew:</span>
                  <strong className="text-[var(--text-main)]">{ship.crew.length} personnel</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tech Certificates:</span>
                  <strong className="text-[var(--text-main)]">{ship.documents.length} docs</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer with Cancel & 5-Second Hold-to-Delete Slider Button */}
            <div className="px-6 py-4 bg-[var(--color-surface)] border-t border-[var(--color-glass-border)] flex items-center justify-end gap-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  handleStopHold();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-full btn-mozuk-secondary font-bold text-xs"
              >
                Cancel
              </button>

              {/* Press & Hold 5s Delete Button with Left-to-Right Slider Fill */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={handleStartHold}
                  onMouseUp={handleStopHold}
                  onMouseLeave={handleStopHold}
                  onTouchStart={handleStartHold}
                  onTouchEnd={handleStopHold}
                  onTouchCancel={handleStopHold}
                  onPointerDown={handleStartHold}
                  onPointerUp={handleStopHold}
                  onPointerLeave={handleStopHold}
                  onPointerCancel={handleStopHold}
                  className={`relative overflow-hidden px-6 py-2.5 rounded-full font-extrabold text-xs transition-all flex items-center gap-2 select-none cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : holdProgress > 0
                      ? 'bg-rose-950 text-white border border-rose-500 shadow-lg scale-[1.02]'
                      : 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500 shadow-md'
                  }`}
                >
                  {/* Left-to-Right Slider Fill Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 transition-all duration-75 pointer-events-none"
                    style={{ width: `${holdProgress}%` }}
                  />

                  {/* Button Content */}
                  <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                        <span>Deleted!</span>
                      </>
                    ) : holdProgress > 0 ? (
                      <>
                        <Trash2 className="w-4 h-4 animate-pulse" />
                        <span>Hold for {secondsRemaining}s... ({Math.round(holdProgress)}%)</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Hold 5s to Delete</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
