import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShipOwnerDetails } from '../types/vessel';
import {
  Building2,
  Globe,
  Phone,
  X,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  Anchor,
  Sparkles,
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
  const [logoUrl, setLogoUrl] = useState(ownerDetails.logoUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompanyName(ownerDetails.companyName || '');
    setCountry(ownerDetails.country || '');
    setPhoneNumber(ownerDetails.phoneNumber || '');
    setLogoUrl(ownerDetails.logoUrl || '');
  }, [ownerDetails, isOpen]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...ownerDetails,
      companyName: companyName.trim() || 'MOZUK MARINE SHIPPING SERVICES S.A.',
      country: country.trim() || 'Mozambique',
      phoneNumber: phoneNumber.trim() || '+258 21 300 450',
      logoUrl: logoUrl.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] shrink-0">
              <div>
                <h3 className="font-heading font-extrabold text-[var(--text-main)] text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  Edit Company Details
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Update corporate owner profile, branding logo, headquarters location, and phone line.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* SECTION 1: COMPANY LOGO UPLOAD */}
              <div className="space-y-3">
                <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#28ada4]" />
                  Company Branding Logo
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {logoUrl ? (
                  <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] p-1.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={logoUrl}
                          alt="Company Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-extrabold text-[var(--text-main)] text-xs">Custom Logo Uploaded</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Active across company profile and fleet credentials.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#28ada4]/15 hover:bg-[#28ada4]/25 text-[#28ada4] border border-[#28ada4]/30 font-bold text-xs transition cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="p-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4 text-[#991b1b] dark:text-[#e05252]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-[#28ada4] bg-[#28ada4]/10'
                        : 'border-[var(--color-glass-border)] bg-[var(--color-bg)] hover:border-[#28ada4]/50'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-[#28ada4] mx-auto mb-2 opacity-80" />
                    <div className="font-bold text-[var(--text-main)] text-xs mb-1">
                      Click to upload company logo, or drag and drop image here
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Supported formats: PNG, JPG, SVG, WebP (Max 5MB)
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: COMPANY GENERAL DETAILS */}
              <div className="space-y-4 pt-2">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2 border-b border-[var(--color-glass-border)] pb-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                  Company General Details
                </h4>

                {/* Company Name */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Company Registered Name <span className="text-[#28ada4]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MOZUK MARINE SHIPPING SERVICES S.A."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country */}
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#28ada4]" /> Registered Operating Country <span className="text-[#28ada4]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mozambique"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  {/* Main Phone Number */}
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#28ada4]" /> Primary Phone Number <span className="text-[#28ada4]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +258 21 300 450"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[var(--color-glass-border)] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Save Company Details
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
