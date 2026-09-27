import React, { useState, useEffect } from 'react';
import { ShipOwnerDetails, CompanyContactPerson } from '../types/vessel';
import {
  Building2,
  Globe,
  Phone,
  Mail,
  UserCheck,
  Plus,
  Trash2,
  X,
  FileText,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

interface ShipOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerDetails: ShipOwnerDetails;
  onSave: (updatedDetails: ShipOwnerDetails) => void;
}

export const ShipOwnerModal: React.FC<ShipOwnerModalProps> = ({
  isOpen,
  onClose,
  ownerDetails,
  onSave,
}) => {
  const [companyName, setCompanyName] = useState(ownerDetails.companyName || '');
  const [country, setCountry] = useState(ownerDetails.country || '');
  const [phoneNumber, setPhoneNumber] = useState(ownerDetails.phoneNumber || '');
  const [contactPeople, setContactPeople] = useState<CompanyContactPerson[]>(
    ownerDetails.contactPeople || []
  );

  useEffect(() => {
    setCompanyName(ownerDetails.companyName || '');
    setCountry(ownerDetails.country || '');
    setPhoneNumber(ownerDetails.phoneNumber || '');
    setContactPeople(ownerDetails.contactPeople || []);
  }, [ownerDetails, isOpen]);

  if (!isOpen) return null;

  const handleAddContactPerson = () => {
    const newPerson: CompanyContactPerson = {
      id: `cp-${Date.now()}`,
      fullName: '',
      position: '',
      country: country || 'Mozambique',
      phoneNumber: '',
      email: '',
      description: '',
    };
    setContactPeople([...contactPeople, newPerson]);
  };

  const handleUpdateContactPerson = (
    id: string,
    field: keyof CompanyContactPerson,
    value: string
  ) => {
    setContactPeople(
      contactPeople.map((cp) => (cp.id === id ? { ...cp, [field]: value } : cp))
    );
  };

  const handleRemoveContactPerson = (id: string) => {
    setContactPeople(contactPeople.filter((cp) => cp.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: companyName.trim() || 'MOZUK MARINE SHIPPING SERVICES S.A.',
      country: country.trim() || 'Mozambique',
      phoneNumber: phoneNumber.trim() || '+258 21 300 450',
      contactPeople: contactPeople.filter((cp) => cp.fullName.trim() !== ''),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
              Edit Ship Owner & Manager Details
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Update corporate owner profile, headquarters location, main hotline, and designated company contacts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* SECTION 1: MAIN COMPANY PROFILE */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--color-glass-border)] pb-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
              Company General Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Company Name */}
              <div className="sm:col-span-3">
                <label className="block text-[var(--text-main)] font-bold mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. MOZUK MARINE SHIPPING SERVICES S.A."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* 2. Country */}
              <div>
                <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> Country *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mozambique, United Kingdom"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* 3. Main Phone Number */}
              <div className="sm:col-span-2">
                <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Company Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +258 21 300 450"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DESIGNATED CONTACT PEOPLE */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-2">
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
                Company Contact People ({contactPeople.length})
              </h4>
              <button
                type="button"
                onClick={handleAddContactPerson}
                className="px-3 py-1.5 rounded-xl bg-[rgba(0,242,254,0.1)] hover:bg-[rgba(0,242,254,0.2)] text-[var(--color-primary)] border border-[var(--color-glass-border)] font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Contact Person
              </button>
            </div>

            {contactPeople.length === 0 ? (
              <div className="bg-[var(--color-surface)] border border-[var(--color-glass-border)] rounded-xl p-5 text-center text-[var(--text-muted)] text-xs">
                No company contact persons listed. Click "+ Add Contact Person" to record DPA, Technical Superintendents, or Emergency Contacts.
              </div>
            ) : (
              <div className="space-y-4">
                {contactPeople.map((person, index) => (
                  <div
                    key={person.id}
                    className="bg-[var(--color-surface)] border border-[var(--color-glass-border)] rounded-2xl p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-2">
                      <span className="font-bold text-[var(--color-primary)] text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Contact #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveContactPerson(person.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        title="Remove Contact Person"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[var(--text-main)] font-bold mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Capt. Antonio Vance"
                          value={person.fullName}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'fullName', e.target.value)
                          }
                          required
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-semibold"
                        />
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-[var(--text-main)] font-bold mb-1">
                          Position / Role *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Designated Person Ashore (DPA)"
                          value={person.position}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'position', e.target.value)
                          }
                          required
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] font-semibold"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-[var(--text-main)] font-bold mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mozambique"
                          value={person.country}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'country', e.target.value)
                          }
                          required
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)]"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-[var(--text-main)] font-bold mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +258 84 999 1122"
                          value={person.phoneNumber}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'phoneNumber', e.target.value)
                          }
                          required
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-main)]"
                        />
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-2">
                        <label className="block text-[var(--text-main)] font-bold mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. a.vance@mozukmarine.com"
                          value={person.email}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'email', e.target.value)
                          }
                          required
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-main)]"
                        />
                      </div>

                      {/* Description (Optional) */}
                      <div className="sm:col-span-2">
                        <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center justify-between">
                          <span>Description</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-normal">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Primary emergency contact for ISM/ISPS fleet operations & port clearance."
                          value={person.description || ''}
                          onChange={(e) =>
                            handleUpdateContactPerson(person.id, 'description', e.target.value)
                          }
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-[var(--color-glass-border)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Save Owner Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
