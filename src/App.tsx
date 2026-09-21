import React, { useState, useEffect } from 'react';
import { Vessel, AlertNotification } from './types/vessel';
import { INITIAL_FLEET, INITIAL_ALERTS } from './data/mockFleet';
import { Header } from './components/Header';
import { FleetOverviewCard } from './components/FleetOverviewCard';
import { InteractiveFleetMap } from './components/InteractiveFleetMap';
import { VesselGrid } from './components/VesselGrid';
import { VesselDetailModal } from './components/VesselDetailModal';
import { AnalyticsTab } from './components/AnalyticsTab';
import { AlertsPanel } from './components/AlertsPanel';
import { LayoutDashboard, BarChart3, Ship, Compass, Waves } from 'lucide-react';

export function App() {
  const [fleet, setFleet] = useState<Vessel[]>(INITIAL_FLEET);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [selectedRole, setSelectedRole] = useState('Fleet Manager');
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [currentViewTab, setCurrentViewTab] = useState<'overview' | 'directory' | 'analytics'>('overview');

  // Real-time live AIS telemetry simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setFleet((prevFleet) =>
        prevFleet.map((vessel) => {
          if (vessel.voyage.status !== 'Underway') return vessel;

          // Slightly alter position based on heading & speed
          const speedFactor = vessel.voyage.speedKnots / 3600; // approximate degree shift
          const angleRad = ((vessel.voyage.headingDegrees - 90) * Math.PI) / 180;

          const deltaLat = Math.sin(angleRad) * speedFactor * 0.05;
          const deltaLng = Math.cos(angleRad) * speedFactor * 0.05;

          // Fluctuate RPM and speed slightly
          const rpmDelta = (Math.random() - 0.5) * 2;
          const speedDelta = (Math.random() - 0.5) * 0.2;

          const newRpm = Math.max(50, Math.min(110, Math.round(vessel.telemetry.engineRpm + rpmDelta)));
          const newSpeed = Math.max(8, Math.min(24, parseFloat((vessel.voyage.speedKnots + speedDelta).toFixed(1))));

          return {
            ...vessel,
            voyage: {
              ...vessel.voyage,
              latitude: vessel.voyage.latitude + deltaLat,
              longitude: vessel.voyage.longitude + deltaLng,
              speedKnots: newSpeed,
            },
            telemetry: {
              ...vessel.telemetry,
              engineRpm: newRpm,
            },
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleSelectVesselById = (vesselId: string) => {
    const found = fleet.find((v) => v.id === vesselId);
    if (found) setSelectedVessel(found);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        alerts={alerts}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onToggleAlerts={() => setIsAlertsOpen(!isAlertsOpen)}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Navigation View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 mb-6 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'Fleet Map & Live Overview', icon: LayoutDashboard },
              { id: 'directory', label: 'Vessels Directory', icon: Ship },
              { id: 'analytics', label: 'CII & Fuel Analytics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentViewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentViewTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl font-bold text-xs transition ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Role View: <strong className="text-white">{selectedRole}</strong></span>
          </div>
        </div>

        {/* Executive KPI Summary Cards */}
        <FleetOverviewCard fleet={fleet} alerts={alerts} />

        {/* Tab View 1: Overview & Interactive AIS Map */}
        {currentViewTab === 'overview' && (
          <div>
            <InteractiveFleetMap
              fleet={fleet}
              onSelectVessel={setSelectedVessel}
              selectedVesselId={selectedVessel?.id}
            />

            {/* Quick Vessels Grid */}
            <VesselGrid fleet={fleet} onSelectVessel={setSelectedVessel} />
          </div>
        )}

        {/* Tab View 2: Detailed Directory */}
        {currentViewTab === 'directory' && (
          <VesselGrid fleet={fleet} onSelectVessel={setSelectedVessel} />
        )}

        {/* Tab View 3: Analytics */}
        {currentViewTab === 'analytics' && <AnalyticsTab fleet={fleet} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong>MOZUK MARINE PORTAL</strong> — Next-Gen Ship Management & AIS Fleet Telemetry.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>IMO SOLAS / MARPOL Compliant</span>
            <span>•</span>
            <span>ISM & ISPS Certified</span>
          </div>
        </div>
      </footer>

      {/* Vessel Detail Drawer Modal */}
      <VesselDetailModal vessel={selectedVessel} onClose={() => setSelectedVessel(null)} />

      {/* Alerts Slideout Panel */}
      <AlertsPanel
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectVesselById={handleSelectVesselById}
      />
    </div>
  );
}
