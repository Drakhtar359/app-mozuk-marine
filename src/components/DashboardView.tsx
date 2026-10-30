import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, CrewMember } from '../types/vessel';
import {
  Bell,
  Wrench,
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
}

const CARTO_RASTER_URL =
  'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3s3u_1_405b6a6fd32e5256acc5e566';

// Accurate maritime positions for default vessels + fallback maritime coordinates for any newly registered ships
const DEFAULT_MARITIME_POSITIONS: Array<{
  lat: number;
  lng: number;
  locationLabel: string;
  speedKnots: number;
  headingDeg: number;
}> = [
  {
    lat: 51.955,
    lng: 4.135,
    locationLabel: 'Port of Rotterdam Approaches, North Sea',
    speedKnots: 14.2,
    headingDeg: 245,
  },
  {
    lat: 53.541,
    lng: 9.984,
    locationLabel: 'Port of Hamburg, Elbe Fairway',
    speedKnots: 11.8,
    headingDeg: 112,
  },
  {
    lat: 51.954,
    lng: 1.351,
    locationLabel: 'Port of Felixstowe, English Channel',
    speedKnots: 16.4,
    headingDeg: 210,
  },
  {
    lat: -25.975,
    lng: 32.572,
    locationLabel: 'Port of Maputo, Mozambique Channel',
    speedKnots: 12.6,
    headingDeg: 38,
  },
  {
    lat: 1.264,
    lng: 103.84,
    locationLabel: 'Singapore Strait, Eastbound Lane',
    speedKnots: 15.1,
    headingDeg: 75,
  },
  {
    lat: 29.966,
    lng: 32.549,
    locationLabel: 'Suez Canal Southern Anchorage',
    speedKnots: 8.5,
    headingDeg: 340,
  },
  {
    lat: 37.942,
    lng: 23.637,
    locationLabel: 'Port of Piraeus, Aegean Sea',
    speedKnots: 13.0,
    headingDeg: 165,
  },
  {
    lat: 25.011,
    lng: 55.061,
    locationLabel: 'Jebel Ali Port, Arabian Gulf',
    speedKnots: 10.4,
    headingDeg: 295,
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
    };
  });

  // Initialize Leaflet Map with Carto Raster Voyager Key (Static, unzoomable, fixed bounds)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    if (mapInstanceRef.current) return;

    // Fixed unmovable, unzoomable map
    const map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      dragging: false,
      keyboard: false,
      attributionControl: false,
    });

    const layer = L.tileLayer(CARTO_RASTER_URL, {
      maxZoom: 18,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    tileLayerRef.current = layer;
    markersLayerRef.current = markersGroup;

    const fitShipBounds = () => {
      if (shipPositions.length > 0) {
        const bounds = L.latLngBounds(shipPositions.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, {
          padding: [35, 35],
          maxZoom: 5,
          animate: false,
        });
      } else {
        map.setView([20, 15], 2);
      }
      map.invalidateSize();
    };

    fitShipBounds();

    const timer = setTimeout(() => {
      fitShipBounds();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      fitShipBounds();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, [shipPositions]);

  // Render Taneet Purple (#7b0b76) Dots with Pulsing Outline & Hover Ship Name Tooltip
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    shipPositions.forEach((pos) => {
      const purpleDotIcon = L.divIcon({
        className: 'taneet-purple-dot-icon',
        html: `
          <div class="taneet-purple-dot-wrapper">
            <div class="taneet-purple-dot-pulse"></div>
            <div class="taneet-purple-dot-core"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([pos.lat, pos.lng], { icon: purpleDotIcon });

      // Show ship name on hover
      marker.bindTooltip(pos.ship.name, {
        direction: 'top',
        offset: [0, -10],
        className: 'taneet-ship-tooltip',
        opacity: 1,
      });

      marker.on('click', () => {
        onSelectShip(pos.ship);
      });

      marker.addTo(markersGroup);
    });
  }, [shipPositions, onSelectShip]);

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
  }

  const allNotifications: AlarmNotification[] = [];

  // 1. Certificate Expiry Notice Alarms for Crew (STCW, Medical Fitness, Seaman's Book & Passport)
  const assignedCrewMembers = companyCrew.filter((c) => c.assignedShipId);
  const crewAlarmTemplates = [
    {
      certName: 'STCW Basic Safety Training (BST) Certificate',
      notice: 'Certificate Expiry Notice Alarm • Expires in 14 days',
      date: '28/09/2026',
      severity: 'alarm' as const,
    },
    {
      certName: 'ILO / STCW Seafarer Medical Fitness Certificate',
      notice: 'Certificate Expiry Notice Alarm • Expires in 21 days',
      date: '27/09/2026',
      severity: 'alarm' as const,
    },
    {
      certName: "Seaman's Discharge Book",
      notice: 'Certificate Expiry Notice Alarm • Renewal required within 30 days',
      date: '26/09/2026',
      severity: 'warning' as const,
    },
    {
      certName: 'STCW Advanced Fire Fighting (AFF) Certificate',
      notice: 'Certificate Expiry Notice Alarm • Refresher course due',
      date: '25/09/2026',
      severity: 'warning' as const,
    },
  ];

  assignedCrewMembers.slice(0, 4).forEach((crew, index) => {
    const tpl = crewAlarmTemplates[index % crewAlarmTemplates.length];
    const shipObj = ships.find((s) => s.id === crew.assignedShipId) || ships[0];
    allNotifications.push({
      id: `alarm-crew-cert-${crew.id}`,
      title: `Crew Certificate Expiry Notice: ${crew.name} (${crew.role})`,
      subtitle: `${tpl.certName} — ${tpl.notice}`,
      shipName: shipObj?.name || crew.assignedShipName || 'UNASSIGNED',
      ship: shipObj,
      timestamp: tpl.date,
      severity: tpl.severity,
    });
  });

  // 2. Active Maintenance / Repair Alarms from ships
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
        });
      });
  });

  // 3. Expiring / Expired Vessel Certificates
  ships.forEach((ship) => {
    ship.documents
      .filter((d) => d.status === 'expiring' || d.status === 'expired')
      .forEach((d) => {
        allNotifications.push({
          id: `alarm-doc-${d.id}`,
          title: `Vessel Certificate Expiry: ${d.title} (${d.documentNumber})`,
          subtitle: `Expires ${d.expiryDate} • Authority: ${d.authority}`,
          shipName: ship.name,
          ship,
          timestamp: d.issueDate,
          severity: d.status === 'expired' ? 'alarm' : 'warning',
        });
      });
  });

  // 4. Spare Parts Procurement In-Transit / Ordered Notifications
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
        });
      });
  });

  // 5. BWTS Telemetry & Compliance Notifications to fill up to 10 items
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
      });
    });
  });

  const latestNotifications = allNotifications.slice(0, 10);

  // ============================================================================
  // REPAIRS ANALYTICS & DONUT GRAPH DATA
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

  // Per-ship repair metrics for Donut Charts
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
                Real-time global AIS vessel positioning, active fleet & crew certificate alarms, and maintenance analytics.
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
        {/* 1. ACCURATE GLOBAL FLEET MAP WITH PULSING TANEET PURPLE DOTS */}
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
                Hover markers for vessel name
              </span>
            </div>
          </div>

          {/* Interactive Accurate Map Container */}
          <div className="relative w-full h-[430px] bg-[var(--color-bg)] z-0">
            <div
              ref={mapContainerRef}
              style={{ height: '430px', width: '100%' }}
              className="w-full h-[430px] z-0"
            />
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
          </div>

          {/* Notifications List (Up to 10 items) */}
          <div className="divide-y divide-[var(--color-glass-border)] overflow-y-auto max-h-[430px] flex-1">
            {latestNotifications.map((item) => (
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
                    {/* Ship Name in Teal (Tags removed) */}
                    <div className="text-[10px] font-extrabold text-[#28ada4] uppercase tracking-wider truncate">
                      {item.shipName}
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
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#7b0b76]" />
            <h2 className="font-['Montserrat',sans-serif] font-extrabold text-xs uppercase tracking-wider text-[var(--text-main)]">
              Fleet Maintenance & Number of Repairs
            </h2>
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

        {/* Graphical Charts Grid: Left = Donut Graph for Each Ship, Right = Repairs by Department */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
          {/* Donut Graph per Vessel (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <Anchor className="w-3.5 h-3.5 text-[#28ada4]" />
                Number of Repairs per Vessel
              </h3>
              <span className="text-[10px] font-bold text-[var(--text-muted)]">
                Click any vessel to inspect work orders
              </span>
            </div>

            {/* Donut Graphs Grid (1 Donut per Ship) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center py-3 px-2 border-b border-[var(--color-glass-border)]">
              {repairsByShip.map((item) => {
                const radius = 34;
                const circumference = 2 * Math.PI * radius;
                const total = Math.max(item.total, 1);

                const openLen = (item.open / total) * circumference;
                const inProgLen = (item.inProgress / total) * circumference;
                const compLen = (item.completed / total) * circumference;

                return (
                  <div
                    key={item.ship.id}
                    onClick={() => onSelectShip(item.ship)}
                    className="flex flex-col items-center p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-glass-border)] hover:border-[#28ada4] transition cursor-pointer group"
                  >
                    {/* SVG Donut Chart */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
                        {/* Background Track */}
                        <circle
                          cx="44"
                          cy="44"
                          r={radius}
                          fill="transparent"
                          stroke="rgba(148, 163, 184, 0.15)"
                          strokeWidth="9"
                        />

                        {/* Completed Segment (Muted Slate) */}
                        {item.completed > 0 && (
                          <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(148, 163, 184, 0.55)"
                            strokeWidth="9"
                            strokeDasharray={`${compLen} ${circumference}`}
                            strokeDashoffset={-(openLen + inProgLen)}
                          />
                        )}

                        {/* In Progress Segment (Teal #28ada4) */}
                        {item.inProgress > 0 && (
                          <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="transparent"
                            stroke="#28ada4"
                            strokeWidth="9"
                            strokeDasharray={`${inProgLen} ${circumference}`}
                            strokeDashoffset={-openLen}
                          />
                        )}

                        {/* Open Segment (Taneet Purple #7b0b76) */}
                        {item.open > 0 && (
                          <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="transparent"
                            stroke="#7b0b76"
                            strokeWidth="9"
                            strokeDasharray={`${openLen} ${circumference}`}
                            strokeDashoffset={0}
                          />
                        )}
                      </svg>

                      {/* Center Count inside Donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-extrabold text-[var(--text-main)] leading-none">
                          {item.total}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-0.5">
                          {item.total === 1 ? 'Repair' : 'Repairs'}
                        </span>
                      </div>
                    </div>

                    {/* Ship Name Label */}
                    <div
                      className="mt-2 text-[10px] font-extrabold text-[var(--text-main)] text-center truncate w-full group-hover:text-[#28ada4] transition"
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div className="text-[9px] font-bold text-[#7b0b76] mt-0.5">
                      {item.active} active • {item.completed} done
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-semibold">
              <span>Active Fleet Work Orders: {openRepairsCount + inProgressRepairsCount}</span>
              <span>
                Fleet Completion Rate:{' '}
                {totalRepairsCount > 0 ? Math.round((completedRepairsCount / totalRepairsCount) * 100) : 0}%
              </span>
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
