import React from 'react';
import { motion } from 'framer-motion';
import { ShipOwnerDetails, Ship, CrewMember, SubscriptionTier } from '../types/vessel';
import {
  Building2,
  Phone,
  Edit,
  ShieldCheck,
  Users,
  Ship as ShipIcon,
  FileCheck,
  Wrench,
  Crown,
  Sparkles,
  Shield,
  ChevronDown,
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
  onOpenEditModal,
  onUpdateOwnerDetails,
}) => {
  const totalFleetCount = ships.length;
  const totalCrewCount = companyCrew.length;
  const totalOnboardCrewCount = companyCrew.filter((c) => c.assignedShipId).length;
  const totalDocsCount = ships.reduce((acc, s) => acc + s.documents.length, 0);
  const totalOpenRepairsCount = ships.reduce(
    (acc, s) => acc + s.maintenance.filter((m) => m.status !== 'completed').length,
    0
  );

  const contactPeopleCount = (ownerDetails.contactPeople || []).length;
  const currentTier: SubscriptionTier = ownerDetails.subscriptionTier || 'Platinum';

  const handleUpdateTier = (newTier: SubscriptionTier) => {
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        subscriptionTier: newTier,
      });
    }
  };

  const getTierBadgeStyles = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-[#7b0b76]/15 text-[#7b0b76] border-[#7b0b76]/40 hover:border-[#7b0b76] shadow-[0_0_14px_rgba(123,11,118,0.22)]';
      case 'Platinum':
        return 'bg-[#28ada4]/15 text-[#28ada4] border-[#28ada4]/40 hover:border-[#28ada4] shadow-[0_0_14px_rgba(40,173,164,0.22)]';
      case 'Gold':
        return 'bg-black/5 dark:bg-white/10 text-[var(--text-main)] border-[var(--color-glass-border-hover)] hover:border-[var(--text-main)]';
      case 'Silver':
        return 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] border-[var(--color-glass-border)] hover:border-[var(--color-glass-border-hover)]';
      case 'Free':
      default:
        return 'bg-black/5 dark:bg-white/5 text-[var(--text-dim)] border-[var(--color-glass-border)]';
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'Diamond':
        return <Sparkles className="w-3.5 h-3.5 text-[#7b0b76] shrink-0" />;
      case 'Platinum':
        return <Crown className="w-3.5 h-3.5 text-[#28ada4] shrink-0" />;
      case 'Gold':
        return <Crown className="w-3.5 h-3.5 text-[var(--text-main)] shrink-0" />;
      case 'Silver':
        return <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />;
      case 'Free':
      default:
        return <Shield className="w-3.5 h-3.5 text-[var(--text-dim)] shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--color-glass-border)] pb-4">
        <div>
          <h2 className="font-heading font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            Company Profile & Manager Details
          </h2>
        </div>

        {/* Subscription Tier Block */}
        <div className="flex flex-col sm:items-end shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
            Subscription tier
          </span>
          <div className="mt-1 relative inline-flex items-center">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              {getTierIcon(currentTier)}
            </div>
            <select
              value={currentTier}
              onChange={(e) => handleUpdateTier(e.target.value as SubscriptionTier)}
              className={`appearance-none pl-8 pr-8 py-1.5 rounded-xl font-extrabold text-xs border cursor-pointer focus:outline-none transition ${getTierBadgeStyles(
                currentTier
              )}`}
            >
              <option value="Diamond" className="bg-[var(--color-bg-alt)] text-[var(--text-main)] font-bold">Diamond</option>
              <option value="Platinum" className="bg-[var(--color-bg-alt)] text-[var(--text-main)] font-bold">Platinum</option>
              <option value="Gold" className="bg-[var(--color-bg-alt)] text-[var(--text-main)] font-bold">Gold</option>
              <option value="Silver" className="bg-[var(--color-bg-alt)] text-[var(--text-main)] font-bold">Silver</option>
              <option value="Free" className="bg-[var(--color-bg-alt)] text-[var(--text-main)] font-bold">Free</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </div>
          </div>
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
                <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
                  {ownerDetails.companyName}
                </h1>
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
                  {contactPeopleCount} Internal Contact{contactPeopleCount === 1 ? '' : 's'}
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
            className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 self-start cursor-pointer"
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
              <div className="font-['Montserrat',sans-serif] font-extrabold text-[var(--text-main)] text-2xl">{totalFleetCount} Vessels</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#28ada4]/10 text-[#28ada4] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Total Crew Personnel</div>
              <div className="font-['Montserrat',sans-serif] font-extrabold text-[var(--text-main)] text-2xl leading-none">{totalCrewCount}</div>
              <div className="text-xs text-[#28ada4] font-bold mt-1">
                ({totalOnboardCrewCount} onboard)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--text-main)] shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Technical Certificates</div>
              <div className="font-['Montserrat',sans-serif] font-extrabold text-[var(--text-main)] text-2xl">{totalDocsCount} Valid</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-[#7b0b76]/10 text-[#7b0b76] shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">Open Work Orders</div>
              <div className="font-['Montserrat',sans-serif] font-extrabold text-[#7b0b76] text-2xl">{totalOpenRepairsCount} Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
