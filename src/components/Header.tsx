import React from 'react';
import { Anchor, ShieldAlert, Bell, Radio, UserCheck, RefreshCw, Compass } from 'lucide-react';
import { AlertNotification } from '../types/vessel';

interface HeaderProps {
  alerts: AlertNotification[];
  selectedRole: string;
  onSelectRole: (role: string) => void;
  onToggleAlerts: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  selectedRole,
  onSelectRole,
  onToggleAlerts,
  isSimulating,
  onToggleSimulation,
}) => {
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
            <Anchor className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                MOZUK <span className="text-cyan-400">MARINE</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                PORTAL 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> Fleet Overview & AIS Real-Time Telemetry
            </p>
          </div>
        </div>

        {/* Right Section: Telemetry Indicator, Role Switcher, Alerts, Simulation */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Telemetry Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Radio className={`w-4 h-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-slate-300 font-medium">AIS Telemetry:</span>
            <span className={isSimulating ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
              {isSimulating ? 'LIVE STREAMING' : 'PAUSED'}
            </span>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isSimulating
                ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : ''}`} />
            {isSimulating ? 'Simulating' : 'Start Simulation'}
          </button>

          {/* Role Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['Fleet Manager', 'Ship Owner', 'Chief Engineer'].map((role) => (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  selectedRole === role
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Notifications / Alerts Button */}
          <button
            onClick={onToggleAlerts}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="View Fleet Alerts"
          >
            {unreadAlertsCount > 0 ? (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            ) : (
              <Bell className="w-5 h-5 text-slate-300" />
            )}
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center animate-bounce shadow">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
