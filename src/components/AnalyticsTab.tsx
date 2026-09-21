import React from 'react';
import { Vessel } from '../types/vessel';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Award, Fuel, ShieldCheck } from 'lucide-react';

interface AnalyticsTabProps {
  fleet: Vessel[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ fleet }) => {
  // Fuel consumption dataset
  const fuelData = fleet.map((v) => ({
    name: v.name.replace('Mozuk ', ''),
    HFO: v.telemetry.hfoFuelTonsPerDay,
    MGO: v.telemetry.mgoFuelTonsPerDay,
    Total: v.telemetry.hfoFuelTonsPerDay + v.telemetry.mgoFuelTonsPerDay,
  }));

  // CII Rating Distribution
  const ciiCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  fleet.forEach((v) => {
    ciiCounts[v.ciiRating] = (ciiCounts[v.ciiRating] || 0) + 1;
  });

  const ciiPieData = [
    { name: 'Grade A (Excellent)', value: ciiCounts.A, color: '#34d399' },
    { name: 'Grade B (Good)', value: ciiCounts.B, color: '#4ade80' },
    { name: 'Grade C (Moderate)', value: ciiCounts.C, color: '#fbbf24' },
    { name: 'Grade D (Action Req.)', value: ciiCounts.D, color: '#fb923c' },
    { name: 'Grade E (Non-Compliant)', value: ciiCounts.E, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  // Speed vs Fuel curve sample data
  const speedCurveData = [
    { speed: 10, fuelTons: 18 },
    { speed: 12, fuelTons: 26 },
    { speed: 14, fuelTons: 36 },
    { speed: 16, fuelTons: 48 },
    { speed: 18, fuelTons: 64 },
    { speed: 20, fuelTons: 85 },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Analytics Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Fleet Performance & CII Environmental Analytics
        </h2>
        <p className="text-xs text-slate-400">
          Monitor fuel efficiency, IMO Carbon Intensity Indicator (CII) compliance ratings, and emissions across your fleet.
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Fuel Burn Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-400" /> Daily Fuel Consumption by Vessel (t/day)
              </h3>
              <p className="text-xs text-slate-400">HFO vs MGO breakdown</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="HFO" fill="#f59e0b" name="Heavy Fuel Oil (t/d)" stackId="a" />
                <Bar dataKey="MGO" fill="#10b981" name="Marine Gas Oil (t/d)" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. CII Rating Distribution Pie Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" /> IMO CII Rating Fleet Distribution
              </h3>
              <p className="text-xs text-slate-400">Carbon Intensity Indicator rating breakdown</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ciiPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(' ')[0]}: ${value}`}
                >
                  {ciiPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Speed vs Fuel Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Speed vs Fuel Rate Efficiency Curve
              </h3>
              <p className="text-xs text-slate-400">Optimizing speed for eco-speed vs charter speed balance</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              Eco-Speed: 14.5 Knots
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedCurveData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="speed" stroke="#64748b" fontSize={11} unit=" kts" />
                <YAxis stroke="#64748b" fontSize={11} unit=" t/d" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="fuelTons" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: '#38bdf8' }} name="Fuel Rate (Tons/Day)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
