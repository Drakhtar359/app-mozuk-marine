import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShipOwnerDetails, Ship, CrewMember } from '../types/vessel';
import {
  Building2,
  Phone,
  Edit,
  ShieldCheck,
  Ship as ShipIcon,
  Search,
  CheckCircle2,
  Lock,
  Anchor,
  Wrench,
  FileCheck,
  BookOpen,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface CompanyProfilePageProps {
  ownerDetails: ShipOwnerDetails;
  ships: Ship[];
  companyCrew: CrewMember[];
  onBack: () => void;
  onOpenEditModal: () => void;
  onSelectShip: (ship: Ship) => void;
  onUpdateOwnerDetails?: (updatedDetails: ShipOwnerDetails) => void;
}

export const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({
  ownerDetails,
  ships,
  onOpenEditModal,
  onSelectShip,
  onUpdateOwnerDetails,
}) => {
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const employees = ownerDetails.employees || [];

  // Default all-fleet access for senior operations staff if not configured yet
  const employeeAccess: Record<string, string[]> = ownerDetails.employeeAccess || {
    'emp-1': ships.map((s) => s.id), // DPA
    'emp-2': ships.map((s) => s.id), // Chief Tech Superintendent
    'emp-3': ships.map((s) => s.id), // Crewing Director
    'emp-4': ships.map((s) => s.id), // Procurement Manager
  };

  const handleToggleShipAccess = (employeeId: string, shipId: string) => {
    const currentShips = employeeAccess[employeeId] || [];
    const isGranted = currentShips.includes(shipId);

    const updatedShips = isGranted
      ? currentShips.filter((id) => id !== shipId)
      : [...currentShips, shipId];

    const updatedAccess = {
      ...employeeAccess,
      [employeeId]: updatedShips,
    };

    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employeeAccess: updatedAccess,
      });
    }
  };

  const handleToggleAllFleetAccess = (employeeId: string) => {
    const currentShips = employeeAccess[employeeId] || [];
    const hasAll = currentShips.length === ships.length;

    const updatedShips = hasAll ? [] : ships.map((s) => s.id);

    const updatedAccess = {
      ...employeeAccess,
      [employeeId]: updatedShips,
    };

    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employeeAccess: updatedAccess,
      });
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = employeeSearchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      (emp.email && emp.email.toLowerCase().includes(q)) ||
      emp.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Mini-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--color-glass-border)] pb-4">
        <div>
          <h2 className="font-heading font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            Company Profile & Manager Details
          </h2>
        </div>
      </div>

      {/* Main Company Overview Banner with Logo & Edit Button */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Company Logo or Fallback Badge */}
            {ownerDetails.logoUrl ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-glass-border-hover)] p-2 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <img
                  src={ownerDetails.logoUrl}
                  alt={ownerDetails.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-[rgba(40,173,164,0.12)] text-[#28ada4] border border-[#28ada4]/30 shrink-0 shadow-sm">
                <Building2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
                  {ownerDetails.companyName}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)] pt-1">
                <span className="flex items-center gap-1.5 text-[var(--text-main)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#28ada4]" />
                  Authorized Ship Owner & Managing Agency
                </span>
                <span className="text-[var(--color-glass-border)]">•</span>
                <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                  <Globe className="w-4 h-4 text-[#28ada4]" />
                  {ownerDetails.country || 'Mozambique'}
                </span>
                <span className="text-[var(--color-glass-border)]">•</span>
                <span className="flex items-center gap-1.5 font-mono text-[var(--text-main)] font-bold">
                  <Phone className="w-4 h-4 text-[#28ada4]" />
                  {ownerDetails.phoneNumber}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-3xl pt-2">
                Primary managing entity governing vessel registrations, classification surveys, crew complement sign-ons, and technical maintenance work orders across the Mozuk Marine fleet infrastructure.
              </p>
            </div>
          </div>

          {/* Edit Company Details Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenEditModal}
            className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 self-start cursor-pointer"
          >
            <Edit className="w-4 h-4" /> Edit Company Details
          </motion.button>
        </div>
      </div>

      {/* SECTION 1: CORPORATE PERSONNEL VESSEL ACCESS MATRIX */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-glass-border)] pb-4">
          <div>
            <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#28ada4]" />
              Corporate Personnel Vessel Permissions
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Configure which ships each shore-based staff member or superintendent has visibility and management access to.
            </p>
          </div>

          <div className="relative flex-1 sm:w-64 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search employees..."
              value={employeeSearchTerm}
              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition shadow-sm"
            />
          </div>
        </div>

        {/* Employee Access Permissions Table */}
        <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-[26%]">Employee & Title</th>
                  <th className="py-2.5 px-2.5 w-[20%]">Email / Location</th>
                  <th className="py-2.5 px-3 w-[42%]">Assigned Vessel Access</th>
                  <th className="py-2.5 px-3 w-[12%] text-right">Fleet Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[var(--text-muted)]">
                      No corporate employees found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const accessibleShipIds = employeeAccess[emp.id] || [];
                    const hasAllShips = accessibleShipIds.length === ships.length;

                    return (
                      <tr key={emp.id} className="hover:bg-[var(--color-glass-border)] transition">
                        {/* Employee & Title */}
                        <td className="py-3 px-3 align-middle overflow-hidden">
                          <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5 truncate" title={emp.position}>
                            {emp.position}
                          </div>
                        </td>

                        {/* Contact & Location */}
                        <td className="py-3 px-2.5 align-middle overflow-hidden">
                          <div className="font-mono text-xs text-[var(--text-main)] truncate">
                            {emp.email || '—'}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] truncate">
                            {emp.country}{emp.city ? `, ${emp.city}` : ''}
                          </div>
                        </td>

                        {/* Vessel Access Pill Chips */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {ships.map((ship) => {
                              const isGranted = accessibleShipIds.includes(ship.id);

                              return (
                                <button
                                  key={ship.id}
                                  type="button"
                                  onClick={() => handleToggleShipAccess(emp.id, ship.id)}
                                  title={isGranted ? `Revoke ${ship.name} access` : `Grant ${ship.name} access`}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                    isGranted
                                      ? 'bg-[#28ada4]/15 border-[#28ada4]/40 text-[#28ada4] hover:bg-[#28ada4]/25 shadow-sm'
                                      : 'bg-[var(--color-bg)] border-[var(--color-glass-border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-glass-border-hover)]'
                                  }`}
                                >
                                  <ShipIcon className={`w-3 h-3 ${isGranted ? 'text-[#28ada4]' : 'opacity-40'}`} />
                                  <span className="truncate">{ship.name}</span>
                                  {isGranted && <CheckCircle2 className="w-3 h-3 text-[#28ada4] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Scope Action Button */}
                        <td className="py-3 px-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleAllFleetAccess(emp.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer shrink-0 ${
                              hasAllShips
                                ? 'bg-[#28ada4] text-white border-[#28ada4] shadow-sm'
                                : 'bg-[var(--color-bg)] text-[var(--text-muted)] border-[var(--color-glass-border)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            {hasAllShips ? 'All Fleet (Full)' : 'Custom Scope'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: CAPTAINS & CHIEF ENGINEERS MANDATORY VESSEL ACCESS */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[var(--color-glass-border)] pb-4">
          <div>
            <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#28ada4]" />
              Shipboard Command Officers: Mandatory Module Access
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
              Under standard maritime compliance (STCW & ISM Code), the appointed Master / Captain and Chief Engineer of each vessel hold non-revocable operational command access to all vessel systems and records.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#28ada4]/10 border border-[#28ada4]/30 text-xs text-[#28ada4] font-bold shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Mandatory Statutory Access Tier</span>
          </div>
        </div>

        {/* Vessel-by-Vessel Command Officers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ships.map((ship) => {
            const captain = ship.crew.find(
              (c) =>
                c.role.toLowerCase().includes('captain') ||
                c.role.toLowerCase().includes('master')
            );

            const chiefEngineer = ship.crew.find((c) =>
              c.role.toLowerCase().includes('chief engineer')
            );

            return (
              <div
                key={ship.id}
                className="mozuk-glass-card rounded-2xl p-5 border border-[var(--color-glass-border)] shadow-md space-y-4 hover:border-[var(--color-glass-border-hover)] transition"
              >
                {/* Ship Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/30 shrink-0">
                      <Anchor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Montserrat',sans-serif] font-extrabold text-sm text-[var(--text-main)]">
                        {ship.name}
                      </h4>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        {ship.imo} • Flag: {ship.flag || 'Mozambique'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectShip(ship)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--color-bg)] hover:bg-[#28ada4]/15 text-[var(--text-muted)] hover:text-[#28ada4] border border-[var(--color-glass-border)] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Ship</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Command Officers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Master / Captain */}
                  <div className="p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#28ada4] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Master / Captain
                    </div>
                    {captain ? (
                      <div>
                        <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                          {captain.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          {captain.nationality} • Sign-on: {captain.signOnDate}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#28ada4]/15 text-[#28ada4] text-[10px] font-bold mt-2">
                          <Lock className="w-2.5 h-2.5" /> Full Vessel Command
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[var(--text-muted)] italic flex items-center gap-1 pt-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#7b0b76]" />
                        Pending Captain Assignment
                      </div>
                    )}
                  </div>

                  {/* Chief Engineer */}
                  <div className="p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#28ada4] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Chief Engineer
                    </div>
                    {chiefEngineer ? (
                      <div>
                        <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                          {chiefEngineer.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                          {chiefEngineer.nationality} • Sign-on: {chiefEngineer.signOnDate}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#28ada4]/15 text-[#28ada4] text-[10px] font-bold mt-2">
                          <Lock className="w-2.5 h-2.5" /> Full Machinery & Tech
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[var(--text-muted)] italic flex items-center gap-1 pt-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#7b0b76]" />
                        Pending Engineer Assignment
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Modules Unlocked for Command Officers */}
                <div className="pt-2 border-t border-[var(--color-glass-border)]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Operational Modules Accessible to Captain & Chief Engineer:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-[var(--text-main)]">
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <CheckCircle2 className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Crew Roster & Sign-ons</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <Wrench className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Maintenance & Repairs</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <FileCheck className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Class Certificates</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <BookOpen className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Visitor Access Log</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <BookOpen className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Ballast & Sewage Logs</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg)] px-2 py-1 rounded-lg border border-[var(--color-glass-border)] truncate">
                      <CheckCircle2 className="w-3 h-3 text-[#28ada4] shrink-0" />
                      <span className="truncate">Spares Procurement</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
