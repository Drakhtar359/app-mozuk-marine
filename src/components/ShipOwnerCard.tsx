import React from 'react';
import { ShipOwnerDetails } from '../types/vessel';
import {
  Building2,
  Globe,
  Phone,
  Mail,
  UserCheck,
  Edit,
  Briefcase,
  Shield,
  FileText,
} from 'lucide-react';

interface ShipOwnerCardProps {
  ownerDetails: ShipOwnerDetails;
  onEdit: () => void;
}

export const ShipOwnerCard: React.FC<ShipOwnerCardProps> = ({ ownerDetails, onEdit }) => {
  return (
    <div className="mozuk-glass-card rounded-2xl p-6 relative overflow-hidden shadow-lg border border-[var(--color-glass-border)]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[rgba(0,242,254,0.1)] text-[var(--color-primary)] border border-[var(--color-glass-border)] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-xl text-[var(--text-main)]">
                {ownerDetails.companyName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
                <Globe className="w-3 h-3 text-cyan-400" />
                {ownerDetails.country}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Authorized Ship Owner & Managing Agency
              </span>
              <span className="text-[var(--color-glass-border)]">|</span>
              <span className="flex items-center gap-1 font-mono text-[var(--text-main)] font-semibold">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> {ownerDetails.phoneNumber}
              </span>
            </p>
          </div>
        </div>

        {/* Edit Button requested by user */}
        <button
          onClick={onEdit}
          className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm transition hover:scale-[1.02]"
        >
          <Edit className="w-4 h-4" /> Edit Owner Details
        </button>
      </div>

      {/* Designated Contact People Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[var(--color-primary)]" /> Designated Company Contacts ({ownerDetails.contactPeople.length})
          </h4>
        </div>

        {ownerDetails.contactPeople.length === 0 ? (
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] rounded-xl p-4 text-center text-xs text-[var(--text-muted)]">
            No designated contact people listed. Click "Edit Owner Details" to add DPA, superintendents, or emergency contacts.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ownerDetails.contactPeople.map((person) => (
              <div
                key={person.id}
                className="p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] space-y-2 hover:border-[var(--color-glass-border-hover)] transition"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[var(--color-glass-border)] pb-2">
                  <div>
                    <h5 className="font-extrabold text-[var(--text-main)] text-xs">{person.fullName}</h5>
                    <span className="text-[11px] text-[var(--color-primary)] font-semibold block mt-0.5">
                      {person.position}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-glass-border)] text-[10px] font-bold text-[var(--text-muted)] shrink-0">
                    {person.country}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[var(--text-main)]">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <a href={`tel:${person.phoneNumber}`} className="hover:underline">
                      {person.phoneNumber}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-main)] truncate" title={person.email}>
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <a href={`mailto:${person.email}`} className="hover:underline truncate">
                      {person.email}
                    </a>
                  </div>
                </div>

                {person.description && (
                  <p className="text-[11px] text-[var(--text-muted)] italic bg-[var(--color-surface)] p-2 rounded-lg border border-[var(--color-glass-border)] mt-2">
                    "{person.description}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
