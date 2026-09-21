import React, { useState } from 'react';
import { Ship, CrewMember, TechnicalDoc, MaintenanceLog } from '../types/vessel';
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
} from 'lucide-react';

interface VesselProfilePageProps {
  ship: Ship;
  onBack: () => void;
  onUpdateShip: (updatedShip: Ship) => void;
}

export const VesselProfilePage: React.FC<VesselProfilePageProps> = ({
  ship,
  onBack,
  onUpdateShip,
}) => {
  const [activeTab, setActiveTab] = useState<'crew' | 'documents' | 'maintenance'>('crew');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  // Modal States
  const [isAddCrewModalOpen, setIsAddCrewModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddRepairModalOpen, setIsAddRepairModalOpen] = useState(false);

  // New Crew Form State
  const [crewName, setCrewName] = useState('');
  const [crewDepartment, setCrewDepartment] = useState<'master' | 'deck' | 'engine' | 'kitchen'>('deck');
  const [crewRole, setCrewRole] = useState('Chief Officer');
  const [crewNationality, setCrewNationality] = useState('');
  const [crewSignOnDate, setCrewSignOnDate] = useState('');
  const [seamanBookNo, setSeamanBookNo] = useState('');

  // New Technical Doc Form State
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Statutory Certificate');
  const [docNumber, setDocNumber] = useState('');
  const [docIssueDate, setDocIssueDate] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docAuthority, setDocAuthority] = useState('DNV GL');

  // New Repair / Maintenance Form State
  const [repairTitle, setRepairTitle] = useState('');
  const [repairCategory, setRepairCategory] = useState<MaintenanceLog['category']>('Machinery');
  const [repairPriority, setRepairPriority] = useState<MaintenanceLog['priority']>('high');
  const [repairReportedBy, setRepairReportedBy] = useState('Chief Engineer');
  const [repairDueDate, setRepairDueDate] = useState('');
  const [repairDescription, setRepairDescription] = useState('');

  // Categorize Crew by Command Hierarchy
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

  const masterCrew = ship.crew.filter((c) => getCrewDepartment(c) === 'master');
  const deckCrew = ship.crew.filter((c) => getCrewDepartment(c) === 'deck');
  const engineCrew = ship.crew.filter((c) => getCrewDepartment(c) === 'engine');
  const kitchenCrew = ship.crew.filter((c) => getCrewDepartment(c) === 'kitchen');

  // Crew Handlers
  const handleAddCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewName.trim()) return;

    const newCrewMember: CrewMember = {
      id: `crew-${Date.now()}`,
      name: crewName.trim(),
      role: crewRole,
      department: crewDepartment,
      nationality: crewNationality.trim() || 'Mozambican',
      signOnDate: crewSignOnDate || new Date().toISOString().substring(0, 10),
      seamanBookNo: seamanBookNo.trim() || undefined,
    };

    onUpdateShip({
      ...ship,
      crew: [newCrewMember, ...ship.crew],
    });

    setCrewName('');
    setCrewNationality('');
    setCrewSignOnDate('');
    setSeamanBookNo('');
    setIsAddCrewModalOpen(false);
  };

  const handleRemoveCrew = (crewId: string) => {
    onUpdateShip({
      ...ship,
      crew: ship.crew.filter((c) => c.id !== crewId),
    });
  };

  // Technical Document Handlers
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docExpiryDate) return;

    const expiryDateObj = new Date(docExpiryDate);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));

    let status: TechnicalDoc['status'] = 'valid';
    if (daysRemaining <= 0) {
      status = 'expired';
    } else if (daysRemaining <= 30) {
      status = 'expiring';
    }

    const newDoc: TechnicalDoc = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      documentType: docType,
      documentNumber: docNumber.trim() || `CERT-${Date.now().toString().slice(-6)}`,
      issueDate: docIssueDate || new Date().toISOString().substring(0, 10),
      expiryDate: docExpiryDate,
      authority: docAuthority.trim() || 'Maritime Authority',
      status,
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
      loggedDate: new Date().toISOString().substring(0, 10),
      dueDate: repairDueDate || new Date().toISOString().substring(0, 10),
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
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[rgba(0,242,254,0.1)] border border-[var(--color-glass-border)] text-[var(--color-primary)] font-bold text-xs uppercase">
                {ship.type || 'Container Ship'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-mono text-[var(--color-primary)] font-bold text-xs">
                {ship.imo}
              </span>
              {ship.flag && (
                <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[var(--text-muted)] font-medium text-xs">
                  🇲🇿 {ship.flag}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)]">{ship.name}</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Registered Mozuk Marine fleet profile & command organization structure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddCrewModalOpen(true)}
              className="px-4 py-2.5 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Add Crew Member
            </button>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">IMO Number</div>
            <div className="font-mono text-[var(--text-main)] font-extrabold text-sm mt-0.5">{ship.imo}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Year of Build</div>
            <div className="font-extrabold text-[var(--text-main)] text-sm mt-0.5">{ship.builtYear || 'N/A'}</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Gross Tonnage</div>
            <div className="font-extrabold text-[var(--text-main)] text-sm mt-0.5">
              {ship.grossTonnage ? `${ship.grossTonnage.toLocaleString()} GT` : 'N/A'}
            </div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Active Crew</div>
            <div className="font-extrabold text-[var(--color-primary)] text-sm mt-0.5">{ship.crew.length} Members</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Tech Documents</div>
            <div className="font-extrabold text-emerald-400 text-sm mt-0.5">{ship.documents.length} Certificates</div>
          </div>

          <div className="bg-[var(--color-bg-alt)] p-3 rounded-xl border border-[var(--color-glass-border)]">
            <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Open Maintenance</div>
            <div className="font-extrabold text-amber-400 text-sm mt-0.5">{openRepairsCount + inProgressCount} Pending</div>
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
              <div className="w-full max-w-md mozuk-glass-card rounded-2xl p-5 border-2 border-amber-500/50 shadow-2xl relative bg-gradient-to-b from-amber-500/10 via-[var(--color-surface)] to-[var(--color-surface)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-extrabold text-[10px] tracking-widest px-3 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3 fill-slate-950" /> VESSEL COMMANDING OFFICER
                </div>

                {masterCrew.length > 0 ? (
                  masterCrew.map((master) => (
                    <div key={master.id} className="pt-2 text-center relative group">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-extrabold text-xl mx-auto mb-2 shadow-lg">
                        {master.name.charAt(0)}
                      </div>
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-lg text-[var(--text-main)]">
                        {master.name}
                      </h3>
                      <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                        {master.role}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-center gap-3">
                        <span>Nationality: <strong className="text-[var(--text-main)]">{master.nationality}</strong></span>
                        <span>Signed On: <strong className="text-[var(--text-main)]">{master.signOnDate}</strong></span>
                      </div>
                      {master.seamanBookNo && (
                        <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                          Seaman Book: {master.seamanBookNo}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveCrew(master.id)}
                        className="absolute top-0 right-0 p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition opacity-0 group-hover:opacity-100"
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

              {/* PERFECT TREE CONNECTORS (SVG Tree linking Master directly to 3 Department Columns) */}
              <div className="hidden md:block w-full h-12 my-0 pointer-events-none">
                <svg className="w-full h-full text-[var(--color-primary)]" viewBox="0 0 100 48" preserveAspectRatio="none">
                  {/* Trunk line from Master down to center point y=24 */}
                  <line x1="50" y1="0" x2="50" y2="24" stroke="currentColor" strokeWidth="2.5" />
                  {/* Horizontal crossbar connecting Deck (16.66%), Engine (50%), and Kitchen (83.33%) */}
                  <line x1="16.66" y1="24" x2="83.33" y2="24" stroke="currentColor" strokeWidth="2.5" />
                  {/* Vertical drop line into Deck Dept (16.66%) */}
                  <line x1="16.66" y1="24" x2="16.66" y2="48" stroke="currentColor" strokeWidth="2.5" />
                  {/* Vertical drop line into Engine Dept (50%) */}
                  <line x1="50" y1="24" x2="50" y2="48" stroke="currentColor" strokeWidth="2.5" />
                  {/* Vertical drop line into Kitchen Dept (83.33%) */}
                  <line x1="83.33" y1="24" x2="83.33" y2="48" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Mobile vertical line connector */}
              <div className="md:hidden w-0.5 h-6 bg-[var(--color-primary)] mx-auto my-1"></div>
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-cyan-500/50 transition group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0 mt-0.5">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-semibold text-[10px] mt-0.5 border border-cyan-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {member.signOnDate}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveCrew(member.id)}
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-blue-500/50 transition group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 font-semibold text-[10px] mt-0.5 border border-blue-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {member.signOnDate}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveCrew(member.id)}
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-emerald-500/50 transition group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-semibold text-[10px] mt-0.5 border border-emerald-800/40">
                                {member.role}
                              </span>
                              <div className="text-[11px] text-[var(--text-muted)] mt-1">
                                {member.nationality} • Signed on: {member.signOnDate}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveCrew(member.id)}
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
                      <span>Logged: <strong className="text-[var(--text-main)]">{log.loggedDate}</strong></span>
                      <span>Target Due: <strong className="text-[var(--text-main)]">{log.dueDate}</strong></span>
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

      {/* SECTION 3: TECHNICAL DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-base">Statutory Certificates & Technical Documents</h2>
              <p className="text-xs text-[var(--text-muted)]">Class certificates, safety management, and statutory filings</p>
            </div>
            <button
              onClick={() => setIsAddDocModalOpen(true)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Technical Document
            </button>
          </div>

          <div className="mozuk-glass-card rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)]">
                <tr>
                  <th className="py-3.5 px-4">Document Title</th>
                  <th className="py-3.5 px-4">Type / Code</th>
                  <th className="py-3.5 px-4">Authority</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {ship.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[var(--color-glass-border)] transition">
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">{doc.title}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{doc.documentNumber}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">{doc.authority}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">{doc.issueDate}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">{doc.expiryDate}</td>
                    <td className="py-3.5 px-4 text-right">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CREW MEMBER */}
      {isAddCrewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[var(--color-primary)]" /> Add Crew Member to {ship.name}
              </h3>
              <button onClick={() => setIsAddCrewModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCrew} className="p-6 space-y-4 text-xs">
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
                <label className="block text-[var(--text-main)] font-bold mb-1">Department Branch *</label>
                <select
                  value={crewDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value as any)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold"
                >
                  <option value="master">Vessel Command (Master / Captain)</option>
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
                  <label className="block text-[var(--text-main)] font-bold mb-1">Sign-On Date</label>
                  <input
                    type="date"
                    value={crewSignOnDate}
                    onChange={(e) => setCrewSignOnDate(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1">Seaman's Book No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SB-884920"
                  value={seamanBookNo}
                  onChange={(e) => setSeamanBookNo(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                />
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
                  <input
                    type="date"
                    value={docIssueDate}
                    onChange={(e) => setDocIssueDate(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
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
                  <input
                    type="date"
                    value={repairDueDate}
                    onChange={(e) => setRepairDueDate(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
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
    </div>
  );
};
