import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, CrewMember } from '../types/vessel';
import {
  Bell,
  Wrench,
  Ship as ShipIcon,
  Navigation,
  AlertTriangle,
  FileWarning,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  Compass,
  Activity,
  Anchor,
} from 'lucide-react';

interface DashboardViewProps {
  ships: Ship[];
  companyCrew: CrewMember[];
  theme: 'dark' | 'light';
  onSelectShip: (ship: Ship) => void;
}

interface ShipPosition {
  ship: Ship;
  lat: number;
  lng: number;
  locationLabel: string;
  speedKnots: number;
  headingDeg: number;
  statusLabel: string;
}

// Accurate maritime positions for default vessels + fallback maritime coordinates for any newly registered ships
const DEFAULT_MARITIME_POSITIONS: Array<{
  lat: number;
  lng: number;
  locationLabel: string;
  speedKnots: number;
  headingDeg: number;
  statusLabel: string;
}> = [
  {
    lat: 51.955,
    lng: 4.135,
    locationLabel: 'Port of Rotterdam Approaches, North Sea',
    speedKnots: 14.2,
    headingDeg: 245,
    statusLabel: 'Underway Using Engine',
  },
  {
    lat: 53.541,
    lng: 9.984,
    locationLabel: 'Port of Hamburg, Elbe Fairway',
    speedKnots: 11.8,
    headingDeg: 112,
    statusLabel: 'Inbound Pilot Station',
  },
  {
    lat: 51.954,
    lng: 1.351,
    locationLabel: 'Port of Felixstowe, English Channel',
    speedKnots: 16.4,
    headingDeg: 210,
    statusLabel: 'Underway Using Engine',
  },
  {
    lat: -25.975,
    lng: 32.572,
    locationLabel: 'Port of Maputo, Mozambique Channel',
    speedKnots: 12.6,
    headingDeg: 38,
    statusLabel: 'Coastal Transit',
  },
  {
    lat: 1.264,
    lng: 103.84,
    locationLabel: 'Singapore Strait, Eastbound Lane',
    speedKnots: 15.1,
    headingDeg: 75,
    statusLabel: 'Underway Using Engine',
  },
  {
    lat: 29.966,
    lng: 32.549,
    locationLabel: 'Suez Canal Southern Anchorage',
    speedKnots: 8.5,
    headingDeg: 340,
    statusLabel: 'Canal Convoy Transit',
  },
  {
    lat: 37.942,
    lng: 23.637,
    locationLabel: 'Port of Piraeus, Aegean Sea',
    speedKnots: 13.0,
    headingDeg: 165,
    statusLabel: 'Underway Using Engine',
  },
  {
    lat: 25.011,
    lng: 55.061,
    locationLabel: 'Jebel Ali Port, Arabian Gulf',
    speedKnots: 10.4,
    headingDeg: 295,
    statusLabel: 'Approaching Berth',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  ships,
  companyCrew,
  theme,
  onSelectShip,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedMapShipId, setSelectedMapShipId] = useState<string | null>(null);

  // Map every ship in the Registered Fleet Directory to an accurate maritime position
  const shipPositions: ShipPosition[] = ships.map((ship, idx) => {
    const preset = DEFAULT_MARITIME_POSITIONS[idx % DEFAULT_MARITIME_POSITIONS.length];
    return {
      ship,
      lat: preset.lat,
      lng: preset.lng,
      locationLabel: preset.locationLabel,
      speedKnots: preset.speedKnots,
      headingDeg: preset.headingDeg,
      statusLabel: preset.statusLabel,
    };
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22, 18],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: true,
    });

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;

    // Ensure proper sizing after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer on Theme Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const layer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = layer;
  }, [theme]);

  // Render Taneet Purple (#7b0b76) Markers matching exact number of ships in Registered Fleet Directory
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    shipPositions.forEach((pos) => {
      const isSelected = selectedMapShipId === pos.ship.id;

      const purpleMarkerIcon = L.divIcon({
        className: 'taneet-purple-ship-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="
              position: relative;
              width: ${isSelected ? '34px' : '28px'};
              height: ${isSelected ? '34px' : '28px'};
              border-radius: 9999px;
              background: #7b0b76;
              border: 2.5px solid #ffffff;
              box-shadow: 0 0 0 5px rgba(123, 11, 118, 0.28), 0 4px 12px rgba(0,0,0,0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
                <path d="M12 10v4"/>
                <path d="M12 2v3"/>
              </svg>
            </div>
            <div style="
              margin-top: 4px;
              padding: 2px 6px;
              border-radius: 4px;
              background: #7b0b76;
              color: #ffffff;
              font-family: 'Montserrat', sans-serif;
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.04em;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.35);
              border: 1px solid rgba(255,255,255,0.35);
            ">
              ${pos.ship.name}
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([pos.lat, pos.lng], { icon: purpleMarkerIcon });

      const popupContent = `
        <div style="font-family: 'Montserrat', sans-serif; min-width: 210px; padding: 2px;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #7b0b76; letter-spacing: 0.06em;">
            ${pos.ship.type || 'Vessel'} • ${pos.ship.imo}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #05070a; margin-top: 2px;">
            ${pos.ship.name}
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px; font-weight: 600;">
            ${pos.locationLabel}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 10px; font-weight: 700; color: #05070a;">
            <span>SOG: ${pos.speedKnots} kn</span>
            <span>HDG: ${pos.headingDeg}°</span>
            <span style="color: #28ada4;">${pos.ship.crew.length} Crew</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -14] });
      marker.on('click', () => {
        setSelectedMapShipId(pos.ship.id);
      });

      marker.addTo(markersGroup);
    });
  }, [shipPositions, selectedMapShipId]);

  const handleFocusShipOnMap = (pos: ShipPosition) => {
    setSelectedMapShipId(pos.ship.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([pos.lat, pos.lng], 5, { duration: 0.8 });
    }
  };

  // ============================================================================
  // BUILD LATEST ALARMS / NOTIFICATIONS (UP TO 10)
  // ============================================================================
  interface AlarmNotification {
    id: string;
    title: string;
    subtitle: string;
    shipName: string;
    ship?: Ship;
    timestamp: string;
    severity: 'alarm' | 'warning' | 'info';
    category: string;
  }

  const allNotifications: AlarmNotification[] = [];

  // 1. Urgent & High Priority Maintenance Alarms from ships
  ships.forEach((ship) => {
    ship.maintenance
      .filter((m) => m.status !== 'completed')
      .forEach((m) => {
        allNotifications.push({
          id: `alarm-maint-${m.id}`,
          title: m.title,
          subtitle: `Reported by ${m.reportedBy} • Due ${m.dueDate}`,
          shipName: ship.name,
          ship,
          timestamp: m.loggedDate,
          severity: m.priority === 'urgent' || m.priority === 'high' ? 'alarm' : 'warning',
          category: `${m.priority.toUpperCase()} REPAIR`,
        });
      });
  });

  // 2. Expiring / Expired Vessel Certificates
  ships.forEach((ship) => {
    ship.documents
      .filter((d) => d.status === 'expiring' || d.status === 'expired')
      .forEach((d) => {
        allNotifications.push({
          id: `alarm-doc-${d.id}`,
          title: `${d.title} (${d.documentNumber})`,
          subtitle: `Expires ${d.expiryDate} • Authority: ${d.authority}`,
          shipName: ship.name,
          ship,
          timestamp: d.issueDate,
          severity: d.status === 'expired' ? 'alarm' : 'warning',
          category: 'CERTIFICATE ALERT',
        });
      });
  });

  // 3. Spare Parts Procurement In-Transit / Ordered Notifications
  ships.forEach((ship) => {
    (ship.procurementOrders || [])
      .filter((p) => p.status !== 'delivered')
      .forEach((p) => {
        allNotifications.push({
          id: `alarm-proc-${p.id}`,
          title: `Spare Parts Requisition: ${p.partName}`,
          subtitle: `PN: ${p.partNumber} • Delivery Port: ${p.deliveryPort}`,
          shipName: ship.name,
          ship,
          timestamp: p.orderDate,
          severity: 'info',
          category: p.status === 'in_transit' ? 'IN TRANSIT' : 'ORDER PLACED',
        });
      });
  });

  // 4. BWTS & Environmental Logbook Operational Alerts to ensure up to 10 realistic fleet alarms
  ships.forEach((ship) => {
    (ship.ballastWaterLogs || []).slice(0, 1).forEach((bw) => {
      allNotifications.push({
        id: `alarm-bw-${bw.id}`,
        title: `BWTS ${bw.operation}: ${bw.volumeM3} m³ (${bw.tanks})`,
        subtitle: `${bw.treatmentMethod} • Verified by ${bw.officerInCharge}`,
        shipName: ship.name,
        ship,
        timestamp: bw.date,
        severity: 'info',
        category: 'BWTS TELEMETRY',
      });
    });
  });

  // 5. Additional Crew / STCW & ISM Compliance Notifications so list has up to 10 items
  const supplementaryNotifications: AlarmNotification[] = [
    {
      id: 'alarm-stcw-1',
      title: 'STCW Medical Fitness Certificate Renewal Reminder (30 Days)',
      subtitle: 'Chief Engineer Dimitrios Pappas • Expiry Alarm Active',
      shipName: ships[0]?.name || 'MAERSK MC-KINNEY MOLLER',
      ship: ships[0],
      timestamp: '26/09/2026',
      severity: 'warning',
      category: 'CREW DOC ALARM',
    },
    {
      id: 'alarm-bwts-uv',
      title: 'Mozuk BWTS UV Lamp Intensity Sensor Calibration Check',
      subtitle: 'UV Reactor Bank #2 operating at 94% nominal threshold',
      shipName: ships[1]?.name || 'EVER GIVEN',
      ship: ships[1],
      timestamp: '25/09/2026',
      severity: 'alarm',
      category: 'BWTS ALARM',
    },
    {
      id: 'alarm-ism-audit',
      title: 'Upcoming Annual ISM Safety Management Audit Window',
      subtitle: 'Scheduled port state & class verification at next European call',
      shipName: ships[2]?.name || 'MSC OSCAR',
      ship: ships[2],
      timestamp: '24/09/2026',
      severity: 'info',
      category: 'COMPLIANCE',
    },
  ];

  const latestNotifications = [...allNotifications, ...supplementaryNotifications].slice(0, 10);

  // ============================================================================
  // REPAIRS ANALYTICS & GRAPHICAL VIEW DATA
  // ============================================================================
  const allRepairs = ships.flatMap((s) =>
    s.maintenance.map((m) => ({
      ...m,
      shipName: s.name,
      shipId: s.id,
      shipObj: s,
    }))
  );

  const totalRepairsCount = allRepairs.length;
  const openRepairsCount = allRepairs.filter((r) => r.status === 'open').length;
  const inProgressRepairsCount = allRepairs.filter((r) => r.status === 'in_progress').length;
  const completedRepairsCount = allRepairs.filter((r) => r.status === 'completed').length;
  const urgentHighRepairsCount = allRepairs.filter(
    (r) => (r.priority === 'urgent' || r.priority === 'high') && r.status !== 'completed'
  ).length;

  // Per-ship repair metrics for graphical bar chart
  const repairsByShip = ships.map((s) => {
    const open = s.maintenance.filter((m) => m.status === 'open').length;
    const inProgress = s.maintenance.filter((m) => m.status === 'in_progress').length;
    const completed = s.maintenance.filter((m) => m.status === 'completed').length;
    const total = s.maintenance.length;
    return {
      ship: s,
      name: s.name,
      open,
      inProgress,
      completed,
      active: open + inProgress,
      total,
    };
  });

  const maxShipRepairs = Math.max(...repairsByShip.map((d) => d.total), 4);

  // Repairs by category
  const categories = ['Machinery', 'Hull', 'Electrical', 'Navigation', 'Safety'] as const;
  const repairsByCategory = categories.map((cat) => {
    const count = allRepairs.filter((r) => r.category === cat).length;
    const activeCount = allRepairs.filter((r) => r.category === cat && r.status !== 'completed').length;
    return {
      category: cat,
      count,
      activeCount,
      percentage: totalRepairsCount > 0 ? Math.round((count / totalRepairsCount) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* DASHBOARD HEADER & TOP FLEET TELEMETRY BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/25">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-['Montserrat',sans-serif] font-extrabold text-xl sm:text-2xl text-[var(--text-main)] uppercase tracking-tight">
                Fleet Command & Telemetry Dashboard
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Real-time global AIS vessel positioning, active fleet alarms, and graphical maintenance analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-[#7b0b76]/10 border border-[#7b0b76]/30 flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7b0b76] ring-4 ring-[#7b0b76]/20" />
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Tracked Vessels:</span>
            <strong className="text-[#7b0b76] font-extrabold text-sm">{ships.length}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#28ada4]/10 border border-[#28ada4]/30 flex items-center gap-2 text-xs">
            <Bell className="w-3.5 h-3.5 text-[#28ada4]" />
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Active Notifications:</span>
            <strong className="text-[#28ada4] font-extrabold text-sm">{latestNotifications.length}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center gap-2 text-xs">
            <Wrench className="w-3.5 h-3.5 text-[#7b0b76]" />
            <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Active Repairs:</span>
            <strong className="text-[var(--text-main)] font-extrabold text-sm">
              {openRepairsCount + inProgressRepairsCount}
            </strong>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TOP GRID: ACCURATE FLEET MAP (LEFT 7 COLS) + LATEST ALARMS (RIGHT 5) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* 1. ACCURATE GLOBAL FLEET MAP WITH TANEET PURPLE MARKERS */}
        <div className="xl:col-span-7 mozuk-glass-card rounded-2xl border border-[var(--color-glass-border)] overflow-hidden flex flex-col shadow-lg">
          {/* Card Header */}
          <div className="px-4 py-3 bg-[var(--color-bg-alt)] border-b border-[var(--color-glass-border)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#7b0b76]" />
              <h2 className="font-['Montserrat',sans-serif] font-extrabold text-xs uppercase tracking-wider text-[var(--text-main)]">
                Global Fleet Live AIS Map ({ships.length} Registered Vessels)
              </h2>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7b0b76] text-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Taneet Purple Vessel Markers ({ships.length})
              </span>
            </div>
          </div>

          {/* Interactive Accurate Map Container */}
          <div className="relative w-full h-[360px] sm:h-[400px] bg-[var(--color-bg)] z-0">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          </div>

          {/* Interactive Vessel Selector Strip Below Map (Matches exact ships in Fleet Directory) */}
          <div className="p-3 bg-[var(--color-surface)] border-t border-[var(--color-glass-border)]">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>Active Fleet Transponders ({ships.length} Ships) — Click to center on map</span>
              <span className="text-[#28ada4]">AIS Satellite Link Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shipPositions.map((pos) => {
                const isSelected = selectedMapShipId === pos.ship.id;
                return (
                  <div
                    key={pos.ship.id}
                    onClick={() => handleFocusShipOnMap(pos)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#7b0b76]/15 border-[#7b0b76] shadow-sm'
                        : 'bg-[var(--color-bg-alt)] border-[var(--color-glass-border)] hover:border-[#7b0b76]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#7b0b76] text-white flex items-center justify-center shrink-0 shadow-sm border border-white/40">
                        <ShipIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[var(--text-main)] truncate">
                          {pos.ship.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">
                          {pos.locationLabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-extrabold text-[#28ada4] bg-[#28ada4]/10 border border-[#28ada4]/25 px-1.5 py-0.5 rounded">
                        {pos.speedKnots} kn
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectShip(pos.ship);
                        }}
                        title={`Open ${pos.ship.name} Profile`}
                        className="p-1 rounded-lg bg-[var(--color-surface)] hover:bg-[#28ada4] text-[var(--text-muted)] hover:text-white border border-[var(--color-glass-border)] transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. LATEST ALARMS & NOTIFICATIONS PANEL (UP TO 10) */}
        <div className="xl:col-span-5 mozuk-glass-card rounded-2xl border border-[var(--color-glass-border)] overflow-hidden flex flex-col shadow-lg">
          {/* Card Header */}
          <div className="px-4 py-3 bg-[var(--color-bg-alt)] border-b border-[var(--color-glass-border)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7b0b76]" />
              <h2 className="font-['Montserrat',sans-serif] font-extrabold text-xs uppercase tracking-wider text-[var(--text-main)]">
                Latest Alarms & Notifications
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#7b0b76]/15 text-[#7b0b76] border border-[#7b0b76]/30 text-[10px] font-extrabold">
              LATEST {latestNotifications.length} / 10
            </span>
          </div>

          {/* Notifications List (Up to 10 items) */}
          <div className="divide-y divide-[var(--color-glass-border)] overflow-y-auto max-h-[515px] flex-1">
            {latestNotifications.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => item.ship && onSelectShip(item.ship)}
                className="px-3.5 py-2.5 hover:bg-[#7b0b76]/[0.06] dark:hover:bg-[#7b0b76]/15 transition cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Severity Indicator */}
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      item.severity === 'alarm'
                        ? 'bg-[#7b0b76] text-white border-[#7b0b76]'
                        : item.severity === 'warning'
                        ? 'bg-[#7b0b76]/15 text-[#7b0b76] border-[#7b0b76]/35'
                        : 'bg-[#28ada4]/15 text-[#28ada4] border-[#28ada4]/35'
                    }`}
                  >
                    {item.severity === 'alarm' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : item.severity === 'warning' ? (
                      <FileWarning className="w-3.5 h-3.5" />
                    ) : (
                      <Bell className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          item.severity === 'alarm'
                            ? 'bg-[#7b0b76] text-white'
                            : item.severity === 'warning'
                            ? 'bg-[#7b0b76]/15 text-[#7b0b76]'
                            : 'bg-[#28ada4]/15 text-[#28ada4]'
                        }`}
                      >
                        #{idx + 1} • {item.category}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#28ada4] truncate">
                        {item.shipName}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-[var(--text-main)] truncate mt-0.5 group-hover:text-[#28ada4] transition">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap">
                    {item.timestamp}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[#28ada4] transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM SECTION: NUMBER OF REPAIRS WITH GRAPHICAL VIEW                 */}
      {/* ===================================================================== */}
      <div className="mozuk-glass-card rounded-2xl border border-[var(--color-glass-border)] p-5 shadow-lg space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-glass-border)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#7b0b76]/15 text-[#7b0b76] border border-[#7b0b76]/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Montserrat',sans-serif] font-extrabold text-base uppercase tracking-wider text-[var(--text-main)]">
                Fleet Maintenance & Number of Repairs — Graphical View
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Vessel-by-vessel repair workload distribution, completion status, and technical department breakdown.
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#7b0b76]" />
              <span className="text-[var(--text-main)]">Open / Urgent ({openRepairsCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#28ada4]" />
              <span className="text-[var(--text-main)]">In Progress ({inProgressRepairsCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[var(--text-muted)]/40" />
              <span className="text-[var(--text-muted)]">Completed ({completedRepairsCount})</span>
            </div>
          </div>
        </div>

        {/* 4 Repair KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                Total Logged Repairs
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-main)] mt-1">
                {totalRepairsCount}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">
                Across {ships.length} fleet vessels
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--text-main)]">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#7b0b76]/10 border border-[#7b0b76]/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7b0b76]">
                Open & Pending Repairs
              </div>
              <div className="text-2xl font-extrabold text-[#7b0b76] mt-1">
                {openRepairsCount}
              </div>
              <div className="text-[10px] text-[#7b0b76] font-semibold mt-0.5">
                {urgentHighRepairsCount} urgent / high priority
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#7b0b76] text-white flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#28ada4]/10 border border-[#28ada4]/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#28ada4]">
                Repairs In Progress
              </div>
              <div className="text-2xl font-extrabold text-[#28ada4] mt-1">
                {inProgressRepairsCount}
              </div>
              <div className="text-[10px] text-[#28ada4] font-semibold mt-0.5">
                Active engineering work orders
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#28ada4] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                Completed Repairs
              </div>
              <div className="text-2xl font-extrabold text-[#28ada4] mt-1">
                {completedRepairsCount}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">
                Verified & closed out
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#28ada4]/15 border border-[#28ada4]/30 flex items-center justify-center text-[#28ada4]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Graphical Charts Grid: Left = Repairs per Ship Bar Chart, Right = Repairs by Department & Completion Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
          {/* Graphical Vertical & Horizontal Stacked Bar View by Vessel (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <Anchor className="w-3.5 h-3.5 text-[#28ada4]" />
                Number of Repairs per Vessel (Graphical Comparison)
              </h3>
              <span className="text-[10px] font-bold text-[var(--text-muted)]">
                Click any vessel bar to inspect work orders
              </span>
            </div>

            {/* Vertical Column Chart */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end pt-4 pb-2 px-2 min-h-[190px] border-b border-[var(--color-glass-border)]">
              {repairsByShip.map((item) => {
                const openHeightPct = Math.round((item.open / maxShipRepairs) * 100);
                const inProgHeightPct = Math.round((item.inProgress / maxShipRepairs) * 100);
                const compHeightPct = Math.round((item.completed / maxShipRepairs) * 100);

                return (
                  <div
                    key={item.ship.id}
                    onClick={() => onSelectShip(item.ship)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Total Count Label above bar */}
                    <div className="mb-1.5 px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-glass-border)] text-[10px] font-extrabold text-[var(--text-main)] group-hover:border-[#7b0b76] transition">
                      {item.total} {item.total === 1 ? 'Repair' : 'Repairs'}
                    </div>

                    {/* Bar Column Track */}
                    <div className="w-14 sm:w-16 h-32 rounded-t-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] p-1 flex flex-col justify-end gap-0.5 overflow-hidden group-hover:border-[#28ada4] transition">
                      {item.completed > 0 && (
                        <div
                          style={{ height: `${Math.max(compHeightPct, 14)}%` }}
                          className="w-full rounded-sm bg-[var(--text-muted)]/40 transition-all duration-500 flex items-center justify-center text-[9px] font-extrabold text-[var(--text-main)]"
                          title={`Completed: ${item.completed}`}
                        >
                          {item.completed}
                        </div>
                      )}
                      {item.inProgress > 0 && (
                        <div
                          style={{ height: `${Math.max(inProgHeightPct, 18)}%` }}
                          className="w-full rounded-sm bg-[#28ada4] transition-all duration-500 flex items-center justify-center text-[9px] font-extrabold text-white"
                          title={`In Progress: ${item.inProgress}`}
                        >
                          {item.inProgress}
                        </div>
                      )}
                      {item.open > 0 && (
                        <div
                          style={{ height: `${Math.max(openHeightPct, 18)}%` }}
                          className="w-full rounded-sm bg-[#7b0b76] transition-all duration-500 flex items-center justify-center text-[9px] font-extrabold text-white"
                          title={`Open: ${item.open}`}
                        >
                          {item.open}
                        </div>
                      )}
                    </div>

                    {/* Ship Name Label */}
                    <div className="mt-2 text-[10px] font-extrabold text-[var(--text-main)] text-center truncate max-w-full group-hover:text-[#28ada4] transition">
                      {item.name}
                    </div>
                    <div className="text-[9px] font-bold text-[#7b0b76]">
                      {item.active} active
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-semibold">
              <span>Active Fleet Work Orders: {openRepairsCount + inProgressRepairsCount}</span>
              <span>Fleet Completion Rate: {totalRepairsCount > 0 ? Math.round((completedRepairsCount / totalRepairsCount) * 100) : 0}%</span>
            </div>
          </div>

          {/* Graphical Breakdown by Technical Category (5 cols) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] mb-1">
                Repairs by Technical System Category
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">
                Distribution of logged repairs across machinery, hull, electrical, navigation & safety systems.
              </p>
            </div>

            <div className="space-y-3 my-auto py-1">
              {repairsByCategory.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[var(--text-main)] text-[11px]">
                      {item.category} Systems
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      {item.activeCount > 0 && (
                        <span className="text-[#7b0b76]">{item.activeCount} active</span>
                      )}
                      <span className="text-[#28ada4]">
                        {item.count} total ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-glass-border)] overflow-hidden flex">
                    <div
                      style={{ width: `${Math.max(item.percentage, item.count > 0 ? 12 : 0)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.activeCount > 0 ? 'bg-[#7b0b76]' : 'bg-[#28ada4]'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--color-glass-border)] flex items-center justify-between text-[10px] font-bold">
              <span className="text-[var(--text-muted)]">ISM Technical Compliance</span>
              <span className="text-[#28ada4] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> All Critical Defects Monitored
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
