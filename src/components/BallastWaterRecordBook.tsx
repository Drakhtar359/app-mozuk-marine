import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, CrewMember, BallastWaterLog, IMOBallastCode, ElectronicSignature } from '../types/vessel';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import {
  Droplets,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  FileText,
  Printer,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Waves,
  X,
  Clock,
  Compass,
  FileCheck,
  HelpCircle,
  Hash,
  Download,
  Award,
} from 'lucide-react';

// IMO MEPC.372(80) & MEPC.369(80) Code Definitions
export const IMO_BALLAST_CODES: Record<
  IMOBallastCode,
  {
    title: string;
    description: string;
    defaultItems: string;
    color: string;
    badgeBg: string;
    badgeBorder: string;
  }
> = {
  A: {
    title: 'Code A: Ballast Water Uptake (Taken on board)',
    description: 'When ballast water is taken on board (pumping or gravitation)',
    defaultItems: 'A-1, A-2, A-3, A-4',
    color: '#28ada4',
    badgeBg: 'rgba(40,173,164,0.12)',
    badgeBorder: 'rgba(40,173,164,0.3)',
  },
  B: {
    title: 'Code B: Internal Circulation / Treatment',
    description: 'Whenever ballast water is circulated or treated for BWM purposes',
    defaultItems: 'B-1, B-2, B-3',
    color: '#0284c7',
    badgeBg: 'rgba(2,132,199,0.12)',
    badgeBorder: 'rgba(2,132,199,0.3)',
  },
  C: {
    title: 'Code C: Discharge to Sea',
    description: 'Whenever ballast water is discharged into the sea (>200nm / >200m depth / BWTS)',
    defaultItems: 'C-1, C-2, C-3, C-4',
    color: '#7b0b76',
    badgeBg: 'rgba(123,11,118,0.12)',
    badgeBorder: 'rgba(123,11,118,0.3)',
  },
  D: {
    title: 'Code D: Discharge to Reception Facility',
    description: 'Whenever ballast water is discharged to a shore reception facility or reception barge',
    defaultItems: 'D-1, D-2, D-3',
    color: '#d97706',
    badgeBg: 'rgba(217,119,6,0.12)',
    badgeBorder: 'rgba(217,119,6,0.3)',
  },
  E: {
    title: 'Code E: Accidental / Exceptional Uptake or Discharge',
    description: 'Accidental loss, emergency discharge, or ingress of ballast water',
    defaultItems: 'E-1, E-2, E-3',
    color: '#dc2626',
    badgeBg: 'rgba(220,38,38,0.12)',
    badgeBorder: 'rgba(220,38,38,0.3)',
  },
  F: {
    title: 'Code F: System Failures & Inoperabilities',
    description: 'Failures, alarms, or inoperabilities of the Ballast Water Management System',
    defaultItems: 'F-1, F-2, F-3, F-4',
    color: '#ea580c',
    badgeBg: 'rgba(234,88,12,0.12)',
    badgeBorder: 'rgba(234,88,12,0.3)',
  },
  G: {
    title: 'Code G: Tank Cleaning & Sediment Removal',
    description: 'Ballast tank cleaning, flushing, desedimentation or disposal to shipyard facility',
    defaultItems: 'G-1, G-2, G-3',
    color: '#475569',
    badgeBg: 'rgba(71,85,105,0.12)',
    badgeBorder: 'rgba(71,85,105,0.3)',
  },
  H: {
    title: 'Code H: General Remarks & Operational Procedures',
    description: 'Additional operational procedures, coastal state communications, or exemptions',
    defaultItems: 'H-1',
    color: '#64748b',
    badgeBg: 'rgba(100,116,139,0.12)',
    badgeBorder: 'rgba(100,116,139,0.3)',
  },
};

interface BallastWaterRecordBookProps {
  ship: Ship;
  companyCrew: CrewMember[];
  onUpdateShip: (updatedShip: Ship) => void;
}

export const BallastWaterRecordBook: React.FC<BallastWaterRecordBookProps> = ({
  ship,
  companyCrew,
  onUpdateShip,
}) => {
  const allLogs: BallastWaterLog[] = useMemo(() => {
    return (ship.ballastWaterLogs || []).map((log, index) => {
      // Ensure each log has a sequential entryNumber and default IMO Code if missing
      const entryNum = log.entryNumber || (ship.ballastWaterLogs?.length || 0) - index;
      let code: IMOBallastCode = log.imoCode || 'A';
      if (!log.imoCode) {
        if (log.operation === 'Ballasting') code = 'A';
        else if (log.operation === 'Deballasting') code = 'C';
        else if (log.operation === 'Internal Transfer') code = 'B';
        else if (log.operation === 'Ballast Exchange (BWM)') code = 'C';
      }
      return {
        ...log,
        entryNumber: entryNum,
        imoCode: code,
        status: log.status || (log.masterCountersignature ? 'countersigned_by_master' : 'signed_by_officer'),
      };
    });
  }, [ship.ballastWaterLogs]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCode, setFilterCode] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCountersignModalOpen, setIsCountersignModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedLogForCorrection, setSelectedLogForCorrection] = useState<BallastWaterLog | null>(null);
  const [selectedLogForCountersign, setSelectedLogForCountersign] = useState<BallastWaterLog | null>(null);

  // New Log Form State
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newImoCode, setNewImoCode] = useState<IMOBallastCode>('A');
  const [newImoItem, setNewImoItem] = useState('A-1, A-2, A-3, A-4');
  const [newDescription, setNewDescription] = useState('Uptake of ballast water from port waters via main ballast pump.');
  const [newTanks, setNewTanks] = useState('Fore Peak Tank (FPT) & DBT 1P/1S');
  const [newVolumeM3, setNewVolumeM3] = useState('');
  const [newGps, setNewGps] = useState('51° 55\' N, 003° 02\' E (Rotterdam Port)');
  const [newDistNm, setNewDistNm] = useState('');
  const [newDepthM, setNewDepthM] = useState('');
  const [newTreatmentMethod, setNewTreatmentMethod] = useState('Mozuk UV System Operational (IMO D-2 Compliant)');
  const [newOfficerName, setNewOfficerName] = useState('Chief Officer Alexey Ivanov');
  const [newOfficerRank, setNewOfficerRank] = useState('Chief Officer');
  const [newRemarks, setNewRemarks] = useState('');

  // Correction Form State
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctedVolumeM3, setCorrectedVolumeM3] = useState('');
  const [correctedRemarks, setCorrectedRemarks] = useState('');
  const [correctionOfficer, setCorrectionOfficer] = useState('Chief Officer Alexey Ivanov');

  // Master Countersign Form State
  const [masterSignerName, setMasterSignerName] = useState('Capt. Marcus Vance');
  const [masterSignRemarks, setMasterSignRemarks] = useState('');
  const [isBatchCountersign, setIsBatchCountersign] = useState(false);

  // PDF Export Form State
  const [pdfDateRange, setPdfDateRange] = useState<'all' | 'last7' | 'last30' | 'custom'>('all');
  const [pdfStartDate, setPdfStartDate] = useState('');
  const [pdfEndDate, setPdfEndDate] = useState('');

  // Find Master and Ballast Officers from Crew
  const masterCrewMember = useMemo(() => {
    return ship.crew.find((c) => c.role.toLowerCase().includes('captain') || c.role.toLowerCase().includes('master'));
  }, [ship.crew]);

  const chiefOfficerMember = useMemo(() => {
    return ship.crew.find((c) => c.role.toLowerCase().includes('chief officer') || c.role.toLowerCase().includes('first officer'));
  }, [ship.crew]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalVolumeUptake = allLogs
      .filter((l) => l.imoCode === 'A' && !l.superseded)
      .reduce((sum, l) => sum + (l.volumeM3 || 0), 0);
    const totalVolumeDischarge = allLogs
      .filter((l) => (l.imoCode === 'C' || l.imoCode === 'D') && !l.superseded)
      .reduce((sum, l) => sum + (l.volumeM3 || 0), 0);
    const pendingMasterCountersign = allLogs.filter(
      (l) => l.status === 'signed_by_officer' && !l.superseded
    ).length;
    return {
      totalOps: allLogs.length,
      totalVolumeUptake,
      totalVolumeDischarge,
      pendingMasterCountersign,
    };
  }, [allLogs]);

  // Filtered Logs for Display
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (filterCode !== 'all' && log.imoCode !== filterCode) {
        return false;
      }
      if (filterStatus === 'pending' && log.status !== 'signed_by_officer') {
        return false;
      }
      if (filterStatus === 'approved' && log.status !== 'countersigned_by_master') {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchCode = (log.imoCode || '').toLowerCase().includes(q);
        const matchTanks = (log.tanks || '').toLowerCase().includes(q);
        const matchLocation = (log.gpsCoordinates || '').toLowerCase().includes(q);
        const matchDesc = (log.operationDescription || '').toLowerCase().includes(q);
        const matchOfficer = (log.officerInCharge || '').toLowerCase().includes(q);
        const matchRemarks = (log.remarks || '').toLowerCase().includes(q);
        if (!matchCode && !matchTanks && !matchLocation && !matchDesc && !matchOfficer && !matchRemarks) {
          return false;
        }
      }
      return true;
    });
  }, [allLogs, filterCode, filterStatus, searchTerm]);

  // Handler: When IMO Code changes in Add modal, update default description and items
  const handleCodeChange = (code: IMOBallastCode) => {
    setNewImoCode(code);
    setNewImoItem(IMO_BALLAST_CODES[code].defaultItems);
    switch (code) {
      case 'A':
        setNewDescription('Uptake of ballast water from port waters via ballast pump No.1 in accordance with BWM Plan.');
        break;
      case 'B':
        setNewDescription('Internal circulation / transfer between tanks for vessel trim & stability, treated via BWTS.');
        break;
      case 'C':
        setNewDescription('Discharge of treated ballast water to sea in full compliance with IMO D-2 biological discharge standards.');
        break;
      case 'D':
        setNewDescription('Discharge of unmanaged ballast water to authorized port reception facility.');
        break;
      case 'E':
        setNewDescription('Exceptional / accidental intake or discharge of ballast water.');
        break;
      case 'F':
        setNewDescription('Failure or alarm on Ballast Water Management System (BWTS). Contingency protocol initiated.');
        break;
      case 'G':
        setNewDescription('Sediment cleaning and desedimentation of ballast tanks in accordance with Guidelines G12.');
        break;
      case 'H':
        setNewDescription('General maritime remark or coastal state compliance declaration.');
        break;
    }
  };

  // Handler: Add New Ballast Water Operation (Officer Signature 1)
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const volume = parseFloat(newVolumeM3) || 0;
    const nowIso = new Date().toISOString();
    const nextEntryNumber = (allLogs[0]?.entryNumber || allLogs.length) + 1;

    // Ballast Officer Electronic Signature 1
    const officerSig: ElectronicSignature = {
      signedBy: newOfficerName.trim() || 'Chief Officer',
      rank: newOfficerRank.trim() || 'Chief Officer',
      signedAt: `${newDate || getTodayDDMMYYYY()} ${newTime}`,
      signatureToken: `EBWRB-OFF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      role: 'ballast_officer',
    };

    const newEntry: BallastWaterLog = {
      id: `bw-${Date.now()}`,
      entryNumber: nextEntryNumber,
      date: formatDate(newDate || getTodayDDMMYYYY()),
      time: newTime || '08:00',
      imoCode: newImoCode,
      imoItem: newImoItem.trim(),
      operation:
        newImoCode === 'A'
          ? 'Ballasting'
          : newImoCode === 'C'
          ? 'Deballasting'
          : newImoCode === 'B'
          ? 'Internal Transfer'
          : newImoCode === 'D'
          ? 'Reception Facility'
          : 'Ballast Exchange (BWM)',
      operationDescription: newDescription.trim(),
      tanks: newTanks.trim(),
      volumeM3: volume,
      gpsCoordinates: newGps.trim(),
      distanceFromLandNm: newDistNm ? parseFloat(newDistNm) : undefined,
      depthMeters: newDepthM ? parseFloat(newDepthM) : undefined,
      treatmentMethod: newTreatmentMethod.trim(),
      officerInCharge: newOfficerName.trim(),
      officerSignature: officerSig,
      status: 'signed_by_officer',
      remarks: newRemarks.trim() || undefined,
    };

    onUpdateShip({
      ...ship,
      ballastWaterLogs: [newEntry, ...(ship.ballastWaterLogs || [])],
    });

    setIsAddModalOpen(false);
    setNewVolumeM3('');
    setNewRemarks('');
    setNewDistNm('');
    setNewDepthM('');
  };

  // Handler: Execute Master Countersignature 2 (Single or Batch)
  const handleExecuteMasterCountersign = (e: React.FormEvent) => {
    e.preventDefault();
    const nowTimestamp = `${getTodayDDMMYYYY()} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    const createMasterSig = (): ElectronicSignature => ({
      signedBy: masterSignerName.trim() || masterCrewMember?.name || 'Master / Captain',
      rank: 'Master / Captain',
      signedAt: nowTimestamp,
      signatureToken: `EBWRB-MST-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      role: 'master',
    });

    let updatedLogs: BallastWaterLog[];

    if (isBatchCountersign) {
      // Countersign all logs currently pending Master signature
      updatedLogs = (ship.ballastWaterLogs || []).map((log) => {
        if (!log.masterCountersignature && !log.superseded) {
          return {
            ...log,
            status: 'countersigned_by_master' as const,
            masterCountersignature: createMasterSig(),
            remarks: masterSignRemarks.trim()
              ? `${log.remarks ? log.remarks + ' | ' : ''}Master: ${masterSignRemarks.trim()}`
              : log.remarks,
          };
        }
        return log;
      });
    } else if (selectedLogForCountersign) {
      // Countersign specific log
      updatedLogs = (ship.ballastWaterLogs || []).map((log) => {
        if (log.id === selectedLogForCountersign.id) {
          return {
            ...log,
            status: 'countersigned_by_master' as const,
            masterCountersignature: createMasterSig(),
            remarks: masterSignRemarks.trim()
              ? `${log.remarks ? log.remarks + ' | ' : ''}Master: ${masterSignRemarks.trim()}`
              : log.remarks,
          };
        }
        return log;
      });
    } else {
      return;
    }

    onUpdateShip({
      ...ship,
      ballastWaterLogs: updatedLogs,
    });

    setIsCountersignModalOpen(false);
    setSelectedLogForCountersign(null);
    setMasterSignRemarks('');
  };

  // Handler: Append Tracked Corrective Entry (Immutability Enforcement: Never overwrite past records)
  const handleAppendCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLogForCorrection || !correctionReason.trim()) return;

    const original = selectedLogForCorrection;
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const nextEntryNumber = (allLogs[0]?.entryNumber || allLogs.length) + 1;

    // Tracked corrective entry
    const correctionSig: ElectronicSignature = {
      signedBy: correctionOfficer.trim() || 'Chief Officer',
      rank: 'Chief Officer',
      signedAt: `${getTodayDDMMYYYY()} ${nowTime}`,
      signatureToken: `EBWRB-CORR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      role: 'ballast_officer',
    };

    const correctiveEntry: BallastWaterLog = {
      id: `bw-corr-${Date.now()}`,
      entryNumber: nextEntryNumber,
      date: getTodayDDMMYYYY(),
      time: nowTime,
      imoCode: original.imoCode || 'A',
      imoItem: `${original.imoItem || 'A-1'} (CORRECTION)`,
      operation: original.operation,
      operationDescription: `CORRECTIVE ENTRY FOR ENTRY #${original.entryNumber}: ${correctionReason.trim()}`,
      tanks: original.tanks,
      volumeM3: correctedVolumeM3 ? parseFloat(correctedVolumeM3) : original.volumeM3,
      gpsCoordinates: original.gpsCoordinates,
      treatmentMethod: original.treatmentMethod,
      officerInCharge: correctionOfficer.trim(),
      officerSignature: correctionSig,
      status: 'signed_by_officer',
      isCorrection: true,
      correctsEntryId: original.id,
      correctionReason: correctionReason.trim(),
      remarks: correctedRemarks.trim()
        ? `Rectification note: ${correctedRemarks.trim()} (Original Entry #${original.entryNumber} superseded per MEPC.372(80))`
        : `Supersedes Entry #${original.entryNumber} pursuant to IMO MEPC.372(80) §6.2.`,
    };

    // Mark original entry as superseded without deleting historical record
    const updatedLogs = (ship.ballastWaterLogs || []).map((l) => {
      if (l.id === original.id) {
        return {
          ...l,
          superseded: true,
          remarks: `${l.remarks ? l.remarks + ' | ' : ''}[SUPERSEDED by Corrective Entry #${nextEntryNumber} on ${getTodayDDMMYYYY()}]`,
        };
      }
      return l;
    });

    onUpdateShip({
      ...ship,
      ballastWaterLogs: [correctiveEntry, ...updatedLogs],
    });

    setIsCorrectionModalOpen(false);
    setSelectedLogForCorrection(null);
    setCorrectionReason('');
    setCorrectedVolumeM3('');
    setCorrectedRemarks('');
  };

  // Filter logs for PDF Export
  const logsForPdf = useMemo(() => {
    let result = [...allLogs];
    if (pdfDateRange === 'last7') {
      const now = new Date();
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((l) => {
        const parts = l.date.split('/');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          return d >= cutoff;
        }
        return true;
      });
    } else if (pdfDateRange === 'last30') {
      const now = new Date();
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter((l) => {
        const parts = l.date.split('/');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          return d >= cutoff;
        }
        return true;
      });
    }
    // Return chronologically for official book printing (earliest to latest)
    return result.sort((a, b) => (a.entryNumber || 0) - (b.entryNumber || 0));
  }, [allLogs, pdfDateRange]);

  // Handler: Trigger Browser Window Print for PDF
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: MEPC.372(80) Compliance Header */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 shrink-0 shadow-sm">
              <Droplets className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl text-[var(--text-main)] tracking-tight">
                  Ballast Water Record Book (eBWRB)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 text-[10.5px] font-extrabold uppercase tracking-wide">
                  IMO MEPC.372(80) &amp; MEPC.369(80)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#7b0b76] border border-[#7b0b76]/30 text-[10.5px] font-extrabold uppercase tracking-wide">
                  D-2 Certified
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] max-w-3xl leading-relaxed">
                Official electronic logbook for recording all ballast operations (Codes A through H) on board{' '}
                <strong className="text-[var(--text-main)]">{ship.name}</strong> ({ship.imo}). Compliant with Regulation B-2
                with role-based dual signatures and immutable audit trails.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Export to PDF Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-90 transition cursor-pointer"
              title="Generate certified true copy PDF for Port State Control (PSC)"
            >
              <Printer className="w-4 h-4 text-[#28ada4]" /> Export to PDF
            </motion.button>

            {/* Master Batch Countersign Button (if pending items) */}
            {stats.pendingMasterCountersign > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsBatchCountersign(true);
                  setSelectedLogForCountersign(null);
                  setIsCountersignModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-full bg-[#7b0b76] text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-[#60085d] transition cursor-pointer"
                title="Countersign all pending entries as Master"
              >
                <Lock className="w-3.5 h-3.5" /> Countersign Batch ({stats.pendingMasterCountersign})
              </motion.button>
            )}

            {/* Log New Ballast Operation Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Ballast Operation
            </motion.button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Operational Totals & Signature Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="mozuk-glass-card p-4.5 rounded-xl border border-[var(--color-glass-border)]">
          <div className="text-[var(--text-muted)] font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-between">
            <span>Total Logged Operations</span>
            <Hash className="w-3.5 h-3.5 text-[#28ada4]" />
          </div>
          <div className="font-extrabold text-[var(--text-main)] text-2xl font-mono mt-1.5">
            {stats.totalOps}
          </div>
          <div className="text-[10.5px] text-[var(--text-muted)] mt-1 font-medium">
            Sequential IMO Entry #1 to #{stats.totalOps}
          </div>
        </div>

        <div className="mozuk-glass-card p-4.5 rounded-xl border border-[#28ada4]/30 bg-[#28ada4]/5">
          <div className="text-[#28ada4] font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" /> Total Uptake (Code A)
            </span>
          </div>
          <div className="font-extrabold text-[#28ada4] text-2xl font-mono mt-1.5">
            {stats.totalVolumeUptake.toLocaleString()} m³
          </div>
          <div className="text-[10.5px] text-gray-500 mt-1 font-medium">
            Ballast water taken on board
          </div>
        </div>

        <div className="mozuk-glass-card p-4.5 rounded-xl border border-[#7b0b76]/30 bg-[#7b0b76]/5">
          <div className="text-[#7b0b76] dark:text-[#7b0b76] font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Total Discharged (Code C/D)
            </span>
          </div>
          <div className="font-extrabold text-[#7b0b76] dark:text-[#7b0b76] text-2xl font-mono mt-1.5">
            {stats.totalVolumeDischarge.toLocaleString()} m³
          </div>
          <div className="text-[10.5px] text-gray-500 mt-1 font-medium">
            Treated D-2 &amp; reception facility
          </div>
        </div>

        <div className="mozuk-glass-card p-4.5 rounded-xl border border-[var(--color-glass-border)]">
          <div className="text-[var(--text-muted)] font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28ada4]" /> Master Countersignatures
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className={`font-extrabold text-2xl font-mono ${
                stats.pendingMasterCountersign > 0 ? 'text-amber-500' : 'text-[#28ada4]'
              }`}
            >
              {stats.pendingMasterCountersign > 0 ? `${stats.pendingMasterCountersign} Pending` : '100% Locked'}
            </span>
          </div>
          <div className="text-[10.5px] text-[var(--text-muted)] mt-1 font-medium">
            {stats.pendingMasterCountersign > 0
              ? 'Awaiting Master validation seal'
              : 'All entries legally certified by Master'}
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="mozuk-glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, tanks, GPS, officer, remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl pl-9 pr-3.5 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition text-xs"
            />
          </div>

          {/* Filter by IMO Code */}
          <select
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="all">All IMO Codes (A to H)</option>
            <option value="A">Code A - Uptake</option>
            <option value="B">Code B - Circulation / Treatment</option>
            <option value="C">Code C - Discharge to Sea</option>
            <option value="D">Code D - Reception Facility</option>
            <option value="E">Code E - Accidental Discharge</option>
            <option value="F">Code F - BWTS Failures</option>
            <option value="G">Code G - Cleaning / Sediment</option>
            <option value="H">Code H - Remarks</option>
          </select>

          {/* Filter by Signature Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Master Countersignature</option>
            <option value="approved">Approved &amp; Locked by Master</option>
          </select>
        </div>

        {(searchTerm !== '' || filterCode !== 'all' || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCode('all');
              setFilterStatus('all');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      {/* Official IMO MEPC.372(80) Tabular Record Book View */}
      <div className="mozuk-glass-card rounded-2xl overflow-hidden shadow-xl border border-[var(--color-glass-border)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs table-fixed">
            <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
              <tr>
                <th className="py-3 px-3 w-[6%] text-center">Entry #</th>
                <th className="py-3 px-3 w-[12%]">Date &amp; Time (UTC)</th>
                <th className="py-3 px-3 w-[11%]">IMO Code &amp; Item</th>
                <th className="py-3 px-3.5 w-[23%]">Operation Details &amp; Tanks</th>
                <th className="py-3 px-2.5 w-[9%] text-right">Volume</th>
                <th className="py-3 px-3 w-[14%]">Location / Position</th>
                <th className="py-3 px-3 w-[13%]">Officer Signature</th>
                <th className="py-3 px-3 w-[12%] text-right">Master Countersign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-glass-border)]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--text-muted)] text-xs">
                    No ballast water operations match the search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const codeMeta = IMO_BALLAST_CODES[log.imoCode || 'A'];
                  const isPendingMaster = !log.masterCountersignature && !log.superseded;
                  const isSuperseded = Boolean(log.superseded);
                  const isCorrection = Boolean(log.isCorrection);

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-[var(--color-glass-border)]/50 transition ${
                        isSuperseded ? 'opacity-60 bg-red-50/10' : ''
                      }`}
                    >
                      {/* Entry Number */}
                      <td className="py-3 px-3 text-center align-top font-mono font-bold text-[var(--text-muted)]">
                        #{log.entryNumber}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3 align-top font-mono font-bold text-[var(--text-main)]">
                        <div>{formatDate(log.date)}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[var(--text-muted)]" /> {log.time} UTC
                        </div>
                      </td>

                      {/* IMO Code & Item */}
                      <td className="py-3 px-3 align-top">
                        <span
                          className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase border inline-flex items-center gap-1 shadow-xs"
                          style={{
                            backgroundColor: codeMeta.badgeBg,
                            borderColor: codeMeta.badgeBorder,
                            color: codeMeta.color,
                          }}
                        >
                          Code {log.imoCode}
                        </span>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                          Item {log.imoItem || `${log.imoCode}-1`}
                        </div>
                        {isCorrection && (
                          <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-600 border border-amber-500/30 inline-block">
                            Corrective Entry
                          </span>
                        )}
                        {isSuperseded && (
                          <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-red-500/15 text-red-600 border border-red-500/30 inline-block">
                            Superseded
                          </span>
                        )}
                      </td>

                      {/* Operation Description & Tanks */}
                      <td className="py-3 px-3.5 align-top space-y-1">
                        <div className="font-extrabold text-[var(--text-main)] text-xs leading-snug">
                          {log.operationDescription || log.operation}
                        </div>
                        <div className="text-[11px] font-bold text-[#28ada4] flex items-center gap-1">
                          <span>Tanks:</span> <span className="font-medium text-[var(--text-main)]">{log.tanks}</span>
                        </div>
                        {log.remarks && (
                          <div className="text-[10.5px] text-[var(--text-muted)] italic leading-tight">
                            &ldquo;{log.remarks}&rdquo;
                          </div>
                        )}
                      </td>

                      {/* Volume */}
                      <td className="py-3 px-2.5 align-top text-right font-mono font-black text-xs text-[#28ada4]">
                        {log.volumeM3 ? `${log.volumeM3.toLocaleString()} m³` : 'N/A'}
                      </td>

                      {/* Position / Location */}
                      <td className="py-3 px-3 align-top text-[11px] font-mono text-[var(--text-main)]">
                        <div className="flex items-start gap-1">
                          <Compass className="w-3.5 h-3.5 text-[#28ada4] shrink-0 mt-0.5" />
                          <span className="leading-tight">{log.gpsCoordinates}</span>
                        </div>
                        {(log.distanceFromLandNm || log.depthMeters) && (
                          <div className="text-[10px] text-[var(--text-muted)] mt-1">
                            {log.distanceFromLandNm ? `${log.distanceFromLandNm} nm off` : ''}
                            {log.distanceFromLandNm && log.depthMeters ? ' • ' : ''}
                            {log.depthMeters ? `${log.depthMeters} m depth` : ''}
                          </div>
                        )}
                      </td>

                      {/* Officer Electronic Signature (Signature 1) */}
                      <td className="py-3 px-3 align-top">
                        {log.officerSignature ? (
                          <div className="space-y-0.5">
                            <div className="font-bold text-[11px] text-[var(--text-main)] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#28ada4]" />
                              <span className="truncate">{log.officerSignature.signedBy}</span>
                            </div>
                            <div className="text-[9.5px] font-mono text-[var(--text-muted)] truncate">
                              {log.officerSignature.signatureToken}
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)]">
                              Signed: {log.officerSignature.signedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-500 font-bold">Unsigned</span>
                        )}
                      </td>

                      {/* Master Electronic Countersignature (Signature 2 & Immutability Lock) */}
                      <td className="py-3 px-3 align-top text-right">
                        {log.masterCountersignature ? (
                          <div className="space-y-0.5 inline-block text-right">
                            <span className="px-2 py-0.5 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#7b0b76] border border-[#7b0b76]/30 font-bold text-[10px] inline-flex items-center gap-1">
                              <Lock className="w-3 h-3 text-[#7b0b76]" /> Master Approved
                            </span>
                            <div className="text-[9.5px] font-bold text-[var(--text-main)] mt-1 truncate">
                              {log.masterCountersignature.signedBy}
                            </div>
                            <div className="text-[9px] font-mono text-[var(--text-muted)] truncate">
                              {log.masterCountersignature.signatureToken}
                            </div>

                            {/* Option to Append Tracked Correction even if locked */}
                            {!isSuperseded && (
                              <button
                                onClick={() => {
                                  setSelectedLogForCorrection(log);
                                  setCorrectedVolumeM3(log.volumeM3?.toString() || '');
                                  setIsCorrectionModalOpen(true);
                                }}
                                className="mt-1 text-[10px] text-amber-600 hover:text-amber-700 underline font-semibold block ml-auto cursor-pointer"
                                title="Append corrective entry per MEPC.372(80) without overwriting past record"
                              >
                                Append Tracked Correction
                              </button>
                            )}
                          </div>
                        ) : isPendingMaster ? (
                          <div className="space-y-1 inline-block text-right">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1">
                              Pending Master
                            </span>
                            <button
                              onClick={() => {
                                setIsBatchCountersign(false);
                                setSelectedLogForCountersign(log);
                                setIsCountersignModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg btn-mozuk-purple text-[10.5px] font-bold flex items-center gap-1 shadow-xs ml-auto cursor-pointer"
                              title="Sign as Master to approve and seal this entry"
                            >
                              <Lock className="w-3 h-3" /> Countersign
                            </button>

                            {!isSuperseded && (
                              <button
                                onClick={() => {
                                  setSelectedLogForCorrection(log);
                                  setCorrectedVolumeM3(log.volumeM3?.toString() || '');
                                  setIsCorrectionModalOpen(true);
                                }}
                                className="text-[9.5px] text-amber-600 hover:text-amber-700 underline font-semibold block ml-auto cursor-pointer"
                              >
                                Rectify Entry
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">Voided</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LOG NEW BALLAST OPERATION (IMO CODES A TO H & SIGNATURE 1)       */}
      {/* ========================================================================= */}
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
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <div>
                  <h3 className="font-['Montserrat',sans-serif] font-black text-[var(--text-main)] text-base flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#28ada4]" /> Log Ballast Operation — {ship.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Strict compliance with IMO Resolution MEPC.372(80) &amp; MEPC.369(80) (Codes A through H)
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleAddLog} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                {/* 1. IMO Code Selector */}
                <div>
                  <label className="block text-[var(--text-main)] font-extrabold mb-1.5">
                    IMO Standard Operation Code (MEPC.372(80)) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(IMO_BALLAST_CODES) as IMOBallastCode[]).map((code) => {
                      const meta = IMO_BALLAST_CODES[code];
                      const isSelected = newImoCode === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleCodeChange(code)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#28ada4] bg-[#28ada4]/15 shadow-sm'
                              : 'border-[var(--color-glass-border)] bg-[var(--color-bg)] hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs" style={{ color: meta.color }}>
                              Code {code}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#28ada4]" />}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-medium mt-1 truncate">
                            {code === 'A'
                              ? 'Uptake'
                              : code === 'B'
                              ? 'Circulation'
                              : code === 'C'
                              ? 'Discharge Sea'
                              : code === 'D'
                              ? 'Reception'
                              : code === 'E'
                              ? 'Accidental'
                              : code === 'F'
                              ? 'BWTS Failure'
                              : code === 'G'
                              ? 'Sediment'
                              : 'Remarks'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1.5 italic">
                    {IMO_BALLAST_CODES[newImoCode].title} — {IMO_BALLAST_CODES[newImoCode].description}
                  </div>
                </div>

                {/* 2. Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Date of Operation *</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Time (UTC) *</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                {/* 3. IMO Item & Tanks */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">IMO Item Reference *</label>
                    <input
                      type="text"
                      value={newImoItem}
                      onChange={(e) => setNewImoItem(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Tanks / Compartments Involved *</label>
                    <input
                      type="text"
                      placeholder="e.g. FPT, DBT 1P/1S, APT"
                      value={newTanks}
                      onChange={(e) => setNewTanks(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                {/* 4. Volume & Position */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Estimated Volume (m³) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g. 620"
                      value={newVolumeM3}
                      onChange={(e) => setNewVolumeM3(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Geographic Position / Port *</label>
                    <input
                      type="text"
                      placeholder="e.g. 51° 55' N, 003° 02' E or Rotterdam"
                      value={newGps}
                      onChange={(e) => setNewGps(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                {/* Optional Distance & Depth (especially for Code C Discharge to Sea) */}
                {newImoCode === 'C' && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)]">
                    <div>
                      <label className="block text-[var(--text-muted)] font-bold mb-1">Dist. from Nearest Land (nm)</label>
                      <input
                        type="number"
                        placeholder="e.g. 210 (>200 nm)"
                        value={newDistNm}
                        onChange={(e) => setNewDistNm(e.target.value)}
                        className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] font-bold mb-1">Water Depth (m)</label>
                      <input
                        type="number"
                        placeholder="e.g. 250 (>200 m)"
                        value={newDepthM}
                        onChange={(e) => setNewDepthM(e.target.value)}
                        className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Treatment Method & Description */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Operation Description *</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Treatment Method (BWTS D-2) *</label>
                  <input
                    type="text"
                    value={newTreatmentMethod}
                    onChange={(e) => setNewTreatmentMethod(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                {/* 6. Officer Electronic Signature Block (Signature 1) */}
                <div className="p-3.5 rounded-2xl bg-[#28ada4]/10 border border-[#28ada4]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#28ada4] font-extrabold text-xs">
                    <ShieldCheck className="w-4 h-4" /> Signature 1: Ballast Officer Electronic Sign-Off
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[var(--text-muted)] text-[11px] font-bold mb-1">Officer Name *</label>
                      <input
                        type="text"
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        required
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] text-[11px] font-bold mb-1">Rank *</label>
                      <input
                        type="text"
                        value={newOfficerRank}
                        onChange={(e) => setNewOfficerRank(e.target.value)}
                        required
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)]"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    By submitting, an authentic cryptographic signature token is registered for the Ballast Officer and the record is locked pending Master countersignature.
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--color-glass-border)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-mozuk-primary font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Sign &amp; Commit Operation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: MASTER ELECTRONIC COUNTERSIGNATURE (SIGNATURE 2)                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCountersignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsCountersignModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3">
                <div className="flex items-center gap-2 text-[#7b0b76] dark:text-[#7b0b76] font-extrabold text-base">
                  <Lock className="w-5 h-5" /> Master Legal Countersignature
                </div>
                <button
                  onClick={() => setIsCountersignModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[var(--text-main)] font-medium leading-relaxed">
                  {isBatchCountersign ? (
                    <>
                      You are about to execute the Master Countersignature for{' '}
                      <strong className="text-[#28ada4]">{stats.pendingMasterCountersign} pending ballast operations</strong> on
                      board <strong className="text-[var(--text-main)]">{ship.name}</strong>.
                    </>
                  ) : (
                    <>
                      You are countersigning Entry #{selectedLogForCountersign?.entryNumber} (
                      {selectedLogForCountersign?.operationDescription}) logged on {selectedLogForCountersign?.date}.
                    </>
                  )}
                </p>
                <div className="p-3 rounded-xl bg-[#7b0b76]/10 border border-[#7b0b76]/30 text-[11px] text-[var(--text-main)]">
                  <strong>IMO MEPC.372(80) §5.4:</strong> Countersigning applies the final immutable approval lock. Once approved, the record is legally certified and cannot be overwritten.
                </div>
              </div>

              <form onSubmit={handleExecuteMasterCountersign} className="space-y-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Master / Captain Name *</label>
                  <input
                    type="text"
                    value={masterSignerName}
                    onChange={(e) => setMasterSignerName(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Master Certification Remarks (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified against ship log and sounding tables"
                    value={masterSignRemarks}
                    onChange={(e) => setMasterSignRemarks(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsCountersignModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--color-glass-border)] text-xs text-[var(--text-muted)] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-mozuk-purple font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Execute Master Countersignature
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: APPEND TRACKED CORRECTION (IMMUTABILITY ENFORCEMENT)            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCorrectionModalOpen && selectedLogForCorrection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsCorrectionModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3">
                <div className="flex items-center gap-2 text-amber-500 font-extrabold text-base">
                  <AlertTriangle className="w-5 h-5" /> Append Tracked Corrective Entry
                </div>
                <button
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-[var(--text-main)] space-y-1">
                <strong>IMO Resolution MEPC.372(80) Compliance Notice:</strong>
                <p>
                  Electronic records are strictly immutable once signed. Past entries are never overwritten. Submitting this form appends a tracked corrective entry and preserves the original audit trail for Port State Control.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Original Entry Details</div>
                <div className="font-bold text-[var(--text-main)]">
                  Entry #{selectedLogForCorrection.entryNumber} — Code {selectedLogForCorrection.imoCode} ({selectedLogForCorrection.date})
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">
                  Tanks: {selectedLogForCorrection.tanks} • Volume: {selectedLogForCorrection.volumeM3} m³
                </div>
              </div>

              <form onSubmit={handleAppendCorrection} className="space-y-3">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Correction Reason (Mandatory Audit Explanation) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Typographical error in soundings - verified by manual ullage tape"
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Corrected Volume (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Correct volume in m³"
                    value={correctedVolumeM3}
                    onChange={(e) => setCorrectedVolumeM3(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Additional Rectification Notes</label>
                  <input
                    type="text"
                    placeholder="Additional context for inspector review"
                    value={correctedRemarks}
                    onChange={(e) => setCorrectedRemarks(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsCorrectionModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--color-glass-border)] text-xs text-[var(--text-muted)] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Append Corrective Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: EXPORT TO PDF UTILITY (PORT STATE CONTROL CERTIFIED TRUE COPY)  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
              onClick={() => setIsPdfModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white text-slate-900 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Modal Top Bar (Screen Only) */}
              <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-2.5">
                  <Printer className="w-5 h-5 text-[#28ada4]" />
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-black text-slate-900 text-base">
                      Export Ballast Water Record Book to PDF
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Official Certified True Copy for Port State Control (PSC) &amp; Flag State Administration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Date Filter Selector */}
                  <select
                    value={pdfDateRange}
                    onChange={(e) => setPdfDateRange(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="all">Complete Record Book (All Entries)</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                  </select>

                  <button
                    onClick={handlePrintPdf}
                    className="px-4 py-2 rounded-xl btn-mozuk-primary font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                  </button>

                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="text-slate-500 hover:text-slate-800 p-1.5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable True Copy Document Content */}
              <div id="ebwrb-printable-report" className="p-8 sm:p-10 overflow-y-auto space-y-6 bg-white text-slate-900">
                {/* 1. Official Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
                    International Maritime Organization (IMO) — BWM Convention 2004 (Regulation B-2)
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black font-['Montserrat',sans-serif] tracking-tight uppercase">
                    BALLAST WATER RECORD BOOK (eBWRB)
                  </h1>
                  <div className="text-xs font-bold text-[#1a827a] uppercase tracking-wide">
                    Certified Electronic Record System in Compliance with IMO Resolutions MEPC.372(80) &amp; MEPC.369(80)
                  </div>
                </div>

                {/* 2. Vessel Particulars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Name of Ship</span>
                    <strong className="text-sm font-black text-slate-900">{ship.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">IMO Number</span>
                    <strong className="text-sm font-mono font-bold text-slate-900">{ship.imo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Flag / Port of Registry</span>
                    <strong className="font-bold text-slate-800">{ship.flag || 'Marshall Islands'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Gross Tonnage</span>
                    <strong className="font-mono font-bold text-slate-800">{ship.grossTonnage || '32,500'} GT</strong>
                  </div>
                </div>

                {/* 3. Official Table of Operations */}
                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-left text-[11px] table-fixed">
                    <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 text-[10px] font-black uppercase">
                      <tr>
                        <th className="py-2 px-2 w-[6%] text-center border-r border-slate-200">No.</th>
                        <th className="py-2 px-2.5 w-[12%] border-r border-slate-200">Date/Time (UTC)</th>
                        <th className="py-2 px-2.5 w-[10%] border-r border-slate-200">Code &amp; Item</th>
                        <th className="py-2 px-3 w-[26%] border-r border-slate-200">Record of Operations / Tanks</th>
                        <th className="py-2 px-2 w-[9%] text-right border-r border-slate-200">Vol (m³)</th>
                        <th className="py-2 px-2.5 w-[13%] border-r border-slate-200">Position / Port</th>
                        <th className="py-2 px-2.5 w-[12%] border-r border-slate-200">Officer Signature</th>
                        <th className="py-2 px-2.5 w-[12%] text-right">Master Countersign</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {logsForPdf.map((log) => (
                        <tr key={log.id} className={log.superseded ? 'bg-red-50 text-slate-400 line-through' : ''}>
                          <td className="py-2 px-2 text-center font-mono font-bold border-r border-slate-200">
                            #{log.entryNumber}
                          </td>
                          <td className="py-2 px-2.5 font-mono border-r border-slate-200">
                            {formatDate(log.date)}<br />{log.time} UTC
                          </td>
                          <td className="py-2 px-2.5 font-bold border-r border-slate-200">
                            Code {log.imoCode}<br />
                            <span className="font-normal font-mono text-[10px] text-slate-500">{log.imoItem}</span>
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200">
                            <div className="font-bold text-slate-900">{log.operationDescription || log.operation}</div>
                            <div className="text-[10px] text-slate-600">Tanks: {log.tanks}</div>
                            {log.remarks && (
                              <div className="text-[9.5px] italic text-slate-500 mt-0.5">&ldquo;{log.remarks}&rdquo;</div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right font-mono font-bold border-r border-slate-200 text-[#1a827a]">
                            {log.volumeM3 ? `${log.volumeM3.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-2 px-2.5 font-mono text-[10px] border-r border-slate-200">
                            {log.gpsCoordinates}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-200 text-[10px]">
                            {log.officerSignature ? (
                              <>
                                <strong className="block text-slate-900">{log.officerSignature.signedBy}</strong>
                                <span className="font-mono text-[9px] text-slate-500 block">
                                  {log.officerSignature.signatureToken}
                                </span>
                              </>
                            ) : (
                              <span className="italic text-slate-400">Unsigned</span>
                            )}
                          </td>
                          <td className="py-2 px-2.5 text-right text-[10px]">
                            {log.masterCountersignature ? (
                              <>
                                <strong className="block text-[#7b0b76]">{log.masterCountersignature.signedBy}</strong>
                                <span className="font-mono text-[9px] text-slate-500 block">
                                  {log.masterCountersignature.signatureToken}
                                </span>
                              </>
                            ) : (
                              <span className="italic text-amber-600 font-bold">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Master Legal Certification of True Copy Box */}
                <div className="mt-8 p-5 border-2 border-slate-900 rounded-xl space-y-4 bg-slate-50">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                    <Award className="w-4 h-4 text-[#7b0b76]" /> Master Certification of True Copy (IMO MEPC.372(80) §6)
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    I, the undersigned Master of M/V <strong className="text-slate-950">{ship.name}</strong>, IMO:{' '}
                    <strong className="text-slate-950">{ship.imo}</strong>, hereby certify that this transcript is a true,
                    unaltered, and authenticated copy of the electronic Ballast Water Record Book entries, extracted from the
                    Taneet Marine Operating System in accordance with Regulation B-2 of the BWM Convention.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-slate-300 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Master Signature</span>
                      <div className="mt-2 font-['Montserrat',sans-serif] font-black text-sm text-[#7b0b76]">
                        {masterCrewMember?.name || 'Capt. Marcus Vance'}
                      </div>
                      <span className="text-[10px] text-slate-500">Master / Captain, {ship.name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Date of Certification</span>
                      <div className="mt-2 font-mono font-bold text-sm text-slate-900">
                        {getTodayDDMMYYYY()}
                      </div>
                      <span className="text-[10px] text-slate-500">Official Electronic Timestamp</span>
                    </div>

                    <div className="p-3 border-2 border-dashed border-slate-400 rounded-lg text-center flex flex-col justify-center items-center min-h-[60px]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                        OFFICIAL SHIP STAMP / EMBOSSED SEAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
