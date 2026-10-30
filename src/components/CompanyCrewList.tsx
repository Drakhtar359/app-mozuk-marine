import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrewMember, Ship, VesselHistoryEntry, getEffectiveVesselHistory } from '../types/vessel';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import { sortByRankHierarchy, getCrewRankWeight, DEPARTMENT_RANKS, DepartmentType } from '../utils/rankSort';
import { DateInput } from './DateInput';
import { CrewAvatar } from './CrewAvatar';
import { CrewProfileModal } from './CrewProfileModal';
import { getCrewAvatarUrl } from '../utils/crewAvatars';
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
  Globe,
  Calendar,
  MapPin,
  BookOpen,
  Briefcase,
  History,
  ChevronLeft,
  ChevronRight,
  Phone,
  Upload,
  Camera,
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningCrew, setAssigningCrew] = useState<CrewMember | null>(null);
  const [viewingProfileCrew, setViewingProfileCrew] = useState<CrewMember | null>(null);

  const sortVesselHistory = (history: VesselHistoryEntry[]) => {
    return [...history].sort((a, b) => {
      if (!a.endDate && b.endDate) return -1;
      if (a.endDate && !b.endDate) return 1;
      return (b.startDate || '').localeCompare(a.startDate || '');
    });
  };

  // Add Crew Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Chief Officer');
  const [department, setDepartment] = useState<'master' | 'deck' | 'engine' | 'kitchen'>('deck');
  const [nationality, setNationality] = useState('British');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [seamanBookNo, setSeamanBookNo] = useState('');
  const [seamanBookExpiry, setSeamanBookExpiry] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFileName, setAvatarFileName] = useState<string>('');
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Assignment Form States
  const [quickShipId, setQuickShipId] = useState<string>('unassigned');
  const [quickRole, setQuickRole] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickSignOnDate, setQuickSignOnDate] = useState('');
  const [quickLocation, setQuickLocation] = useState('');

  // Department Selection Auto Sync Role
  const handleDepartmentSelect = (dept: DepartmentType) => {
    setDepartment(dept);
    const ranks = DEPARTMENT_RANKS[dept];
    if (ranks && ranks.length > 0) {
      setRole(ranks[0]);
    }
  };

  // Reset Add Form
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setRole(DEPARTMENT_RANKS.deck[0]);
    setDepartment('deck');
    setNationality('British');
    setDateOfBirth('');
    setPassportNumber('');
    setPassportExpiry('');
    setSeamanBookNo('');
    setSeamanBookExpiry('');
    setAvatarPreview('');
    setAvatarFileName('');
  };

  // Submit Register New Crew Member
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCrewId = `crew-${Date.now()}`;
    const newCrew: CrewMember = {
      id: newCrewId,
      name: name.trim(),
      email: email.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      role: role.trim() || 'Officer',
      department,
      nationality: nationality.trim() || 'International',
      dateOfBirth: dateOfBirth ? formatDate(dateOfBirth) : undefined,
      passportNumber: passportNumber.trim() || undefined,
      passportExpiry: passportExpiry ? formatDate(passportExpiry) : undefined,
      seamanBookNo: seamanBookNo.trim() || undefined,
      seamanBookExpiry: seamanBookExpiry ? formatDate(seamanBookExpiry) : undefined,
      signOnDate: getTodayDDMMYYYY(),
      avatarUrl: avatarPreview || getCrewAvatarUrl({ id: newCrewId, name: name.trim() }),
      assignedShipId: undefined,
      assignedShipName: undefined,
      vesselHistory: [],
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
    setQuickPhone(crew.phoneNumber || '');
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
      phoneNumber: quickPhone.trim() || assigningCrew.phoneNumber,
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
      if (crew.assignedShipId !== vesselFilter) return false;
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

  // Pagination Slice
  const totalPages = Math.ceil(sortedCrew.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCrew = sortedCrew.slice((validCurrentPage - 1) * ITEMS_PER_PAGE, validCurrentPage * ITEMS_PER_PAGE);

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
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & KPIS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--color-glass-border)] pb-4">
        <div>
          <h2 className="font-heading font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            Company Master Crew Roster
          </h2>
        </div>

        {/* Action Button & Counters */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[var(--text-muted)] font-semibold">Total Crew:</span>
            <strong className="text-[var(--text-main)] font-mono text-sm">{companyCrew.length}</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#28ada4]/10 border border-[#28ada4]/30 px-3 py-1.5 rounded-xl text-xs text-[#28ada4] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#28ada4] animate-pulse"></span>
            <span>Onboard:</span>
            <strong className="font-mono text-sm">{assignedCount}</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#7b0b76]/10 border border-[#7b0b76]/30 px-3 py-1.5 rounded-xl text-xs text-[#7b0b76] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#7b0b76]"></span>
            <span>Unassigned:</span>
            <strong className="font-mono text-sm">{unassignedCount}</strong>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Register New Crew Member
          </motion.button>
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
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl pl-9 pr-3.5 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition font-medium"
            />
          </div>

          {/* Status / Assignment Filter */}
          <div>
            <select
              value={assignmentFilter}
              onChange={(e) => {
                const nextVal = e.target.value as 'all' | 'assigned' | 'unassigned';
                setAssignmentFilter(nextVal);
                if (nextVal === 'unassigned') {
                  setVesselFilter('all');
                }
              }}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Assignment Statuses</option>
              <option value="assigned">Onboard Vessel ({assignedCount})</option>
              <option value="unassigned">Unassigned ({unassignedCount})</option>
            </select>
          </div>

          {/* Specific Vessel Filter */}
          <div>
            <select
              value={vesselFilter}
              onChange={(e) => setVesselFilter(e.target.value)}
              disabled={assignmentFilter === 'unassigned'}
              className={`w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none ${
                assignmentFilter === 'unassigned' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <option value="all">
                {assignmentFilter === 'unassigned' ? 'No Ships (Unassigned)' : 'All Ships'}
              </option>
              {assignmentFilter !== 'unassigned' &&
                ships.map((s) => (
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
              className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="master">Master</option>
              <option value="deck">Deck Department</option>
              <option value="engine">Engine Department</option>
              <option value="kitchen">Kitchen / Mess Dept</option>
            </select>
          </div>
        </div>

        {/* Sort & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--color-glass-border)] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Sort By:
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSortBy('rank')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${
                sortBy === 'rank'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-main)] hover:text-[var(--color-primary)] border border-[var(--color-glass-border)]'
              }`}
            >
              Rank Hierarchy (Master → Rating)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${
                sortBy === 'name'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-main)] hover:text-[var(--color-primary)] border border-[var(--color-glass-border)]'
              }`}
            >
              Name (A-Z)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSortBy('signOn')}
              className={`px-3 py-1 rounded-lg font-extrabold transition ${
                sortBy === 'signOn'
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'bg-[var(--color-bg)] text-[var(--text-main)] hover:text-[var(--color-primary)] border border-[var(--color-glass-border)]'
              }`}
            >
              Recent Sign-On
            </motion.button>
          </div>

          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={resetFilters}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
            </motion.button>
          )}
        </div>
      </div>

      {/* MASTER CREW ROSTER TABLE */}
      <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed text-left text-xs">
            <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
              <tr>
                <th className="py-2 px-2.5 w-[26%]">Crew Member & Role</th>
                <th className="py-2 px-2 w-[13%]">Department</th>
                <th className="py-2 px-2 w-[17%]">Ship Assignment</th>
                <th className="py-2 px-2 w-[11%]">Nationality</th>
                <th className="py-2 px-2 w-[14%]">Passport / SB</th>
                <th className="py-2 px-1.5 w-[9%] text-center">Vessels</th>
                <th className="py-2 px-2.5 w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-glass-border)]">
              {paginatedCrew.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[var(--text-muted)] text-xs">
                    <Users className="w-10 h-10 text-[var(--text-dim)] mx-auto mb-2 opacity-50" />
                    <h4 className="font-bold text-[var(--text-main)] text-sm mb-1">No Crew Members Match Criteria</h4>
                    <p>Try clearing your search term or filter parameters.</p>
                  </td>
                </tr>
              ) : (
                paginatedCrew.map((crew) => {
                  const assignedShip = ships.find((s) => s.id === crew.assignedShipId);
                  const effectiveHistory = getEffectiveVesselHistory(crew);
                  const historyCount = effectiveHistory.length;

                  return (
                    <tr
                      key={crew.id}
                      className="hover:bg-[#7b0b76]/[0.08] dark:hover:bg-[#7b0b76]/15 transition-colors group cursor-pointer"
                      onClick={() => {
                        setViewingProfileCrew(crew);
                        onSelectCrewMember(crew);
                      }}
                      title="Click to view full crew profile"
                    >
                      {/* Name & Role */}
                      <td className="py-1.5 px-2.5 align-middle overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <CrewAvatar
                            crew={crew}
                            size="sm"
                            className="group-hover:scale-105 group-hover:border-[#7b0b76]/50 transition-all shadow-sm shrink-0"
                          />
                          <div className="leading-tight min-w-0 flex-1">
                            <h4 className="font-extrabold text-[var(--text-main)] text-xs truncate transition">
                              {crew.name}
                            </h4>
                            <div className="font-bold text-[10px] text-[#28ada4] truncate">
                              {crew.role}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department Badges */}
                      <td className="py-1.5 px-2 align-middle overflow-hidden">
                        {crew.department === 'master' && (
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)] font-extrabold text-[10px] inline-block truncate max-w-full">
                            MASTER
                          </span>
                        )}
                        {crew.department === 'deck' && (
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)] font-extrabold text-[10px] inline-block truncate max-w-full">
                            DECK DEPT
                          </span>
                        )}
                        {crew.department === 'engine' && (
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)] font-extrabold text-[10px] inline-block truncate max-w-full">
                            ENGINE DEPT
                          </span>
                        )}
                        {crew.department === 'kitchen' && (
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)] font-extrabold text-[10px] inline-block truncate max-w-full">
                            GALLEY & MESS
                          </span>
                        )}
                        {!crew.department && (
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)] font-extrabold text-[10px] inline-block truncate max-w-full">
                            GENERAL CREW
                          </span>
                        )}
                      </td>

                      {/* Current Ship Assignment */}
                      <td className="py-1.5 px-2 align-middle overflow-hidden">
                        {assignedShip ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectShip(assignedShip);
                            }}
                            className="px-2 py-0.5 rounded-full bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[var(--text-main)] border border-[#28ada4]/30 text-[10px] font-extrabold inline-flex items-center gap-1 transition shadow-sm group/btn max-w-full"
                            title={`Click to open ${assignedShip.name} vessel profile`}
                          >
                            <ShipIcon className="w-2.5 h-2.5 text-[#28ada4] shrink-0 group-hover/btn:scale-110 transition-transform" />
                            <span className="truncate">{assignedShip.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0 text-[#28ada4]" />
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] border border-[#7b0b76]/30 text-[10px] font-bold inline-flex items-center gap-1 max-w-full">
                            <Clock className="w-2.5 h-2.5 text-[#7b0b76] shrink-0" />
                            <span className="truncate">UNASSIGNED</span>
                          </span>
                        )}
                      </td>

                      {/* Nationality */}
                      <td className="py-1.5 px-2 align-middle text-[var(--text-main)] font-extrabold text-[11px] truncate">
                        {crew.nationality}
                      </td>

                      {/* Passport & Seaman Book */}
                      <td className="py-1.5 px-2 align-middle overflow-hidden font-mono text-[10px] text-[var(--text-muted)] leading-tight font-bold">
                        <div className="truncate">Pass: <span className="text-[var(--text-main)]">{crew.passportNumber || '—'}</span></div>
                        <div className="truncate">SB: <span className="text-[var(--text-main)]">{crew.seamanBookNo || '—'}</span></div>
                      </td>

                      {/* Vessels Served */}
                      <td className="py-1.5 px-1.5 align-middle text-center overflow-hidden">
                        <span className="px-1.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-extrabold text-[10px] text-[#28ada4] inline-block truncate max-w-full">
                          {historyCount} {historyCount === 1 ? 'vessel' : 'vessels'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-1.5 px-2.5 align-middle text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {/* View Profile Button */}
                          <button
                            onClick={() => {
                              setViewingProfileCrew(crew);
                              onSelectCrewMember(crew);
                            }}
                            className="py-1 px-1.5 rounded-md bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 transition inline-flex items-center gap-1 text-[10px] font-extrabold shrink-0"
                            title="View full crew profile"
                          >
                            <FileText className="w-3 h-3 text-[#28ada4] shrink-0" />
                            <span className="hidden xl:inline">Profile</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => onRemoveCrewMember(crew.id)}
                            className="p-1 rounded-md bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition inline-flex items-center shrink-0"
                            title="Remove crew member from company roster"
                          >
                            <Trash2 className="w-3 h-3 text-[#991b1b] dark:text-[#e05252]" />
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

        {/* Pagination Bar */}
        {sortedCrew.length > 0 && (
          <div className="px-4 py-3 bg-[var(--color-surface)] border-t border-[var(--color-glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-[var(--text-muted)] font-semibold">
              Showing <strong className="text-[var(--text-main)] font-mono">{(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
              <strong className="text-[var(--text-main)] font-mono">{Math.min(validCurrentPage * ITEMS_PER_PAGE, sortedCrew.length)}</strong> of{' '}
              <strong className="text-[var(--text-main)] font-mono">{sortedCrew.length}</strong> crew members
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={validCurrentPage === 1}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--text-main)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-glass-border)] transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-mono font-bold text-xs transition ${
                      pageNum === validCurrentPage
                        ? 'bg-[var(--color-primary)] text-slate-950 shadow-sm'
                        : 'bg-[var(--color-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={validCurrentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--text-main)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-glass-border)] transition flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: REGISTER NEW COMPANY CREW MEMBER */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#28ada4]/10 border border-[#28ada4]/20 flex items-center justify-center text-[#28ada4]">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      Register New Crew Member to Company Roster
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Add marine officer or rating details to the master database.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
                {/* Profile Picture Upload */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-glass-border)] flex items-center justify-center shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-5 h-5 text-[#28ada4]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <label className="block text-[var(--text-main)] font-extrabold text-xs">
                        Profile Picture
                      </label>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {avatarFileName || 'Upload a portrait photo (PNG, JPG, WEBP)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setAvatarPreview(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview('');
                          setAvatarFileName('');
                          if (avatarInputRef.current) avatarInputRef.current.value = '';
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 font-bold text-[11px] transition cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                  </div>
                </div>

                {/* Name, Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Full Name <span className="text-[#7b0b76]">*</span>
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

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Phone Number <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +44 7911 123456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] font-mono"
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
                      <option value="master">Master</option>
                      <option value="deck">Deck Department</option>
                      <option value="engine">Engine Department</option>
                      <option value="kitchen">Kitchen / Mess Dept</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Rank / Position</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                    >
                      {DEPARTMENT_RANKS[department]?.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nationality & Date of Birth */}
                <div className="grid grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Date of Birth</label>
                    <DateInput
                      value={dateOfBirth}
                      onChange={(val) => setDateOfBirth(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                {/* Passport Number & Passport Expiry */}
                <div className="grid grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Passport Expiry</label>
                    <DateInput
                      value={passportExpiry}
                      onChange={(val) => setPassportExpiry(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                {/* Seaman Book Number & Seaman Book Expiry */}
                <div className="grid grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Seaman Book Expiry</label>
                    <DateInput
                      value={seamanBookExpiry}
                      onChange={(val) => setSeamanBookExpiry(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-3 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Crew Member
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: QUICK ASSIGN / CHANGE SHIP MODAL */}
      <AnimatePresence>
        {assigningCrew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setAssigningCrew(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#28ada4]/10 border border-[#28ada4]/20 flex items-center justify-center text-[#28ada4]">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      Vessel Assignment Control
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">Assign {assigningCrew.name} to a fleet vessel</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAssigningCrew(null)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-6 space-y-4 text-xs">
                <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)] flex items-center gap-3">
                  <CrewAvatar crew={assigningCrew} size="md" />
                  <div>
                    <div className="font-bold text-[var(--text-main)] text-sm">{assigningCrew.name}</div>
                    <div className="text-[var(--color-primary)] font-semibold">{assigningCrew.role} • {assigningCrew.nationality}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1.5">Select Vessel</label>
                  <select
                    value={quickShipId}
                    onChange={(e) => setQuickShipId(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold focus:outline-none focus:border-[#28ada4] cursor-pointer"
                  >
                    <option value="unassigned">Unassign / Set to Unassigned Pool</option>
                    {ships.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.type || 'Container Ship'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1.5">Role / Position on Vessel</label>
                  <select
                    value={quickRole}
                    onChange={(e) => setQuickRole(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    {assigningCrew?.department && DEPARTMENT_RANKS[assigningCrew.department] ? (
                      <>
                        {DEPARTMENT_RANKS[assigningCrew.department].map((rank) => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                        {quickRole && !DEPARTMENT_RANKS[assigningCrew.department].includes(quickRole) && (
                          <option value={quickRole}>{quickRole} (Current)</option>
                        )}
                      </>
                    ) : (
                      Object.entries(DEPARTMENT_RANKS).map(([deptKey, ranks]) => (
                        <optgroup key={deptKey} label={deptKey.toUpperCase()}>
                          {ranks.map((rank) => (
                            <option key={rank} value={rank}>{rank}</option>
                          ))}
                        </optgroup>
                      ))
                    )}
                  </select>
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setAssigningCrew(null)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Assignment
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREW MEMBER PROFILE */}
      <AnimatePresence>
        {viewingProfileCrew && (
          <CrewProfileModal
            crew={viewingProfileCrew}
            onClose={() => setViewingProfileCrew(null)}
            onUpdateCrew={(updated) => {
              setViewingProfileCrew(updated);
              onUpdateCrewMember(updated);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
