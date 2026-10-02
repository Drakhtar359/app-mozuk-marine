import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShipOwnerDetails, Ship, CrewMember } from '../types/vessel';
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
  ChevronRight,
  ChevronLeft,
  Anchor,
} from 'lucide-react';

interface CompanyProfilePageProps {
  ownerDetails: ShipOwnerDetails;
  ships: Ship[];
  companyCrew: CrewMember[];
  onBack: () => void;
  onOpenEditModal: () => void;
  onSelectShip: (ship: Ship) => void;
}

export const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({
  ownerDetails,
  ships,
  companyCrew,
  onBack,
  onOpenEditModal,
  onSelectShip,
}) => {
  const [vesselPage, setVesselPage] = useState(1);
  const VESSELS_PER_PAGE = 12; // 4 vessels per row * 3 rows per page

  const totalFleetCount = ships.length;
  const totalCrewCount = companyCrew.length;
  const totalOnboardCrewCount = companyCrew.filter((c) => c.assignedShipId).length;
  const totalDocsCount = ships.reduce((acc, s) => acc + s.documents.length, 0);
  const totalOpenRepairsCount = ships.reduce(
    (acc, s) => acc + s.maintenance.filter((m) => m.status !== 'completed').length,
    0
  );

  const totalVesselPages = Math.ceil(ships.length / VESSELS_PER_PAGE) || 1;
  const validVesselPage = Math.min(vesselPage, totalVesselPages);
  const paginatedShips = ships.slice((validVesselPage - 1) * VESSELS_PER_PAGE, validVesselPage * VESSELS_PER_PAGE);

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

      {/* Main Company Overview Banner */}
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

      {/* 1. Managed Fleet Vessels Directory (Placed BEFORE Internal Contacts, Up to 4 per row, 3 rows max per page) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <Anchor className="w-5 h-5 text-[#28ada4]" />
              Managed Fleet Directory ({ships.length})
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Vessels currently registered and operating under {ownerDetails.companyName}.
            </p>
          </div>

          {totalVesselPages > 1 && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                onClick={() => setVesselPage((prev) => Math.max(prev - 1, 1))}
                disabled={validVesselPage === 1}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--text-main)] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-glass-border)] transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <span className="text-xs font-mono font-bold text-[var(--text-main)] px-2">
                Page {validVesselPage} of {totalVesselPages}
              </span>

              <button
                onClick={() => setVesselPage((prev) => Math.min(prev + 1, totalVesselPages))}
                disabled={validVesselPage === totalVesselPages}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--text-main)] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-glass-border)] transition flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 4 Vessels per row grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {paginatedShips.map((ship) => {
            const openRepairs = ship.maintenance.filter((m) => m.status !== 'completed').length;
            return (
              <motion.div
                key={ship.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => onSelectShip(ship)}
                className="mozuk-glass-card rounded-2xl p-4 cursor-pointer hover:border-[#28ada4]/50 transition group flex flex-col justify-between border border-[var(--color-glass-border)] shadow-md relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#28ada4] uppercase tracking-wider">
                      {ship.type}
                    </span>
                    {ship.flag && (
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)]">
                        {ship.flag}
                      </span>
                    )}
                  </div>

                  <h4 className="font-['Space_Grotesk',sans-serif] font-extrabold text-lg text-[var(--text-main)] group-hover:text-[#28ada4] transition leading-snug">
                    {ship.name}
                  </h4>
                  <div className="font-mono text-xs font-bold text-[var(--text-muted)] mt-1">
                    {ship.imo}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-glass-border)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] font-medium">Crew Onboard:</span>
                    <strong className="text-[var(--text-main)] font-bold">{ship.crew.length} Personnel</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] font-medium">Open Repairs:</span>
                    <strong className={openRepairs > 0 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                      {openRepairs} Pending
                    </strong>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#28ada4] group-hover:underline">
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Internal Company Contacts Table Section (Placed AFTER Vessels) */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-glass-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#28ada4]" />
              Internal Company Contacts Directory
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Authorized company representatives, DPAs, technical superintendents, and crewing directors.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenEditModal}
            className="px-3.5 py-2 rounded-full bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Edit className="w-3.5 h-3.5" /> Manage Contacts
          </motion.button>
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
                {ownerDetails.contactPeople.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                      <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                      No internal contacts listed. Click "Manage Contacts" to add team members.
                    </td>
                  </tr>
                ) : (
                  ownerDetails.contactPeople.map((person) => (
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
    </div>
  );
};
