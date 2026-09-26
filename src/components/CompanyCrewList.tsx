import React, { useState } from 'react';
import { CrewMember, Ship } from '../types/vessel';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import { sortByRankHierarchy, getCrewRankWeight } from '../utils/rankSort';
import { DateInput } from './DateInput';
import {
  Users,
  Search,
  Filter,
  Plus,
  Ship as ShipIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  RotateCcw,
  ArrowUpDown,
  Anchor,
  UserCheck,
  X,
  Mail,
} from 'lucide-react';

interface CompanyCrewListProps {
  companyCrew: CrewMember[];
  ships: Ship[];
  onSelectShip: (ship: Ship) => void;
  onSelectCrewMember: (crew: CrewMember) => void;
  onAddCrewMember: (newCrew: CrewMember) => void;
  onUpdateCrewMember: (updatedCrew: CrewMember) => void;
  onRemoveCrewMember: (crewId: string) => void;
}

export const CompanyCrewList: React.FC<CompanyCrewListProps> = ({
  companyCrew,
  ships,
  onSelectShip,
  onSelectCrewMember,
  onAddCrewMember,
  onUpdateCrewMember,
  onRemoveCrewMember,
}) => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [vesselFilter, setVesselFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'signOn'>('rank');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningCrew, setAssigningCrew] = useState<CrewMember | null>(null);

  // Add Crew Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Chief Officer');
  const [department, setDepartment] = useState<'master' | 'deck' | 'engine' | 'kitchen'>('deck');
  const [nationality, setNationality] = useState('British');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [seamanBookNo, setSeamanBookNo] = useState('');
  const [seamanBookExpiry, setSeamanBookExpiry] = useState('');
  const [signOnDate, setSignOnDate] = useState('');
  const [signOnLocation, setSignOnLocation] = useState('');
  const [targetShipId, setTargetShipId] = useState<string>('unassigned');

  // Quick Assignment Form States
  const [quickShipId, setQuickShipId] = useState<string>('unassigned');
  const [quickRole, setQuickRole] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickSignOnDate, setQuickSignOnDate] = useState('');
  const [quickLocation, setQuickLocation] = useState('');

  // Department Selection Auto Sync Role
  const handleDepartmentSelect = (dept: 'master' | 'deck' | 'engine' | 'kitchen') => {
    setDepartment(dept);
    if (dept === 'master') setRole('Master / Captain');
    if (dept === 'deck') setRole('Chief Officer');
    if (dept === 'engine') setRole('Chief Engineer');
    if (dept === 'kitchen') setRole('Chief Cook');
  };

  // Reset Add Form
  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('Chief Officer');
    setDepartment('deck');
    setNationality('British');
    setDateOfBirth('');
    setPassportNumber('');
    setPassportExpiry('');
    setSeamanBookNo('');
    setSeamanBookExpiry('');
    setSignOnDate('');
    setSignOnLocation('');
    setTargetShipId('unassigned');
  };

  // Submit Register New Crew Member
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedShip = ships.find((s) => s.id === targetShipId);

    const newCrew: CrewMember = {
      id: `crew-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      role: role.trim() || 'Officer',
      department,
      nationality: nationality.trim() || 'International',
      dateOfBirth: dateOfBirth ? formatDate(dateOfBirth) : undefined,
      passportNumber: passportNumber.trim() || undefined,
      passportExpiry: passportExpiry ? formatDate(passportExpiry) : undefined,
      seamanBookNo: seamanBookNo.trim() || undefined,
      seamanBookExpiry: seamanBookExpiry ? formatDate(seamanBookExpiry) : undefined,
      signOnDate: formatDate(signOnDate || getTodayDDMMYYYY()),
      signOnLocation: signOnLocation.trim() || undefined,
      assignedShipId: selectedShip ? selectedShip.id : undefined,
      assignedShipName: selectedShip ? selectedShip.name : undefined,
      vesselHistory: selectedShip
        ? [
            {
              shipName: selectedShip.name,
              role: role.trim() || 'Officer',
              startDate: formatDate(signOnDate || getTodayDDMMYYYY()),
            },
          ]
        : [],
    };

    onAddCrewMember(newCrew);
    resetForm();
    setIsAddModalOpen(false);
  };

  // Open Quick Assignment Modal
  const openAssignModal = (crew: CrewMember) => {
    setAssigningCrew(crew);
    setQuickShipId(crew.assignedShipId || 'unassigned');
    setQuickRole(crew.role);
    setQuickEmail(crew.email || '');
    setQuickSignOnDate(crew.signOnDate || getTodayDDMMYYYY());
    setQuickLocation(crew.signOnLocation || '');
  };

  // Submit Quick Assignment
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningCrew) return;

    const newShip = ships.find((s) => s.id === quickShipId);
    const prevHistory = assigningCrew.vesselHistory || [];

    let updatedHistory = [...prevHistory];

    if (newShip) {
      const activeIdx = updatedHistory.findIndex((h) => !h.endDate && h.shipName === newShip.name);
      if (activeIdx === -1) {
        updatedHistory = updatedHistory.map((h) =>
          !h.endDate ? { ...h, endDate: formatDate(quickSignOnDate || getTodayDDMMYYYY()) } : h
        );
        updatedHistory.unshift({
          shipName: newShip.name,
          role: quickRole.trim() || assigningCrew.role,
          startDate: formatDate(quickSignOnDate || getTodayDDMMYYYY()),
        });
      }
    } else {
      updatedHistory = updatedHistory.map((h) =>
        !h.endDate ? { ...h, endDate: formatDate(quickSignOnDate || getTodayDDMMYYYY()) } : h
      );
    }

    const updatedCrew: CrewMember = {
      ...assigningCrew,
      role: quickRole.trim() || assigningCrew.role,
      email: quickEmail.trim() || assigningCrew.email,
      assignedShipId: newShip ? newShip.id : undefined,
      assignedShipName: newShip ? newShip.name : undefined,
      signOnDate: formatDate(quickSignOnDate || getTodayDDMMYYYY()),
      signOnLocation: quickLocation.trim() || assigningCrew.signOnLocation,
      vesselHistory: updatedHistory,
    };

    onUpdateCrewMember(updatedCrew);
    setAssigningCrew(null);
  };

  // Filter & Sort Logic
  const filteredCrew = companyCrew.filter((crew) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = crew.name.toLowerCase().includes(q);
      const matchEmail = (crew.email || '').toLowerCase().includes(q);
      const matchRole = crew.role.toLowerCase().includes(q);
      const matchPassport = (crew.passportNumber || '').toLowerCase().includes(q);
      const matchSeaman = (crew.seamanBookNo || '').toLowerCase().includes(q);
      const matchNat = (crew.nationality || '').toLowerCase().includes(q);
      const matchShip = (crew.assignedShipName || '').toLowerCase().includes(q);

      if (!matchName && !matchEmail && !matchRole && !matchPassport && !matchSeaman && !matchNat && !matchShip) {
        return false;
      }
    }

    if (assignmentFilter === 'assigned' && !crew.assignedShipId) return false;
    if (assignmentFilter === 'unassigned' && crew.assignedShipId) return false;

    if (vesselFilter !== 'all') {
      if (vesselFilter === 'unassigned' && crew.assignedShipId) return false;
      if (vesselFilter !== 'unassigned' && crew.assignedShipId !== vesselFilter) return false;
    }

    if (departmentFilter !== 'all') {
      if (departmentFilter === 'master' && crew.department !== 'master') return false;
      if (departmentFilter === 'deck' && crew.department !== 'deck') return false;
      if (departmentFilter === 'engine' && crew.department !== 'engine') return false;
      if (departmentFilter === 'kitchen' && crew.department !== 'kitchen') return false;
    }

    return true;
  });

  // Sort Crew List
  const sortedCrew = [...filteredCrew].sort((a, b) => {
    if (sortBy === 'rank') {
      const wA = getCrewRankWeight(a.role);
      const wB = getCrewRankWeight(b.role);
      if (wA !== wB) return wA - wB;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'signOn') {
      return b.signOnDate.localeCompare(a.signOnDate);
    }
    return 0;
  });

  const assignedCount = companyCrew.filter((c) => c.assignedShipId).length;
  const unassignedCount = companyCrew.filter((c) => !c.assignedShipId).length;

  const hasActiveFilters =
    searchTerm !== '' ||
    assignmentFilter !== 'all' ||
    vesselFilter !== 'all' ||
    departmentFilter !== 'all' ||
    sortBy !== 'rank';

  const resetFilters = () => {
    setSearchTerm('');
    setAssignmentFilter('all');
    setVesselFilter('all');
    setDepartmentFilter('all');
    setSortBy('rank');
  };

  return (
    <div className="space-y-6 my-10">
      {/* SECTION HEADER & KPIS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-[rgba(0,242,254,0.1)] text-[var(--color-primary)] border border-[var(--color-glass-border)]">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] font-extrabold text-2xl text-[var(--text-main)]">
              Company Master Crew Roster
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Centralized directory of all registered officers, engineers, ratings, active vessel assignments & standby pool.
          </p>
        </div>

        {/* Action Button & Counters */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[var(--text-muted)] font-semibold">Total Crew:</span>
            <strong className="text-[var(--text-main)] font-mono text-sm">{companyCrew.length}</strong>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-xl text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">Onboard:</span>
            <strong className="text-white font-mono text-sm">{assignedCount}</strong>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl text-xs text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold">Standby:</span>
            <strong className="text-white font-mono text-sm">{unassignedCount}</strong>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Register New Crew Member
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="mozuk-glass-card rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, rank, passport or seaman book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl pl-9 pr-3.5 py-2 text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-[var(--color-primary)] transition"
            />
          </div>

          {/* Status / Assignment Filter */}
          <div>
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value as any)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Assignment Statuses</option>
              <option value="assigned">Onboard Vessel ({assignedCount})</option>
              <option value="unassigned">Unassigned / Standby ({unassignedCount})</option>
            </select>
          </div>

          {/* Specific Vessel Filter */}
          <div>
            <select
              value={vesselFilter}
              onChange={(e) => setVesselFilter(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Ships & Standby</option>
              <option value="unassigned">Unassigned Standby Pool</option>
              {ships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.crew.length} crew)
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="master">Command & Master</option>
              <option value="deck">Deck Department</option>
              <option value="engine">Engine Department</option>
              <option value="kitchen">Kitchen / Mess Dept</option>
            </select>
          </div>
        </div>

        {/* Sort & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--color-glass-border)] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Sort By:
            </span>
            <button
              onClick={() => setSortBy('rank')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                sortBy === 'rank'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Rank Hierarchy (Master → Rating)
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                sortBy === 'name'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Name (A-Z)
            </button>
            <button
              onClick={() => setSortBy('signOn')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                sortBy === 'signOn'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Recent Sign-On
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* MASTER CREW ROSTER TABLE */}
      <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-bold">
            <tr>
              <th className="py-3.5 px-4">Crew Member Name & Role</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Current Ship Assignment</th>
              <th className="py-3.5 px-4">Nationality</th>
              <th className="py-3.5 px-4">Passport & Seaman Book</th>
              <th className="py-3.5 px-4">Signed On</th>
              <th className="py-3.5 px-4 text-center">Vessels Served</th>
              <th className="py-3.5 px-4 text-right sticky right-0 bg-[var(--color-bg-alt)] z-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-glass-border)]">
            {sortedCrew.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[var(--text-muted)] text-xs">
                  <Users className="w-10 h-10 text-[var(--text-dim)] mx-auto mb-2 opacity-50" />
                  <h4 className="font-bold text-[var(--text-main)] text-sm mb-1">No Crew Members Match Criteria</h4>
                  <p>Try clearing your search term or filter parameters.</p>
                </td>
              </tr>
            ) : (
              sortedCrew.map((crew) => {
                const assignedShip = ships.find((s) => s.id === crew.assignedShipId);
                const historyCount = crew.vesselHistory ? crew.vesselHistory.length : 0;

                return (
                  <tr
                    key={crew.id}
                    className="hover:bg-[var(--color-glass-border)] transition group cursor-pointer"
                    onClick={() => onSelectCrewMember(crew)}
                    title="Click to view full crew profile"
                  >
                    {/* Name & Role (Fitted cleanly on one line) */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-400 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {crew.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[var(--text-main)] text-xs whitespace-nowrap group-hover:text-[var(--color-primary)] transition">
                            {crew.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                            <span className="font-semibold text-[11px] text-[var(--color-primary)] whitespace-nowrap">
                              {crew.role}
                            </span>
                            {crew.email && (
                              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-mono whitespace-nowrap">
                                <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                                {crew.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      {crew.department === 'master' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/60 font-bold text-[10px]">
                          COMMAND / MASTER
                        </span>
                      )}
                      {crew.department === 'deck' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-bold text-[10px]">
                          DECK DEPT
                        </span>
                      )}
                      {crew.department === 'engine' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60 font-bold text-[10px]">
                          ENGINE DEPT
                        </span>
                      )}
                      {crew.department === 'kitchen' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold text-[10px]">
                          GALLEY & MESS
                        </span>
                      )}
                      {!crew.department && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/60 font-bold text-[10px]">
                          GENERAL CREW
                        </span>
                      )}
                    </td>

                    {/* Current Ship Assignment */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      {assignedShip ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectShip(assignedShip);
                          }}
                          className="px-3 py-1 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/80 text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm group/btn"
                          title={`Click to open ${assignedShip.name} vessel profile`}
                        >
                          <ShipIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover/btn:scale-110 transition-transform" />
                          <span>{assignedShip.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/60 text-xs font-bold inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Unassigned / Standby</span>
                        </span>
                      )}
                    </td>

                    {/* Nationality */}
                    <td className="py-3.5 px-4 align-middle text-[var(--text-main)] font-semibold whitespace-nowrap">
                      {crew.nationality}
                    </td>

                    {/* Passport & Seaman Book */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap font-mono text-[11px] text-[var(--text-muted)] space-y-0.5">
                      <div>Pass: <span className="text-[var(--text-main)]">{crew.passportNumber || '—'}</span></div>
                      <div>SB: <span className="text-[var(--text-main)]">{crew.seamanBookNo || '—'}</span></div>
                    </td>

                    {/* Signed On Date */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap font-mono font-semibold text-[var(--text-main)]">
                      {formatDate(crew.signOnDate)}
                      {crew.signOnLocation && (
                        <div className="text-[10px] text-[var(--text-muted)] font-sans">{crew.signOnLocation}</div>
                      )}
                    </td>

                    {/* Vessels Served */}
                    <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-bold text-xs text-[var(--color-primary)]">
                        {historyCount} {historyCount === 1 ? 'vessel' : 'vessels'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap sticky right-0 bg-[var(--color-surface)] group-hover:bg-[var(--color-glass-border)] transition z-10">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Assign / Change Ship Button */}
                        <button
                          onClick={() => openAssignModal(crew)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-bold transition inline-flex items-center gap-1 shadow-sm"
                          title="Assign or reassign crew member to a vessel"
                        >
                          <Anchor className="w-3 h-3 text-cyan-400" />
                          <span>{crew.assignedShipId ? 'Change Ship' : 'Assign Ship'}</span>
                        </button>

                        {/* View Profile Button */}
                        <button
                          onClick={() => onSelectCrewMember(crew)}
                          className="p-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 transition inline-flex items-center"
                          title="View full crew profile"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onRemoveCrewMember(crew.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition inline-flex items-center"
                          title="Remove crew member from company roster"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: REGISTER NEW COMPANY CREW MEMBER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[var(--color-primary)]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                    Register New Crew Member to Company Roster
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Add marine officer or rating details to the master database.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Capt. Marcus Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Email Address <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. m.vance@mozukmarine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => handleDepartmentSelect(e.target.value as any)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="master">Command / Master</option>
                    <option value="deck">Deck Department</option>
                    <option value="engine">Engine Department</option>
                    <option value="kitchen">Kitchen / Mess Dept</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Rank / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Officer, Bosun, ETO"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Nationality</label>
                <input
                  type="text"
                  placeholder="e.g. British, Filipino, Greek"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Vessel Assignment Selection */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] space-y-2">
                <label className="block text-[var(--text-main)] font-bold flex items-center gap-1.5 text-xs">
                  <Anchor className="w-4 h-4 text-cyan-400" />
                  Initial Ship Assignment
                </label>
                <select
                  value={targetShipId}
                  onChange={(e) => setTargetShipId(e.target.value)}
                  className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="unassigned">Unassigned / Standby Pool (Available for future assignment)</option>
                  {ships.map((s) => (
                    <option key={s.id} value={s.id}>
                      Assign to Vessel: {s.name} ({s.type || 'Vessel'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Birth & Passport */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Date of Birth</label>
                  <DateInput
                    value={dateOfBirth}
                    onChange={(val) => setDateOfBirth(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GB-99482019"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)]"
                  />
                </div>
              </div>

              {/* Passport Expiry & Seaman Book */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Passport Expiry</label>
                  <DateInput
                    value={passportExpiry}
                    onChange={(val) => setPassportExpiry(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Seaman Book Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SB-884920"
                    value={seamanBookNo}
                    onChange={(e) => setSeamanBookNo(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)]"
                  />
                </div>
              </div>

              {/* Seaman Book Expiry & Sign-On Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Seaman Book Expiry</label>
                  <DateInput
                    value={seamanBookExpiry}
                    onChange={(val) => setSeamanBookExpiry(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On Date</label>
                  <DateInput
                    value={signOnDate}
                    onChange={(val) => setSignOnDate(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              {/* Sign On City */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On City / Port</label>
                <input
                  type="text"
                  placeholder="e.g. Rotterdam, Antwerp, Yokohama"
                  value={signOnLocation}
                  onChange={(e) => setSignOnLocation(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Crew Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK ASSIGN / CHANGE SHIP MODAL */}
      {assigningCrew && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                    Vessel Assignment Control
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">Assign {assigningCrew.name} to a fleet vessel</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningCrew(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                <div className="font-bold text-[var(--text-main)] text-sm">{assigningCrew.name}</div>
                <div className="text-[var(--color-primary)] font-semibold">{assigningCrew.role} • {assigningCrew.nationality}</div>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1.5">Select Vessel</label>
                <select
                  value={quickShipId}
                  onChange={(e) => setQuickShipId(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="unassigned">Unassign / Set to Standby Pool</option>
                  {ships.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type || 'Container Ship'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1.5">Role / Position on Vessel</label>
                <input
                  type="text"
                  value={quickRole}
                  onChange={(e) => setQuickRole(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="e.g. officer@mozukmarine.com"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1.5">Sign-On Date</label>
                <DateInput
                  value={quickSignOnDate}
                  onChange={(val) => setQuickSignOnDate(val)}
                  inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1.5">Sign-On City / Port</label>
                <input
                  type="text"
                  placeholder="e.g. Rotterdam"
                  value={quickLocation}
                  onChange={(e) => setQuickLocation(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setAssigningCrew(null)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
