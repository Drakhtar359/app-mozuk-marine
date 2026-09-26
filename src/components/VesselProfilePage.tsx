import React, { useState } from 'react';
import { Ship, CrewMember, TechnicalDoc, MaintenanceLog, VesselHistoryEntry, VisitorLog } from '../types/vessel';
import {
  ArrowLeft,
  Users,
  FileCheck,
  Wrench,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Check,
  Play,
  RotateCcw,
  UserPlus,
  Crown,
  Compass,
  Utensils,
  Anchor,
  Shield,
  ChevronDown,
  Navigation,
  ExternalLink,
  ShieldCheck,
  FileText,
  Folder,
  Globe,
  Calendar,
  MapPin,
  BookOpen,
  Briefcase,
  History,
  UserCheck,
  ClipboardList,
  Building2,
  LogOut,
  LogIn,
  Filter,
  Mail,
} from 'lucide-react';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import { DateInput } from './DateInput';

interface VesselProfilePageProps {
  ship: Ship;
  companyCrew?: CrewMember[];
  onBack: () => void;
  onUpdateShip: (updatedShip: Ship) => void;
  onAssignExistingCrewToShip?: (crewId: string, role?: string, signOnDate?: string, signOnLocation?: string) => void;
  onUnassignCrewFromShip?: (crewId: string) => void;
}

export const VesselProfilePage: React.FC<VesselProfilePageProps> = ({
  ship,
  companyCrew = [],
  onBack,
  onUpdateShip,
  onAssignExistingCrewToShip,
  onUnassignCrewFromShip,
}) => {
  const [activeTab, setActiveTab] = useState<'crew' | 'documents' | 'maintenance' | 'visitors'>('crew');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  // Modal & Detail States
  const [isAddCrewModalOpen, setIsAddCrewModalOpen] = useState(false);
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddRepairModalOpen, setIsAddRepairModalOpen] = useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);

  // Add Crew Modal Mode (Select from company roster vs Register new)
  const [addCrewTab, setAddCrewTab] = useState<'select' | 'create'>('select');
  const [selectedExistingCrewId, setSelectedExistingCrewId] = useState<string>('');

  // Form states for Crew Member
  const [crewName, setCrewName] = useState('');
  const [crewEmail, setCrewEmail] = useState('');
  const [crewDepartment, setCrewDepartment] = useState<'master' | 'deck' | 'engine' | 'kitchen'>('deck');
  const [crewRole, setCrewRole] = useState('Chief Officer');
  const [crewNationality, setCrewNationality] = useState('');
  const [crewSignOnDate, setCrewSignOnDate] = useState('');
  const [seamanBookNo, setSeamanBookNo] = useState('');
  const [crewDateOfBirth, setCrewDateOfBirth] = useState('');
  const [crewPassportNumber, setCrewPassportNumber] = useState('');
  const [crewPassportExpiry, setCrewPassportExpiry] = useState('');
  const [crewSeamanBookExpiry, setCrewSeamanBookExpiry] = useState('');
  const [crewSignOnLocation, setCrewSignOnLocation] = useState('');

  // Form states for Visitor Log
  const [visitorDate, setVisitorDate] = useState('');
  const [visitorFullName, setVisitorFullName] = useState('');
  const [visitorCompany, setVisitorCompany] = useState('');
  const [visitorReason, setVisitorReason] = useState('');
  const [visitorTimeIn, setVisitorTimeIn] = useState('');
  const [visitorTimeOut, setVisitorTimeOut] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');

  // Filter states for Visitor Logbook
  const [visitorFilterDateFrom, setVisitorFilterDateFrom] = useState('');
  const [visitorFilterDateTo, setVisitorFilterDateTo] = useState('');
  const [visitorFilterLocation, setVisitorFilterLocation] = useState('all');
  const [visitorFilterCompany, setVisitorFilterCompany] = useState('all');

  // Form states for Technical Document
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Statutory Certificate');
  const [docNumber, setDocNumber] = useState('');
  const [docIssueDate, setDocIssueDate] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docAuthority, setDocAuthority] = useState('');
  const [docCategory, setDocCategory] = useState<'certifications' | 'technical_documentation' | 'misc'>('certifications');

  // Form states for Maintenance Repair
  const [repairTitle, setRepairTitle] = useState('');
  const [repairCategory, setRepairCategory] = useState<MaintenanceLog['category']>('Machinery');
  const [repairPriority, setRepairPriority] = useState<MaintenanceLog['priority']>('medium');
  const [repairDueDate, setRepairDueDate] = useState('');
  const [repairReportedBy, setRepairReportedBy] = useState('');
  const [repairDescription, setRepairDescription] = useState('');

  // Helper to parse dd/mm/yyyy or yyyy-mm-dd to timestamp for sorting
  const parseDDMMYYYY = (dateStr?: string): number => {
    if (!dateStr) return 0;
    const trimmed = dateStr.trim();
    const dmyMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)).getTime();
    }
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10)).getTime();
    }
    const t = new Date(trimmed).getTime();
    return isNaN(t) ? 0 : t;
  };

  // Sort vessel history: active assignment (!endDate) first, then newest start date down
  const sortVesselHistory = (history?: VesselHistoryEntry[]): VesselHistoryEntry[] => {
    if (!history || history.length === 0) return [];
    return [...history].sort((a, b) => {
      if (!a.endDate && b.endDate) return -1;
      if (a.endDate && !b.endDate) return 1;
      const timeA = parseDDMMYYYY(a.startDate);
      const timeB = parseDDMMYYYY(b.startDate);
      return timeB - timeA;
    });
  };

  // Maritime Crew Hierarchy Rank Weight
  const getCrewRankWeight = (role: string): number => {
    const r = (role || '').toLowerCase();
    
    // Master / Captain
    if (r.includes('master') || r.includes('captain')) return 1;

    // Deck Department Ranks
    if (r.includes('chief officer') || r.includes('first mate') || r.includes('1st mate')) return 10;
    if (r.includes('second officer') || r.includes('2nd officer') || r.includes('2nd mate')) return 11;
    if (r.includes('third officer') || r.includes('3rd officer') || r.includes('3rd mate')) return 12;
    if (r.includes('deck officer') || r.includes('junior officer')) return 13;
    if (r.includes('cadet')) return 14;
    if (r.includes('bosun') || r.includes('boatswain')) return 20;
    if (r.includes('able seaman') || r.includes('ab ') || r.includes('ab/')) return 21;
    if (r.includes('ordinary seaman') || r.includes('os ') || r.includes('os/')) return 22;
    if (r.includes('deckhand') || r.includes('deck crew')) return 23;

    // Engine Department Ranks
    if (r.includes('chief engineer')) return 10;
    if (r.includes('second engineer') || r.includes('2nd engineer')) return 11;
    if (r.includes('third engineer') || r.includes('3rd engineer')) return 12;
    if (r.includes('fourth engineer') || r.includes('4th engineer')) return 13;
    if (r.includes('electro-technical') || r.includes('eto') || r.includes('electrician')) return 14;
    if (r.includes('engine cadet')) return 15;
    if (r.includes('motorman') || r.includes('oiler')) return 20;
    if (r.includes('fitter') || r.includes('welder') || r.includes('machinist')) return 21;
    if (r.includes('wiper') || r.includes('engine hand')) return 22;

    // Kitchen / Mess Department Ranks
    if (r.includes('chief cook') || r.includes('head cook') || r.includes('chef')) return 10;
    if (r.includes('second cook') || r.includes('2nd cook') || r.includes('cook')) return 11;
    if (r.includes('chief steward') || r.includes('stewardess')) return 12;
    if (r.includes('messman') || r.includes('mess boy') || r.includes('steward')) return 20;
    if (r.includes('galley') || r.includes('utility')) return 21;

    return 50;
  };

  const sortByHierarchy = (crewList: CrewMember[]): CrewMember[] => {
    return [...crewList].sort((a, b) => {
      const weightA = getCrewRankWeight(a.role);
      const weightB = getCrewRankWeight(b.role);
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Document Category Resolver
  const getDocCategory = (doc: TechnicalDoc): 'certifications' | 'technical_documentation' | 'misc' => {
    if (doc.category) return doc.category;
    
    const typeLower = (doc.documentType || '').toLowerCase();
    const titleLower = (doc.title || '').toLowerCase();
    
    if (
      typeLower.includes('manual') ||
      typeLower.includes('drawing') ||
      typeLower.includes('schematic') ||
      typeLower.includes('spec') ||
      titleLower.includes('manual') ||
      titleLower.includes('plan') ||
      titleLower.includes('schematic') ||
      titleLower.includes('blueprint') ||
      titleLower.includes('drawing')
    ) {
      return 'technical_documentation';
    }

    if (
      typeLower.includes('invoice') ||
      typeLower.includes('order') ||
      typeLower.includes('charter') ||
      typeLower.includes('permit') ||
      typeLower.includes('pass') ||
      typeLower.includes('bunker') ||
      typeLower.includes('receipt') ||
      typeLower.includes('misc') ||
      titleLower.includes('invoice') ||
      titleLower.includes('permit') ||
      titleLower.includes('charter') ||
      titleLower.includes('clearance') ||
      titleLower.includes('bunker')
    ) {
      return 'misc';
    }

    return 'certifications';
  };

  // Helper for resolving Crew Department
  const getCrewDepartment = (member: CrewMember): 'master' | 'deck' | 'engine' | 'kitchen' => {
    if (member.department) return member.department;
    const roleLower = member.role.toLowerCase();
    if (roleLower.includes('master') || roleLower.includes('captain')) {
      return 'master';
    }
    if (
      roleLower.includes('engineer') ||
      roleLower.includes('oiler') ||
      roleLower.includes('motorman') ||
      roleLower.includes('electrician') ||
      roleLower.includes('eto') ||
      roleLower.includes('fitter')
    ) {
      return 'engine';
    }
    if (
      roleLower.includes('cook') ||
      roleLower.includes('mess') ||
      roleLower.includes('steward') ||
      roleLower.includes('galley') ||
      roleLower.includes('catering')
    ) {
      return 'kitchen';
    }
    return 'deck';
  };

  const masterCrew = sortByHierarchy(ship.crew.filter((c) => getCrewDepartment(c) === 'master'));
  const deckCrew = sortByHierarchy(ship.crew.filter((c) => getCrewDepartment(c) === 'deck'));
  const engineCrew = sortByHierarchy(ship.crew.filter((c) => getCrewDepartment(c) === 'engine'));
  const kitchenCrew = sortByHierarchy(ship.crew.filter((c) => getCrewDepartment(c) === 'kitchen'));

  // Crew Handlers
  const handleAddCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewName.trim()) return;

    const formattedSignOn = formatDate(crewSignOnDate || getTodayDDMMYYYY());

    const newCrewMember: CrewMember = {
      id: `crew-${Date.now()}`,
      name: crewName.trim(),
      email: crewEmail.trim() || undefined,
      role: crewRole,
      department: crewDepartment,
      nationality: crewNationality.trim() || 'Mozambican',
      signOnDate: formattedSignOn,
      signOnLocation: crewSignOnLocation.trim() || undefined,
      dateOfBirth: crewDateOfBirth ? formatDate(crewDateOfBirth) : undefined,
      passportNumber: crewPassportNumber.trim() || undefined,
      passportExpiry: crewPassportExpiry ? formatDate(crewPassportExpiry) : undefined,
      seamanBookNo: seamanBookNo.trim() || undefined,
      seamanBookExpiry: crewSeamanBookExpiry ? formatDate(crewSeamanBookExpiry) : undefined,
      vesselHistory: [
        {
          shipName: ship.name,
          role: crewRole,
          startDate: formattedSignOn,
        },
      ],
    };

    onUpdateShip({
      ...ship,
      crew: [newCrewMember, ...ship.crew],
    });

    setCrewName('');
    setCrewEmail('');
    setCrewNationality('');
    setCrewSignOnDate('');
    setSeamanBookNo('');
    setCrewDateOfBirth('');
    setCrewPassportNumber('');
    setCrewPassportExpiry('');
    setCrewSeamanBookExpiry('');
    setCrewSignOnLocation('');
    setIsAddCrewModalOpen(false);
  };

  const handleAssignExistingCrewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExistingCrewId) return;

    if (onAssignExistingCrewToShip) {
      onAssignExistingCrewToShip(
        selectedExistingCrewId,
        crewRole,
        crewSignOnDate || getTodayDDMMYYYY(),
        crewSignOnLocation
      );
    } else {
      const existing = companyCrew.find((c) => c.id === selectedExistingCrewId);
      if (existing) {
        const updated: CrewMember = {
          ...existing,
          role: crewRole || existing.role,
          signOnDate: formatDate(crewSignOnDate || getTodayDDMMYYYY()),
          signOnLocation: crewSignOnLocation || existing.signOnLocation,
          assignedShipId: ship.id,
          assignedShipName: ship.name,
        };
        onUpdateShip({
          ...ship,
          crew: [updated, ...ship.crew.filter((c) => c.id !== existing.id)],
        });
      }
    }

    setSelectedExistingCrewId('');
    setCrewSignOnDate('');
    setCrewSignOnLocation('');
    setIsAddCrewModalOpen(false);
  };

  const handleRemoveCrew = (crewId: string) => {
    if (onUnassignCrewFromShip) {
      onUnassignCrewFromShip(crewId);
    } else {
      onUpdateShip({
        ...ship,
        crew: ship.crew.filter((c) => c.id !== crewId),
      });
    }
  };

  // Technical Document Handlers
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docExpiryDate) return;

    const formattedExpiryDate = formatDate(docExpiryDate);
    const formattedIssueDate = formatDate(docIssueDate || getTodayDDMMYYYY());

    let status: TechnicalDoc['status'] = 'valid';
    // Calculate days remaining
    const parts = docExpiryDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const expiryDateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      const today = new Date();
      const daysRemaining = Math.ceil((expiryDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysRemaining <= 0) {
        status = 'expired';
      } else if (daysRemaining <= 30) {
        status = 'expiring';
      }
    }

    const newDoc: TechnicalDoc = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      documentType: docType,
      documentNumber: docNumber.trim() || `CERT-${Date.now().toString().slice(-6)}`,
      issueDate: formattedIssueDate,
      expiryDate: formattedExpiryDate,
      authority: docAuthority.trim() || 'Maritime Authority',
      status,
      category: docCategory,
    };

    onUpdateShip({
      ...ship,
      documents: [newDoc, ...ship.documents],
    });

    setDocTitle('');
    setDocNumber('');
    setDocIssueDate('');
    setDocExpiryDate('');
    setIsAddDocModalOpen(false);
  };

  const openAddDocModal = (category: 'certifications' | 'technical_documentation' | 'misc' = 'certifications') => {
    setDocCategory(category);
    if (category === 'certifications') setDocType('Class Certificate');
    else if (category === 'technical_documentation') setDocType('Technical Manual');
    else setDocType('Commercial Invoice');
    setIsAddDocModalOpen(true);
  };

  const handleRemoveDocument = (docId: string) => {
    onUpdateShip({
      ...ship,
      documents: ship.documents.filter((d) => d.id !== docId),
    });
  };

  // Maintenance Repair Handlers
  const handleLogRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairTitle.trim()) return;

    const newLog: MaintenanceLog = {
      id: `maint-${Date.now()}`,
      title: repairTitle.trim(),
      category: repairCategory,
      priority: repairPriority,
      loggedDate: getTodayDDMMYYYY(),
      dueDate: formatDate(repairDueDate || getTodayDDMMYYYY()),
      reportedBy: repairReportedBy.trim() || 'Chief Engineer',
      description: repairDescription.trim() || 'Maintenance repair logged for vessel operations.',
      status: 'open',
    };

    onUpdateShip({
      ...ship,
      maintenance: [newLog, ...ship.maintenance],
    });

    setRepairTitle('');
    setRepairDescription('');
    setRepairDueDate('');
    setIsAddRepairModalOpen(false);
  };

  const handleUpdateRepairStatus = (logId: string, newStatus: MaintenanceLog['status']) => {
    onUpdateShip({
      ...ship,
      maintenance: ship.maintenance.map((log) =>
        log.id === logId ? { ...log, status: newStatus } : log
      ),
    });
  };

  const handleRemoveRepair = (logId: string) => {
    onUpdateShip({
      ...ship,
      maintenance: ship.maintenance.filter((log) => log.id !== logId),
    });
  };

  // Visitor Logbook Handlers
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorFullName.trim() || !visitorCompany.trim()) return;

    const newVisitor: VisitorLog = {
      id: `vis-${Date.now()}`,
      date: formatDate(visitorDate || getTodayDDMMYYYY()),
      fullName: visitorFullName.trim(),
      company: visitorCompany.trim(),
      reason: visitorReason.trim() || 'General Inspection / Visit',
      timeIn: visitorTimeIn.trim() || '09:00',
      timeOut: visitorTimeOut.trim() || undefined,
      location: visitorLocation.trim() || ship.name,
    };

    onUpdateShip({
      ...ship,
      visitors: [newVisitor, ...(ship.visitors || [])],
    });

    setVisitorDate('');
    setVisitorFullName('');
    setVisitorCompany('');
    setVisitorReason('');
    setVisitorTimeIn('');
    setVisitorTimeOut('');
    setVisitorLocation('');
    setIsAddVisitorModalOpen(false);
  };

  const handleSignOutVisitor = (visitorId: string) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    onUpdateShip({
      ...ship,
      visitors: (ship.visitors || []).map((v) =>
        v.id === visitorId ? { ...v, timeOut: currentTimeStr } : v
      ),
    });
  };

  const handleRemoveVisitor = (visitorId: string) => {
    onUpdateShip({
      ...ship,
      visitors: (ship.visitors || []).filter((v) => v.id !== visitorId),
    });
  };

  // Maintenance Counters
  const openRepairsCount = ship.maintenance.filter((m) => m.status === 'open').length;
  const inProgressCount = ship.maintenance.filter((m) => m.status === 'in_progress').length;
  const completedCount = ship.maintenance.filter((m) => m.status === 'completed').length;

  const filteredMaintenance = ship.maintenance.filter((m) => {
    if (maintenanceFilter === 'all') return true;
    return m.status === maintenanceFilter;
  });

  // When Department changes in modal, set default role
  const handleDepartmentChange = (dept: 'master' | 'deck' | 'engine' | 'kitchen') => {
    setCrewDepartment(dept);
    if (dept === 'master') setCrewRole('Master / Captain');
    else if (dept === 'deck') setCrewRole('Chief Officer');
    else if (dept === 'engine') setCrewRole('Chief Engineer');
    else setCrewRole('Chief Cook');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Navigation Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" /> Back to Fleet Directory
        </button>
      </div>

      {/* Ship Basic Specifications Header Card */}
      <div className="mozuk-glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-5 mb-5">
          <div>
            {/* 1. Ship Type stays where it is (above ship name) */}
            <div className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-0.5">
              {ship.type || 'Container Ship'}
            </div>

            {/* 2. Ship Name */}
            <h1 className="text-3xl font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] leading-tight">
              {ship.name}
            </h1>

            {/* 3. IMO Number goes UNDER the ship name */}
            <div className="font-mono text-xs font-bold text-[var(--text-muted)] mt-1">
              {ship.imo}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={
                ship.imo
                  ? `https://www.marinetraffic.com/en/ais/details/ships/imo:${ship.imo.replace(/\D/g, '')}`
                  : `https://www.marinetraffic.com/en/ais/index/ships/all/keyword:${encodeURIComponent(ship.name)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold text-xs flex items-center gap-2 transition"
              title={`Track ${ship.name} (${ship.imo}) on MarineTraffic`}
            >
              <Navigation className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              <span>Track on MarineTraffic</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">IMO Number</div>
            <div className="font-mono text-[var(--text-main)] font-extrabold text-xs mt-0.5">{ship.imo}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Flag State</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">{ship.flag || 'Marshall Islands'}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Class Society</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">{ship.classification || 'DNV GL'}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Year Built</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">{ship.builtYear || 'N/A'}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Gross Tonnage</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">
              {ship.grossTonnage ? `${ship.grossTonnage.toLocaleString()} GT` : 'N/A'}
            </div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Active Crew</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">{ship.crew.length} Members</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase font-mono">Tech Certs</div>
            <div className="font-extrabold text-[var(--text-main)] text-xs mt-0.5">{ship.documents.length} Valid</div>
          </div>
        </div>
      </div>

      {/* 3 Main Sections Tabs Bar */}
      <div className="flex border border-[var(--color-glass-border)] bg-[var(--color-surface)] rounded-2xl p-1.5 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('crew')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition ${
            activeTab === 'crew'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <Users className="w-4 h-4" />
          Crew Command Hierarchy ({ship.crew.length})
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition ${
            activeTab === 'maintenance'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Maintenance & Repair Log ({ship.maintenance.length})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition ${
            activeTab === 'documents'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Technical Documents ({ship.documents.length})
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition ${
            activeTab === 'visitors'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Visitor Logbook ({(ship.visitors || []).length})
        </button>
      </div>

      {/* SECTION 1: CREW COMMAND TREE HIERARCHY */}
      {activeTab === 'crew' && (
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Vessel Command Organization Tree
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Hierarchy structure led by the Master commanding Deck, Engine, and Kitchen/Mess departments.
              </p>
            </div>

            <button
              onClick={() => setIsAddCrewModalOpen(true)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Add Crew Member
            </button>
          </div>

          {/* COMMAND TREE CONTAINER */}
          <div className="relative">
            {/* TOP COMMAND NODE: MASTER / CAPTAIN */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md mozuk-glass-card rounded-2xl p-5 border border-amber-500/40 shadow-xl relative">
                {masterCrew.length > 0 ? (
                  masterCrew.map((master) => (
                    <div
                      key={master.id}
                      onClick={() => setSelectedCrewMember(master)}
                      className="pt-2 text-center relative group cursor-pointer hover:bg-[var(--color-bg-alt)]/60 rounded-xl p-3 transition border border-transparent hover:border-amber-400/50 shadow-sm"
                      title="Click to view full crew profile"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-xl mx-auto mb-2 shadow-lg group-hover:scale-105 transition-transform">
                        {master.name.charAt(0)}
                      </div>
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-lg text-[var(--text-main)] group-hover:text-amber-400 transition">
                        {master.name}
                      </h3>
                      <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                        {master.role}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-center gap-3">
                        <span>Nationality: <strong className="text-[var(--text-main)]">{master.nationality}</strong></span>
                        <span>Signed On: <strong className="text-[var(--text-main)]">{formatDate(master.signOnDate)}</strong></span>
                      </div>
                      {master.seamanBookNo && (
                        <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                          Seaman Book: {master.seamanBookNo}
                        </div>
                      )}
                      <div className="text-[10px] text-amber-400/80 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition">
                        🔍 Click to open full profile
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCrew(master.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition opacity-0 group-hover:opacity-100"
                        title="Remove Master"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-3">No Master / Captain assigned to this vessel</p>
                    <button
                      onClick={() => {
                        handleDepartmentChange('master');
                        setIsAddCrewModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                    >
                      <UserPlus className="w-4 h-4" /> Assign Master / Captain
                    </button>
                  </div>
                )}
              </div>

              {/* UNIFORM TREE CONNECTORS (Guaranteed exact 2px line thickness across vertical & horizontal lines) */}
              <div className="hidden md:flex flex-col items-center w-full my-0 pointer-events-none">
                {/* 1. Trunk Line from Master Card down */}
                <div className="w-[2px] h-6 bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>

                {/* 2. Horizontal Crossbar spanning from center of Column 1 to center of Column 3 */}
                <div className="w-[66.666%] h-[2px] bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>

                {/* 3. Drop Lines row into each of the 3 Department Column Cards */}
                <div className="w-full grid grid-cols-3 gap-6">
                  <div className="flex justify-center">
                    <div className="w-[2px] h-6 bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-[2px] h-6 bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-[2px] h-6 bg-[var(--color-primary)] shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>
                  </div>
                </div>
              </div>

              {/* Mobile vertical line connector */}
              <div className="md:hidden w-[2px] h-6 bg-[var(--color-primary)] mx-auto my-1"></div>
            </div>

            {/* THREE DEPARTMENT COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COLUMN 1: DECK DEPARTMENT */}
              <div className="flex flex-col">
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-cyan-500 flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                          Deck Department
                        </h3>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          Navigation & Cargo Ops
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 font-bold text-xs border border-cyan-800/60">
                      {deckCrew.length}
                    </span>
                  </div>

                  {/* Deck Crew List */}
                  <div className="space-y-3 flex-1">
                    {deckCrew.length === 0 ? (
                      <div className="py-8 text-center text-[var(--text-muted)] text-xs">
                        No deck officers or crew assigned.
                      </div>
                    ) : (
                      deckCrew.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedCrewMember(member)}
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-cyan-500/80 transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-cyan-400 transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-semibold text-[10px] mt-0.5 border border-cyan-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {formatDate(member.signOnDate)}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCrew(member.id);
                            }}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition opacity-0 group-hover:opacity-100"
                            title="Remove crew member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => {
                      handleDepartmentChange('deck');
                      setIsAddCrewModalOpen(true);
                    }}
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-cyan-800/80 text-cyan-400 hover:bg-cyan-950/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Deck Crew
                  </button>
                </div>
              </div>

              {/* COLUMN 2: ENGINE DEPARTMENT */}
              <div className="flex flex-col">
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-blue-500 flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/60">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                          Engine Department
                        </h3>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          Propulsion & Technical
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-400 font-bold text-xs border border-blue-800/60">
                      {engineCrew.length}
                    </span>
                  </div>

                  {/* Engine Crew List */}
                  <div className="space-y-3 flex-1">
                    {engineCrew.length === 0 ? (
                      <div className="py-8 text-center text-[var(--text-muted)] text-xs">
                        No engine officers or crew assigned.
                      </div>
                    ) : (
                      engineCrew.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedCrewMember(member)}
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-blue-500/80 transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-blue-400 transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 font-semibold text-[10px] mt-0.5 border border-blue-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {formatDate(member.signOnDate)}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCrew(member.id);
                            }}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition opacity-0 group-hover:opacity-100"
                            title="Remove crew member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => {
                      handleDepartmentChange('engine');
                      setIsAddCrewModalOpen(true);
                    }}
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-blue-800/80 text-blue-400 hover:bg-blue-950/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Engine Crew
                  </button>
                </div>
              </div>

              {/* COLUMN 3: KITCHEN / MESS DEPARTMENT */}
              <div className="flex flex-col">
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-emerald-500 flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                          Kitchen / Mess Dept
                        </h3>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          Catering & Galley
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 font-bold text-xs border border-emerald-800/60">
                      {kitchenCrew.length}
                    </span>
                  </div>

                  {/* Kitchen Crew List */}
                  <div className="space-y-3 flex-1">
                    {kitchenCrew.length === 0 ? (
                      <div className="py-8 text-center text-[var(--text-muted)] text-xs">
                        No galley staff or mess crew assigned.
                      </div>
                    ) : (
                      kitchenCrew.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedCrewMember(member)}
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-emerald-500/80 transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-emerald-400 transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-semibold text-[10px] mt-0.5 border border-emerald-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {formatDate(member.signOnDate)}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCrew(member.id);
                            }}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition opacity-0 group-hover:opacity-100"
                            title="Remove crew member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => {
                      handleDepartmentChange('kitchen');
                      setIsAddCrewModalOpen(true);
                    }}
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-emerald-800/80 text-emerald-400 hover:bg-emerald-950/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Kitchen / Mess Staff
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MAINTENANCE & REPAIR LOG */}
      {activeTab === 'maintenance' && (
        <div className="space-y-5">
          {/* Maintenance KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mozuk-glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[var(--text-muted)] text-xs font-bold uppercase">Open Repairs</div>
                <div className="text-2xl font-['Space_Grotesk',sans-serif] font-extrabold text-rose-400 mt-1">{openRepairsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="mozuk-glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[var(--text-muted)] text-xs font-bold uppercase">In Progress</div>
                <div className="text-2xl font-['Space_Grotesk',sans-serif] font-extrabold text-amber-400 mt-1">{inProgressCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="mozuk-glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[var(--text-muted)] text-xs font-bold uppercase">Completed</div>
                <div className="text-2xl font-['Space_Grotesk',sans-serif] font-extrabold text-emerald-400 mt-1">{completedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter Bar & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-glass-border)] text-xs">
              {[
                { id: 'all', label: `All (${ship.maintenance.length})` },
                { id: 'open', label: `Open (${openRepairsCount})` },
                { id: 'in_progress', label: `In Progress (${inProgressCount})` },
                { id: 'completed', label: `Completed (${completedCount})` },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setMaintenanceFilter(filter.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    maintenanceFilter === filter.id
                      ? 'bg-[var(--color-bg-alt)] text-[var(--text-main)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddRepairModalOpen(true)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log New Repair / Work Order
            </button>
          </div>

          {/* Maintenance Logs List */}
          {filteredMaintenance.length === 0 ? (
            <div className="mozuk-glass-card rounded-2xl p-10 text-center text-[var(--text-muted)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-base">No Maintenance Repairs Found</h4>
              <p className="text-xs mt-1">There are no repair logs matching the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaintenance.map((log) => (
                <div
                  key={log.id}
                  className="mozuk-glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase border ${
                          log.priority === 'urgent'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                            : log.priority === 'high'
                            ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                            : log.priority === 'medium'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                            : 'bg-slate-800/60 text-slate-300 border-slate-700'
                        }`}
                      >
                        {log.priority} priority
                      </span>

                      {/* Category Badge */}
                      <span className="px-2.5 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-semibold text-[10px] text-[var(--color-primary)]">
                        {log.category}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase border ${
                          log.status === 'open'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                            : log.status === 'in_progress'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        }`}
                      >
                        {log.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">{log.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{log.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-muted)] pt-1">
                      <span>Logged: <strong className="text-[var(--text-main)]">{formatDate(log.loggedDate)}</strong></span>
                      <span>Target Due: <strong className="text-[var(--text-main)]">{formatDate(log.dueDate)}</strong></span>
                      <span>Reported by: <strong className="text-[var(--color-primary)]">{log.reportedBy}</strong></span>
                    </div>
                  </div>

                  {/* Log Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[var(--color-glass-border)] pt-3 md:pt-0 md:pl-4">
                    {log.status === 'open' && (
                      <button
                        onClick={() => handleUpdateRepairStatus(log.id, 'in_progress')}
                        className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/80 text-amber-300 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Repair
                      </button>
                    )}

                    {log.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateRepairStatus(log.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}

                    {log.status === 'completed' && (
                      <button
                        onClick={() => handleUpdateRepairStatus(log.id, 'open')}
                        className="px-3 py-1.5 rounded-lg btn-mozuk-secondary text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Re-open
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveRepair(log.id)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: TECHNICAL DOCUMENTS (3 SECTIONS) */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          {/* Main Tab Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[var(--color-primary)]" />
                Vessel Documentation Repository
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Class & statutory certificates, technical engineering manuals, and commercial/misc operational filings.
              </p>
            </div>
            <button
              onClick={() => openAddDocModal('certifications')}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Document
            </button>
          </div>

          {/* SECTION 1: CERTIFICATIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                  Certifications (Class, Flag, Statutory & ISM)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  {ship.documents.filter((d) => getDocCategory(d) === 'certifications').length}
                </span>
              </div>
              <button
                onClick={() => openAddDocModal('certifications')}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="mozuk-glass-card rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)]">
                  <tr>
                    <th className="py-3 px-4">Certificate Title</th>
                    <th className="py-3 px-4">Doc / Reg Number</th>
                    <th className="py-3 px-4">Issuing Authority</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {ship.documents.filter((d) => getDocCategory(d) === 'certifications').length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[var(--text-muted)] text-xs">
                        No statutory or class certificates logged yet.
                      </td>
                    </tr>
                  ) : (
                    ship.documents
                      .filter((d) => getDocCategory(d) === 'certifications')
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-[var(--color-glass-border)] transition">
                          <td className="py-3 px-4 font-bold text-[var(--text-main)]">{doc.title}</td>
                          <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{doc.documentNumber}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{doc.authority}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.issueDate)}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.expiryDate)}</td>
                          <td className="py-3 px-4 text-right">
                            {doc.status === 'valid' && (
                              <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold text-[10px]">
                                VALID
                              </span>
                            )}
                            {doc.status === 'expiring' && (
                              <span className="px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 font-bold text-[10px]">
                                EXPIRING SOON
                              </span>
                            )}
                            {doc.status === 'expired' && (
                              <span className="px-2.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-bold text-[10px]">
                                EXPIRED
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: TECHNICAL DOCUMENTATION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                  Technical Documentation (Manuals, Schematics & Drawings)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20">
                  {ship.documents.filter((d) => getDocCategory(d) === 'technical_documentation').length}
                </span>
              </div>
              <button
                onClick={() => openAddDocModal('technical_documentation')}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Technical Doc
              </button>
            </div>

            <div className="mozuk-glass-card rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)]">
                  <tr>
                    <th className="py-3 px-4">Document / Manual Title</th>
                    <th className="py-3 px-4">Drawing / Manual ID</th>
                    <th className="py-3 px-4">OEM / Authority</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4">Revision Expiry</th>
                    <th className="py-3 px-4 text-right">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {ship.documents.filter((d) => getDocCategory(d) === 'technical_documentation').length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[var(--text-muted)] text-xs">
                        No technical manuals or engineering schematics registered.
                      </td>
                    </tr>
                  ) : (
                    ship.documents
                      .filter((d) => getDocCategory(d) === 'technical_documentation')
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-[var(--color-glass-border)] transition">
                          <td className="py-3 px-4 font-bold text-[var(--text-main)]">{doc.title}</td>
                          <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{doc.documentNumber}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{doc.authority}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.issueDate)}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.expiryDate)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60 font-bold text-[10px]">
                              ACTIVE MANUAL
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: MISCELLANEOUS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Folder className="w-4 h-4" />
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                  Miscellaneous (Invoices, Cargo Chartering Orders, Port Access & Contracts)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20">
                  {ship.documents.filter((d) => getDocCategory(d) === 'misc').length}
                </span>
              </div>
              <button
                onClick={() => openAddDocModal('misc')}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Misc Record
              </button>
            </div>

            <div className="mozuk-glass-card rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)]">
                  <tr>
                    <th className="py-3 px-4">Record Title</th>
                    <th className="py-3 px-4">Reference / Invoice No</th>
                    <th className="py-3 px-4">Issuing Party / Agency</th>
                    <th className="py-3 px-4">Filing Date</th>
                    <th className="py-3 px-4">Valid / Due Until</th>
                    <th className="py-3 px-4 text-right">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {ship.documents.filter((d) => getDocCategory(d) === 'misc').length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[var(--text-muted)] text-xs">
                        No invoices, charter party orders, or port permits filed yet.
                      </td>
                    </tr>
                  ) : (
                    ship.documents
                      .filter((d) => getDocCategory(d) === 'misc')
                      .map((doc) => (
                        <tr key={doc.id} className="hover:bg-[var(--color-glass-border)] transition">
                          <td className="py-3 px-4 font-bold text-[var(--text-main)]">{doc.title}</td>
                          <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{doc.documentNumber}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{doc.authority}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.issueDate)}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)]">{formatDate(doc.expiryDate)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2.5 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/60 font-bold text-[10px]">
                              FILED RECORD
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VISITOR LOGBOOK */}
      {activeTab === 'visitors' && (() => {
        const allVisitors = ship.visitors || [];

        const uniqueLocations = Array.from(
          new Set(allVisitors.map((v) => v.location?.trim()).filter(Boolean))
        );

        const uniqueCompanies = Array.from(
          new Set(allVisitors.map((v) => v.company?.trim()).filter(Boolean))
        );

        const currentlyOnboardCount = allVisitors.filter(
          (v) => !v.timeOut || v.timeOut.trim() === ''
        ).length;

        const filteredVisitors = allVisitors.filter((visitor) => {
          // Date From Filter
          if (visitorFilterDateFrom) {
            const fromTime = parseDDMMYYYY(visitorFilterDateFrom);
            const visTime = parseDDMMYYYY(visitor.date);
            if (visTime < fromTime) return false;
          }
          // Date To Filter
          if (visitorFilterDateTo) {
            const toTime = parseDDMMYYYY(visitorFilterDateTo);
            const visTime = parseDDMMYYYY(visitor.date);
            if (visTime > toTime) return false;
          }
          // Location Filter
          if (visitorFilterLocation !== 'all') {
            if ((visitor.location || '').toLowerCase() !== visitorFilterLocation.toLowerCase()) {
              return false;
            }
          }
          // Company Filter
          if (visitorFilterCompany !== 'all') {
            if ((visitor.company || '').toLowerCase() !== visitorFilterCompany.toLowerCase()) {
              return false;
            }
          }
          return true;
        });

        const resetVisitorFilters = () => {
          setVisitorFilterDateFrom('');
          setVisitorFilterDateTo('');
          setVisitorFilterLocation('all');
          setVisitorFilterCompany('all');
        };

        const hasActiveFilters =
          visitorFilterDateFrom !== '' ||
          visitorFilterDateTo !== '' ||
          visitorFilterLocation !== 'all' ||
          visitorFilterCompany !== 'all';

        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
              <div>
                <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[var(--color-primary)]" />
                  Vessel Visitor Logbook & Physical Registry
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Official physical logbook entries for shore inspectors, auditors, service technicians, and port agents.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* 3. Small "Currently On Board" pill next to Log New Visitor */}
                <div className="px-3.5 py-2 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-extrabold text-xs flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>On Board: <strong className="text-white ml-0.5">{currentlyOnboardCount}</strong></span>
                </div>

                <button
                  onClick={() => setIsAddVisitorModalOpen(true)}
                  className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Log New Visitor
                </button>
              </div>
            </div>

            {/* 5. Filter Options Bar (Date From-To, Location, Company) */}
            <div className="mozuk-glass-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)] shrink-0">
                  <Filter className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Filters:</span>
                </div>

                {/* Date From */}
                <div className="flex items-center gap-1.5 bg-[var(--color-bg-alt)] px-3 py-1.5 rounded-xl border border-[var(--color-glass-border)]">
                  <span className="text-[var(--text-muted)] text-[11px] font-semibold whitespace-nowrap">From:</span>
                  <DateInput
                    value={visitorFilterDateFrom}
                    onChange={(val) => setVisitorFilterDateFrom(val)}
                    placeholder="dd/mm/yyyy"
                    inputClassName="bg-transparent w-24"
                  />
                </div>

                {/* Date To */}
                <div className="flex items-center gap-1.5 bg-[var(--color-bg-alt)] px-3 py-1.5 rounded-xl border border-[var(--color-glass-border)]">
                  <span className="text-[var(--text-muted)] text-[11px] font-semibold whitespace-nowrap">To:</span>
                  <DateInput
                    value={visitorFilterDateTo}
                    onChange={(val) => setVisitorFilterDateTo(val)}
                    placeholder="dd/mm/yyyy"
                    inputClassName="bg-transparent w-24"
                  />
                </div>

                {/* Location Filter */}
                <div className="flex items-center gap-1.5 bg-[var(--color-bg-alt)] px-3 py-1.5 rounded-xl border border-[var(--color-glass-border)]">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <select
                    value={visitorFilterLocation}
                    onChange={(e) => setVisitorFilterLocation(e.target.value)}
                    className="bg-transparent text-[var(--text-main)] text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div className="flex items-center gap-1.5 bg-[var(--color-bg-alt)] px-3 py-1.5 rounded-xl border border-[var(--color-glass-border)]">
                  <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                  <select
                    value={visitorFilterCompany}
                    onChange={(e) => setVisitorFilterCompany(e.target.value)}
                    className="bg-transparent text-[var(--text-main)] text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Companies</option>
                    {uniqueCompanies.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetVisitorFilters}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>

            {/* Visitor Logbook Table */}
            <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)]">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Visitor Full Name</th>
                    <th className="py-3 px-3">Company / Organization</th>
                    <th className="py-3 px-3">Reason of Visit</th>
                    <th className="py-3 px-3">Location / Berth</th>
                    <th className="py-3 px-3">Time In</th>
                    <th className="py-3 px-3">Time Out</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right sticky right-0 bg-[var(--color-bg-alt)] z-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[var(--text-muted)] text-xs">
                        {hasActiveFilters
                          ? 'No visitor records match the selected filters.'
                          : 'No visitors logged for this vessel yet. Click "Log New Visitor" to record ship visits.'}
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((visitor) => {
                      const isOnboard = !visitor.timeOut || visitor.timeOut.trim() === '';
                      return (
                        <tr key={visitor.id} className="hover:bg-[var(--color-glass-border)] transition group">
                          <td className="py-3 px-3 font-extrabold text-[var(--text-main)] font-mono whitespace-nowrap align-middle">
                            {formatDate(visitor.date)}
                          </td>

                          {/* 2. Full Name without logo initials */}
                          <td className="py-3 px-3 font-bold text-[var(--text-main)] text-xs whitespace-nowrap align-middle">
                            {visitor.fullName}
                          </td>

                          {/* 1. Company Name with shrink-0 icon to prevent squashing */}
                          <td className="py-3 px-3 text-[var(--text-muted)] font-medium align-middle">
                            <div className="flex items-center gap-1.5 whitespace-nowrap max-w-[160px] truncate" title={visitor.company}>
                              <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                              <span className="text-xs text-[var(--text-main)] truncate">{visitor.company}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-[var(--text-main)] max-w-[180px] truncate align-middle" title={visitor.reason}>
                            {visitor.reason}
                          </td>
                          
                          <td className="py-3 px-3 text-[var(--text-muted)] align-middle whitespace-nowrap">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{visitor.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap align-middle">
                            {visitor.timeIn}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[var(--text-muted)] whitespace-nowrap align-middle">
                            {visitor.timeOut || '—'}
                          </td>

                          {/* 4. Single-line status badge */}
                          <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                            {isOnboard ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-extrabold text-[10px] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                                ON BOARD
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-slate-800/60 text-slate-400 border border-slate-700/60 font-bold text-[10px] inline-flex items-center whitespace-nowrap shrink-0">
                                DEPARTED
                              </span>
                            )}
                          </td>

                          {/* 4. Sticky single-line action buttons */}
                          <td className="py-3 px-3 text-right align-middle whitespace-nowrap sticky right-0 bg-[var(--color-surface)] group-hover:bg-[var(--color-glass-border)] transition z-10">
                            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                              {isOnboard && (
                                <button
                                  onClick={() => handleSignOutVisitor(visitor.id)}
                                  className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 text-[11px] font-bold transition inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-sm"
                                  title="Sign out visitor at current time"
                                >
                                  <LogOut className="w-3 h-3 shrink-0" /> Sign Out
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveVisitor(visitor.id)}
                                className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition inline-flex items-center shrink-0 shadow-sm"
                                title="Delete log entry"
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
          </div>
        );
      })()}

      {/* MODAL 1: ADD CREW MEMBER */}
      {isAddCrewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[var(--color-primary)]" /> Add Crew Member to {ship.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Assign existing company personnel or register a new crew member</p>
              </div>
              <button onClick={() => setIsAddCrewModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 pt-4 pb-2 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-alt)]">
              <div className="grid grid-cols-2 gap-2 bg-[var(--color-bg)] p-1 rounded-xl border border-[var(--color-glass-border)] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAddCrewTab('select')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                    addCrewTab === 'select'
                      ? 'bg-[var(--color-primary)] text-slate-950 shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Select from Roster
                </button>
                <button
                  type="button"
                  onClick={() => setAddCrewTab('create')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                    addCrewTab === 'create'
                      ? 'bg-[var(--color-primary)] text-slate-950 shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register New Crew
                </button>
              </div>
            </div>

            {/* TAB 1: SELECT FROM COMPANY ROSTER */}
            {addCrewTab === 'select' ? (
              <form onSubmit={handleAssignExistingCrewSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1.5">
                    Select Company Crew Member *
                  </label>
                  <select
                    value={selectedExistingCrewId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedExistingCrewId(id);
                      const selected = companyCrew.find((c) => c.id === id);
                      if (selected) {
                        setCrewRole(selected.role);
                      }
                    }}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="">-- Choose a Crew Member from Company Database --</option>
                    
                    {/* Unassigned Standby Crew First */}
                    <optgroup label="⚡ Unassigned Pool (Available)">
                      {companyCrew
                        .filter((c) => !c.assignedShipId && !ship.crew.some((sc) => sc.id === c.id))
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.role} ({c.nationality}) • UNASSIGNED
                          </option>
                        ))}
                    </optgroup>

                    {/* Assigned Crew on Other Vessels */}
                    <optgroup label="⚓ Currently Onboard Other Vessels">
                      {companyCrew
                        .filter((c) => c.assignedShipId && c.assignedShipId !== ship.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.role} (Currently on {c.assignedShipName})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {selectedExistingCrewId && (() => {
                  const selectedCrew = companyCrew.find((c) => c.id === selectedExistingCrewId);
                  if (!selectedCrew) return null;

                  return (
                    <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] space-y-1">
                      <div className="font-extrabold text-[var(--text-main)] text-xs flex items-center justify-between">
                        <span>{selectedCrew.name}</span>
                        <span className="text-[var(--color-primary)]">{selectedCrew.nationality}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono">
                        Passport: {selectedCrew.passportNumber || 'N/A'} • Seaman Book: {selectedCrew.seamanBookNo || 'N/A'}
                      </div>
                      <div className="text-[11px] text-amber-400 font-bold mt-1">
                        Current Status: {selectedCrew.assignedShipName ? `Working on ${selectedCrew.assignedShipName}` : 'Unassigned'}
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Rank / Position on {ship.name}</label>
                  <input
                    type="text"
                    value={crewRole}
                    onChange={(e) => setCrewRole(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On Date</label>
                    <DateInput
                      value={crewSignOnDate}
                      onChange={(val) => setCrewSignOnDate(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On City / Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Rotterdam"
                      value={crewSignOnLocation}
                      onChange={(e) => setCrewSignOnLocation(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsAddCrewModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedExistingCrewId}
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold disabled:opacity-50"
                  >
                    Assign to {ship.name}
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: REGISTER NEW CREW MEMBER FORM */
              <form onSubmit={handleAddCrew} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Capt. Marcus Vance"
                    value={crewName}
                    onChange={(e) => setCrewName(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. m.vance@mozukmarine.com"
                    value={crewEmail}
                    onChange={(e) => setCrewEmail(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Department Branch *</label>
                <select
                  value={crewDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value as any)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold"
                >
                  <option value="master">Master</option>
                  <option value="deck">Deck Department (Navigation & Cargo)</option>
                  <option value="engine">Engine Department (Propulsion & Electrical)</option>
                  <option value="kitchen">Kitchen / Mess Department (Catering & Galley)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Rank / Role *</label>
                <select
                  value={crewRole}
                  onChange={(e) => setCrewRole(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                >
                  {crewDepartment === 'master' && (
                    <option value="Master / Captain">Master / Captain</option>
                  )}
                  {crewDepartment === 'deck' && (
                    <>
                      <option value="Chief Officer">Chief Officer</option>
                      <option value="Second Officer">Second Officer</option>
                      <option value="Third Officer">Third Officer</option>
                      <option value="Bosun">Bosun</option>
                      <option value="Able Seaman">Able Seaman</option>
                      <option value="Ordinary Seaman">Ordinary Seaman</option>
                      <option value="Deck Cadet">Deck Cadet</option>
                    </>
                  )}
                  {crewDepartment === 'engine' && (
                    <>
                      <option value="Chief Engineer">Chief Engineer</option>
                      <option value="Second Engineer">Second Engineer</option>
                      <option value="Third Engineer">Third Engineer</option>
                      <option value="Fourth Engineer">Fourth Engineer</option>
                      <option value="Electro-Technical Officer (ETO)">Electro-Technical Officer (ETO)</option>
                      <option value="Oiler / Motorman">Oiler / Motorman</option>
                      <option value="Fitter">Fitter</option>
                      <option value="Engine Cadet">Engine Cadet</option>
                    </>
                  )}
                  {crewDepartment === 'kitchen' && (
                    <>
                      <option value="Chief Cook">Chief Cook</option>
                      <option value="Second Cook">Second Cook</option>
                      <option value="Chief Steward">Chief Steward</option>
                      <option value="Messman">Messman</option>
                      <option value="Galley Hand">Galley Hand</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Nationality</label>
                  <input
                    type="text"
                    placeholder="e.g. Mozambican"
                    value={crewNationality}
                    onChange={(e) => setCrewNationality(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Date of Birth</label>
                  <DateInput
                    value={crewDateOfBirth}
                    onChange={(val) => setCrewDateOfBirth(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GB-99482019"
                    value={crewPassportNumber}
                    onChange={(e) => setCrewPassportNumber(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Passport Expiry</label>
                  <DateInput
                    value={crewPassportExpiry}
                    onChange={(val) => setCrewPassportExpiry(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Seaman's Book No.</label>
                  <input
                    type="text"
                    placeholder="e.g. SB-884920"
                    value={seamanBookNo}
                    onChange={(e) => setSeamanBookNo(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Seaman Book Expiry</label>
                  <DateInput
                    value={crewSeamanBookExpiry}
                    onChange={(val) => setCrewSeamanBookExpiry(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On Date</label>
                  <DateInput
                    value={crewSignOnDate}
                    onChange={(val) => setCrewSignOnDate(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On City / Port</label>
                  <input
                    type="text"
                    placeholder="e.g. Rotterdam"
                    value={crewSignOnLocation}
                    onChange={(e) => setCrewSignOnLocation(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddCrewModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Add Crew Member
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TECHNICAL DOCUMENT */}
      {isAddDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[var(--color-primary)]" /> Add Technical Document
              </h3>
              <button onClick={() => setIsAddDocModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Document Section / Category *</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold"
                >
                  <option value="certifications">Certifications (Class, Flag, Statutory & ISM)</option>
                  <option value="technical_documentation">Technical Documentation (Manuals, Schematics & Drawings)</option>
                  <option value="misc">Misc (Invoices, Chartering Orders, Port Access & Contracts)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. International Load Line Certificate"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Document Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ILLC-2024-99"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. DNV / ClassNK"
                    value={docAuthority}
                    onChange={(e) => setDocAuthority(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Issue Date</label>
                  <DateInput
                    value={docIssueDate}
                    onChange={(val) => setDocIssueDate(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Expiry Date *</label>
                  <DateInput
                    value={docExpiryDate}
                    onChange={(val) => setDocExpiryDate(val)}
                    required
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG REPAIR / MAINTENANCE WORK ORDER */}
      {isAddRepairModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[var(--color-primary)]" /> Log Repair / Maintenance Task
              </h3>
              <button onClick={() => setIsAddRepairModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogRepair} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Repair Title / Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Main Engine Cylinder #3 Valve Overhaul"
                  value={repairTitle}
                  onChange={(e) => setRepairTitle(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Category</label>
                  <select
                    value={repairCategory}
                    onChange={(e) => setRepairCategory(e.target.value as any)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  >
                    <option value="Machinery">Machinery</option>
                    <option value="Hull">Hull</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Safety">Safety</option>
                    <option value="Navigation">Navigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Priority</label>
                  <select
                    value={repairPriority}
                    onChange={(e) => setRepairPriority(e.target.value as any)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Reported By</label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Engineer"
                    value={repairReportedBy}
                    onChange={(e) => setRepairReportedBy(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Target Due Date</label>
                  <DateInput
                    value={repairDueDate}
                    onChange={(val) => setRepairDueDate(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Detailed Work Order Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide technical details, spare parts required, or diagnostic findings..."
                  value={repairDescription}
                  onChange={(e) => setRepairDescription(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddRepairModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Log Repair Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREW MEMBER PROFILE */}
      {selectedCrewMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Profile Header */}
            <div className="px-6 py-5 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] font-extrabold text-2xl shadow-md">
                  {selectedCrewMember.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl">
                      {selectedCrewMember.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[10px] uppercase border border-[var(--color-primary)]/30">
                      {selectedCrewMember.department || getCrewDepartment(selectedCrewMember)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-wider mt-0.5">
                    {selectedCrewMember.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCrewMember(null)}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* 8 Field Identity Cards Grid */}
              <div>
                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] mb-3 flex items-center gap-2 border-b border-[var(--color-glass-border)] pb-2">
                  <UserCheck className="w-4 h-4 text-[var(--color-primary)]" /> Personal & Maritime Credentials
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Email */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Email Address
                    </div>
                    <div className="font-mono font-bold text-[var(--text-main)] text-xs mt-1 truncate" title={selectedCrewMember.email}>
                      {selectedCrewMember.email || 'N/A'}
                    </div>
                  </div>

                  {/* 1. Nationality */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Nationality
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {selectedCrewMember.nationality || 'N/A'}
                    </div>
                  </div>

                  {/* 2. Date of Birth */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Date of Birth
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {formatDate(selectedCrewMember.dateOfBirth)}
                    </div>
                  </div>

                  {/* 3. Passport Number */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Passport No.
                    </div>
                    <div className="font-mono font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {selectedCrewMember.passportNumber || 'N/A'}
                    </div>
                  </div>

                  {/* 4. Passport Expiry */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Passport Expiry
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {formatDate(selectedCrewMember.passportExpiry)}
                    </div>
                  </div>

                  {/* 5. Seaman Book Number */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Seaman Book No.
                    </div>
                    <div className="font-mono font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {selectedCrewMember.seamanBookNo || 'N/A'}
                    </div>
                  </div>

                  {/* 6. Seaman Book Expiry */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Seaman Book Expiry
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {formatDate(selectedCrewMember.seamanBookExpiry)}
                    </div>
                  </div>

                  {/* 7. Signed On Date */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Anchor className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Signed On Date
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {formatDate(selectedCrewMember.signOnDate)}
                    </div>
                  </div>

                  {/* 8. Signed On Location (City) */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Sign-On City
                    </div>
                    <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                      {selectedCrewMember.signOnLocation || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 9. History of Ships Worked On */}
              <div>
                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] mb-3 flex items-center gap-2 border-b border-[var(--color-glass-border)] pb-2">
                  <History className="w-4 h-4 text-[var(--color-primary)]" /> Company Vessel Service History
                </h4>

                {(!selectedCrewMember.vesselHistory || selectedCrewMember.vesselHistory.length === 0) ? (
                  <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center text-[var(--text-muted)] text-xs border border-[var(--color-glass-border)]">
                    Current vessel ({ship.name}) is the first recorded assignment in company fleet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sortVesselHistory(selectedCrewMember.vesselHistory).map((entry, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--color-surface)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-[var(--text-main)] text-xs">{entry.shipName}</h5>
                            <span className="text-[11px] text-[var(--color-primary)] font-semibold">{entry.role}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[var(--text-muted)] font-mono sm:text-right">
                          <span>{formatDate(entry.startDate)}</span>
                          <span className="mx-1.5">→</span>
                          <span className={!entry.endDate ? 'text-emerald-500 font-bold' : ''}>
                            {entry.endDate ? formatDate(entry.endDate) : 'Present (Current Assignment)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[var(--color-glass-border)] bg-[var(--color-surface)] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCrewMember(null)}
                className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: LOG NEW SHIP VISITOR */}
      {isAddVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" /> Log New Visitor to {ship.name}
              </h3>
              <button onClick={() => setIsAddVisitorModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVisitor} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Visit Date *</label>
                  <DateInput
                    value={visitorDate}
                    onChange={(val) => setVisitorDate(val)}
                    inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Port / Berth Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rotterdam Port, Berth 4"
                    value={visitorLocation}
                    onChange={(e) => setVisitorLocation(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Johnathan Miller"
                  value={visitorFullName}
                  onChange={(e) => setVisitorFullName(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Company / Organization *</label>
                <input
                  type="text"
                  placeholder="e.g. DNV / Port State Control / Wärtsilä"
                  value={visitorCompany}
                  onChange={(e) => setVisitorCompany(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Reason of Visit *</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Class & Safety Inspection"
                  value={visitorReason}
                  onChange={(e) => setVisitorReason(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Time In *</label>
                  <input
                    type="time"
                    value={visitorTimeIn}
                    onChange={(e) => setVisitorTimeIn(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Time Out (Optional)</label>
                  <input
                    type="time"
                    value={visitorTimeOut}
                    onChange={(e) => setVisitorTimeOut(e.target.value)}
                    placeholder="Leave empty if currently on board"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Save Visitor Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
