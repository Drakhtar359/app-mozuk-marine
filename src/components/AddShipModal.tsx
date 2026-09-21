import React, { useState } from 'react';
import { Ship } from '../types/vessel';
import { fetchLiveVesselByImo } from '../services/marineTraffic';
import { X, Ship as ShipIcon, Radio, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface AddShipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShip: (newShip: Ship) => void;
}

export const AddShipModal: React.FC<AddShipModalProps> = ({ isOpen, onClose, onAddShip }) => {
  const [name, setName] = useState('');
  const [imo, setImo] = useState('');
  const [type, setType] = useState('Container Ship');
  const [builtYear, setBuiltYear] = useState<string>('');
  const [grossTonnage, setGrossTonnage] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Ship Name is required.');
      return;
    }
    if (!imo.trim()) {
      setError('IMO Number is required.');
      return;
    }

    setIsLoading(true);

    try {
      // Pull real live vessel location & metadata from MarineTraffic / VesselFinder
      const vesselData = await fetchLiveVesselByImo(name.trim(), imo.trim());

      const newShip: Ship = {
        id: `ship-${Date.now()}`,
        name: vesselData.realName || name.trim(),
        imo: vesselData.imo || (imo.trim().startsWith('IMO') ? imo.trim() : `IMO ${imo.trim()}`),
        type: type.trim() || vesselData.shipType || undefined,
        builtYear: builtYear ? parseInt(builtYear, 10) : vesselData.builtYear,
        grossTonnage: grossTonnage ? parseInt(grossTonnage, 10) : vesselData.grossTonnage,
        location: vesselData.location,
        addedAt: new Date().toISOString().substring(0, 10),
      };

      onAddShip(newShip);

      // Reset form
      setName('');
      setImo('');
      setBuiltYear('');
      setGrossTonnage('');
      setIsLoading(false);
      onClose();
    } catch (err) {
      setError('Failed to pull MarineTraffic location. Please check the IMO number.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShipIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Add Ship & Pull MarineTraffic AIS</h2>
              <p className="text-xs text-slate-400">Enter IMO number to resolve live position & vessel details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="bg-rose-950/50 border border-rose-800/80 text-rose-300 p-3 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Quick Tip for real vessels */}
          <div className="bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 p-3 rounded-xl flex items-start gap-2 text-[11px]">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Pro Tip:</strong> Enter real IMO numbers (e.g. <span className="font-mono text-white font-bold">9811000</span> for <em>Ever Given</em>, <span className="font-mono text-white font-bold">9703291</span> for <em>MSC Oscar</em>, or <span className="font-mono text-white font-bold">9632064</span> for <em>Merete Maersk</em>) to pull their exact real-time port location and flag!
            </div>
          </div>

          {/* 1. Ship Name (Mandatory) */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Ship Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. EVER GIVEN"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* 2. IMO Number (Mandatory) */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              IMO Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 9811000"
              value={imo}
              onChange={(e) => setImo(e.target.value)}
              disabled={isLoading}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">Unique 7-digit IMO number registered with MarineTraffic.</p>
          </div>

          {/* 3. Ship Type (Optional) */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Ship Type <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Container Ship">Container Ship</option>
              <option value="Oil Tanker">Oil Tanker</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
              <option value="LNG Carrier">LNG Carrier</option>
              <option value="General Cargo">General Cargo</option>
              <option value="Offshore Support">Offshore Support</option>
              <option value="Tugboat">Tugboat</option>
            </select>
          </div>

          {/* 4 & 5. Year of Construction & Gross Tonnage (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Year of Construction <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 2018"
                value={builtYear}
                onChange={(e) => setBuiltYear(e.target.value)}
                disabled={isLoading}
                min="1950"
                max="2030"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Gross Tonnage <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 219000"
                value={grossTonnage}
                onChange={(e) => setGrossTonnage(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching MarineTraffic AIS...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Add Ship & Pull Location
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
