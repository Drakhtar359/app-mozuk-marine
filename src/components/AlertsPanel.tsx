import React from 'react';
import { AlertNotification } from '../types/vessel';
import { X, ShieldAlert, AlertTriangle, Info, Check, BellOff } from 'lucide-react';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectVesselById: (vesselId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectVesselById,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base">Fleet Alerts & Compliance</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BellOff className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="font-medium">No active alerts for your fleet.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition ${
                  alert.read
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : alert.severity === 'critical'
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                    : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <button
                      onClick={() => {
                        onSelectVesselById(alert.vesselId);
                        onClose();
                      }}
                      className="font-bold text-xs text-white hover:text-cyan-400 underline decoration-dashed"
                    >
                      {alert.vesselName}
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400">{alert.timestamp.split(' ')[0]}</span>
                </div>

                <p className="text-xs font-medium mt-1 text-slate-200">{alert.message}</p>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{alert.category}</span>
                  {!alert.read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <Check className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
