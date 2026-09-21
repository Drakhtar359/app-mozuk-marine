import React from 'react';
import { Ship, Navigation, Anchor, Wrench, AlertTriangle, Fuel, Gauge } from 'lucide-react';
import { Vessel, AlertNotification } from '../types/vessel';

interface FleetOverviewCardProps {
  fleet: Vessel[];
  alerts: AlertNotification[];
}

export const FleetOverviewCard: React.FC<FleetOverviewCardProps> = ({ fleet, alerts }) => {
  const totalShips = fleet.length;
  const underwayCount = fleet.filter((v) => v.voyage.status === 'Underway').length;
  const inPortCount = fleet.filter((v) => v.voyage.status === 'In Port' || v.voyage.status === 'Anchored').length;
  const maintenanceCount = fleet.filter((v) => v.voyage.status === 'Maintenance').length;
  const totalDwt = fleet.reduce((acc, v) => acc + v.particulars.deadweightTons, 0);

  const totalDailyFuel = fleet.reduce(
    (acc, v) => acc + v.telemetry.hfoFuelTonsPerDay + v.telemetry.mgoFuelTonsPerDay,
    0
  );

  const criticalAlertsCount = alerts.filter((a) => a.severity === 'critical' || a.severity === 'warning').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 1. Total Fleet */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Fleet</span>
          <div className="p-2 rounded-lg bg-cyan-950/70 text-cyan-400">
            <Ship className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-white">{totalShips} <span className="text-xs text-slate-400 font-normal">vessels</span></div>
          <div className="text-xs text-cyan-400 font-medium mt-0.5">{(totalDwt / 1000).toFixed(0)}k total DWT</div>
        </div>
      </div>

      {/* 2. Underway / At Sea */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Underway</span>
          <div className="p-2 rounded-lg bg-blue-950/70 text-blue-400">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-white">{underwayCount}</div>
          <div className="text-xs text-blue-400 font-medium mt-0.5">Active Transit</div>
        </div>
      </div>

      {/* 3. In Port / Anchored */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">In Port / Anchor</span>
          <div className="p-2 rounded-lg bg-emerald-950/70 text-emerald-400">
            <Anchor className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-white">{inPortCount}</div>
          <div className="text-xs text-emerald-400 font-medium mt-0.5">Cargo ops / Waiting</div>
        </div>
      </div>

      {/* 4. Maintenance */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Drydock / Repair</span>
          <div className="p-2 rounded-lg bg-purple-950/70 text-purple-400">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-white">{maintenanceCount}</div>
          <div className="text-xs text-purple-400 font-medium mt-0.5">Scheduled works</div>
        </div>
      </div>

      {/* 5. Daily Fuel Burn */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Fleet Fuel Rate</span>
          <div className="p-2 rounded-lg bg-amber-950/70 text-amber-400">
            <Fuel className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-white">{totalDailyFuel.toFixed(1)} <span className="text-xs text-slate-400 font-normal">t/day</span></div>
          <div className="text-xs text-amber-400 font-medium mt-0.5">HFO + MGO blend</div>
        </div>
      </div>

      {/* 6. Compliance Alerts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-rose-500/50 transition">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Compliance Alerts</span>
          <div className="p-2 rounded-lg bg-rose-950/70 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-rose-400">{criticalAlertsCount}</div>
          <div className="text-xs text-rose-400/80 font-medium mt-0.5">Action items pending</div>
        </div>
      </div>
    </div>
  );
};
