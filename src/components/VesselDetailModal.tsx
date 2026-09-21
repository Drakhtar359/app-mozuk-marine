import React, { useState } from 'react';
import { Vessel } from '../types/vessel';
import {
  X,
  Ship,
  Gauge,
  Compass,
  FileCheck,
  Users,
  Wrench,
  Fuel,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  Flame,
  Thermometer,
} from 'lucide-react';

interface VesselDetailModalProps {
  vessel: Vessel | null;
  onClose: () => void;
}

export const VesselDetailModal: React.FC<VesselDetailModalProps> = ({ vessel, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'specs' | 'telemetry' | 'voyage' | 'certificates' | 'crew' | 'maintenance'
  >('specs');

  if (!vessel) return null;

  const { particulars, voyage, telemetry, certificates, crew, workOrders } = vessel;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 bg-slate-950 shrink-0 overflow-hidden">
          <img
            src={vessel.image}
            alt={vessel.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Metadata */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs uppercase">
                  {particulars.type}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs">
                  {particulars.flag} ({particulars.imo})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{vessel.name}</h1>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-2 mt-0.5">
                <span>Call Sign: {particulars.callSign}</span> • <span>MMSI: {particulars.mmsi}</span> • <span>Built {particulars.builtYear}</span>
              </p>
            </div>

            {/* CII Rating & Status */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right">
                <div className="text-[10px] uppercase text-slate-400 font-bold">CII Rating</div>
                <div className="text-sm font-extrabold text-cyan-400">Grade {vessel.ciiRating}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Voyage Status</div>
                <div className="text-sm font-extrabold text-emerald-400">{voyage.status}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto shrink-0 px-6">
          {[
            { id: 'specs', label: 'Particulars & Specs', icon: Ship },
            { id: 'telemetry', label: 'Engine Telemetry', icon: Gauge },
            { id: 'voyage', label: 'Voyage Navigation', icon: Compass },
            { id: 'certificates', label: `Certificates (${certificates.length})`, icon: FileCheck },
            { id: 'crew', label: `Crew Roster (${crew.length})`, icon: Users },
            { id: 'maintenance', label: `Work Orders (${workOrders.length})`, icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-xs whitespace-nowrap transition ${
                  isActive
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-300">
          {/* TAB 1: Particulars & Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="font-bold text-sm text-cyan-400 border-b border-slate-800 pb-2">
                  Identity & Registry
                </h3>
                <div className="flex justify-between"><span className="text-slate-400">IMO Number:</span> <span className="font-bold text-white">{particulars.imo}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">MMSI:</span> <span className="font-bold text-white">{particulars.mmsi}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Call Sign:</span> <span className="font-bold text-white">{particulars.callSign}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Flag State:</span> <span className="font-bold text-white">{particulars.flag}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Class Society:</span> <span className="font-bold text-cyan-300">{particulars.classificationSociety}</span></div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="font-bold text-sm text-cyan-400 border-b border-slate-800 pb-2">
                  Dimensions & Tonnage
                </h3>
                <div className="flex justify-between"><span className="text-slate-400">Length Overall (LOA):</span> <span className="font-bold text-white">{particulars.lengthOverallMeters} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Beam / Width:</span> <span className="font-bold text-white">{particulars.beamMeters} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Max Summer Draft:</span> <span className="font-bold text-white">{particulars.maxDraftMeters} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Deadweight Tonnage (DWT):</span> <span className="font-bold text-white">{particulars.deadweightTons.toLocaleString()} MT</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Gross Tonnage (GT):</span> <span className="font-bold text-white">{particulars.grossTonnage.toLocaleString()} GT</span></div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="font-bold text-sm text-cyan-400 border-b border-slate-800 pb-2">
                  Build & Yard Info
                </h3>
                <div className="flex justify-between"><span className="text-slate-400">Year Built:</span> <span className="font-bold text-white">{particulars.builtYear}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Shipbuilder:</span> <span className="font-medium text-slate-200">{particulars.shipyard}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Vessel Category:</span> <span className="font-bold text-cyan-300">{particulars.type}</span></div>
              </div>
            </div>
          )}

          {/* TAB 2: Engine Telemetry */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Engine Load */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="font-semibold flex items-center gap-1.5"><Gauge className="w-4 h-4 text-cyan-400" /> Main Engine Load</span>
                    <span className="font-extrabold text-white text-base">{telemetry.engineLoadPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${telemetry.engineLoadPct}%` }}></div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                    <span>Engine RPM: <strong className="text-white">{telemetry.engineRpm} RPM</strong></span>
                    <span>Generator: <strong className="text-white">{telemetry.generatorLoadPct}%</strong></span>
                  </div>
                </div>

                {/* HFO Fuel Tank */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="font-semibold flex items-center gap-1.5"><Fuel className="w-4 h-4 text-amber-400" /> Heavy Fuel Oil (HFO)</span>
                    <span className="font-extrabold text-white text-base">{telemetry.hfoTankPct}% Tank</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${telemetry.hfoTankPct}%` }}></div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                    <span>Burn Rate: <strong className="text-white">{telemetry.hfoFuelTonsPerDay} t/day</strong></span>
                  </div>
                </div>

                {/* MGO Fuel Tank */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="font-semibold flex items-center gap-1.5"><Fuel className="w-4 h-4 text-emerald-400" /> Marine Gas Oil (MGO)</span>
                    <span className="font-extrabold text-white text-base">{telemetry.mgoTankPct}% Tank</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${telemetry.mgoTankPct}%` }}></div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                    <span>Burn Rate: <strong className="text-white">{telemetry.mgoFuelTonsPerDay} t/day</strong></span>
                  </div>
                </div>
              </div>

              {/* Machinery Temperatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-orange-950/60 text-orange-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Main Engine Lube Oil Temp</div>
                      <div className="text-[11px] text-slate-400">Normal range: 60°C - 72°C</div>
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white">{telemetry.lubeOilTempC}°C</div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-950/60 text-blue-400">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Jacket Cooling Water Temp</div>
                      <div className="text-[11px] text-slate-400">Normal range: 75°C - 85°C</div>
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white">{telemetry.coolingWaterTempC}°C</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Voyage Navigation */}
          {activeTab === 'voyage' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-bold text-sm text-cyan-400 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Current Active Passage & Waypoints
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Port of Origin</div>
                    <div className="font-extrabold text-base text-white mt-1">{voyage.origin}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Departed: {voyage.departureTime}</div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{voyage.speedKnots} KNOTS @ {voyage.headingDegrees}°</div>
                    <div className="w-full flex items-center my-2">
                      <div className="h-0.5 bg-slate-700 flex-1"></div>
                      <div className="px-2 py-1 bg-cyan-950 text-cyan-400 rounded border border-cyan-800 font-extrabold text-xs">
                        {voyage.status}
                      </div>
                      <div className="h-0.5 bg-slate-700 flex-1"></div>
                    </div>
                    <div className="text-[11px] text-slate-400">Remaining: {voyage.distanceToGoNm} NM</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Destination Port</div>
                    <div className="font-extrabold text-base text-white mt-1">{voyage.destination}</div>
                    <div className="text-[11px] text-emerald-400 font-bold mt-0.5">Estimated Arrival: {voyage.eta}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-xs mb-1">GPS Coordinates</div>
                  <div className="font-mono text-base font-bold text-white">{voyage.latitude.toFixed(4)}° N, {voyage.longitude.toFixed(4)}° E</div>
                </div>
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                  <div className="text-slate-400 text-xs mb-1">Sea State & Weather</div>
                  <div className="font-bold text-base text-slate-200">{voyage.seaState}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Certificates */}
          {activeTab === 'certificates' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-white">Statutory & Class Certificates</h3>
                <span className="text-xs text-slate-400">Enforced by IMO & Flag State Administration</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Certificate Name</th>
                      <th className="py-3 px-4">Code / No.</th>
                      <th className="py-3 px-4">Issuing Authority</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white">{cert.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{cert.code}</td>
                        <td className="py-3 px-4 text-slate-300">{cert.authority}</td>
                        <td className="py-3 px-4 text-slate-300">{cert.expiryDate}</td>
                        <td className="py-3 px-4 text-right">
                          {cert.status === 'valid' && (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                              VALID
                            </span>
                          )}
                          {cert.status === 'expiring' && (
                            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold text-[10px]">
                              EXPIRING SOON
                            </span>
                          )}
                          {cert.status === 'expired' && (
                            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold text-[10px]">
                              EXPIRED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Crew Roster */}
          {activeTab === 'crew' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Active Manning Complement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {crew.map((member, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{member.name}</div>
                      <div className="text-xs text-cyan-400 font-semibold">{member.role}</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>Nationality: <strong className="text-slate-200">{member.nationality}</strong></div>
                      <div>Sign-on: <strong className="text-slate-200">{member.signOnDate}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Maintenance Work Orders */}
          {activeTab === 'maintenance' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white">Planned Maintenance & Defect Log</h3>
              {workOrders.length === 0 ? (
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No pending machinery or hull work orders registered.
                </div>
              ) : (
                <div className="space-y-2">
                  {workOrders.map((wo) => (
                    <div key={wo.id} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${wo.priority === 'high' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'}`}>
                            {wo.priority.toUpperCase()} PRIORITY
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{wo.category}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{wo.title}</h4>
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-slate-400">Due: <strong className="text-slate-200">{wo.dueDate}</strong></div>
                        <div className="mt-1 font-bold text-amber-400">{wo.status.replace('_', ' ').toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
