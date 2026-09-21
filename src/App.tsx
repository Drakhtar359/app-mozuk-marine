import React, { useState, useEffect } from 'react';
import { Ship } from './types/vessel';
import { AddShipModal } from './components/AddShipModal';
import { ShipList } from './components/ShipList';
import { VesselProfilePage } from './components/VesselProfilePage';
import { Anchor, Plus, ExternalLink, Sun, Moon, ShieldCheck, Wrench, Users, FileCheck, Ship as ShipIcon } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mozuk_theme') as 'dark' | 'light') || 'dark';
  });

  const [ships, setShips] = useState<Ship[]>([
    {
      id: 'ship-1',
      name: 'SIRIOS BULK II',
      imo: 'IMO 9143398',
      type: 'General Cargo Ship',
      builtYear: 1998,
      grossTonnage: 14500,
      flag: 'Marshall Islands',
      addedAt: '2026-09-21',
      crew: [
        { id: 'c1', name: 'Capt. Marcus Vance', role: 'Master', nationality: 'British', signOnDate: '2026-01-15' },
        { id: 'c2', name: 'Dimitrios Pappas', role: 'Chief Engineer', nationality: 'Greek', signOnDate: '2026-02-01' },
        { id: 'c3', name: 'Alexey Ivanov', role: 'Chief Officer', nationality: 'Ukrainian', signOnDate: '2026-03-10' },
        { id: 'c4', name: 'Elena Rostova', role: 'Second Engineer', nationality: 'Estonian', signOnDate: '2026-04-05' },
        { id: 'c5', name: 'Kenji Sato', role: 'Third Engineer', nationality: 'Japanese', signOnDate: '2026-05-12' },
      ],
      documents: [
        { id: 'd1', title: 'International Load Line Certificate', documentType: 'Statutory Certificate', documentNumber: 'ILLC-98-4412', issueDate: '2022-04-10', expiryDate: '2027-04-09', authority: 'DNV GL', status: 'valid' },
        { id: 'd2', title: 'Safety Management Certificate (SMC)', documentType: 'ISM Code Cert', documentNumber: 'SMC-2023-887', issueDate: '2023-01-15', expiryDate: '2028-01-14', authority: 'Lloyds Register', status: 'valid' },
        { id: 'd3', title: 'Marpol Air Pollution Prevention (IAPP)', documentType: 'Environmental Cert', documentNumber: 'IAPP-2021-09', issueDate: '2021-10-01', expiryDate: '2026-10-01', authority: 'Bureau Veritas', status: 'expiring' },
        { id: 'd4', title: 'Cargo Ship Safety Radio Certificate', documentType: 'Safety Cert', documentNumber: 'CSSR-2024-11', issueDate: '2024-02-20', expiryDate: '2029-02-19', authority: 'DNV GL', status: 'valid' },
      ],
      maintenance: [
        {
          id: 'm1',
          title: 'Main Engine Cylinder #3 Exhaust Valve Overhaul',
          category: 'Machinery',
          priority: 'urgent',
          loggedDate: '2026-09-18',
          dueDate: '2026-09-25',
          reportedBy: 'Chief Engineer Dimitrios Pappas',
          description: 'High exhaust temperature warning triggered during last sea voyage. Requires immediate valve seat grinding and spindle replacement.',
          status: 'open',
        },
        {
          id: 'm2',
          title: 'Auxiliary Generator #2 Fuel Injector Servicing',
          category: 'Electrical',
          priority: 'high',
          loggedDate: '2026-09-19',
          dueDate: '2026-09-28',
          reportedBy: 'Second Engineer Elena Rostova',
          description: 'Standard 2,000-hour running service for aux engine fuel injectors. Replacement gaskets and nozzles prepared.',
          status: 'in_progress',
        },
        {
          id: 'm3',
          title: 'Port Side Anchor Windlass Hydraulic Leak Fix',
          category: 'Machinery',
          priority: 'medium',
          loggedDate: '2026-09-20',
          dueDate: '2026-10-05',
          reportedBy: 'Chief Officer Alexey Ivanov',
          description: 'Minor hydraulic oil seepage observed near the winch drum motor seal during anchoring.',
          status: 'open',
        },
        {
          id: 'm4',
          title: 'Cargo Hold #2 Rubber Hatch Cover Seal Replacement',
          category: 'Hull',
          priority: 'low',
          loggedDate: '2026-09-10',
          dueDate: '2026-09-20',
          reportedBy: 'Chief Officer Alexey Ivanov',
          description: 'Replaced 12 meters of weathered neoprene packing strip to ensure weather-tightness prior to grain loading.',
          status: 'completed',
        },
      ],
    },
    {
      id: 'ship-2',
      name: 'EVER GIVEN',
      imo: 'IMO 9811000',
      type: 'Container Ship',
      builtYear: 2018,
      grossTonnage: 219079,
      flag: 'Panama',
      addedAt: '2026-09-21',
      crew: [
        { id: 'c201', name: 'Capt. Alexander Wright', role: 'Master', nationality: 'Canadian', signOnDate: '2026-02-10' },
        { id: 'c202', name: 'Hiroshi Tanaka', role: 'Chief Engineer', nationality: 'Japanese', signOnDate: '2026-03-01' },
        { id: 'c203', name: 'Carlos Mendez', role: 'Chief Officer', nationality: 'Filipino', signOnDate: '2026-03-15' },
      ],
      documents: [
        { id: 'd201', title: 'Hull & Machinery Class Certificate', documentType: 'Class Certificate', documentNumber: 'NK-18-9921', issueDate: '2023-05-01', expiryDate: '2028-04-30', authority: 'ClassNK', status: 'valid' },
        { id: 'd202', title: 'ISM Code Document of Compliance', documentType: 'Safety Cert', documentNumber: 'DOC-2022-771', issueDate: '2022-08-12', expiryDate: '2027-08-11', authority: 'Panama Maritime', status: 'valid' },
      ],
      maintenance: [
        {
          id: 'm201',
          title: 'Bow Thruster Hydraulic Oil Filtration & Inspection',
          category: 'Machinery',
          priority: 'high',
          loggedDate: '2026-09-15',
          dueDate: '2026-10-01',
          reportedBy: 'Chief Engineer Hiroshi Tanaka',
          description: 'Routine oil analysis showed minor particulate buildup. Perform oil flushing and filter element replacement.',
          status: 'open',
        },
        {
          id: 'm202',
          title: 'ECDIS Primary & Secondary Radar Calibration',
          category: 'Navigation',
          priority: 'low',
          loggedDate: '2026-09-12',
          dueDate: '2026-09-18',
          reportedBy: 'Capt. Alexander Wright',
          description: 'Annual navigation equipment sensor test and firmware sync verified by shore technician.',
          status: 'completed',
        },
      ],
    },
    {
      id: 'ship-3',
      name: 'MSC OSCAR',
      imo: 'IMO 9703291',
      type: 'Container Ship',
      builtYear: 2014,
      grossTonnage: 193000,
      flag: 'Panama',
      addedAt: '2026-09-21',
      crew: [
        { id: 'c301', name: 'Capt. Jean-Luc Picard', role: 'Master', nationality: 'French', signOnDate: '2026-01-20' },
        { id: 'c302', name: 'Sven Lindqvist', role: 'Chief Engineer', nationality: 'Swedish', signOnDate: '2026-02-15' },
      ],
      documents: [
        { id: 'd301', title: 'International Sewage Pollution Prevention', documentType: 'Environmental Cert', documentNumber: 'ISPP-14-332', issueDate: '2020-11-10', expiryDate: '2025-11-09', authority: 'DNV GL', status: 'valid' },
      ],
      maintenance: [
        {
          id: 'm301',
          title: 'Turbocharger Nozzle Ring Inspection',
          category: 'Machinery',
          priority: 'urgent',
          loggedDate: '2026-09-20',
          dueDate: '2026-09-24',
          reportedBy: 'Chief Engineer Sven Lindqvist',
          description: 'Inspect carbon deposit buildup on main engine turbocharger intake blades.',
          status: 'in_progress',
        },
      ],
    },
    {
      id: 'ship-4',
      name: 'MOZUK MARINER',
      imo: 'IMO 9954321',
      type: 'Bulk Carrier',
      builtYear: 2021,
      grossTonnage: 45000,
      flag: 'Mozambique',
      addedAt: '2026-09-21',
      crew: [
        { id: 'c401', name: 'Capt. Joao Silva', role: 'Master', nationality: 'Mozambican', signOnDate: '2026-01-10' },
        { id: 'c402', name: 'Mateus Nhampossa', role: 'Chief Engineer', nationality: 'Mozambican', signOnDate: '2026-01-12' },
        { id: 'c403', name: 'Antonio Cossa', role: 'Chief Officer', nationality: 'Mozambican', signOnDate: '2026-02-01' },
      ],
      documents: [
        { id: 'd401', title: 'National Certificate of Registry', documentType: 'Statutory Certificate', documentNumber: 'MZ-REG-2021-004', issueDate: '2021-06-01', expiryDate: '2031-05-31', authority: 'INAMAR Mozambique', status: 'valid' },
        { id: 'd402', title: 'Cargo Ship Safety Construction Certificate', documentType: 'Safety Cert', documentNumber: 'CSSC-MZ-2021-88', issueDate: '2021-06-15', expiryDate: '2026-06-14', authority: 'ABS Class', status: 'valid' },
      ],
      maintenance: [
        {
          id: 'm401',
          title: 'Engine Room Bilge High Level Alarm Test',
          category: 'Safety',
          priority: 'low',
          loggedDate: '2026-09-21',
          dueDate: '2026-09-30',
          reportedBy: 'Chief Engineer Mateus Nhampossa',
          description: 'Routine float switch operation check for bilge wells #1 and #2.',
          status: 'open',
        },
      ],
    },
  ]);

  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync theme changes to html element & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mozuk_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddShip = (newShip: Ship) => {
    setShips((prev) => [newShip, ...prev]);
    setSelectedShip(newShip);
  };

  const handleRemoveShip = (shipId: string) => {
    setShips((prev) => prev.filter((s) => s.id !== shipId));
    if (selectedShip?.id === shipId) {
      setSelectedShip(null);
    }
  };

  const handleUpdateShip = (updatedShip: Ship) => {
    setShips((prev) =>
      prev.map((s) => (s.id === updatedShip.id ? updatedShip : s))
    );
    if (selectedShip?.id === updatedShip.id) {
      setSelectedShip(updatedShip);
    }
  };

  // Fleet Overview Metrics
  const totalFleetCount = ships.length;
  const totalCrewCount = ships.reduce((acc, s) => acc + s.crew.length, 0);
  const totalDocsCount = ships.reduce((acc, s) => acc + s.documents.length, 0);
  const totalOpenRepairsCount = ships.reduce(
    (acc, s) => acc + s.maintenance.filter((m) => m.status !== 'completed').length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white transition-colors duration-300">
      {/* Background Cyber Gradient Overlay */}
      <div className="bg-mozuk-overlay" />

      {/* Header matching marine.mozuk.net */}
      <header className="header-nav sticky top-0 z-30 px-4 lg:px-8 py-3.5 border-b border-[var(--color-glass-border)] backdrop-blur-md bg-[var(--color-surface)] shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Mozuk Marine Branding */}
          <div className="flex items-center gap-3">
            <a
              href="https://marine.mozuk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <img
                src="https://marine.mozuk.net/images/logo.png"
                alt="Mozuk Marine Logo"
                className="h-9 w-auto drop-shadow-[0_0_12px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback icon if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    onClick={() => setSelectedShip(null)}
                    className="font-['Space_Grotesk',sans-serif] font-bold text-xl tracking-tight text-[var(--text-main)] cursor-pointer group-hover:text-[var(--color-primary)] transition"
                  >
                    MOZUK <span className="text-[var(--color-primary)] font-extrabold">MARINE</span>
                  </h1>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[rgba(0,242,254,0.1)] border border-[var(--color-glass-border)] text-[var(--color-primary)] tracking-wider uppercase">
                    FLEET PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium">
                  Official Vessel Profile & Operations Portal
                </p>
              </div>
            </a>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Visit Official Mozuk Marine Website Button */}
            <a
              href="https://marine.mozuk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full btn-mozuk-secondary text-xs font-semibold"
            >
              <span>marine.mozuk.net</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full btn-mozuk-secondary text-[var(--text-main)] hover:rotate-12 transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600" />
              )}
            </button>

            {selectedShip && (
              <button
                onClick={() => setSelectedShip(null)}
                className="px-3.5 py-2 rounded-full btn-mozuk-secondary font-bold text-xs"
              >
                ← Back to Fleet
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-full btn-mozuk-primary font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Register Vessel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {!selectedShip ? (
          <div>
            {/* Mozuk Marine Fleet Banner */}
            <div className="mozuk-glass-card rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[rgba(0,242,254,0.1)] text-[var(--color-primary)] font-extrabold text-[10px] uppercase border border-[var(--color-glass-border)]">
                      MOZUK MARINE FLEET OPERATIONS
                    </span>
                  </div>
                  <h2 className="text-2xl font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                    Ship Owner Fleet Operations Portal
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
                    Integrated with Mozuk Marine's engineering standards. Select a vessel below to access its crew roster, statutory technical certificates, and maintenance repair logs.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://marine.mozuk.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full btn-mozuk-secondary text-xs font-bold flex items-center gap-1.5"
                  >
                    Mozuk Marine Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Ship
                  </button>
                </div>
              </div>

              {/* Fleet Metric Counters Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[rgba(0,242,254,0.1)] text-[var(--color-primary)]">
                    <ShipIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Total Fleet</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl">{totalFleetCount} Vessels</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Total Crew</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl">{totalCrewCount} Active</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-950/40 text-blue-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Tech Certificates</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl">{totalDocsCount} Valid</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/40 text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Open Work Orders</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-amber-400 text-xl">{totalOpenRepairsCount} Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fleet List */}
            <ShipList
              ships={ships}
              onSelectShip={(ship) => setSelectedShip(ship)}
              onRemoveShip={handleRemoveShip}
            />
          </div>
        ) : (
          <VesselProfilePage
            ship={selectedShip}
            onBack={() => setSelectedShip(null)}
            onUpdateShip={handleUpdateShip}
          />
        )}
      </main>

      {/* Footer matching marine.mozuk.net */}
      <footer className="border-t border-[var(--color-glass-border)] bg-[var(--color-bg-alt)] py-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://marine.mozuk.net/images/logo.png"
              alt="Mozuk Marine"
              className="h-7 w-auto opacity-80"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              © 2026 <strong className="text-[var(--text-main)]">MOZUK MARINE</strong> — Premier BWTS Solutions & Maritime Engineering.
            </div>
          </div>

          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a
              href="https://marine.mozuk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary)] transition flex items-center gap-1"
            >
              Company Website <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>BWTS Installation & Compliance</span>
            <span>•</span>
            <span>Fleet Portal</span>
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
