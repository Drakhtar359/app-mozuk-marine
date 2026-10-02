import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShipOwnerDetails, Ship, CrewMember, CompanyEmployee } from '../types/vessel';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import { DateInput } from './DateInput';
import {
  Building2,
  Globe,
  Phone,
  Edit,
  ShieldCheck,
  Users,
  Ship as ShipIcon,
  FileCheck,
  Wrench,
  ArrowLeft,
  Mail,
  UserCheck,
  Briefcase,
  Plus,
  Trash2,
  X,
  MapPin,
  Calendar,
  Search,
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
  companyCrew,
  onBack,
  onOpenEditModal,
  onSelectShip,
  onUpdateOwnerDetails,
}) => {
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  // Local state for Employees list initialized from ownerDetails
  const [employeesList, setEmployeesList] = useState<CompanyEmployee[]>(
    ownerDetails.employees || []
  );

  useEffect(() => {
    if (ownerDetails.employees) {
      setEmployeesList(ownerDetails.employees);
    }
  }, [ownerDetails.employees]);

  // Employee Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [empName, setEmpName] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [empDateOfBirth, setEmpDateOfBirth] = useState('');
  const [empDateOfJoining, setEmpDateOfJoining] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhoneNumber, setEmpPhoneNumber] = useState('');
  const [empCountry, setEmpCountry] = useState('Mozambique');
  const [empCity, setEmpCity] = useState('Maputo');

  const totalFleetCount = ships.length;
  const totalCrewCount = companyCrew.length;
  const totalOnboardCrewCount = companyCrew.filter((c) => c.assignedShipId).length;
  const totalDocsCount = ships.reduce((acc, s) => acc + s.documents.length, 0);
  const totalOpenRepairsCount = ships.reduce(
    (acc, s) => acc + s.maintenance.filter((m) => m.status !== 'completed').length,
    0
  );

  const filteredContactPeople = ownerDetails.contactPeople.filter((person) => {
    const query = contactSearchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      person.fullName.toLowerCase().includes(query) ||
      person.position.toLowerCase().includes(query) ||
      person.country.toLowerCase().includes(query) ||
      (person.phoneNumber && person.phoneNumber.toLowerCase().includes(query)) ||
      (person.email && person.email.toLowerCase().includes(query)) ||
      (person.description && person.description.toLowerCase().includes(query))
    );
  });

  // Employee Handlers
  const handleOpenAddEmployeeModal = () => {
    setEditingEmployeeId(null);
    setEmpName('');
    setEmpPosition('');
    setEmpDateOfBirth('');
    setEmpDateOfJoining('');
    setEmpEmail('');
    setEmpPhoneNumber('');
    setEmpCountry(ownerDetails.country || 'Mozambique');
    setEmpCity('Maputo');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployeeModal = (emp: CompanyEmployee) => {
    setEditingEmployeeId(emp.id);
    setEmpName(emp.name);
    setEmpPosition(emp.position);
    setEmpDateOfBirth(emp.dateOfBirth || '');
    setEmpDateOfJoining(emp.dateOfJoining || '');
    setEmpEmail(emp.email || '');
    setEmpPhoneNumber(emp.phoneNumber || '');
    setEmpCountry(emp.country || 'Mozambique');
    setEmpCity(emp.city || '');
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employeesList.filter((e) => e.id !== id);
    setEmployeesList(updated);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employees: updated,
      });
    }
  };

  const handleSaveEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;

    let updatedList: CompanyEmployee[];

    if (editingEmployeeId) {
      updatedList = employeesList.map((emp) =>
        emp.id === editingEmployeeId
          ? {
              ...emp,
              name: empName.trim(),
              position: empPosition.trim() || 'Staff',
              dateOfBirth: empDateOfBirth ? formatDate(empDateOfBirth) : '',
              dateOfJoining: empDateOfJoining ? formatDate(empDateOfJoining) : '',
              email: empEmail.trim(),
              phoneNumber: empPhoneNumber.trim(),
              country: empCountry.trim() || 'Mozambique',
              city: empCity.trim() || 'Maputo',
            }
          : emp
      );
    } else {
      const newEmployee: CompanyEmployee = {
        id: `emp-${Date.now()}`,
        name: empName.trim(),
        position: empPosition.trim() || 'Staff',
        dateOfBirth: empDateOfBirth ? formatDate(empDateOfBirth) : '',
        dateOfJoining: empDateOfJoining ? formatDate(empDateOfJoining) : formatDate(getTodayDDMMYYYY()),
        email: empEmail.trim(),
        phoneNumber: empPhoneNumber.trim(),
        country: empCountry.trim() || 'Mozambique',
        city: empCity.trim() || 'Maputo',
      };
      updatedList = [newEmployee, ...employeesList];
    }

    setEmployeesList(updatedList);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employees: updatedList,
      });
    }
    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-5">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-[var(--text-main)] hover:border-[var(--color-primary)] transition flex items-center gap-2 text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Back to Fleet Directory</span>
          </motion.button>
          <div className="h-6 w-px bg-[var(--color-glass-border)] hidden sm:block" />
          <h2 className="font-['Space_Grotesk',sans-serif] font-extrabold text-2xl text-[var(--text-main)] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#28ada4]" />
            Company Profile & Manager Details
          </h2>
        </div>
      </div>

      {/* Main Company Overview Banner with Edit Company Details Button */}
      <div className="mozuk-glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-[var(--color-glass-border)]">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-[rgba(40,173,164,0.12)] text-[#28ada4] border border-[#28ada4]/30 shrink-0 shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-['Space_Grotesk',sans-serif] font-black text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
                  {ownerDetails.companyName}
                </h1>
                <span className="px-3 py-1 rounded-full bg-[#2c6498]/20 text-[#28ada4] border border-[#28ada4]/40 text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-[#28ada4]" />
                  {ownerDetails.country}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)] pt-1">
                <span className="flex items-center gap-1.5 text-[var(--text-main)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#28ada4]" />
                  Authorized Ship Owner & Managing Agency
                </span>
                <span className="text-[var(--color-glass-border)]">•</span>
                <span className="flex items-center gap-1.5 font-mono text-[var(--text-main)] font-bold">
                  <Phone className="w-4 h-4 text-[#28ada4]" />
                  {ownerDetails.phoneNumber}
                </span>
                <span className="text-[var(--color-glass-border)]">•</span>
                <span className="flex items-center gap-1.5 font-bold text-[#28ada4]">
                  <Users className="w-4 h-4" />
                  {ownerDetails.contactPeople.length} Internal Contact{ownerDetails.contactPeople.length === 1 ? '' : 's'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-3xl pt-2">
                Primary managing entity for vessel registrations, class certifications, crew contracts, and technical maintenance work orders across the Mozuk Marine fleet infrastructure.
              </p>
            </div>
          </div>

          {/* Edit Company Details Button inside Company Details Banner */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenEditModal}
            className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 self-start"
          >
            <Edit className="w-4 h-4" /> Edit Company Details
          </motion.button>
        </div>

        {/* Fleet Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[var(--color-glass-border)]">
          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#28ada4]/10 text-[#28ada4] shrink-0">
              <ShipIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Managed Fleet</div>
              <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-2xl">{totalFleetCount} Vessels</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Total Crew Personnel</div>
              <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-2xl leading-none">{totalCrewCount}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ({totalOnboardCrewCount} onboard)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Technical Certificates</div>
              <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-2xl">{totalDocsCount} Valid</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Open Work Orders</div>
              <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-amber-600 dark:text-amber-400 text-2xl">{totalOpenRepairsCount} Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Company Employees Directory */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-glass-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#28ada4]" />
              Employees Directory ({employeesList.length})
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Shore-based corporate personnel, superintendents, operations leads, and company staff.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenAddEmployeeModal}
            className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1.5 transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Register Employee
          </motion.button>
        </div>

        <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[950px]">
              <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Employee Name & Position</th>
                  <th className="py-3.5 px-4">Date of Birth</th>
                  <th className="py-3.5 px-4">Date of Joining</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Country & City</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {employeesList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[var(--text-muted)]">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                      No company employees registered yet. Click "+ Register Employee" to populate directory.
                    </td>
                  </tr>
                ) : (
                  employeesList.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[var(--color-glass-border)] transition">
                      {/* Name & Position */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-extrabold text-[var(--text-main)] text-xs">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5">
                          {emp.position}
                        </div>
                      </td>

                      {/* Date of Birth */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[var(--text-main)] font-semibold whitespace-nowrap">
                        {emp.dateOfBirth || '—'}
                      </td>

                      {/* Date of Joining */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[var(--text-main)] font-semibold whitespace-nowrap">
                        {emp.dateOfJoining || '—'}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[#28ada4] font-semibold whitespace-nowrap">
                        {emp.email ? (
                          <a href={`mailto:${emp.email}`} className="hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#28ada4]" />
                            {emp.email}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[var(--text-main)] font-bold whitespace-nowrap">
                        {emp.phoneNumber || '—'}
                      </td>

                      {/* Country & City */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="font-bold text-[var(--text-main)]">{emp.country}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{emp.city}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditEmployeeModal(emp)}
                            className="p-1.5 px-2.5 rounded-lg bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition inline-flex items-center"
                            title="Delete employee record"
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
      </div>

      {/* 2. Internal Company Contacts Table Section */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-glass-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#28ada4]" />
              Internal Company Contacts Directory ({filteredContactPeople.length})
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Authorized company representatives, DPAs, technical superintendents, and crewing directors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search contacts by keyword..."
                value={contactSearchTerm}
                onChange={(e) => setContactSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition shadow-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenEditModal}
              className="px-3.5 py-2 rounded-full bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
            >
              <Edit className="w-3.5 h-3.5" /> Manage Contacts
            </motion.button>
          </div>
        </div>

        <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Contact Person & Position</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Responsibilities / Notes</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {filteredContactPeople.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                      <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                      {ownerDetails.contactPeople.length === 0
                        ? 'No internal contacts listed. Click "Manage Contacts" to add team members.'
                        : 'No internal contacts match your search query.'}
                    </td>
                  </tr>
                ) : (
                  filteredContactPeople.map((person) => (
                    <tr key={person.id} className="hover:bg-[var(--color-glass-border)] transition">
                      {/* Name & Position */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-extrabold text-[var(--text-main)] text-xs">
                          {person.fullName}
                        </div>
                        <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5">
                          {person.position}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-4 align-middle text-[var(--text-main)] font-semibold whitespace-nowrap">
                        {person.country}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[var(--text-main)] font-bold whitespace-nowrap">
                        {person.phoneNumber || '—'}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 align-middle font-mono text-xs text-[#28ada4] font-semibold whitespace-nowrap">
                        {person.email ? (
                          <a href={`mailto:${person.email}`} className="hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#28ada4]" />
                            {person.email}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 align-middle text-[var(--text-muted)] max-w-xs truncate">
                        {person.description || '—'}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                        <button
                          onClick={onOpenEditModal}
                          className="px-3 py-1.5 rounded-lg bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
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

      {/* MODAL: REGISTER / EDIT COMPANY EMPLOYEE */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsEmployeeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/30">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      {editingEmployeeId ? 'Edit Employee Details' : 'Register New Company Employee'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Fill in shore staff credentials and company placement.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEmployeeSubmit} className="p-6 space-y-4 text-xs">
                {/* Employee Name */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Employee Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Capt. Antonio Vance"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Position / Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fleet Operations Director, HR Lead"
                    value={empPosition}
                    onChange={(e) => setEmpPosition(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Dates Row (Date of Birth & Date of Joining) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Date of Birth
                    </label>
                    <DateInput
                      value={empDateOfBirth}
                      onChange={(val) => setEmpDateOfBirth(val)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Date of Joining Company
                    </label>
                    <DateInput
                      value={empDateOfJoining}
                      onChange={(val) => setEmpDateOfJoining(val)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>

                {/* Contact Row (Email & Phone Number) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. a.vance@mozukmarine.com"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +258 84 999 1122"
                      value={empPhoneNumber}
                      onChange={(e) => setEmpPhoneNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Location Row (Country & City) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mozambique, Greece"
                      value={empCountry}
                      onChange={(e) => setEmpCountry(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maputo, London"
                      value={empCity}
                      onChange={(e) => setEmpCity(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md"
                  >
                    {editingEmployeeId ? 'Save Changes' : 'Register Employee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
