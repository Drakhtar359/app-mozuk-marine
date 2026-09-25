import React, { useState, useEffect } from 'react';
import { Ship } from './types/vessel';
import { AddShipModal } from './components/AddShipModal';
import { ShipList } from './components/ShipList';
import { VesselProfilePage } from './components/VesselProfilePage';
import { Plus, Sun, Moon, ShieldCheck, Wrench, Users, FileCheck, Ship as ShipIcon } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mozuk_theme') as 'dark' | 'light') || 'light';
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
      classification: 'DNV GL',
      addedAt: '21/09/2026',
      crew: [
        {
          id: 'c1',
          name: 'Capt. Marcus Vance',
          role: 'Master / Captain',
          department: 'master',
          nationality: 'British',
          dateOfBirth: '14/05/1975',
          passportNumber: 'GB-99482019',
          passportExpiry: '12/10/2030',
          seamanBookNo: 'SB-882109',
          seamanBookExpiry: '15/06/2028',
          signOnDate: '15/01/2026',
          signOnLocation: 'Rotterdam',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Master / Captain', startDate: '15/01/2026' },
            { shipName: 'SIRIOS BULK II', role: 'Master / Captain', startDate: '15/01/2024', endDate: '30/08/2025' },
            { shipName: 'MOZUK MARINER', role: 'Chief Officer', startDate: '10/02/2022', endDate: '15/11/2023' },
          ],
        },
        {
          id: 'c3',
          name: 'Alexey Ivanov',
          role: 'Chief Officer',
          department: 'deck',
          nationality: 'Ukrainian',
          dateOfBirth: '22/08/1984',
          passportNumber: 'UA-7710294',
          passportExpiry: '18/04/2029',
          seamanBookNo: 'SB-UA-55201',
          seamanBookExpiry: '20/09/2027',
          signOnDate: '10/03/2026',
          signOnLocation: 'Antwerp',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Chief Officer', startDate: '10/03/2026' },
            { shipName: 'MOZUK MARINER', role: 'Second Officer', startDate: '05/05/2023', endDate: '10/12/2024' },
          ],
        },
        {
          id: 'c5',
          name: 'Kenji Sato',
          role: 'Second Officer',
          department: 'deck',
          nationality: 'Japanese',
          dateOfBirth: '03/11/1990',
          passportNumber: 'JP-4491028',
          passportExpiry: '30/11/2031',
          seamanBookNo: 'SB-JP-99201',
          seamanBookExpiry: '10/01/2028',
          signOnDate: '12/05/2026',
          signOnLocation: 'Yokohama',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Second Officer', startDate: '12/05/2026' },
            { shipName: 'EVER GIVEN', role: 'Third Officer', startDate: '15/01/2024', endDate: '20/12/2024' },
          ],
        },
        {
          id: 'c6',
          name: 'Thomas Miller',
          role: 'Bosun',
          department: 'deck',
          nationality: 'Filipino',
          dateOfBirth: '18/06/1982',
          passportNumber: 'PH-3392810',
          passportExpiry: '05/07/2028',
          seamanBookNo: 'SB-PH-11029',
          seamanBookExpiry: '12/12/2027',
          signOnDate: '01/04/2026',
          signOnLocation: 'Manila',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Bosun', startDate: '01/04/2026' },
            { shipName: 'MOZUK MARINER', role: 'Able Seaman', startDate: '01/03/2021', endDate: '15/02/2023' },
          ],
        },
        {
          id: 'c7',
          name: 'Jose Santos',
          role: 'Able Seaman',
          department: 'deck',
          nationality: 'Filipino',
          dateOfBirth: '09/09/1995',
          passportNumber: 'PH-8829104',
          passportExpiry: '14/02/2030',
          seamanBookNo: 'SB-PH-77291',
          seamanBookExpiry: '08/08/2029',
          signOnDate: '15/04/2026',
          signOnLocation: 'Manila',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Able Seaman', startDate: '15/04/2026' },
            { shipName: 'SIRIOS BULK II', role: 'Ordinary Seaman', startDate: '10/05/2024', endDate: '20/12/2024' },
          ],
        },
        {
          id: 'c2',
          name: 'Dimitrios Pappas',
          role: 'Chief Engineer',
          department: 'engine',
          nationality: 'Greek',
          dateOfBirth: '07/03/1978',
          passportNumber: 'GR-1102938',
          passportExpiry: '25/09/2029',
          seamanBookNo: 'SB-GR-44910',
          seamanBookExpiry: '18/11/2027',
          signOnDate: '01/02/2026',
          signOnLocation: 'Piraeus',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Chief Engineer', startDate: '01/02/2026' },
            { shipName: 'SIRIOS BULK II', role: 'Chief Engineer', startDate: '01/02/2024', endDate: '15/12/2024' },
            { shipName: 'MSC OSCAR', role: 'Second Engineer', startDate: '01/06/2021', endDate: '10/01/2023' },
          ],
        },
        {
          id: 'c4',
          name: 'Elena Rostova',
          role: 'Second Engineer',
          department: 'engine',
          nationality: 'Estonian',
          dateOfBirth: '15/12/1988',
          passportNumber: 'EE-5592810',
          passportExpiry: '10/03/2032',
          seamanBookNo: 'SB-EE-33821',
          seamanBookExpiry: '05/05/2028',
          signOnDate: '05/04/2026',
          signOnLocation: 'Tallinn',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Second Engineer', startDate: '05/04/2026' },
            { shipName: 'SIRIOS BULK II', role: 'Third Engineer', startDate: '10/01/2023', endDate: '20/11/2024' },
          ],
        },
        {
          id: 'c8',
          name: 'Viktor Morozov',
          role: 'Third Engineer',
          department: 'engine',
          nationality: 'Latvian',
          dateOfBirth: '29/01/1992',
          passportNumber: 'LV-7739102',
          passportExpiry: '16/08/2030',
          seamanBookNo: 'SB-LV-88192',
          seamanBookExpiry: '19/02/2028',
          signOnDate: '01/05/2026',
          signOnLocation: 'Riga',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Third Engineer', startDate: '01/05/2026' },
            { shipName: 'SIRIOS BULK II', role: 'Fourth Engineer', startDate: '15/04/2024', endDate: '10/01/2025' },
          ],
        },
        {
          id: 'c9',
          name: 'Ahmed Hassan',
          role: 'Oiler / Motorman',
          department: 'engine',
          nationality: 'Egyptian',
          dateOfBirth: '11/04/1994',
          passportNumber: 'EG-3301928',
          passportExpiry: '22/01/2029',
          seamanBookNo: 'SB-EG-55102',
          seamanBookExpiry: '14/04/2027',
          signOnDate: '20/05/2026',
          signOnLocation: 'Alexandria',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Oiler / Motorman', startDate: '20/05/2026' },
            { shipName: 'MOZUK MARINER', role: 'Wiper', startDate: '05/02/2023', endDate: '30/11/2024' },
          ],
        },
        {
          id: 'c10',
          name: 'Giuseppe Rossi',
          role: 'Chief Cook',
          department: 'kitchen',
          nationality: 'Italian',
          dateOfBirth: '05/07/1980',
          passportNumber: 'IT-9920194',
          passportExpiry: '11/11/2031',
          seamanBookNo: 'SB-IT-22910',
          seamanBookExpiry: '01/09/2028',
          signOnDate: '15/02/2026',
          signOnLocation: 'Genoa',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Chief Cook', startDate: '15/02/2026' },
            { shipName: 'MSC OSCAR', role: 'Second Cook', startDate: '10/03/2022', endDate: '15/01/2024' },
          ],
        },
        {
          id: 'c11',
          name: 'Manny Pacquiao',
          role: 'Messman / Steward',
          department: 'kitchen',
          nationality: 'Filipino',
          dateOfBirth: '17/12/1996',
          passportNumber: 'PH-4401928',
          passportExpiry: '28/02/2030',
          seamanBookNo: 'SB-PH-99210',
          seamanBookExpiry: '15/10/2029',
          signOnDate: '01/03/2026',
          signOnLocation: 'Manila',
          vesselHistory: [
            { shipName: 'SIRIOS BULK II', role: 'Messman / Steward', startDate: '01/03/2026' },
          ],
        },
      ],
      documents: [
        { id: 'd1', title: 'International Load Line Certificate', documentType: 'Statutory Certificate', documentNumber: 'ILLC-98-4412', issueDate: '10/04/2022', expiryDate: '09/04/2027', authority: 'DNV GL', status: 'valid', category: 'certifications' },
        { id: 'd2', title: 'Safety Management Certificate (SMC)', documentType: 'ISM Code Cert', documentNumber: 'SMC-2023-887', issueDate: '15/01/2023', expiryDate: '14/01/2028', authority: 'Lloyds Register', status: 'valid', category: 'certifications' },
        { id: 'd3', title: 'Marpol Air Pollution Prevention (IAPP)', documentType: 'Environmental Cert', documentNumber: 'IAPP-2021-09', issueDate: '01/10/2021', expiryDate: '01/10/2026', authority: 'Bureau Veritas', status: 'expiring', category: 'certifications' },
        { id: 'd4', title: 'Cargo Ship Safety Radio Certificate', documentType: 'Safety Cert', documentNumber: 'CSSR-2024-11', issueDate: '20/02/2024', expiryDate: '19/02/2029', authority: 'DNV GL', status: 'valid', category: 'certifications' },
        { id: 'd5', title: 'MAN B&W 6S50MC Engine Operation & Service Manual', documentType: 'Technical Manual', documentNumber: 'MAN-MANUAL-6S50', issueDate: '10/05/2020', expiryDate: '10/05/2030', authority: 'MAN Energy Solutions', status: 'valid', category: 'technical_documentation' },
        { id: 'd6', title: 'General Arrangement & Hold Capacity Plan', documentType: 'Ship Drawing', documentNumber: 'DWG-SB2-001', issueDate: '15/03/1998', expiryDate: '15/03/2035', authority: 'Shipyard Design Office', status: 'valid', category: 'technical_documentation' },
        { id: 'd7', title: 'Port of Rotterdam Entry Permit & Berth Clearance', documentType: 'Port Access Permit', documentNumber: 'RTM-PERMIT-2026', issueDate: '01/09/2026', expiryDate: '01/10/2026', authority: 'Port of Rotterdam Authority', status: 'valid', category: 'misc' },
        { id: 'd8', title: 'Bunker Delivery Note & Fuel Quality Invoice', documentType: 'Commercial Invoice', documentNumber: 'BDN-2026-0941', issueDate: '12/09/2026', expiryDate: '31/12/2026', authority: 'Shell Marine Fuels', status: 'valid', category: 'misc' },
      ],
      maintenance: [
        {
          id: 'm1',
          title: 'Main Engine Cylinder #3 Exhaust Valve Overhaul',
          category: 'Machinery',
          priority: 'urgent',
          loggedDate: '18/09/2026',
          dueDate: '25/09/2026',
          reportedBy: 'Chief Engineer Dimitrios Pappas',
          description: 'High exhaust temperature warning triggered during last sea voyage. Requires immediate valve seat grinding and spindle replacement.',
          status: 'open',
        },
        {
          id: 'm2',
          title: 'Auxiliary Generator #2 Fuel Injector Servicing',
          category: 'Electrical',
          priority: 'high',
          loggedDate: '19/09/2026',
          dueDate: '28/09/2026',
          reportedBy: 'Second Engineer Elena Rostova',
          description: 'Standard 2,000-hour running service for aux engine fuel injectors. Replacement gaskets and nozzles prepared.',
          status: 'in_progress',
        },
        {
          id: 'm3',
          title: 'Port Side Anchor Windlass Hydraulic Leak Fix',
          category: 'Machinery',
          priority: 'medium',
          loggedDate: '20/09/2026',
          dueDate: '05/10/2026',
          reportedBy: 'Chief Officer Alexey Ivanov',
          description: 'Minor hydraulic oil seepage observed near the winch drum motor seal during anchoring.',
          status: 'open',
        },
        {
          id: 'm4',
          title: 'Cargo Hold #2 Rubber Hatch Cover Seal Replacement',
          category: 'Hull',
          priority: 'low',
          loggedDate: '10/09/2026',
          dueDate: '20/09/2026',
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
      classification: 'ClassNK',
      addedAt: '21/09/2026',
      crew: [
        { id: 'c201', name: 'Capt. Alexander Wright', role: 'Master / Captain', department: 'master', nationality: 'Canadian', signOnDate: '10/02/2026', seamanBookNo: 'SB-993012' },
        { id: 'c203', name: 'Carlos Mendez', role: 'Chief Officer', department: 'deck', nationality: 'Filipino', signOnDate: '15/03/2026' },
        { id: 'c204', name: 'Li Wei', role: 'Second Officer', department: 'deck', nationality: 'Chinese', signOnDate: '01/04/2026' },
        { id: 'c202', name: 'Hiroshi Tanaka', role: 'Chief Engineer', department: 'engine', nationality: 'Japanese', signOnDate: '01/03/2026' },
        { id: 'c205', name: 'Lars Hansen', role: 'Second Engineer', department: 'engine', nationality: 'Danish', signOnDate: '20/03/2026' },
        { id: 'c206', name: 'Francois Dubois', role: 'Chief Cook', department: 'kitchen', nationality: 'French', signOnDate: '25/02/2026' },
        { id: 'c207', name: 'Pedro Gomez', role: 'Messman', department: 'kitchen', nationality: 'Filipino', signOnDate: '10/03/2026' },
      ],
      documents: [
        { id: 'd201', title: 'Hull & Machinery Class Certificate', documentType: 'Class Certificate', documentNumber: 'NK-18-9921', issueDate: '01/05/2023', expiryDate: '30/04/2028', authority: 'ClassNK', status: 'valid', category: 'certifications' },
        { id: 'd202', title: 'ISM Code Document of Compliance', documentType: 'Safety Cert', documentNumber: 'DOC-2022-771', issueDate: '12/08/2022', expiryDate: '11/08/2027', authority: 'Panama Maritime', status: 'valid', category: 'certifications' },
        { id: 'd203', title: 'Container Lashing & Securing Manual', documentType: 'Technical Manual', documentNumber: 'EG-LASH-2018', issueDate: '01/09/2018', expiryDate: '01/09/2028', authority: 'Imabari Shipbuilding', status: 'valid', category: 'technical_documentation' },
        { id: 'd204', title: 'Suez Canal Transit Clearance & Toll Invoice', documentType: 'Port Clearance & Invoice', documentNumber: 'SCA-INV-2026-88', issueDate: '15/09/2026', expiryDate: '15/10/2026', authority: 'Suez Canal Authority', status: 'valid', category: 'misc' },
      ],
      maintenance: [
        {
          id: 'm201',
          title: 'Bow Thruster Hydraulic Oil Filtration & Inspection',
          category: 'Machinery',
          priority: 'high',
          loggedDate: '15/09/2026',
          dueDate: '01/10/2026',
          reportedBy: 'Chief Engineer Hiroshi Tanaka',
          description: 'Routine oil analysis showed minor particulate buildup. Perform oil flushing and filter element replacement.',
          status: 'open',
        },
        {
          id: 'm202',
          title: 'ECDIS Primary & Secondary Radar Calibration',
          category: 'Navigation',
          priority: 'low',
          loggedDate: '12/09/2026',
          dueDate: '18/09/2026',
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
      classification: 'Bureau Veritas',
      addedAt: '21/09/2026',
      crew: [
        { id: 'c301', name: 'Capt. Jean-Luc Picard', role: 'Master / Captain', department: 'master', nationality: 'French', signOnDate: '20/01/2026', seamanBookNo: 'SB-170100' },
        { id: 'c303', name: 'William Riker', role: 'Chief Officer', department: 'deck', nationality: 'American', signOnDate: '01/02/2026' },
        { id: 'c302', name: 'Sven Lindqvist', role: 'Chief Engineer', department: 'engine', nationality: 'Swedish', signOnDate: '15/02/2026' },
        { id: 'c304', name: 'Geordi La Forge', role: 'Electro-Technical Officer (ETO)', department: 'engine', nationality: 'American', signOnDate: '20/02/2026' },
        { id: 'c305', name: 'Neelix', role: 'Chief Cook', department: 'kitchen', nationality: 'Talaxian', signOnDate: '05/03/2026' },
      ],
      documents: [
        { id: 'd301', title: 'International Sewage Pollution Prevention', documentType: 'Environmental Cert', documentNumber: 'ISPP-14-332', issueDate: '10/11/2020', expiryDate: '09/11/2025', authority: 'DNV GL', status: 'valid', category: 'certifications' },
        { id: 'd302', title: 'MAN B&W 11S90ME Main Engine Electrical Wiring Schematic', documentType: 'Electrical Schematic', documentNumber: 'DWG-ME-11S90', issueDate: '20/01/2015', expiryDate: '20/01/2030', authority: 'MAN Energy Solutions', status: 'valid', category: 'technical_documentation' },
        { id: 'd303', title: 'Charterer Voyage Instructions & Port Access Permit', documentType: 'Charterer Order', documentNumber: 'VOY-2026-992', issueDate: '10/09/2026', expiryDate: '10/10/2026', authority: 'MSC Line Chartering', status: 'valid', category: 'misc' },
      ],
      maintenance: [
        {
          id: 'm301',
          title: 'Turbocharger Nozzle Ring Inspection',
          category: 'Machinery',
          priority: 'urgent',
          loggedDate: '20/09/2026',
          dueDate: '24/09/2026',
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
      classification: 'American Bureau of Shipping (ABS)',
      addedAt: '21/09/2026',
      crew: [
        { id: 'c401', name: 'Capt. Joao Silva', role: 'Master / Captain', department: 'master', nationality: 'Mozambican', signOnDate: '10/01/2026', seamanBookNo: 'SB-MZ-0019' },
        { id: 'c403', name: 'Antonio Cossa', role: 'Chief Officer', department: 'deck', nationality: 'Mozambican', signOnDate: '01/02/2026' },
        { id: 'c402', name: 'Mateus Nhampossa', role: 'Chief Engineer', department: 'engine', nationality: 'Mozambican', signOnDate: '12/01/2026' },
        { id: 'c404', name: 'Inacio Tembe', role: 'Chief Cook', department: 'kitchen', nationality: 'Mozambican', signOnDate: '25/01/2026' },
      ],
      documents: [
        { id: 'd401', title: 'National Certificate of Registry', documentType: 'Statutory Certificate', documentNumber: 'MZ-REG-2021-004', issueDate: '01/06/2021', expiryDate: '31/05/2031', authority: 'INAMAR Mozambique', status: 'valid', category: 'certifications' },
        { id: 'd402', title: 'Cargo Ship Safety Construction Certificate', documentType: 'Safety Cert', documentNumber: 'CSSC-MZ-2021-88', issueDate: '15/06/2021', expiryDate: '14/06/2026', authority: 'ABS Class', status: 'valid', category: 'certifications' },
        { id: 'd403', title: 'Cargo Hold Hatch Cover Hydraulic System Drawing', documentType: 'Technical Drawing', documentNumber: 'DWG-HC-MZ401', issueDate: '01/05/2021', expiryDate: '01/05/2031', authority: 'Mozambique Shipyard', status: 'valid', category: 'technical_documentation' },
        { id: 'd404', title: 'Maputo Port Berth Access Pass & Agency Invoice', documentType: 'Port Access & Invoice', documentNumber: 'MPT-INV-2026-04', issueDate: '18/09/2026', expiryDate: '18/10/2026', authority: 'Maputo Port Development Co', status: 'valid', category: 'misc' },
      ],
      maintenance: [
        {
          id: 'm401',
          title: 'Engine Room Bilge High Level Alarm Test',
          category: 'Safety',
          priority: 'low',
          loggedDate: '21/09/2026',
          dueDate: '30/09/2026',
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
            <div
              onClick={() => setSelectedShip(null)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src="https://marine.mozuk.net/images/logo.png"
                alt="Mozuk Marine Logo"
                className="h-9 w-auto drop-shadow-[0_0_12px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-xl tracking-tight text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition">
                  MOZUK <span className="text-[var(--color-primary)] font-extrabold">MARINE</span>
                </h1>
                <p className="text-[11px] text-[var(--text-muted)] font-medium">
                  Vessel Profile & Operations Portal
                </p>
              </div>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
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
                  <h2 className="text-2xl font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                    Ship Owner Fleet Operations Portal
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
                    Integrated with Mozuk Marine's engineering standards. Select a vessel below to access its crew command hierarchy, statutory technical certificates, and maintenance repair logs.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
