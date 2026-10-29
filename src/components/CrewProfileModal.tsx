import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CrewMember,
  CrewDocument,
  getEffectiveVesselHistory,
  VesselHistoryEntry,
} from '../types/vessel';
import { formatDate } from '../utils/dateFormatter';
import { getDefaultCrewDocuments } from '../utils/crewDocuments';
import { CrewAvatar } from './CrewAvatar';
import {
  X,
  UserCheck,
  History,
  FileCheck,
  Mail,
  Phone,
  Globe,
  Calendar,
  FileText,
  Clock,
  BookOpen,
  Anchor,
  MapPin,
  Briefcase,
  Plus,
  Search,
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface CrewProfileModalProps {
  crew: CrewMember | null;
  onClose: () => void;
  onUpdateCrew?: (updatedCrew: CrewMember) => void;
  shipName?: string;
}

export const CrewProfileModal: React.FC<CrewProfileModalProps> = ({
  crew,
  onClose,
  onUpdateCrew,
  shipName,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'history' | 'documents'>('personal');
  const [docFilter, setDocFilter] = useState<'all' | 'certification' | 'documentation'>('all');
  const [docSearch, setDocSearch] = useState('');
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'certification' | 'documentation'>('certification');
  const [newDocNo, setNewDocNo] = useState('');
  const [newAuthority, setNewAuthority] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');

  if (!crew) return null;

  // Documents list
  const documents: CrewDocument[] = getDefaultCrewDocuments(crew);

  // History sorting helper
  const sortVesselHistory = (history: VesselHistoryEntry[]) => {
    return [...history].sort((a, b) => {
      if (!a.endDate && b.endDate) return -1;
      if (a.endDate && !b.endDate) return 1;
      return (b.startDate || '').localeCompare(a.startDate || '');
    });
  };

  const effectiveHistory = getEffectiveVesselHistory(crew);

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesType = docFilter === 'all' || doc.type === docFilter;
    const q = docSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.authority.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const certCount = documents.filter((d) => d.type === 'certification').length;
  const docCount = documents.filter((d) => d.type === 'documentation').length;

  // Add document handler
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: CrewDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      documentNumber: newDocNo.trim() || `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
      authority: newAuthority.trim() || 'Maritime Authority',
      issueDate: formatDate(newIssueDate) || '01/01/2026',
      expiryDate: newExpiryDate ? formatDate(newExpiryDate) : undefined,
      status: 'valid',
      fileSize: '1.5 MB',
    };

    const updatedDocs = [newDoc, ...documents];
    const updatedCrew: CrewMember = {
      ...crew,
      documents: updatedDocs,
    };

    if (onUpdateCrew) {
      onUpdateCrew(updatedCrew);
    }

    // Reset form
    setNewTitle('');
    setNewDocNo('');
    setNewAuthority('');
    setNewIssueDate('');
    setNewExpiryDate('');
    setIsAddDocOpen(false);
  };

  // Delete document handler
  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    const updatedCrew: CrewMember = {
      ...crew,
      documents: updatedDocs,
    };
    if (onUpdateCrew) {
      onUpdateCrew(updatedCrew);
    }
  };

  // Simulated download
  const handleDownload = (doc: CrewDocument) => {
    setDownloadSuccess(`Downloaded: ${doc.title}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Profile Header */}
        <div className="px-6 py-5 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <CrewAvatar
              crew={crew}
              size="lg"
              className="shadow-md border-2 border-[#28ada4]/60 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl truncate">
                  {crew.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--text-main)] font-extrabold text-[10px] uppercase border border-[var(--color-glass-border)] shrink-0">
                  {crew.department === 'master'
                    ? 'Master'
                    : crew.department
                    ? `${crew.department.toUpperCase()} DEPT`
                    : 'CREW'}
                </span>
                {crew.assignedShipName && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#28ada4]/15 text-[#28ada4] font-extrabold text-[10px] border border-[#28ada4]/35 shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28ada4] animate-pulse"></span>
                    Onboard {crew.assignedShipName}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#28ada4] font-bold uppercase tracking-wider mt-0.5">
                {crew.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition shrink-0 ml-3"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION BAR */}
        <div className="px-6 pt-3 pb-0 border-b border-[var(--color-glass-border)] bg-[var(--color-surface)]/60 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Tab 1: Personal Info */}
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 px-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'personal'
                  ? 'border-[#28ada4] text-[#28ada4]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Personal Info</span>
            </button>

            {/* Tab 2: Company Vessel History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'border-[#28ada4] text-[#28ada4]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Company Vessel History</span>
              {effectiveHistory.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10 text-[var(--text-main)] font-mono">
                  {effectiveHistory.length}
                </span>
              )}
            </button>

            {/* Tab 3: Documents & Certifications */}
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 px-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-[#28ada4] text-[#28ada4]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Documents & Certifications</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#28ada4]/15 text-[#28ada4] font-extrabold border border-[#28ada4]/35">
                {documents.length}
              </span>
            </button>
          </div>
        </div>

        {/* Download notification banner */}
        {downloadSuccess && (
          <div className="bg-[#28ada4]/15 border-b border-[#28ada4]/30 px-6 py-2 text-xs font-bold text-[#28ada4] flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#28ada4]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* TAB CONTENTS (Scrollable Body) */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* TAB 1: PERSONAL INFO */}
            {/* ======================================================== */}
            {activeTab === 'personal' && (
              <motion.div
                key="tab-personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#28ada4]" /> Identity & Maritime Credentials
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Email */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#28ada4]" /> Email Address
                      </div>
                      <div className="font-mono font-bold text-[var(--text-main)] text-xs mt-1 truncate" title={crew.email}>
                        {crew.email || 'N/A'}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#28ada4]" /> Phone Number
                      </div>
                      <div className="font-mono font-bold text-[var(--text-main)] text-xs mt-1 truncate" title={crew.phoneNumber}>
                        {crew.phoneNumber || 'N/A'}
                      </div>
                    </div>

                    {/* Nationality */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#28ada4]" /> Nationality
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {crew.nationality || 'N/A'}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#28ada4]" /> Date of Birth
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {formatDate(crew.dateOfBirth)}
                      </div>
                    </div>

                    {/* Passport Number */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#28ada4]" /> Passport No.
                      </div>
                      <div className="font-mono font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {crew.passportNumber || 'N/A'}
                      </div>
                    </div>

                    {/* Passport Expiry */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#28ada4]" /> Passport Expiry
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {formatDate(crew.passportExpiry)}
                      </div>
                    </div>

                    {/* Seaman Book Number */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#28ada4]" /> Seaman Book No.
                      </div>
                      <div className="font-mono font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {crew.seamanBookNo || 'N/A'}
                      </div>
                    </div>

                    {/* Seaman Book Expiry */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#28ada4]" /> Seaman Book Expiry
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {formatDate(crew.seamanBookExpiry)}
                      </div>
                    </div>

                    {/* Signed On Date */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <Anchor className="w-3.5 h-3.5 text-[#28ada4]" /> Signed On Date
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {formatDate(crew.signOnDate)}
                      </div>
                    </div>

                    {/* Signed On Location */}
                    <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-glass-border)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#28ada4]" /> Sign-On City / Port
                      </div>
                      <div className="font-extrabold text-[var(--text-main)] text-xs mt-1">
                        {crew.signOnLocation || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: COMPANY VESSEL HISTORY */}
            {/* ======================================================== */}
            {activeTab === 'history' && (
              <motion.div
                key="tab-history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <History className="w-4 h-4 text-[#28ada4]" /> Company Vessel Service Timeline
                  </h4>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">
                    Total Assignments: {effectiveHistory.length}
                  </span>
                </div>

                {effectiveHistory.length === 0 ? (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-8 text-center text-[var(--text-muted)] text-xs border border-[var(--color-glass-border)]">
                    <Briefcase className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                    No prior vessel assignment recorded in company fleet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {sortVesselHistory(effectiveHistory).map((entry, idx) => (
                      <div
                        key={idx}
                        className={`bg-[var(--color-surface)] border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                          !entry.endDate
                            ? 'border-[#28ada4]/50 shadow-md shadow-[#28ada4]/5'
                            : 'border-[var(--color-glass-border)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`p-2.5 rounded-xl font-bold shrink-0 ${
                              !entry.endDate
                                ? 'bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30'
                                : 'bg-black/5 dark:bg-white/10 text-[var(--text-main)] border border-[var(--color-glass-border)]'
                            }`}
                          >
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-extrabold text-[var(--text-main)] text-sm">
                                {entry.shipName}
                              </h5>
                              {!entry.endDate && (
                                <span className="px-2 py-0.5 rounded-full bg-[#28ada4]/15 text-[#28ada4] font-extrabold text-[9px] uppercase border border-[#28ada4]/35">
                                  Current Assignment
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#28ada4] font-semibold mt-0.5 inline-block">
                              {entry.role}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[var(--text-muted)] font-mono sm:text-right">
                          <span className="font-bold text-[var(--text-main)]">{formatDate(entry.startDate)}</span>
                          <span className="mx-2">→</span>
                          <span className={!entry.endDate ? 'text-[#28ada4] font-extrabold uppercase' : ''}>
                            {entry.endDate ? formatDate(entry.endDate) : 'Present (Active)'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: DOCUMENTS & CERTIFICATIONS */}
            {/* ======================================================== */}
            {activeTab === 'documents' && (
              <motion.div
                key="tab-documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Metrics Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Total Files</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-black text-xl text-[var(--text-main)] mt-0.5">
                      {documents.length}
                    </div>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Certifications</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-black text-xl text-[#28ada4] mt-0.5">
                      {certCount}
                    </div>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Documentation</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-black text-xl text-[var(--text-main)] mt-0.5">
                      {docCount}
                    </div>
                  </div>
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Compliance</div>
                    <div className="font-extrabold text-xs text-[#28ada4] flex items-center gap-1 mt-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Valid
                    </div>
                  </div>
                </div>

                {/* Filter & Action Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-glass-border)] shrink-0">
                    <button
                      onClick={() => setDocFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        docFilter === 'all'
                          ? 'bg-[#28ada4] text-slate-950 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      All ({documents.length})
                    </button>
                    <button
                      onClick={() => setDocFilter('certification')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        docFilter === 'certification'
                          ? 'bg-[#28ada4] text-slate-950 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      Certifications ({certCount})
                    </button>
                    <button
                      onClick={() => setDocFilter('documentation')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        docFilter === 'documentation'
                          ? 'bg-[#28ada4] text-slate-950 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      Documentation ({docCount})
                    </button>
                  </div>

                  {/* Search and Add Button */}
                  <div className="flex items-center gap-2 flex-1 sm:justify-end">
                    <div className="relative flex-1 sm:max-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search document..."
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddDocOpen(!isAddDocOpen)}
                      className="px-3 py-1.5 rounded-xl btn-mozuk-primary font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Document</span>
                    </button>
                  </div>
                </div>

                {/* ADD DOCUMENT FORM (Collapse) */}
                <AnimatePresence>
                  {isAddDocOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddDocument}
                      className="bg-[var(--color-surface)] border border-[#28ada4]/40 p-4 rounded-2xl space-y-3 overflow-hidden shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-2 mb-2">
                        <h5 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5 text-[#28ada4]" /> Upload New Credential / Document
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsAddDocOpen(false)}
                          className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Document / Certificate Title *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. STCW II/1 Officer of the Watch"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Category / Type *
                          </label>
                          <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value as any)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[#28ada4]"
                          >
                            <option value="certification">Official Maritime Certification</option>
                            <option value="documentation">Operational Documentation / Contract</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Document / License Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. COC-UK-2026-9812"
                            value={newDocNo}
                            onChange={(e) => setNewDocNo(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-mono focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Issuing Authority / Flag State
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. MCA, DNV, Panama Maritime"
                            value={newAuthority}
                            onChange={(e) => setNewAuthority(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Issue Date
                          </label>
                          <input
                            type="date"
                            value={newIssueDate}
                            onChange={(e) => setNewIssueDate(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Expiry Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={newExpiryDate}
                            onChange={(e) => setNewExpiryDate(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-glass-border)]">
                        <button
                          type="button"
                          onClick={() => setIsAddDocOpen(false)}
                          className="px-3.5 py-1.5 rounded-xl btn-mozuk-secondary text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl btn-mozuk-primary text-xs font-bold shadow-sm"
                        >
                          Save to Profile
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* DOCUMENTS LIST */}
                {filteredDocuments.length === 0 ? (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-8 text-center text-[var(--text-muted)] text-xs border border-[var(--color-glass-border)]">
                    <FileCheck className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                    No documents or certificates match the current filter criteria.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-[var(--color-surface)] border border-[var(--color-glass-border)] hover:border-[#28ada4]/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Icon badge */}
                          <div
                            className={`p-2.5 rounded-xl font-bold shrink-0 mt-0.5 ${
                              doc.type === 'certification'
                                ? 'bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/35'
                                : 'bg-[#7b0b76]/15 text-[#7b0b76] border border-[#7b0b76]/35'
                            }`}
                          >
                            {doc.type === 'certification' ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-extrabold text-[var(--text-main)] text-xs">
                                {doc.title}
                              </h5>
                              <span
                                className={`px-2 py-0.2 rounded-full font-extrabold text-[9px] uppercase border ${
                                  doc.type === 'certification'
                                    ? 'bg-[#28ada4]/10 text-[#28ada4] border-[#28ada4]/30'
                                    : 'bg-[#7b0b76]/10 text-[#7b0b76] border-[#7b0b76]/30'
                                }`}
                              >
                                {doc.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--text-muted)] flex-wrap">
                              <span className="font-mono">
                                No: <strong className="text-[var(--text-main)]">{doc.documentNumber}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Authority: <strong className="text-[var(--text-main)]">{doc.authority}</strong>
                              </span>
                              {doc.fileSize && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[10px]">{doc.fileSize}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dates & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-glass-border)]">
                          <div className="text-[11px] text-[var(--text-muted)] font-mono sm:text-right">
                            <div>
                              Issued: <span className="text-[var(--text-main)]">{formatDate(doc.issueDate)}</span>
                            </div>
                            <div className="text-[10px]">
                              Expires: <span className="text-[#28ada4] font-bold">{doc.expiryDate ? formatDate(doc.expiryDate) : 'Valid (Indefinite)'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Download Button */}
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-1.5 rounded-lg bg-[var(--color-bg)] hover:bg-[#28ada4]/15 border border-[var(--color-glass-border)] hover:border-[#28ada4]/40 text-[var(--text-main)] hover:text-[#28ada4] transition"
                              title="Download digital certificate"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button (Subtle Dark Red) */}
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--text-muted)]">
            Registry ID: <span className="font-mono font-bold text-[var(--text-main)]">{crew.id}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full btn-mozuk-secondary font-bold text-xs"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};
