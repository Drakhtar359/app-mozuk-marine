import React from 'react';
import { ShipOwnerDetails } from '../types/vessel';
import { Building2, Globe, Phone, Edit, Shield, Users } from 'lucide-react';

interface ShipOwnerCardProps {
  ownerDetails: ShipOwnerDetails;
  onEdit: () => void;
}

export const ShipOwnerCard: React.FC<ShipOwnerCardProps> = ({ ownerDetails, onEdit }) => {
  return (
    <div className="mozuk-glass-card rounded-2xl p-6 relative overflow-hidden shadow-lg border border-[var(--color-glass-border)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[rgba(0,242,254,0.1)] text-[var(--color-primary)] border border-[var(--color-glass-border)] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)]">
                {ownerDetails.companyName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
                <Globe className="w-3 h-3 text-cyan-400" />
                {ownerDetails.country}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mt-1 font-medium">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Authorized Ship Owner & Managing Agency
              </span>
              <span className="text-[var(--color-glass-border)]">•</span>
              <span className="flex items-center gap-1 font-mono text-[var(--text-main)] font-semibold">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> {ownerDetails.phoneNumber}
              </span>
              <span className="text-[var(--color-glass-border)]">•</span>
              <span className="flex items-center gap-1 font-semibold text-[var(--color-primary)]">
                <Users className="w-3.5 h-3.5" /> {ownerDetails.contactPeople.length} Internal Contact{ownerDetails.contactPeople.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm transition hover:scale-[1.02]"
        >
          <Edit className="w-4 h-4" /> Edit Owner Details
        </button>
      </div>
    </div>
  );
};
