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
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  UserPlus,
  X,
  UserCheck,
  Wrench,
  FileCheck,
  BookOpen,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedShips, setCollapsedShips] = useState<Record<string, boolean>>({});
  const [addingEmployeeForShipId, setAddingEmployeeForShipId] = useState<string | null>(null);

  const employees = ownerDetails.employees || [];

  // Default all-fleet access for senior operations staff if not configured yet
  const employeeAccess: Record<string, string[]> = ownerDetails.employeeAccess || {
    'emp-1': ships.map((s) => s.id),
    'emp-2': ships.map((s) => s.id),
    'emp-3': ships.map((s) => s.id),
    'emp-4': ships.map((s) => s.id),
  };

  const toggleShipCollapse = (shipId: string) => {
    setCollapsedShips((prev) => ({
      ...prev,
      [shipId]: !prev[shipId],
    }));
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

  const handleGrantAllEmployeesToShip = (shipId: string) => {
    const updatedAccess = { ...employeeAccess };
    employees.forEach((emp) => {
      const current = updatedAccess[emp.id] || [];
      if (!current.includes(shipId)) {
        updatedAccess[emp.id] = [...current, shipId];
      }
    });

    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employeeAccess: updatedAccess,
      });
    }
  };

  const q = searchTerm.toLowerCase().trim();

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

      {/* Main Company Overview Banner with Logo & Edit Button (Description Removed) */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
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

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
                  {ownerDetails.companyName}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
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
            </div>
          </div>

          {/* Edit Company Details Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenEditModal}
            className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 self-start md:self-center cursor-pointer"
          >
            <Edit className="w-4 h-4" /> Edit Company Details
          </motion.button>
        </div>
      </div>

      {/* UNIFIED ACCESS MANAGEMENT TABLE (Ships as Rows, People with Access as Sub-rows) */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-glass-border)] pb-4">
          <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#28ada4]" />
            Vessel Access Management
          </h3>

          <div className="relative flex-1 sm:w-72 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search vessel or personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition shadow-sm"
            />
          </div>
        </div>

        {/* Single Structured Table with Ship Rows and Personnel Sub-rows */}
        <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3 px-3.5 w-[28%]">Vessel / Personnel</th>
                  <th className="py-3 px-3 w-[22%]">Role & Access Tier</th>
                  <th className="py-3 px-3 w-[34%]">Authorized Ship Modules</th>
                  <th className="py-3 px-3.5 w-[16%] text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {ships.map((ship) => {
                  const captain = ship.crew.find(
                    (c) =>
                      c.role.toLowerCase().includes('captain') ||
                      c.role.toLowerCase().includes('master')
                  );
                  const chiefEngineer = ship.crew.find((c) =>
                    c.role.toLowerCase().includes('chief engineer')
                  );

                  const assignedEmployees = employees.filter((emp) =>
                    (employeeAccess[emp.id] || []).includes(ship.id)
                  );
                  const unassignedEmployees = employees.filter(
                    (emp) => !(employeeAccess[emp.id] || []).includes(ship.id)
                  );

                  // Filter logic when searching
                  const shipMatches =
                    !q ||
                    ship.name.toLowerCase().includes(q) ||
                    ship.imo.toLowerCase().includes(q) ||
                    (ship.type || '').toLowerCase().includes(q);

                  const captainMatches =
                    !q ||
                    shipMatches ||
                    (captain &&
                      (captain.name.toLowerCase().includes(q) ||
                        captain.role.toLowerCase().includes(q))) ||
                    'captain master'.includes(q);

                  const engineerMatches =
                    !q ||
                    shipMatches ||
                    (chiefEngineer &&
                      (chiefEngineer.name.toLowerCase().includes(q) ||
                        chiefEngineer.role.toLowerCase().includes(q))) ||
                    'chief engineer'.includes(q);

                  const matchingAssignedEmployees = shipMatches
                    ? assignedEmployees
                    : assignedEmployees.filter(
                        (emp) =>
                          emp.name.toLowerCase().includes(q) ||
                          emp.position.toLowerCase().includes(q) ||
                          (emp.email && emp.email.toLowerCase().includes(q))
                      );

                  if (
                    !shipMatches &&
                    !captainMatches &&
                    !engineerMatches &&
                    matchingAssignedEmployees.length === 0
                  ) {
                    return null;
                  }

                  const isCollapsed = !!collapsedShips[ship.id] && !q;
                  const totalAccessCount = 2 + assignedEmployees.length;
                  const isAddingToThisShip = addingEmployeeForShipId === ship.id;

                  return (
                    <React.Fragment key={ship.id}>
                      {/* PARENT ROW: SHIP SECTION */}
                      <tr className="bg-[var(--color-bg-alt)]/80 hover:bg-[var(--color-bg-alt)] transition border-t-2 border-[var(--color-glass-border)]">
                        <td className="py-3 px-3.5 align-middle" colSpan={2}>
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => toggleShipCollapse(ship.id)}
                              className="p-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--text-main)] hover:text-[#28ada4] hover:border-[#28ada4]/40 transition cursor-pointer shrink-0"
                              title={isCollapsed ? 'Expand personnel rows' : 'Collapse personnel rows'}
                            >
                              {isCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#28ada4]" />
                              )}
                            </button>

                            <div className="p-2 rounded-xl bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 shrink-0">
                              <ShipIcon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  onClick={() => onSelectShip(ship)}
                                  className="font-['Montserrat',sans-serif] font-black text-sm text-[var(--text-main)] hover:text-[#28ada4] transition cursor-pointer truncate"
                                >
                                  {ship.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                                  {ship.imo}
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                                {ship.type} • Flag: {ship.flag || 'Mozambique'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 align-middle">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#28ada4]/12 border border-[#28ada4]/30 text-[#28ada4] text-[11px] font-bold">
                              <UserCheck className="w-3.5 h-3.5" />
                              {totalAccessCount} Authorized Personnel
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)] font-medium">
                              (2 Command Officers • {assignedEmployees.length} Shore Staff)
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5 align-middle text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setAddingEmployeeForShipId(isAddingToThisShip ? null : ship.id)
                              }
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                isAddingToThisShip
                                  ? 'bg-[#28ada4] text-white border-[#28ada4]'
                                  : 'bg-[var(--color-bg)] text-[#28ada4] border-[#28ada4]/40 hover:bg-[#28ada4]/15'
                              }`}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Manage Access</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* INLINE EMPLOYEE ACCESS PICKER SUB-BAR (When "Manage Access" is clicked on this ship) */}
                      {isAddingToThisShip && (
                        <tr className="bg-[#28ada4]/5 border-l-4 border-l-[#28ada4]">
                          <td colSpan={4} className="py-3 px-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-extrabold text-[var(--text-main)] mr-2">
                                  Toggle Shore Personnel for {ship.name}:
                                </span>
                                {employees.map((emp) => {
                                  const hasAccess = (employeeAccess[emp.id] || []).includes(ship.id);
                                  return (
                                    <button
                                      key={emp.id}
                                      type="button"
                                      onClick={() => handleToggleShipAccess(emp.id, ship.id)}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                                        hasAccess
                                          ? 'bg-[#28ada4] text-white border-[#28ada4] shadow-sm'
                                          : 'bg-[var(--color-bg)] text-[var(--text-muted)] border-[var(--color-glass-border)] hover:text-[var(--text-main)]'
                                      }`}
                                    >
                                      <span>{emp.name}</span>
                                      {hasAccess && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {unassignedEmployees.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleGrantAllEmployeesToShip(ship.id)}
                                    className="px-2.5 py-1 rounded-lg bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 text-[11px] font-bold hover:bg-[#28ada4]/25 transition cursor-pointer"
                                  >
                                    Grant All Staff
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setAddingEmployeeForShipId(null)}
                                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                                  title="Close"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* SUB-ROWS: PEOPLE WITH ACCESS ON THIS SHIP */}
                      {!isCollapsed && (
                        <>
                          {/* SUB-ROW 1: MASTER / CAPTAIN */}
                          {captainMatches && (
                            <tr className="bg-[var(--color-bg)]/50 hover:bg-[var(--color-glass-border)]/40 transition">
                              <td className="py-2.5 pl-9 pr-3 align-middle overflow-hidden border-l-4 border-l-[#28ada4]">
                                <div className="flex items-center gap-2">
                                  <Anchor className="w-3.5 h-3.5 text-[#28ada4] shrink-0" />
                                  <div className="min-w-0">
                                    <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                                      {captain ? captain.name : 'Pending Captain Assignment'}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                                      {captain
                                        ? `${captain.nationality} • Sign-on: ${captain.signOnDate}`
                                        : 'Vessel Master Position'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle overflow-hidden">
                                <div className="font-bold text-[#28ada4] text-xs truncate">
                                  Master / Captain
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                                  Shipboard Command
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-[#28ada4]" /> Crew Roster
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <Wrench className="w-2.5 h-2.5 text-[#28ada4]" /> Maintenance
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <FileCheck className="w-2.5 h-2.5 text-[#28ada4]" /> Certificates
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <BookOpen className="w-2.5 h-2.5 text-[#28ada4]" /> Logs & Spares
                                  </span>
                                </div>
                              </td>

                              <td className="py-2.5 px-3.5 align-middle text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28ada4]/15 border border-[#28ada4]/30 text-[#28ada4] text-[10px] font-bold">
                                  <Lock className="w-3 h-3" /> Mandatory
                                </span>
                              </td>
                            </tr>
                          )}

                          {/* SUB-ROW 2: CHIEF ENGINEER */}
                          {engineerMatches && (
                            <tr className="bg-[var(--color-bg)]/50 hover:bg-[var(--color-glass-border)]/40 transition">
                              <td className="py-2.5 pl-9 pr-3 align-middle overflow-hidden border-l-4 border-l-[#28ada4]">
                                <div className="flex items-center gap-2">
                                  <Wrench className="w-3.5 h-3.5 text-[#28ada4] shrink-0" />
                                  <div className="min-w-0">
                                    <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                                      {chiefEngineer
                                        ? chiefEngineer.name
                                        : 'Pending Chief Engineer Assignment'}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                                      {chiefEngineer
                                        ? `${chiefEngineer.nationality} • Sign-on: ${chiefEngineer.signOnDate}`
                                        : 'Chief Engineer Position'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle overflow-hidden">
                                <div className="font-bold text-[#28ada4] text-xs truncate">
                                  Chief Engineer
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                                  Shipboard Command
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <Wrench className="w-2.5 h-2.5 text-[#28ada4]" /> Machinery & Tech
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-[#28ada4]" /> Spares
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <FileCheck className="w-2.5 h-2.5 text-[#28ada4]" /> Certificates
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-semibold text-[var(--text-main)] flex items-center gap-1">
                                    <BookOpen className="w-2.5 h-2.5 text-[#28ada4]" /> Env. Logs
                                  </span>
                                </div>
                              </td>

                              <td className="py-2.5 px-3.5 align-middle text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#28ada4]/15 border border-[#28ada4]/30 text-[#28ada4] text-[10px] font-bold">
                                  <Lock className="w-3 h-3" /> Mandatory
                                </span>
                              </td>
                            </tr>
                          )}

                          {/* SUB-ROWS 3+: SHORE-BASED EMPLOYEES WITH ACCESS TO THIS SHIP */}
                          {matchingAssignedEmployees.map((emp) => (
                            <tr
                              key={`${ship.id}-${emp.id}`}
                              className="bg-[var(--color-bg)]/30 hover:bg-[var(--color-glass-border)]/40 transition"
                            >
                              <td className="py-2.5 pl-9 pr-3 align-middle overflow-hidden border-l-4 border-l-[#7b0b76]/60">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-3.5 h-3.5 text-[#28ada4] shrink-0" />
                                  <div className="min-w-0">
                                    <div className="font-bold text-[var(--text-main)] text-xs truncate">
                                      {emp.name}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                                      {emp.email || `${emp.country}${emp.city ? `, ${emp.city}` : ''}`}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle overflow-hidden">
                                <div
                                  className="font-semibold text-[var(--text-main)] text-xs truncate"
                                  title={emp.position}
                                >
                                  {emp.position}
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                                  Shore Personnel
                                </div>
                              </td>

                              <td className="py-2.5 px-3 align-middle">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-medium text-[var(--text-main)]">
                                    Vessel Dashboard
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-medium text-[var(--text-main)]">
                                    Certificates & Audits
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[10px] font-medium text-[var(--text-main)]">
                                    Crew & Maintenance
                                  </span>
                                </div>
                              </td>

                              <td className="py-2.5 px-3.5 align-middle text-right">
                                <button
                                  type="button"
                                  onClick={() => handleToggleShipAccess(emp.id, ship.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-alt)] hover:bg-[#991b1b]/15 text-[var(--text-muted)] hover:text-[#ef4444] border border-[var(--color-glass-border)] hover:border-[#991b1b]/40 text-[10px] font-bold transition cursor-pointer"
                                  title={`Revoke ${emp.name}'s access to ${ship.name}`}
                                >
                                  Revoke Access
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
