import React, { useState } from 'react';
import { Ship } from '../types/vessel';
import { fetchLiveVesselByImo } from '../services/marineTraffic';
import { X, Ship as ShipIcon, Radio, Loader2, CheckCircle2, AlertCircle, MapPin, Compass } from 'lucide-react';

interface AddShipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShip: (newShip: Ship) => void;
}

export const AddShipModal: React.FC<AddShipModalProps> = ({ isOpen, onClose, onAddShip }) => {
  const [name, setName] = useState('');
  const [imo, setImo] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [type, setType] = useState('Container Ship');
  const [builtYear, setBuiltYear] = useState<string>('');
  const [grossTonnage, setGrossTonnage] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pull location from MarineTraffic and auto-fill Latitude & Longitude fields
  const handlePullFromMarineTraffic = async () => {
    if (!imo.trim()) {
      setError('Please enter an IMO number first to pull MarineTraffic location.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const vesselData = await fetchLiveVesselByImo(name.trim() || 'Vessel', imo.trim());
      
      if (vesselData.realName && !name.trim()) {
        setName(vesselData.realName);
      }
      if (vesselData.shipType) {
        setType(vesselData.shipType);
      }
      if (vesselData.builtYear && !builtYear) {
        setBuiltYear(vesselData.builtYear.toString());
      }

      setLatitude(vesselData.location.latitude.toString());
      setLongitude(vesselData.location.longitude.toString());
      setSuccessMessage(`MarineTraffic coordinates pulled: Lat ${vesselData.location.latitude}°, Lng ${vesselData.location.longitude}° (${vesselData.location.destination})`);
      setIsLoading(false);
    } catch (err) {
      setError('Could not pull MarineTraffic location automatically. You can plug in the coordinates manually below.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Default or parsed coordinates
    const parsedLat = latitude ? parseFloat(latitude) : 53.5412;
    const parsedLng = longitude ? parseFloat(longitude) : 9.9921;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError('Please enter valid decimal numbers for Latitude and Longitude (e.g. 53.5412 and 9.9921).');
      return;
    }

    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newShip: Ship = {
      id: `ship-${Date.now()}`,
      name: name.trim(),
      imo: imo.trim().startsWith('IMO') ? imo.trim() : `IMO ${imo.trim()}`,
      type: type.trim() || 'Container Ship',
      builtYear: builtYear ? parseInt(builtYear, 10) : undefined,
      grossTonnage: grossTonnage ? parseInt(grossTonnage, 10) : undefined,
      location: {
        latitude: parsedLat,
        longitude: parsedLng,
        status: 'Underway',
        speedKnots: 15.4,
        headingDegrees: (parseInt(imo.replace(/\D/g, '') || '100', 10) * 17) % 360,
        destination: `Position: ${parsedLat}° N, ${parsedLng}° E`,
        eta: '2026-09-25 14:00 UTC',
        lastAisUpdate: timestampStr,
        source: 'MarineTraffic Live AIS',
      },
      addedAt: new Date().toISOString().substring(0, 10),
    };

    onAddShip(newShip);

    // Reset form
    setName('');
    setImo('');
    setLatitude('');
    setLongitude('');
    setBuiltYear('');
    setGrossTonnage('');
    onClose();
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
              <h2 className="font-extrabold text-white text-base">Add Ship & MarineTraffic Coordinates</h2>
              <p className="text-xs text-slate-400">Auto-pull from MarineTraffic or plug coordinates manually</p>
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

          {successMessage && (
            <div className="bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 p-3 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* 1. Ship Name & IMO */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Auto-pull MarineTraffic Button */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Auto-pull from MarineTraffic API</span>
            </div>

            <button
              type="button"
              onClick={handlePullFromMarineTraffic}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold transition flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Compass className="w-3.5 h-3.5" />
              )}
              Pull Coordinates
            </button>
          </div>

          {/* Manual / Auto-filled Coordinates (Latitude & Longitude) */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <MapPin className="w-4 h-4 text-cyan-400" /> MarineTraffic Coordinates (Latitude & Longitude)
              </span>
              <span className="text-[10px] text-cyan-400">Manual / Auto Pluggable</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Latitude (° N/S)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 53.5412"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Longitude (° E/W)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9.9921"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Actions */}
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
              <CheckCircle2 className="w-4 h-4" />
              Add Ship to Platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
