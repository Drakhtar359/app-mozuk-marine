import React, { useState, useRef } from 'react';
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
  Download,
  Trash2,
  CheckCircle2,
  Bell,
  Upload,
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
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'history' | 'documents'>('personal');
  const [docSearch, setDocSearch] = useState('');
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [alarmDocIds, setAlarmDocIds] = useState<Record<string, boolean>>({});

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newDocNo, setNewDocNo] = useState('');
  const [newAuthority, setNewAuthority] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!crew) return null;

  // Documents list (includes Passport & Seaman's book template for every seafarer)
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

  // Filtered documents by search query across all types (all in one tab)
  const filteredDocuments = documents.filter((doc) => {
    const q = docSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.documentNumber.toLowerCase().includes(q) ||
      doc.authority.toLowerCase().includes(q)
    );
  });

  // Add document handler
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: CrewDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      type: 'certification',
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
    setUploadedFileName('');
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

  // Toggle expiry alarm
  const handleToggleAlarm = (doc: CrewDocument) => {
    const nextState = !alarmDocIds[doc.id];
    setAlarmDocIds((prev) => ({ ...prev, [doc.id]: nextState }));
    setDownloadSuccess(
      nextState
        ? `Expiry alarm set for: ${doc.title}`
        : `Expiry alarm cleared for: ${doc.title}`
    );
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2200);
  };

  // Simulated download
  const handleDownload = (doc: CrewDocument) => {
    setDownloadSuccess(`Downloaded: ${doc.title}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
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

      {/* Modal Dialog: Fixed dimensions to prevent window resizing/jumping when switching tabs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-3xl w-full max-w-4xl h-[650px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Profile Header (Fixed Top) */}
        <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
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
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition shrink-0 ml-3 cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION BAR (No numbers next to tabs) */}
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
            </button>

            {/* Tab 3: Documents */}
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
            </button>
          </div>
        </div>

        {/* Notification banner */}
        {downloadSuccess && (
          <div className="bg-[#28ada4]/15 border-b border-[#28ada4]/30 px-6 py-2 text-xs font-bold text-[#28ada4] flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#28ada4]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* TAB CONTENTS (Scrollable Body with fixed height container) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 text-xs">
          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* TAB 1: PERSONAL INFO */}
            {/* ======================================================== */}
            {activeTab === 'personal' && (
              <motion.div
                key="tab-personal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="space-y-3"
              >
                {/* Practical Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#28ada4]" /> All Seafarer Documents & Certifications
                  </h4>

                  <div className="flex items-center gap-2 flex-1 sm:justify-end">
                    <div className="relative flex-1 sm:max-w-[220px]">
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
                      className="px-3 py-1.5 rounded-xl btn-mozuk-primary font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
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
                          <Plus className="w-3.5 h-3.5 text-[#28ada4]" /> Add New Credential / Document
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsAddDocOpen(false)}
                          className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
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
                            placeholder="e.g. MCA, DNV, Maritime Authority"
                            value={newAuthority}
                            onChange={(e) => setNewAuthority(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[var(--text-main)] font-bold mb-1">
                            Document File Upload
                          </label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setUploadedFileName(file.name);
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-[var(--color-bg)] hover:bg-[#28ada4]/10 border border-dashed border-[#28ada4]/50 rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#28ada4]" />
                            <span className="truncate">
                              {uploadedFileName || 'Upload Document File (PDF / Image)'}
                            </span>
                          </button>
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
                          className="px-3.5 py-1.5 rounded-xl btn-mozuk-secondary text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl btn-mozuk-primary text-xs font-bold shadow-sm cursor-pointer"
                        >
                          Save to Profile
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* COMPACT SINGLE-LINE DOCUMENT TABLE (Fits horizontally, no horizontal scroll) */}
                {filteredDocuments.length === 0 ? (
                  <div className="bg-[var(--color-surface)] rounded-2xl p-8 text-center text-[var(--text-muted)] text-xs border border-[var(--color-glass-border)]">
                    No documents match your search criteria.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface)] shadow-sm">
                    <table className="w-full table-fixed text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-[var(--color-glass-border)] bg-[var(--color-surface)]/90 text-[9px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
                          <th className="py-2 px-2.5 w-[34%]">Document Title</th>
                          <th className="py-2 px-2 w-[16%]">Doc Number</th>
                          <th className="py-2 px-2 w-[20%]">Issuing Authority</th>
                          <th className="py-2 px-2 w-[10%]">Issued</th>
                          <th className="py-2 px-2 w-[10%]">Expires</th>
                          <th className="py-2 px-2.5 w-[10%] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-glass-border)]">
                        {filteredDocuments.map((doc) => {
                          const isAlarmActive = !!alarmDocIds[doc.id];
                          return (
                            <tr
                              key={doc.id}
                              className="hover:bg-[var(--color-bg)]/60 transition group"
                            >
                              {/* Document Title */}
                              <td
                                className="py-1.5 px-2.5 font-bold text-[var(--text-main)] truncate"
                                title={doc.title}
                              >
                                {doc.title}
                              </td>

                              {/* Document Number */}
                              <td
                                className="py-1.5 px-2 font-mono text-[10px] font-bold text-[var(--text-main)] truncate"
                                title={doc.documentNumber}
                              >
                                {doc.documentNumber}
                              </td>

                              {/* Issuing Authority */}
                              <td
                                className="py-1.5 px-2 text-[10px] text-[var(--text-muted)] truncate"
                                title={doc.authority}
                              >
                                {doc.authority}
                              </td>

                              {/* Issue Date */}
                              <td className="py-1.5 px-2 whitespace-nowrap font-mono text-[10px] text-[var(--text-main)]">
                                {formatDate(doc.issueDate) || '—'}
                              </td>

                              {/* Expiry Date */}
                              <td className="py-1.5 px-2 whitespace-nowrap font-mono text-[10px] text-[#28ada4] font-bold">
                                {doc.expiryDate ? formatDate(doc.expiryDate) : 'Valid'}
                              </td>

                              {/* Action Buttons (Alarm, Download, Subtle Red Delete) */}
                              <td className="py-1.5 px-2.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleToggleAlarm(doc)}
                                    className={`p-1 rounded-md border transition cursor-pointer ${
                                      isAlarmActive
                                        ? 'bg-[#28ada4]/20 border-[#28ada4] text-[#28ada4]'
                                        : 'bg-[var(--color-bg)] hover:bg-[#28ada4]/15 border-[var(--color-glass-border)] hover:border-[#28ada4]/40 text-[var(--text-main)] hover:text-[#28ada4]'
                                    }`}
                                    title={isAlarmActive ? 'Expiry Alarm Active' : 'Set Expiry Alarm'}
                                  >
                                    <Bell className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-1 rounded-md bg-[var(--color-bg)] hover:bg-[#28ada4]/15 border border-[var(--color-glass-border)] hover:border-[#28ada4]/40 text-[var(--text-main)] hover:text-[#28ada4] transition cursor-pointer"
                                    title="Download Document"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-1 rounded-md bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition cursor-pointer"
                                    title="Delete Document"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer (Fixed Bottom) */}
        <div className="px-6 py-3.5 border-t border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--text-muted)]">
            Registry ID: <span className="font-mono font-bold text-[var(--text-main)]">{crew.id}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full btn-mozuk-secondary font-bold text-xs cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};
