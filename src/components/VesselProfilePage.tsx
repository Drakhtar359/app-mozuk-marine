import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, CrewMember, TechnicalDoc, MaintenanceLog, VesselHistoryEntry, VisitorLog, BallastWaterLog, SewageWaterLog, ProcurementOrder, getEffectiveVesselHistory } from '../types/vessel';
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
  Phone,
  Droplets,
  Waves,
  Recycle,
  Gauge,
  Search,
  ShoppingCart,
  Package,
  Truck,
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
  const [activeTab, setActiveTab] = useState<'crew' | 'documents' | 'maintenance' | 'logbooks'>('crew');
  const [activeLogbookTab, setActiveLogbookTab] = useState<'visitors' | 'ballast' | 'sewage'>('visitors');
  const [activeDocTab, setActiveDocTab] = useState<'certifications' | 'technical_documentation' | 'misc'>('certifications');
  const [activeMaintTab, setActiveMaintTab] = useState<'active' | 'logs' | 'procurement'>('active');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  // Modal & Detail States
  const [isAddCrewModalOpen, setIsAddCrewModalOpen] = useState(false);
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddRepairModalOpen, setIsAddRepairModalOpen] = useState(false);
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);
  const [isAddBallastModalOpen, setIsAddBallastModalOpen] = useState(false);
  const [isAddSewageModalOpen, setIsAddSewageModalOpen] = useState(false);
  const [isAddProcurementModalOpen, setIsAddProcurementModalOpen] = useState(false);

  // Form states for Procurement Order
  const [procPartName, setProcPartName] = useState('');
  const [procPartNumber, setProcPartNumber] = useState('');
  const [procProvider, setProcProvider] = useState('');
  const [procOrderDate, setProcOrderDate] = useState('');
  const [procDeliveryPort, setProcDeliveryPort] = useState('');
  const [procQuantity, setProcQuantity] = useState('1');
  const [procStatus, setProcStatus] = useState<'ordered' | 'in_transit' | 'delivered'>('ordered');
  const [procOfficer, setProcOfficer] = useState('');
  const [procRemarks, setProcRemarks] = useState('');

  // Form & Filter states for Ballast Water Record Book
  const [ballastDate, setBallastDate] = useState('');
  const [ballastTime, setBallastTime] = useState('');
  const [ballastOperation, setBallastOperation] = useState<'Ballasting' | 'Deballasting' | 'Internal Transfer' | 'Ballast Exchange (BWM)'>('Ballasting');
  const [ballastTanks, setBallastTanks] = useState('');
  const [ballastVolumeM3, setBallastVolumeM3] = useState('');
  const [ballastGpsCoordinates, setBallastGpsCoordinates] = useState('');
  const [ballastTreatmentMethod, setBallastTreatmentMethod] = useState('UV Disinfection (Mozuk BWTS)');
  const [ballastOfficerInCharge, setBallastOfficerInCharge] = useState('');
  const [ballastRemarks, setBallastRemarks] = useState('');
  const [ballastFilterOp, setBallastFilterOp] = useState<string>('all');
  const [ballastSearchTerm, setBallastSearchTerm] = useState('');

  // Form & Filter states for Sewage / Grey Water Record Book
  const [sewageDate, setSewageDate] = useState('');
  const [sewageTime, setSewageTime] = useState('');
  const [sewageType, setSewageType] = useState<'Sewage (Black Water)' | 'Grey Water'>('Sewage (Black Water)');
  const [sewageOperation, setSewageOperation] = useState<'Discharge to Sea (Outside Special Area)' | 'Discharge to Shore Facility' | 'Internal Transfer to Holding Tank' | 'Treatment Plant Disinfection'>('Discharge to Sea (Outside Special Area)');
  const [sewageTankSource, setSewageTankSource] = useState('');
  const [sewageVolumeM3, setSewageVolumeM3] = useState('');
  const [sewageGpsCoordinates, setSewageGpsCoordinates] = useState('');
  const [sewageShipSpeedKnots, setSewageShipSpeedKnots] = useState('');
  const [sewageOfficerInCharge, setSewageOfficerInCharge] = useState('');
  const [sewageRemarks, setSewageRemarks] = useState('');
  const [sewageFilterType, setSewageFilterType] = useState<string>('all');
  const [sewageFilterOp, setSewageFilterOp] = useState<string>('all');
  const [sewageSearchTerm, setSewageSearchTerm] = useState('');

  // Add Crew Modal Mode (Select from company roster vs Register new)
  const [addCrewTab, setAddCrewTab] = useState<'select' | 'create'>('select');
  const [selectedExistingCrewId, setSelectedExistingCrewId] = useState<string>('');

  // Form states for Crew Member
  const [crewName, setCrewName] = useState('');
  const [crewEmail, setCrewEmail] = useState('');
  const [crewPhoneNumber, setCrewPhoneNumber] = useState('');
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
      phoneNumber: crewPhoneNumber.trim() || undefined,
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
    setCrewPhoneNumber('');
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

  // Ballast Water Handlers
  const handleAddBallastLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ballastTanks.trim() || !ballastVolumeM3) return;

    const newLog: BallastWaterLog = {
      id: `bw-${Date.now()}`,
      date: formatDate(ballastDate || getTodayDDMMYYYY()),
      time: ballastTime || '08:00',
      operation: ballastOperation,
      tanks: ballastTanks.trim(),
      volumeM3: parseFloat(ballastVolumeM3) || 0,
      gpsCoordinates: ballastGpsCoordinates.trim() || 'Anchor / Port Location',
      treatmentMethod: ballastTreatmentMethod.trim() || 'UV Disinfection (Mozuk BWTS)',
      officerInCharge: ballastOfficerInCharge.trim() || 'Chief Officer',
      remarks: ballastRemarks.trim() || undefined,
    };

    onUpdateShip({
      ...ship,
      ballastWaterLogs: [newLog, ...(ship.ballastWaterLogs || [])],
    });

    setBallastDate('');
    setBallastTime('');
    setBallastOperation('Ballasting');
    setBallastTanks('');
    setBallastVolumeM3('');
    setBallastGpsCoordinates('');
    setBallastTreatmentMethod('UV Disinfection (Mozuk BWTS)');
    setBallastOfficerInCharge('');
    setBallastRemarks('');
    setIsAddBallastModalOpen(false);
  };

  const handleRemoveBallastLog = (logId: string) => {
    onUpdateShip({
      ...ship,
      ballastWaterLogs: (ship.ballastWaterLogs || []).filter((l) => l.id !== logId),
    });
  };

  // Sewage / Grey Water Handlers
  const handleAddSewageLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sewageTankSource.trim() || !sewageVolumeM3) return;

    const newLog: SewageWaterLog = {
      id: `sw-${Date.now()}`,
      date: formatDate(sewageDate || getTodayDDMMYYYY()),
      time: sewageTime || '10:00',
      type: sewageType,
      operation: sewageOperation,
      tankSource: sewageTankSource.trim(),
      volumeM3: parseFloat(sewageVolumeM3) || 0,
      gpsCoordinates: sewageGpsCoordinates.trim() || 'Port / Sea Position',
      shipSpeedKnots: sewageShipSpeedKnots ? parseFloat(sewageShipSpeedKnots) : undefined,
      officerInCharge: sewageOfficerInCharge.trim() || 'Second Engineer',
      remarks: sewageRemarks.trim() || undefined,
    };

    onUpdateShip({
      ...ship,
      sewageWaterLogs: [newLog, ...(ship.sewageWaterLogs || [])],
    });

    setSewageDate('');
    setSewageTime('');
    setSewageType('Sewage (Black Water)');
    setSewageOperation('Discharge to Sea (Outside Special Area)');
    setSewageTankSource('');
    setSewageVolumeM3('');
    setSewageGpsCoordinates('');
    setSewageShipSpeedKnots('');
    setSewageOfficerInCharge('');
    setSewageRemarks('');
    setIsAddSewageModalOpen(false);
  };

  const handleRemoveSewageLog = (logId: string) => {
    onUpdateShip({
      ...ship,
      sewageWaterLogs: (ship.sewageWaterLogs || []).filter((l) => l.id !== logId),
    });
  };

  // Procurement Handlers
  const handleAddProcurementOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procPartName.trim()) return;

    const newOrder: ProcurementOrder = {
      id: `po-${Date.now()}`,
      partName: procPartName.trim(),
      partNumber: procPartNumber.trim() || 'N/A',
      provider: procProvider.trim() || 'General Supplier',
      orderDate: procOrderDate ? formatDate(procOrderDate) : formatDate(getTodayDDMMYYYY()),
      deliveryPort: procDeliveryPort.trim() || 'Next Port of Call',
      quantity: parseInt(procQuantity) || 1,
      status: procStatus,
      officerInCharge: procOfficer.trim() || 'Chief Engineer',
      remarks: procRemarks.trim(),
    };

    onUpdateShip({
      ...ship,
      procurementOrders: [newOrder, ...(ship.procurementOrders || [])],
    });

    setProcPartName('');
    setProcPartNumber('');
    setProcProvider('');
    setProcOrderDate('');
    setProcDeliveryPort('');
    setProcQuantity('1');
    setProcStatus('ordered');
    setProcOfficer('');
    setProcRemarks('');
    setIsAddProcurementModalOpen(false);
  };

  const handleRemoveProcurementOrder = (id: string) => {
    onUpdateShip({
      ...ship,
      procurementOrders: (ship.procurementOrders || []).filter((p) => p.id !== id),
    });
  };

  const handleUpdateProcurementStatus = (id: string, newStatus: 'ordered' | 'in_transit' | 'delivered') => {
    onUpdateShip({
      ...ship,
      procurementOrders: (ship.procurementOrders || []).map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      ),
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
              className="px-4 py-2.5 rounded-full bg-[#7b0b76]/15 hover:bg-[#7b0b76]/25 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/35 font-bold text-xs flex items-center gap-2 transition shadow-sm"
              title={`Track ${ship.name} (${ship.imo}) on MarineTraffic`}
            >
              <Navigation className="w-4 h-4 text-[#7b0b76] dark:text-[#c432bd]" />
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

      {/* Main Sections Tabs Container (4 top-level tabs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 border border-[var(--color-glass-border)] bg-[var(--color-surface)] rounded-2xl p-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('crew')}
          className={`flex items-center justify-start gap-2.5 py-2.5 px-4 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition w-full ${
            activeTab === 'crew'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">Crew Command Hierarchy ({ship.crew.length})</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center justify-start gap-2.5 py-2.5 px-4 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition w-full ${
            activeTab === 'maintenance'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <Wrench className="w-4 h-4 shrink-0" />
          <span className="truncate">Maintenance & Repair Log ({ship.maintenance.length})</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('documents')}
          className={`flex items-center justify-start gap-2.5 py-2.5 px-4 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition w-full ${
            activeTab === 'documents'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <FileCheck className="w-4 h-4 shrink-0" />
          <span className="truncate">Technical Documents ({ship.documents.length})</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('logbooks')}
          className={`flex items-center justify-start gap-2.5 py-2.5 px-4 rounded-xl font-['Space_Grotesk',sans-serif] font-bold text-xs transition w-full ${
            activeTab === 'logbooks'
              ? 'btn-mozuk-primary shadow-lg'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)]'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-[#28ada4]" />
          <span className="truncate">
            Ship Logbooks & Registries ({ (ship.visitors?.length || 0) + (ship.ballastWaterLogs?.length || 0) + (ship.sewageWaterLogs?.length || 0) })
          </span>
        </motion.button>
      </div>

      {/* SECTION 1: CREW COMMAND TREE HIERARCHY */}
      {activeTab === 'crew' && (
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#7b0b76] dark:text-[#c432bd]" />
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
              <div className="w-full max-w-md mozuk-glass-card rounded-2xl p-5 border border-[#7b0b76]/40 shadow-xl relative">
                {masterCrew.length > 0 ? (
                  masterCrew.map((master) => (
                    <div
                      key={master.id}
                      onClick={() => setSelectedCrewMember(master)}
                      className="pt-2 text-center relative group cursor-pointer hover:bg-[var(--color-bg-alt)]/60 rounded-xl p-3 transition border border-transparent hover:border-[#7b0b76]/50 shadow-sm"
                      title="Click to view full crew profile"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#7b0b76]/20 border-2 border-[#7b0b76] flex items-center justify-center text-[#7b0b76] dark:text-[#c432bd] font-extrabold text-xl mx-auto mb-2 shadow-lg group-hover:scale-105 transition-transform">
                        {master.name.charAt(0)}
                      </div>
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-lg text-[var(--text-main)] group-hover:text-[#7b0b76] dark:group-hover:text-[#c432bd] transition">
                        {master.name}
                      </h3>
                      <div className="text-xs text-[#7b0b76] dark:text-[#c432bd] font-bold uppercase tracking-wider mt-0.5">
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
                      <div className="text-[10px] text-[#7b0b76]/80 dark:text-[#c432bd]/80 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition">
                        🔍 Click to open full profile
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCrew(master.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#7b0b76]/20 hover:bg-[#7b0b76]/40 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/40 transition opacity-0 group-hover:opacity-100"
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
                      className="px-4 py-2 rounded-full btn-mozuk-purple text-xs inline-flex items-center gap-1.5 shadow-md"
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
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-[#28ada4] flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30">
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
                    <span className="px-2.5 py-0.5 rounded-full bg-[#28ada4]/15 text-[#28ada4] font-bold text-xs border border-[#28ada4]/30">
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-[#28ada4]/80 transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-[#28ada4]/20 border border-[#28ada4]/40 flex items-center justify-center text-[#28ada4] font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-[#28ada4] transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-[#28ada4]/15 text-[#28ada4] font-semibold text-[10px] mt-0.5 border border-[#28ada4]/30">
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
                            className="p-1 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition opacity-0 group-hover:opacity-100"
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
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-[#28ada4]/60 text-[#28ada4] hover:bg-[#28ada4]/10 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Deck Crew
                  </button>
                </div>
              </div>

              {/* COLUMN 2: ENGINE DEPARTMENT */}
              <div className="flex flex-col">
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-white/40 dark:border-white/30 flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[var(--color-surface)] text-[var(--text-main)] border border-[var(--color-glass-border)]">
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
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--text-main)] font-bold text-xs border border-[var(--color-glass-border)]">
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-[var(--color-primary)] transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--text-main)] font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-[var(--color-primary)] transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--text-main)] font-semibold text-[10px] mt-0.5 border border-[var(--color-glass-border)]">
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
                            className="p-1 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition opacity-0 group-hover:opacity-100"
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
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-[var(--color-glass-border)] text-[var(--text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Engine Crew
                  </button>
                </div>
              </div>

              {/* COLUMN 3: KITCHEN / MESS DEPARTMENT */}
              <div className="flex flex-col">
                <div className="mozuk-glass-card rounded-2xl p-4 border-t-4 border-white/20 flex-1 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[var(--color-surface)] text-[var(--text-muted)] border border-[var(--color-glass-border)]">
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
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--text-muted)] font-bold text-xs border border-[var(--color-glass-border)]">
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
                          className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-[var(--color-primary)] transition group cursor-pointer shadow-sm hover:shadow-md"
                          title="Click to view full crew profile"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--text-muted)] font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-main)] text-xs group-hover:text-[var(--color-primary)] transition">{member.name}</h4>
                              <span className="inline-block px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--text-muted)] font-semibold text-[10px] mt-0.5 border border-[var(--color-glass-border)]">
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
                            className="p-1 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition opacity-0 group-hover:opacity-100"
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
                    className="w-full mt-4 py-2 rounded-xl border border-dashed border-[var(--color-glass-border)] text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-bold transition flex items-center justify-center gap-1.5"
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
      {activeTab === 'maintenance' && (() => {
        const activeRepairs = ship.maintenance.filter(
          (m) => m.status === 'open' || m.status === 'in_progress'
        );
        const completedRepairs = ship.maintenance.filter(
          (m) => m.status === 'completed'
        );
        const procurementList = ship.procurementOrders || [];

        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
              <div>
                <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[var(--color-primary)]" />
                  Vessel Maintenance & Technical Requisitions
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Active work orders, completed machinery repair logs, and spare parts procurement tracking.
                </p>
              </div>

              {activeMaintTab === 'procurement' ? (
                <button
                  onClick={() => setIsAddProcurementModalOpen(true)}
                  className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Order Spare Parts
                </button>
              ) : (
                <button
                  onClick={() => setIsAddRepairModalOpen(true)}
                  className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Log Work Order
                </button>
              )}
            </div>

            {/* Folder Sub-Tabs Bar */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0.5 border-b border-[var(--color-glass-border)]">
              <button
                onClick={() => setActiveMaintTab('active')}
                className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                  activeMaintTab === 'active'
                    ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                    : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
                }`}
              >
                {activeMaintTab === 'active' && (
                  <motion.div
                    layoutId="activeMaintTabBottomLine"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                  />
                )}
                <Wrench className="w-4 h-4 text-[#28ada4]" />
                <span>Active Maintenance</span>
              </button>

              <button
                onClick={() => setActiveMaintTab('logs')}
                className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                  activeMaintTab === 'logs'
                    ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                    : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
                }`}
              >
                {activeMaintTab === 'logs' && (
                  <motion.div
                    layoutId="activeMaintTabBottomLine"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                  />
                )}
                <CheckCircle2 className="w-4 h-4 text-[#28ada4]" />
                <span>Repair Logs</span>
              </button>

              <button
                onClick={() => setActiveMaintTab('procurement')}
                className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                  activeMaintTab === 'procurement'
                    ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                    : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
                }`}
              >
                {activeMaintTab === 'procurement' && (
                  <motion.div
                    layoutId="activeMaintTabBottomLine"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                  />
                )}
                <ShoppingCart className="w-4 h-4 text-[#7b0b76] dark:text-[#c432bd]" />
                <span>Procurement</span>
              </button>
            </div>

            {/* Folder Content Body Container */}
            <div className="mozuk-glass-card rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl relative z-0">
              {/* SUB-TAB 1: ACTIVE MAINTENANCE */}
              {activeMaintTab === 'active' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mozuk-glass-card rounded-xl p-4 flex items-center justify-between border border-[#7b0b76]/30 bg-[#7b0b76]/10">
                      <div>
                        <div className="text-[#7b0b76] dark:text-[#c432bd] text-xs font-bold uppercase">Open Work Orders</div>
                        <div className="text-2xl font-['Space_Grotesk',sans-serif] font-extrabold text-[#7b0b76] dark:text-[#c432bd] mt-1">{openRepairsCount}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#7b0b76]/20 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/40">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="mozuk-glass-card rounded-xl p-4 flex items-center justify-between border border-[#28ada4]/30 bg-[#28ada4]/10">
                      <div>
                        <div className="text-[#28ada4] text-xs font-bold uppercase">In Progress Overhauls</div>
                        <div className="text-2xl font-['Space_Grotesk',sans-serif] font-extrabold text-[#28ada4] mt-1">{inProgressCount}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/40">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {activeRepairs.length === 0 ? (
                    <div className="mozuk-glass-card rounded-2xl p-10 text-center text-[var(--text-muted)]">
                      <CheckCircle2 className="w-10 h-10 text-[#28ada4] mx-auto mb-2" />
                      <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-base">No Active Maintenance Orders</h4>
                      <p className="text-xs mt-1">All logged repairs are completed or verified.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeRepairs.map((log) => (
                        <div
                          key={log.id}
                          className="mozuk-glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--color-glass-border)]"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase border ${
                                  log.priority === 'urgent' || log.priority === 'high'
                                    ? 'bg-[#7b0b76]/20 text-[#7b0b76] dark:text-[#c432bd] border-[#7b0b76]/40'
                                    : log.priority === 'medium'
                                    ? 'bg-[#28ada4]/15 text-[#28ada4] border-[#28ada4]/30'
                                    : 'bg-[var(--color-surface)] text-[var(--text-muted)] border-[var(--color-glass-border)]'
                                }`}
                              >
                                {log.priority} priority
                              </span>

                              <span className="px-2.5 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-semibold text-[10px] text-[var(--color-primary)]">
                                {log.category}
                              </span>

                              <span
                                className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase border ${
                                  log.status === 'open'
                                    ? 'bg-[#7b0b76]/20 text-[#7b0b76] dark:text-[#c432bd] border-[#7b0b76]/40'
                                    : 'bg-[#28ada4]/15 text-[#28ada4] border-[#28ada4]/30'
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

                          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[var(--color-glass-border)] pt-3 md:pt-0 md:pl-4">
                            {log.status === 'open' && (
                              <button
                                onClick={() => handleUpdateRepairStatus(log.id, 'in_progress')}
                                className="px-3 py-1.5 rounded-lg bg-[#7b0b76]/20 hover:bg-[#7b0b76]/35 border border-[#7b0b76]/40 text-[#7b0b76] dark:text-[#c432bd] font-bold text-xs transition flex items-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5" /> Start Repair
                              </button>
                            )}

                            {log.status === 'in_progress' && (
                              <button
                                onClick={() => handleUpdateRepairStatus(log.id, 'completed')}
                                className="px-3 py-1.5 rounded-lg btn-mozuk-primary text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark Completed
                              </button>
                            )}

                            <button
                              onClick={() => handleRemoveRepair(log.id)}
                              className="p-2 rounded-lg bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition"
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

              {/* SUB-TAB 2: REPAIR LOGS (COMPLETED) */}
              {activeMaintTab === 'logs' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#28ada4]" />
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                        Completed Repair History ({completedRepairs.length})
                      </h3>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      Closed technical work orders & signed-off overhaul records
                    </span>
                  </div>

                  {completedRepairs.length === 0 ? (
                    <div className="mozuk-glass-card rounded-2xl p-10 text-center text-[var(--text-muted)]">
                      <History className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                      <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] text-base">No Completed Repair Logs</h4>
                      <p className="text-xs mt-1">Repairs completed in Active Maintenance will automatically archive here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedRepairs.map((log) => (
                        <div
                          key={log.id}
                          className="mozuk-glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--color-glass-border)]"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 font-extrabold text-[10px] uppercase">
                                COMPLETED & CLOSED
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] font-semibold text-[10px] text-[var(--color-primary)]">
                                {log.category}
                              </span>
                            </div>

                            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)] line-through opacity-85">{log.title}</h3>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{log.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-muted)] pt-1">
                              <span>Completed Date: <strong className="text-[#28ada4]">{formatDate(log.dueDate)}</strong></span>
                              <span>Reported by: <strong className="text-[var(--color-primary)]">{log.reportedBy}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[var(--color-glass-border)] pt-3 md:pt-0 md:pl-4">
                            <button
                              onClick={() => handleUpdateRepairStatus(log.id, 'open')}
                              className="px-3 py-1.5 rounded-lg btn-mozuk-secondary text-xs font-bold transition flex items-center gap-1.5"
                              title="Re-open repair and move back to Active Maintenance"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Re-open Work Order
                            </button>

                            <button
                              onClick={() => handleRemoveRepair(log.id)}
                              className="p-2 rounded-lg bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition"
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

              {/* SUB-TAB 3: PROCUREMENT */}
              {activeMaintTab === 'procurement' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-glass-border)] pb-3">
                    <div>
                      <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-[#7b0b76] dark:text-[#c432bd]" />
                        Spare Parts Procurement & Technical Requisitions ({procurementList.length})
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Machinery spare parts orders, OEM supply tracking, delivery ports, and part numbers.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddProcurementModalOpen(true)}
                      className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Order Spare Parts
                    </button>
                  </div>

                  <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
                    <table className="w-full text-left text-xs min-w-[900px]">
                      <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">Order Date</th>
                          <th className="py-3.5 px-4">Spare Part Name & Part Number</th>
                          <th className="py-3.5 px-4">Provider / OEM Supplier</th>
                          <th className="py-3.5 px-4">Delivery Port</th>
                          <th className="py-3.5 px-4 text-center">Qty</th>
                          <th className="py-3.5 px-4 text-center">Order Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-glass-border)]">
                        {procurementList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] text-xs">
                              No spare parts procurement orders registered yet. Click "Order Spare Parts" to create a technical requisition.
                            </td>
                          </tr>
                        ) : (
                          procurementList.map((item) => (
                            <tr key={item.id} className="hover:bg-[var(--color-glass-border)] transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-main)] whitespace-nowrap">
                                {formatDate(item.orderDate)}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[var(--text-main)] text-xs">{item.partName}</div>
                                <div className="font-mono text-[11px] text-[var(--color-primary)] font-semibold mt-0.5">
                                  PN: {item.partNumber}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-[var(--text-main)]">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                                  <span>{item.provider}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-[var(--text-muted)]">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                                  <span>{item.deliveryPort}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-center font-mono font-bold text-xs text-[var(--text-main)]">
                                {item.quantity}
                              </td>

                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                {item.status === 'ordered' && (
                                  <span className="px-2.5 py-1 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/35 font-bold text-[10px]">
                                    ORDERED
                                  </span>
                                )}
                                {item.status === 'in_transit' && (
                                  <span className="px-2.5 py-1 rounded-full bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/35 font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#28ada4] animate-pulse"></span>
                                    IN TRANSIT
                                  </span>
                                )}
                                {item.status === 'delivered' && (
                                  <span className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--text-main)] border border-[var(--color-glass-border)] font-bold text-[10px]">
                                    DELIVERED
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {item.status !== 'delivered' && (
                                    <button
                                      onClick={() =>
                                        handleUpdateProcurementStatus(
                                          item.id,
                                          item.status === 'ordered' ? 'in_transit' : 'delivered'
                                        )
                                      }
                                      className="px-2.5 py-1 rounded btn-mozuk-primary text-[11px] font-bold transition shadow-sm"
                                    >
                                      {item.status === 'ordered' ? 'Ship Item' : 'Mark Delivered'}
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleRemoveProcurementOrder(item.id)}
                                    className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition inline-flex items-center"
                                    title="Delete order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* SECTION 3: TECHNICAL DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
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
              onClick={() => openAddDocModal(activeDocTab)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Document
            </button>
          </div>

          {/* Folder Sub-Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0.5 border-b border-[var(--color-glass-border)]">
            <button
              onClick={() => setActiveDocTab('certifications')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeDocTab === 'certifications'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeDocTab === 'certifications' && (
                <motion.div
                  layoutId="activeDocTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <ShieldCheck className="w-4 h-4 text-[#28ada4]" />
              <span>Certifications</span>
            </button>

            <button
              onClick={() => setActiveDocTab('technical_documentation')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeDocTab === 'technical_documentation'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeDocTab === 'technical_documentation' && (
                <motion.div
                  layoutId="activeDocTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <FileText className="w-4 h-4 text-[var(--text-main)]" />
              <span>Technical Documentation</span>
            </button>

            <button
              onClick={() => setActiveDocTab('misc')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeDocTab === 'misc'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeDocTab === 'misc' && (
                <motion.div
                  layoutId="activeDocTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <Folder className="w-4 h-4 text-[#7b0b76] dark:text-[#c432bd]" />
              <span>Miscellaneous Records</span>
            </button>
          </div>

          {/* Folder Content Body Container */}
          <div className="mozuk-glass-card rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl relative z-0">
            {/* SUB-TAB 1: CERTIFICATIONS */}
            {activeDocTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      Certifications (Class, Flag, Statutory & ISM)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#28ada4]/15 text-[#28ada4] font-bold text-xs border border-[#28ada4]/30">
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

                <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
                  <table className="w-full text-left text-xs min-w-[850px]">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
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
                                  <span className="px-2.5 py-0.5 rounded bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 font-bold text-[10px]">
                                    VALID
                                  </span>
                                )}
                                {doc.status === 'expiring' && (
                                  <span className="px-2.5 py-0.5 rounded bg-[#7b0b76]/20 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/40 font-bold text-[10px]">
                                    EXPIRING SOON
                                  </span>
                                )}
                                {doc.status === 'expired' && (
                                  <span className="px-2.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--text-muted)] border border-[var(--color-glass-border)] font-bold text-[10px]">
                                    EXPIRED
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition"
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
            )}

            {/* SUB-TAB 2: TECHNICAL DOCUMENTATION */}
            {activeDocTab === 'technical_documentation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[var(--color-surface)] text-[var(--text-main)] border border-[var(--color-glass-border)]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      Technical Documentation (Manuals, Schematics & Drawings)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--text-main)] font-bold text-xs border border-[var(--color-glass-border)]">
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

                <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
                  <table className="w-full text-left text-xs min-w-[850px]">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
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
                                <span className="px-2.5 py-0.5 rounded bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 font-bold text-[10px]">
                                  ACTIVE MANUAL
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition"
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
            )}

            {/* SUB-TAB 3: MISCELLANEOUS */}
            {activeDocTab === 'misc' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/30">
                      <Folder className="w-4 h-4" />
                    </div>
                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      Miscellaneous (Invoices, Cargo Chartering Orders, Port Access & Contracts)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] font-bold text-xs border border-[#7b0b76]/30">
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

                <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
                  <table className="w-full text-left text-xs min-w-[850px]">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
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
                                <span className="px-2.5 py-0.5 rounded bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/30 font-bold text-[10px]">
                                  FILED RECORD
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition"
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
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: SHIP LOGBOOKS & REGISTRIES */}
      {activeTab === 'logbooks' && (
        <div className="space-y-6">
          {/* Folder Sub-Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0.5 border-b border-[var(--color-glass-border)]">
            <button
              onClick={() => setActiveLogbookTab('visitors')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeLogbookTab === 'visitors'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeLogbookTab === 'visitors' && (
                <motion.div
                  layoutId="activeLogbookTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Visitor Logbook</span>
            </button>

            <button
              onClick={() => setActiveLogbookTab('ballast')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeLogbookTab === 'ballast'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeLogbookTab === 'ballast' && (
                <motion.div
                  layoutId="activeLogbookTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <Droplets className="w-4 h-4 text-[#28ada4]" />
              <span>Ballast Water Record Book</span>
            </button>

            <button
              onClick={() => setActiveLogbookTab('sewage')}
              className={`relative px-5 sm:px-6 py-3.5 rounded-t-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 ${
                activeLogbookTab === 'sewage'
                  ? 'bg-[var(--color-bg-alt)] text-[var(--color-primary)] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                  : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
              }`}
            >
              {activeLogbookTab === 'sewage' && (
                <motion.div
                  layoutId="activeLogbookTabBottomLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-b-full z-30"
                />
              )}
              <Recycle className="w-4 h-4 text-[#7b0b76] dark:text-[#c432bd]" />
              <span>Sewage & Grey Water Log</span>
            </button>
          </div>

          {/* Folder Content Container */}
          <div className="mozuk-glass-card rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl relative z-0">
            {/* SUB-TAB 1: VISITOR LOGBOOK */}
            {activeLogbookTab === 'visitors' && (() => {
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
                <div className="px-3.5 py-2 rounded-full bg-[#28ada4]/15 border border-[#28ada4]/35 text-[#28ada4] font-extrabold text-xs flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#28ada4] animate-pulse"></span>
                  <span>On Board: <strong className="text-[var(--text-main)] ml-0.5">{currentlyOnboardCount}</strong></span>
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
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
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
                              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                              <span>{visitor.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#28ada4] whitespace-nowrap align-middle">
                            {visitor.timeIn}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[var(--text-muted)] whitespace-nowrap align-middle">
                            {visitor.timeOut || '—'}
                          </td>

                          {/* 4. Single-line status badge */}
                          <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                            {isOnboard ? (
                              <span className="px-2.5 py-1 rounded-full bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/35 font-extrabold text-[10px] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#28ada4] animate-pulse shrink-0"></span>
                                ON BOARD
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-[var(--color-surface)] text-[var(--text-muted)] border border-[var(--color-glass-border)] font-bold text-[10px] inline-flex items-center whitespace-nowrap shrink-0">
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
                                  className="px-2.5 py-1 rounded bg-[#7b0b76]/20 hover:bg-[#7b0b76]/35 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/40 text-[11px] font-bold transition inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-sm"
                                  title="Sign out visitor at current time"
                                >
                                  <LogOut className="w-3 h-3 shrink-0" /> Sign Out
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveVisitor(visitor.id)}
                                className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition inline-flex items-center shrink-0 shadow-sm"
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

      {/* SUB-TAB 2: BALLAST WATER RECORD BOOK */}
      {activeLogbookTab === 'ballast' && (() => {
        const allBallastLogs = ship.ballastWaterLogs || [];

        const totalBallasted = allBallastLogs
          .filter((l) => l.operation === 'Ballasting')
          .reduce((acc, l) => acc + l.volumeM3, 0);

        const totalDeballasted = allBallastLogs
          .filter((l) => l.operation === 'Deballasting')
          .reduce((acc, l) => acc + l.volumeM3, 0);

        const filteredLogs = allBallastLogs.filter((log) => {
          if (ballastFilterOp !== 'all' && log.operation !== ballastFilterOp) {
            return false;
          }
          if (ballastSearchTerm.trim()) {
            const q = ballastSearchTerm.toLowerCase();
            const matchTanks = log.tanks.toLowerCase().includes(q);
            const matchGps = log.gpsCoordinates.toLowerCase().includes(q);
            const matchOfficer = log.officerInCharge.toLowerCase().includes(q);
            const matchRemarks = (log.remarks || '').toLowerCase().includes(q);
            if (!matchTanks && !matchGps && !matchOfficer && !matchRemarks) return false;
          }
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
              <div>
                <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#28ada4]" />
                  Ballast Water Record Book (IMO BWM Convention)
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Official digital logbook for ballast water operations (ballasting, deballasting, internal transfer & BWM exchange) in compliance with IMO D-2 standards.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAddBallastModalOpen(true)}
                className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Log Ballast Operation
              </motion.button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="mozuk-glass-card p-4 rounded-xl border border-[var(--color-glass-border)]">
                <div className="text-[var(--text-muted)] font-bold text-[11px] uppercase">Total Operations Logged</div>
                <div className="font-extrabold text-[var(--text-main)] text-xl font-mono mt-1">
                  {allBallastLogs.length}
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[#28ada4]/30 bg-[#28ada4]/10">
                <div className="text-[#28ada4] font-bold text-[11px] uppercase flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5" /> Total Volume Ballasted
                </div>
                <div className="font-extrabold text-[#28ada4] text-xl font-mono mt-1">
                  {totalBallasted.toLocaleString()} m³
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[#7b0b76]/30 bg-[#7b0b76]/10">
                <div className="text-[#7b0b76] dark:text-[#c432bd] font-bold text-[11px] uppercase flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> Total Volume Deballasted
                </div>
                <div className="font-extrabold text-[#7b0b76] dark:text-[#c432bd] text-xl font-mono mt-1">
                  {totalDeballasted.toLocaleString()} m³
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]">
                <div className="text-[var(--text-muted)] font-bold text-[11px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#28ada4]" /> BWTS Compliance Status
                </div>
                <div className="font-extrabold text-[#28ada4] text-xs mt-1">
                  Mozuk UV System Operational (IMO D-2)
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mozuk-glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tanks, GPS, officer or remarks..."
                    value={ballastSearchTerm}
                    onChange={(e) => setBallastSearchTerm(e.target.value)}
                    className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl pl-9 pr-3.5 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition"
                  />
                </div>

                <select
                  value={ballastFilterOp}
                  onChange={(e) => setBallastFilterOp(e.target.value)}
                  className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Operations</option>
                  <option value="Ballasting">Ballasting</option>
                  <option value="Deballasting">Deballasting</option>
                  <option value="Internal Transfer">Internal Transfer</option>
                  <option value="Ballast Exchange (BWM)">Ballast Exchange (BWM)</option>
                </select>
              </div>

              {(ballastSearchTerm !== '' || ballastFilterOp !== 'all') && (
                <button
                  onClick={() => {
                    setBallastSearchTerm('');
                    setBallastFilterOp('all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
              <table className="w-full text-left text-xs min-w-[950px]">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Operation Type</th>
                    <th className="py-3.5 px-4">Tank(s) / Compartment</th>
                    <th className="py-3.5 px-4">Volume (m³)</th>
                    <th className="py-3.5 px-4">GPS Coordinates / Location</th>
                    <th className="py-3.5 px-4">Treatment Method</th>
                    <th className="py-3.5 px-4">Officer in Charge</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[var(--text-muted)] text-xs">
                        No ballast water operations recorded match criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      return (
                        <tr key={log.id} className="hover:bg-[var(--color-glass-border)] transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-main)] whitespace-nowrap">
                            {formatDate(log.date)} {log.time ? `@ ${log.time}` : ''}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {log.operation === 'Ballasting' && (
                              <span className="px-2.5 py-1 rounded-full bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 font-bold text-[11px]">
                                Ballasting
                              </span>
                            )}
                            {log.operation === 'Deballasting' && (
                              <span className="px-2.5 py-1 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/30 font-bold text-[11px]">
                                Deballasting
                              </span>
                            )}
                            {log.operation === 'Internal Transfer' && (
                              <span className="px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--text-main)] border border-[var(--color-glass-border)] font-bold text-[11px]">
                                Internal Transfer
                              </span>
                            )}
                            {log.operation === 'Ballast Exchange (BWM)' && (
                              <span className="px-2.5 py-1 rounded-full bg-[#28ada4]/15 text-[#28ada4] border border-[#28ada4]/30 font-bold text-[11px]">
                                Ballast Exchange (BWM)
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-[var(--text-main)]">
                            {log.tanks}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-extrabold text-[#28ada4] text-sm whitespace-nowrap">
                            {log.volumeM3.toLocaleString()} m³
                          </td>

                          <td className="py-3.5 px-4 text-[var(--text-main)] font-mono text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                              <span>{log.gpsCoordinates}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[var(--text-muted)] font-semibold">
                            {log.treatmentMethod || 'Mozuk BWTS UV'}
                          </td>

                          <td className="py-3.5 px-4 text-[var(--text-main)] font-bold">
                            {log.officerInCharge}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleRemoveBallastLog(log.id)}
                              className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition inline-flex items-center"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        );
      })()}

      {/* SUB-TAB 3: SEWAGE & GREY WATER RECORD BOOK */}
      {activeLogbookTab === 'sewage' && (() => {
        const allSewageLogs = ship.sewageWaterLogs || [];

        const totalSeaDischarge = allSewageLogs
          .filter((l) => l.operation.includes('Sea'))
          .reduce((acc, l) => acc + l.volumeM3, 0);

        const totalShoreDischarge = allSewageLogs
          .filter((l) => l.operation.includes('Shore'))
          .reduce((acc, l) => acc + l.volumeM3, 0);

        const filteredLogs = allSewageLogs.filter((log) => {
          if (sewageFilterType !== 'all' && log.type !== sewageFilterType) {
            return false;
          }
          if (sewageFilterOp !== 'all' && log.operation !== sewageFilterOp) {
            return false;
          }
          if (sewageSearchTerm.trim()) {
            const q = sewageSearchTerm.toLowerCase();
            const matchSource = log.tankSource.toLowerCase().includes(q);
            const matchGps = log.gpsCoordinates.toLowerCase().includes(q);
            const matchOfficer = log.officerInCharge.toLowerCase().includes(q);
            const matchRemarks = (log.remarks || '').toLowerCase().includes(q);
            if (!matchSource && !matchGps && !matchOfficer && !matchRemarks) return false;
          }
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
              <div>
                <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-[#7b0b76] dark:text-[#c432bd]" />
                  Sewage & Grey Water Record Book (MARPOL Annex IV)
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Official environmental logbook for black water sewage discharges and galley/accommodation grey water handling in accordance with MARPOL Annex IV regulations.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAddSewageModalOpen(true)}
                className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Log Sewage / Grey Water Operation
              </motion.button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="mozuk-glass-card p-4 rounded-xl border border-[var(--color-glass-border)]">
                <div className="text-[var(--text-muted)] font-bold text-[11px] uppercase">Total Logged Operations</div>
                <div className="font-extrabold text-[var(--text-main)] text-xl font-mono mt-1">
                  {allSewageLogs.length}
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[#28ada4]/30 bg-[#28ada4]/10">
                <div className="text-[#28ada4] font-bold text-[11px] uppercase flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Discharged to Sea (Offshore)
                </div>
                <div className="font-extrabold text-[#28ada4] text-xl font-mono mt-1">
                  {totalSeaDischarge.toLocaleString()} m³
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[#7b0b76]/30 bg-[#7b0b76]/10">
                <div className="text-[#7b0b76] dark:text-[#c432bd] font-bold text-[11px] uppercase flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5" /> Discharged to Shore Reception
                </div>
                <div className="font-extrabold text-[#7b0b76] dark:text-[#c432bd] text-xl font-mono mt-1">
                  {totalShoreDischarge.toLocaleString()} m³
                </div>
              </div>

              <div className="mozuk-glass-card p-4 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]">
                <div className="text-[var(--text-muted)] font-bold text-[11px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#28ada4]" /> MARPOL Annex IV Status
                </div>
                <div className="font-extrabold text-[#28ada4] text-xs mt-1">
                  Certified STP & Holding Tank Compliant
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mozuk-glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tank, GPS, officer or remarks..."
                    value={sewageSearchTerm}
                    onChange={(e) => setSewageSearchTerm(e.target.value)}
                    className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl pl-9 pr-3.5 py-2 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition"
                  />
                </div>

                <select
                  value={sewageFilterType}
                  onChange={(e) => setSewageFilterType(e.target.value)}
                  className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Water Types</option>
                  <option value="Sewage (Black Water)">Sewage (Black Water)</option>
                  <option value="Grey Water">Grey Water</option>
                </select>

                <select
                  value={sewageFilterOp}
                  onChange={(e) => setSewageFilterOp(e.target.value)}
                  className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Operations</option>
                  <option value="Discharge to Sea (Outside Special Area)">Discharge to Sea</option>
                  <option value="Discharge to Shore Facility">Discharge to Shore Facility</option>
                  <option value="Internal Transfer to Holding Tank">Internal Transfer</option>
                  <option value="Treatment Plant Disinfection">STP Treatment</option>
                </select>
              </div>

              {(sewageSearchTerm !== '' || sewageFilterType !== 'all' || sewageFilterOp !== 'all') && (
                <button
                  onClick={() => {
                    setSewageSearchTerm('');
                    setSewageFilterType('all');
                    setSewageFilterOp('all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="mozuk-glass-card rounded-2xl overflow-x-auto shadow-lg">
              <table className="w-full text-left text-xs min-w-[950px]">
                <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Water Category</th>
                    <th className="py-3.5 px-4">Operation</th>
                    <th className="py-3.5 px-4">Tank / Source</th>
                    <th className="py-3.5 px-4">Volume (m³)</th>
                    <th className="py-3.5 px-4">GPS Coordinates / Location</th>
                    <th className="py-3.5 px-4">Ship Speed</th>
                    <th className="py-3.5 px-4">Officer in Charge</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-glass-border)]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[var(--text-muted)] text-xs">
                        No sewage or grey water operations recorded match criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      return (
                        <tr key={log.id} className="hover:bg-[var(--color-glass-border)] transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-main)] whitespace-nowrap">
                            {formatDate(log.date)} {log.time ? `@ ${log.time}` : ''}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {log.type === 'Sewage (Black Water)' ? (
                              <span className="px-2.5 py-1 rounded bg-[#7b0b76]/15 text-[#7b0b76] dark:text-[#c432bd] border border-[#7b0b76]/30 font-bold text-[11px]">
                                Black Water (Sewage)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-[var(--color-surface)] text-[var(--text-muted)] border border-[var(--color-glass-border)] font-bold text-[11px]">
                                Grey Water
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[var(--text-main)]">
                            {log.operation}
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-[var(--text-main)]">
                            {log.tankSource}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-extrabold text-[#28ada4] text-sm whitespace-nowrap">
                            {log.volumeM3.toLocaleString()} m³
                          </td>

                          <td className="py-3.5 px-4 text-[var(--text-main)] font-mono text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                              <span>{log.gpsCoordinates}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-xs font-bold text-[var(--text-muted)] whitespace-nowrap">
                            {log.shipSpeedKnots !== undefined ? `${log.shipSpeedKnots} kn` : '—'}
                          </td>

                          <td className="py-3.5 px-4 text-[var(--text-main)] font-bold">
                            {log.officerInCharge}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleRemoveSewageLog(log.id)}
                              className="p-1.5 rounded bg-black/40 hover:bg-[#7b0b76]/40 text-[var(--text-muted)] hover:text-[#7b0b76] dark:hover:text-[#c432bd] border border-[var(--color-glass-border)] hover:border-[#7b0b76]/40 transition inline-flex items-center"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        );
      })()}
    </div>
  </div>
)}

      {/* MODAL 1: ADD CREW MEMBER */}
      <AnimatePresence>
        {isAddCrewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddCrewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[var(--color-primary)]" /> Add Crew Member to {ship.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">Assign existing company personnel or register a new crew member</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddCrewModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                      <div className="text-[11px] text-[var(--color-primary)] font-bold mt-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +44 7911 123456"
                    value={crewPhoneNumber}
                    onChange={(e) => setCrewPhoneNumber(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsAddCrewModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Add Crew Member
                </motion.button>
              </div>
            </form>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MODAL 2: ADD TECHNICAL DOCUMENT */}
      <AnimatePresence>
        {isAddDocModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddDocModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[var(--color-primary)]" /> Add Technical Document
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Save Document
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MODAL 3: LOG REPAIR / MAINTENANCE WORK ORDER */}
      <AnimatePresence>
        {isAddRepairModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddRepairModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[var(--color-primary)]" /> Log Repair / Maintenance Task
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddRepairModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsAddRepairModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Log Repair Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MODAL 4: CREW MEMBER PROFILE */}
      <AnimatePresence>
        {selectedCrewMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedCrewMember(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
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

                  {/* Phone Number */}
                  <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-glass-border)]">
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Phone Number
                    </div>
                    <div className="font-mono font-bold text-[var(--text-main)] text-xs mt-1 truncate" title={selectedCrewMember.phoneNumber}>
                      {selectedCrewMember.phoneNumber || 'N/A'}
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

                {(() => {
                  const effectiveSelectedHistory = getEffectiveVesselHistory(selectedCrewMember);
                  return effectiveSelectedHistory.length === 0 ? (
                    <div className="bg-[var(--color-surface)] rounded-xl p-4 text-center text-[var(--text-muted)] text-xs border border-[var(--color-glass-border)]">
                      Current vessel ({ship.name}) is the first recorded assignment in company fleet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sortVesselHistory(effectiveSelectedHistory).map((entry, idx) => (
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
                            <span className={!entry.endDate ? 'text-[#28ada4] font-bold' : ''}>
                              {entry.endDate ? formatDate(entry.endDate) : 'Present (Current Assignment)'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[var(--color-glass-border)] bg-[var(--color-surface)] flex justify-end shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCrewMember(null)}
                className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs"
              >
                Close Profile
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MODAL 5: LOG NEW SHIP VISITOR */}
      <AnimatePresence>
        {isAddVisitorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddVisitorModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" /> Log New Visitor to {ship.name}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddVisitorModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsAddVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                >
                  Save Visitor Entry
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* MODAL 6: LOG BALLAST WATER OPERATION */}
      <AnimatePresence>
        {isAddBallastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddBallastModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#28ada4]" /> Log Ballast Operation to {ship.name}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddBallastModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddBallastLog} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Date *</label>
                    <DateInput
                      value={ballastDate}
                      onChange={(val) => setBallastDate(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Time (HH:mm) *</label>
                    <input
                      type="time"
                      value={ballastTime}
                      onChange={(e) => setBallastTime(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Operation Type *</label>
                    <select
                      value={ballastOperation}
                      onChange={(e) => setBallastOperation(e.target.value as any)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold"
                    >
                      <option value="Ballasting">Ballasting</option>
                      <option value="Deballasting">Deballasting</option>
                      <option value="Internal Transfer">Internal Transfer</option>
                      <option value="Ballast Exchange (BWM)">Ballast Exchange (BWM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Volume (m³) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      step="0.1"
                      min="0"
                      value={ballastVolumeM3}
                      onChange={(e) => setBallastVolumeM3(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Tank(s) / Compartments *</label>
                  <input
                    type="text"
                    placeholder="e.g. Fore Peak Tank (FPT) & DBT 1P/1S"
                    value={ballastTanks}
                    onChange={(e) => setBallastTanks(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">GPS Coordinates / Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. 51° 55' N, 003° 02' E or Rotterdam Port"
                    value={ballastGpsCoordinates}
                    onChange={(e) => setBallastGpsCoordinates(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Treatment Method / Status</label>
                  <input
                    type="text"
                    placeholder="e.g. UV Disinfection (Mozuk BWTS) / Un-treated"
                    value={ballastTreatmentMethod}
                    onChange={(e) => setBallastTreatmentMethod(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Officer in Charge *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Officer Alexey Ivanov"
                    value={ballastOfficerInCharge}
                    onChange={(e) => setBallastOfficerInCharge(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Remarks / Operation Purpose</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Deballasting during cargo loading at Berth 4."
                    value={ballastRemarks}
                    onChange={(e) => setBallastRemarks(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsAddBallastModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                  >
                    Save Ballast Log
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 7: LOG SEWAGE / GREY WATER OPERATION */}
      <AnimatePresence>
        {isAddSewageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddSewageModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-[#7b0b76] dark:text-[#c432bd]" /> Log Sewage / Grey Water Operation to {ship.name}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddSewageModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddSewageLog} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Date *</label>
                    <DateInput
                      value={sewageDate}
                      onChange={(val) => setSewageDate(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Time (HH:mm) *</label>
                    <input
                      type="time"
                      value={sewageTime}
                      onChange={(e) => setSewageTime(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Water Category *</label>
                    <select
                      value={sewageType}
                      onChange={(e) => setSewageType(e.target.value as any)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold"
                    >
                      <option value="Sewage (Black Water)">Sewage (Black Water)</option>
                      <option value="Grey Water">Grey Water</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Volume (m³) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 12.5"
                      step="0.1"
                      min="0"
                      value={sewageVolumeM3}
                      onChange={(e) => setSewageVolumeM3(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Operation Type *</label>
                  <select
                    value={sewageOperation}
                    onChange={(e) => setSewageOperation(e.target.value as any)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold"
                  >
                    <option value="Discharge to Sea (Outside Special Area)">Discharge to Sea (Outside Special Area)</option>
                    <option value="Discharge to Shore Facility">Discharge to Shore Reception Facility</option>
                    <option value="Internal Transfer to Holding Tank">Internal Transfer to Holding Tank</option>
                    <option value="Treatment Plant Disinfection">STP Treatment Plant Disinfection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Tank / Source Compartment *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sewage Holding Tank #1 / Galley Grey Water Tank"
                    value={sewageTankSource}
                    onChange={(e) => setSewageTankSource(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">GPS Coordinates / Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. 53° 12' N, 004° 10' E"
                      value={sewageGpsCoordinates}
                      onChange={(e) => setSewageGpsCoordinates(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Ship Speed (knots)</label>
                    <input
                      type="number"
                      placeholder="e.g. 14.2"
                      step="0.1"
                      min="0"
                      value={sewageShipSpeedKnots}
                      onChange={(e) => setSewageShipSpeedKnots(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Officer in Charge *</label>
                  <input
                    type="text"
                    placeholder="e.g. Second Engineer Elena Rostova"
                    value={sewageOfficerInCharge}
                    onChange={(e) => setSewageOfficerInCharge(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Remarks / MARPOL Compliance Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Discharged through certified STP at speed >4 knots (>12 NM off coast)."
                    value={sewageRemarks}
                    onChange={(e) => setSewageRemarks(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsAddSewageModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                  >
                    Save Sewage Log
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 8: LOG PROCUREMENT ORDER */}
      <AnimatePresence>
        {isAddProcurementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAddProcurementModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)]">
                <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#7b0b76] dark:text-[#c432bd]" /> Log Spare Part Procurement Order
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsAddProcurementModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddProcurementOrder} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Spare Part Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Engine Fuel Injection Pump Valves"
                    value={procPartName}
                    onChange={(e) => setProcPartName(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Part Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MAN-B&W-50MC-08"
                      value={procPartNumber}
                      onChange={(e) => setProcPartNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Provider / OEM Supplier *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MAN Energy Solutions"
                      value={procProvider}
                      onChange={(e) => setProcProvider(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Order Date</label>
                    <DateInput
                      value={procOrderDate}
                      onChange={(val) => setProcOrderDate(val)}
                      inputClassName="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Delivery Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Rotterdam Berth 4"
                      value={procDeliveryPort}
                      onChange={(e) => setProcDeliveryPort(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={procQuantity}
                      onChange={(e) => setProcQuantity(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Order Status</label>
                    <select
                      value={procStatus}
                      onChange={(e) => setProcStatus(e.target.value as any)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-bold cursor-pointer"
                    >
                      <option value="ordered">Ordered</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">Requisition Officer</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Engineer Dimitrios Pappas"
                      value={procOfficer}
                      onChange={(e) => setProcOfficer(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">Requisition Remarks</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Urgent spare part requisition for upcoming main engine overhaul."
                    value={procRemarks}
                    onChange={(e) => setProcRemarks(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl p-3 text-xs text-[var(--text-main)]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsAddProcurementModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold"
                  >
                    Save Procurement Order
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
