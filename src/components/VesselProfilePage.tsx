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
  Calendar,
  Shield,
  Trash2,
  Check,
  Play,
  RotateCcw,
  UserPlus,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<'crew' | 'documents' | 'maintenance'>('maintenance');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  // Modal States
  const [isAddCrewModalOpen, setIsAddCrewModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddRepairModalOpen, setIsAddRepairModalOpen] = useState(false);

  // New Crew Form State
  const [crewName, setCrewName] = useState('');
  const [crewRole, setCrewRole] = useState('Master');
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

  // Crew Handlers
  const handleAddCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewName.trim()) return;

    const newCrewMember: CrewMember = {
      id: `crew-${Date.now()}`,
      name: crewName.trim(),
      role: crewRole,
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

        <a
          href="https://marine.mozuk.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--text-muted)] hover:text-[var(--color-primary)] font-semibold flex items-center gap-1 transition"
        >
          Mozuk Marine Engineering <ExternalLink className="w-3 h-3" />
        </a>
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
              Registered Mozuk Marine fleet profile & statutory compliance record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddRepairModalOpen(true)}
              className="px-4 py-2.5 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" /> Log Repair / Maintenance
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
          onClick={() => setActiveTab('crew')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition ${
            activeTab === 'crew'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <Users className="w-4 h-4" />
          Crew Complement ({ship.crew.length})
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

      {/* SECTION 1: MAINTENANCE & REPAIR LOG */}
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

      {/* SECTION 2: CREW COMPLEMENT */}
      {activeTab === 'crew' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-base">Active Manning & Officers Roster</h2>
              <p className="text-xs text-[var(--text-muted)]">Current crew signed on board {ship.name}</p>
            </div>
            <button
              onClick={() => setIsAddCrewModalOpen(true)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Add Crew Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ship.crew.map((member) => (
              <div
                key={member.id}
                className="mozuk-glass-card rounded-2xl p-4 flex items-center justify-between shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(0,242,254,0.1)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-primary)] font-extrabold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)] text-sm">{member.name}</h3>
                    <div className="text-xs text-[var(--color-primary)] font-semibold">{member.role}</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Nationality: <strong className="text-[var(--text-main)]">{member.nationality}</strong> • Signed on: <strong className="text-[var(--text-main)]">{member.signOnDate}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCrew(member.id)}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 transition"
                  title="Remove crew member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
                <label className="block text-[var(--text-main)] font-bold mb-1">Rank / Role *</label>
                <select
                  value={crewRole}
                  onChange={(e) => setCrewRole(e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                >
                  <option value="Master">Master / Captain</option>
                  <option value="Chief Engineer">Chief Engineer</option>
                  <option value="Chief Officer">Chief Officer</option>
                  <option value="Second Engineer">Second Engineer</option>
                  <option value="Second Officer">Second Officer</option>
                  <option value="Third Engineer">Third Engineer</option>
                  <option value="Bosun">Bosun</option>
                  <option value="Able Seaman">Able Seaman</option>
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
