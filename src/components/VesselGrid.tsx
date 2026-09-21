import React, { useState } from 'react';
import { Vessel, VesselType, VesselStatus } from '../types/vessel';
import { Search, Filter, Compass, Fuel, Gauge, Award, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VesselGridProps {
  fleet: Vessel[];
  onSelectVessel: (vessel: Vessel) => void;
}

export const VesselGrid: React.FC<VesselGridProps> = ({ fleet, onSelectVessel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filtering logic
  const filteredFleet = fleet.filter((vessel) => {
    const matchesSearch =
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.particulars.imo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.particulars.flag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.voyage.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.voyage.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || vessel.particulars.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || vessel.voyage.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getCiiBadgeColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'B':
        return 'bg-green-950 text-green-300 border-green-700';
      case 'C':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'D':
        return 'bg-orange-950 text-orange-300 border-orange-700';
      case 'E':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: VesselStatus) => {
    switch (status) {
      case 'Underway':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/80';
      case 'In Port':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      case 'Anchored':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'Maintenance':
        return 'bg-purple-950/80 text-purple-400 border-purple-800/80';
    }
  };

  return (
    <div className="mb-8">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Managed Vessel Directory
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredFleet.length} Ships
            </span>
          </h2>
          <p className="text-xs text-slate-400">Select any vessel to inspect live engine telemetry, statutory certificates, and crew roster.</p>
        </div>

        {/* Filters & Search Input */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ship name, IMO, flag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Vessel Types</option>
            <option value="Container Ship">Container Ships</option>
            <option value="Oil Tanker">Oil Tankers</option>
            <option value="Bulk Carrier">Bulk Carriers</option>
            <option value="LNG Carrier">LNG Carriers</option>
            <option value="Offshore Support">Offshore Support</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Underway">Underway</option>
            <option value="In Port">In Port</option>
            <option value="Anchored">Anchored</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Vessel Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFleet.map((vessel) => {
          const expiredCerts = vessel.certificates.filter((c) => c.status === 'expired').length;
          const expiringCerts = vessel.certificates.filter((c) => c.status === 'expiring').length;

          return (
            <div
              key={vessel.id}
              onClick={() => onSelectVessel(vessel)}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col group"
            >
              {/* Card Image Header */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={vessel.image}
                  alt={vessel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Status Pill & Flag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${getStatusBadge(vessel.voyage.status)}`}>
                    {vessel.voyage.status}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md text-xs font-medium text-slate-200">
                    <span>🇲🇿</span>
                    <span>{vessel.particulars.flag}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-400 transition">
                      {vessel.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {vessel.particulars.type} • {vessel.particulars.imo}
                    </p>
                  </div>

                  {/* CII Rating Badge */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">CII Rating</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getCiiBadgeColor(vessel.ciiRating)}`}>
                      Grade {vessel.ciiRating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {/* Voyage Route */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" /> Voyage Route
                    </span>
                    <span className="font-bold text-slate-200">
                      {vessel.voyage.status === 'Underway' ? `${vessel.voyage.speedKnots} knots` : vessel.voyage.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-100 flex items-center justify-between gap-2">
                    <span className="truncate">{vessel.voyage.origin.split(' ')[0]}</span>
                    <span className="text-cyan-400">→</span>
                    <span className="truncate">{vessel.voyage.destination.split(' ')[0]}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
                    <span>ETA: {vessel.voyage.eta.split(' ')[0]}</span>
                    <span>Dist: {vessel.voyage.distanceToGoNm} NM</span>
                  </div>
                </div>

                {/* Key Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <div className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-cyan-400" /> Main Engine Load
                    </div>
                    <div className="font-bold text-white mt-0.5">{vessel.telemetry.engineLoadPct}% ({vessel.telemetry.engineRpm} RPM)</div>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <div className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" /> Fuel HFO / MGO
                    </div>
                    <div className="font-bold text-white mt-0.5">
                      {(vessel.telemetry.hfoFuelTonsPerDay + vessel.telemetry.mgoFuelTonsPerDay).toFixed(1)} t/day
                    </div>
                  </div>
                </div>

                {/* Certificate & Compliance Alert status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {expiredCerts > 0 ? (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> {expiredCerts} Expired Cert
                      </span>
                    ) : expiringCerts > 0 ? (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> {expiringCerts} Expiring Cert
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Class Compliant
                      </span>
                    )}
                  </div>

                  <span className="text-cyan-400 group-hover:translate-x-1 transition font-bold flex items-center gap-0.5">
                    View Details <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
