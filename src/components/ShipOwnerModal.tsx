import React, { useState, useEffect } from 'react';
import { ShipOwnerDetails, CompanyContactPerson } from '../types/vessel';
import {
  Building2,
  Globe,
  Phone,
  UserCheck,
  Plus,
  Trash2,
  X,
  ShieldCheck,
  Users,
  Edit,
  Check,
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

  // State to track which contact row is currently being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setCompanyName(ownerDetails.companyName || '');
    setCountry(ownerDetails.country || '');
    setPhoneNumber(ownerDetails.phoneNumber || '');
    setContactPeople(ownerDetails.contactPeople || []);
    setEditingId(null);
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
    setEditingId(newPerson.id); // Automatically edit newly added contact
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
    if (editingId === id) {
      setEditingId(null);
    }
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
      <div className="bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
              Edit Ship Owner & Manager Details
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Update corporate owner profile, headquarters location, main phone line, and internal company contacts.
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

          {/* SECTION 2: INTERNAL COMPANY CONTACTS TABLE (STATIC ROWS WITH EDIT & DELETE ON RIGHT) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-2">
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                Internal Company Contacts Directory ({contactPeople.length})
              </h4>
              <button
                type="button"
                onClick={handleAddContactPerson}
                className="px-3.5 py-1.5 rounded-xl bg-[rgba(0,242,254,0.1)] hover:bg-[rgba(0,242,254,0.2)] text-[var(--color-primary)] border border-[var(--color-glass-border)] font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Contact Person
              </button>
            </div>

            <div className="mozuk-glass-card rounded-2xl overflow-hidden border border-[var(--color-glass-border)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead className="bg-[var(--color-bg-alt)] text-[var(--text-muted)] text-[11px] uppercase border-b border-[var(--color-glass-border)] font-bold">
                    <tr>
                      <th className="py-3 px-3.5 min-w-[160px]">Full Name</th>
                      <th className="py-3 px-3.5 min-w-[160px]">Position / Role</th>
                      <th className="py-3 px-3.5 min-w-[110px]">Country</th>
                      <th className="py-3 px-3.5 min-w-[130px]">Phone Number</th>
                      <th className="py-3 px-3.5 min-w-[170px]">Email Address</th>
                      <th className="py-3 px-3.5 min-w-[170px]">Description</th>
                      <th className="py-3 px-3.5 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-glass-border)]">
                    {contactPeople.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] text-xs">
                          <UserCheck className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-2 opacity-50" />
                          No internal contact persons added yet. Click "+ Add Contact Person" to add static entries.
                        </td>
                      </tr>
                    ) : (
                      contactPeople.map((person) => {
                        const isEditing = editingId === person.id;

                        if (isEditing) {
                          /* EDITING ROW FORM */
                          return (
                            <tr key={person.id} className="bg-[rgba(0,242,254,0.04)] align-middle">
                              {/* Full Name */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  placeholder="e.g. Capt. Antonio Vance"
                                  value={person.fullName}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'fullName', e.target.value)
                                  }
                                  required
                                  autoFocus
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] font-semibold"
                                />
                              </td>

                              {/* Position */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  placeholder="e.g. DPA / Operations"
                                  value={person.position}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'position', e.target.value)
                                  }
                                  required
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)] font-semibold"
                                />
                              </td>

                              {/* Country */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  placeholder="e.g. Mozambique"
                                  value={person.country}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'country', e.target.value)
                                  }
                                  required
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                                />
                              </td>

                              {/* Phone Number */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="tel"
                                  placeholder="e.g. +258 84 999 1122"
                                  value={person.phoneNumber}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'phoneNumber', e.target.value)
                                  }
                                  required
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--text-main)]"
                                />
                              </td>

                              {/* Email */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="email"
                                  placeholder="e.g. a.vance@mozukmarine.com"
                                  value={person.email}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'email', e.target.value)
                                  }
                                  required
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--text-main)]"
                                />
                              </td>

                              {/* Description */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  placeholder="e.g. Primary emergency contact"
                                  value={person.description || ''}
                                  onChange={(e) =>
                                    handleUpdateContactPerson(person.id, 'description', e.target.value)
                                  }
                                  className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                                />
                              </td>

                              {/* Save/Done Action Button */}
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold hover:bg-emerald-900/80 transition inline-flex items-center gap-1 text-[11px]"
                                  title="Done Editing"
                                >
                                  <Check className="w-3.5 h-3.5" /> Done
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        /* STATIC ROW DISPLAY */
                        return (
                          <tr key={person.id} className="hover:bg-[var(--color-glass-border)] transition align-middle">
                            {/* Full Name */}
                            <td className="py-3 px-3.5 font-extrabold text-[var(--text-main)] text-xs">
                              {person.fullName || '—'}
                            </td>

                            {/* Position */}
                            <td className="py-3 px-3.5 font-semibold text-[var(--color-primary)] text-xs">
                              {person.position || '—'}
                            </td>

                            {/* Country */}
                            <td className="py-3 px-3.5 font-semibold text-[var(--text-main)]">
                              {person.country || '—'}
                            </td>

                            {/* Phone Number */}
                            <td className="py-3 px-3.5 font-mono text-cyan-400 font-semibold whitespace-nowrap">
                              {person.phoneNumber || '—'}
                            </td>

                            {/* Email */}
                            <td className="py-3 px-3.5 font-mono text-[var(--text-main)]">
                              {person.email || '—'}
                            </td>

                            {/* Description */}
                            <td className="py-3 px-3.5 text-[var(--text-muted)] italic max-w-[200px] truncate" title={person.description || ''}>
                              {person.description || '—'}
                            </td>

                            {/* Actions on the right side (Edit and Delete) */}
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingId(person.id)}
                                  className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 rounded-lg transition"
                                  title="Edit Contact Person"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveContactPerson(person.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition"
                                  title="Delete Contact Person"
                                >
                                  <Trash2 className="w-4 h-4" />
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
