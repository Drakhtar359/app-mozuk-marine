import React, { useState, useEffect } from 'react';
import { Ship, CrewMember } from './types/vessel';
import { AddShipModal } from './components/AddShipModal';
import { ShipList } from './components/ShipList';
import { VesselProfilePage } from './components/VesselProfilePage';
import { CompanyCrewList } from './components/CompanyCrewList';
import { formatDate, getTodayDDMMYYYY } from './utils/dateFormatter';
import { Plus, Sun, Moon, ShieldCheck, Wrench, Users, FileCheck, Ship as ShipIcon } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mozuk_theme') as 'dark' | 'light') || 'light';
  });

  // Initial Master Company Crew State
  const [companyCrew, setCompanyCrew] = useState<CrewMember[]>([
    // Unassigned / Standby Pool Crew Members
    {
      id: 'c-standby-1',
      name: 'Capt. David Sterling',
      role: 'Master / Captain',
      department: 'master',
      email: 'd.sterling@mozukmarine.com',
      phoneNumber: '+44 7911 123456',
      nationality: 'British',
      signOnDate: '01/09/2026',
      signOnLocation: 'London',
      dateOfBirth: '14/08/1972',
      passportNumber: 'GB-1102934',
      passportExpiry: '10/10/2031',
      seamanBookNo: 'SB-UK-99102',
      seamanBookExpiry: '15/05/2029',
      vesselHistory: [{ shipName: 'MOZUK MARINER', role: 'Master / Captain', startDate: '10/01/2024', endDate: '15/08/2026' }],
    },
    {
      id: 'c-standby-2',
      name: 'Mikhail Petrov',
      role: 'Second Engineer',
      department: 'engine',
      email: 'm.petrov@mozukmarine.com',
      phoneNumber: '+372 5123 4567',
      nationality: 'Estonian',
      signOnDate: '15/08/2026',
      signOnLocation: 'Tallinn',
      dateOfBirth: '20/03/1986',
      passportNumber: 'EE-8820194',
      passportExpiry: '12/12/2030',
      seamanBookNo: 'SB-EE-77201',
      seamanBookExpiry: '20/06/2028',
      vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Second Engineer', startDate: '15/02/2025', endDate: '01/08/2026' }],
    },
    {
      id: 'c-standby-3',
      name: 'Juan Dela Cruz',
      role: 'Able Seaman',
      department: 'deck',
      email: 'j.delacruz@mozukmarine.com',
      phoneNumber: '+63 917 123 4567',
      nationality: 'Filipino',
      signOnDate: '01/09/2026',
      signOnLocation: 'Manila',
      dateOfBirth: '11/11/1993',
      passportNumber: 'PH-5591029',
      passportExpiry: '18/09/2029',
      seamanBookNo: 'SB-PH-44910',
      seamanBookExpiry: '10/10/2027',
      vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Able Seaman', startDate: '01/03/2024', endDate: '10/08/2026' }],
    },
    {
      id: 'c-standby-4',
      name: 'Lars Oberg',
      role: 'Electro-Technical Officer (ETO)',
      department: 'engine',
      email: 'l.oberg@mozukmarine.com',
      phoneNumber: '+46 70 123 4567',
      nationality: 'Swedish',
      signOnDate: '10/09/2026',
      signOnLocation: 'Gothenburg',
      dateOfBirth: '05/06/1988',
      passportNumber: 'SE-3391029',
      passportExpiry: '22/01/2032',
      seamanBookNo: 'SB-SE-22910',
      seamanBookExpiry: '15/04/2028',
      vesselHistory: [{ shipName: 'MSC OSCAR', role: 'ETO', startDate: '10/05/2023', endDate: '20/07/2026' }],
    },

    // Assigned Crew Members
    { id: 'c1', name: 'Capt. Marcus Vance', role: 'Master / Captain', department: 'master', email: 'm.vance@mozukmarine.com', phoneNumber: '+44 7700 900077', nationality: 'British', dateOfBirth: '14/05/1975', passportNumber: 'GB-99482019', passportExpiry: '12/10/2030', seamanBookNo: 'SB-882109', seamanBookExpiry: '15/06/2028', signOnDate: '15/01/2026', signOnLocation: 'Rotterdam', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Master / Captain', startDate: '15/01/2026' }, { shipName: 'SIRIOS BULK II', role: 'Master / Captain', startDate: '15/01/2024', endDate: '30/08/2025' }, { shipName: 'MOZUK MARINER', role: 'Chief Officer', startDate: '10/02/2022', endDate: '15/11/2023' }] },
    { id: 'c3', name: 'Alexey Ivanov', role: 'Chief Officer', department: 'deck', email: 'a.ivanov@mozukmarine.com', phoneNumber: '+380 50 123 4567', nationality: 'Ukrainian', dateOfBirth: '22/08/1984', passportNumber: 'UA-7710294', passportExpiry: '18/04/2029', seamanBookNo: 'SB-UA-55201', seamanBookExpiry: '20/09/2027', signOnDate: '10/03/2026', signOnLocation: 'Antwerp', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Chief Officer', startDate: '10/03/2026' }, { shipName: 'MOZUK MARINER', role: 'Second Officer', startDate: '05/05/2023', endDate: '10/12/2024' }] },
    { id: 'c5', name: 'Kenji Sato', role: 'Second Officer', department: 'deck', email: 'k.sato@mozukmarine.com', phoneNumber: '+81 90 1234 5678', nationality: 'Japanese', dateOfBirth: '03/11/1990', passportNumber: 'JP-4491028', passportExpiry: '30/11/2031', seamanBookNo: 'SB-JP-99201', seamanBookExpiry: '10/01/2028', signOnDate: '12/05/2026', signOnLocation: 'Yokohama', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Second Officer', startDate: '12/05/2026' }, { shipName: 'EVER GIVEN', role: 'Third Officer', startDate: '15/01/2024', endDate: '20/12/2024' }] },
    { id: 'c6', name: 'Thomas Miller', role: 'Bosun', department: 'deck', email: 't.miller@mozukmarine.com', phoneNumber: '+63 918 765 4321', nationality: 'Filipino', dateOfBirth: '18/06/1982', passportNumber: 'PH-3392810', passportExpiry: '05/07/2028', seamanBookNo: 'SB-PH-11029', seamanBookExpiry: '12/12/2027', signOnDate: '01/04/2026', signOnLocation: 'Manila', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Bosun', startDate: '01/04/2026' }, { shipName: 'MOZUK MARINER', role: 'Able Seaman', startDate: '01/03/2021', endDate: '15/02/2023' }] },
    { id: 'c7', name: 'Jose Santos', role: 'Able Seaman', department: 'deck', email: 'j.santos@mozukmarine.com', phoneNumber: '+63 919 888 7777', nationality: 'Filipino', dateOfBirth: '09/09/1995', passportNumber: 'PH-8829104', passportExpiry: '14/02/2030', seamanBookNo: 'SB-PH-77291', seamanBookExpiry: '08/08/2029', signOnDate: '15/04/2026', signOnLocation: 'Manila', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Able Seaman', startDate: '15/04/2026' }, { shipName: 'SIRIOS BULK II', role: 'Ordinary Seaman', startDate: '10/05/2024', endDate: '20/12/2024' }] },
    { id: 'c2', name: 'Dimitrios Pappas', role: 'Chief Engineer', department: 'engine', email: 'd.pappas@mozukmarine.com', phoneNumber: '+30 691 234 5678', nationality: 'Greek', dateOfBirth: '07/03/1978', passportNumber: 'GR-1102938', passportExpiry: '25/09/2029', seamanBookNo: 'SB-GR-44910', seamanBookExpiry: '18/11/2027', signOnDate: '01/02/2026', signOnLocation: 'Piraeus', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Chief Engineer', startDate: '01/02/2026' }, { shipName: 'SIRIOS BULK II', role: 'Chief Engineer', startDate: '01/02/2024', endDate: '15/12/2024' }, { shipName: 'MSC OSCAR', role: 'Second Engineer', startDate: '01/06/2021', endDate: '10/01/2023' }] },
    { id: 'c4', name: 'Elena Rostova', role: 'Second Engineer', department: 'engine', email: 'e.rostova@mozukmarine.com', phoneNumber: '+372 555 1234', nationality: 'Estonian', dateOfBirth: '15/12/1988', passportNumber: 'EE-5592810', passportExpiry: '10/03/2032', seamanBookNo: 'SB-EE-33821', seamanBookExpiry: '05/05/2028', signOnDate: '05/04/2026', signOnLocation: 'Tallinn', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Second Engineer', startDate: '05/04/2026' }, { shipName: 'SIRIOS BULK II', role: 'Third Engineer', startDate: '10/01/2023', endDate: '20/11/2024' }] },
    { id: 'c8', name: 'Viktor Morozov', role: 'Third Engineer', department: 'engine', email: 'v.morozov@mozukmarine.com', phoneNumber: '+371 20 123 456', nationality: 'Latvian', dateOfBirth: '29/01/1992', passportNumber: 'LV-7739102', passportExpiry: '16/08/2030', seamanBookNo: 'SB-LV-88192', seamanBookExpiry: '19/02/2028', signOnDate: '01/05/2026', signOnLocation: 'Riga', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Third Engineer', startDate: '01/05/2026' }, { shipName: 'SIRIOS BULK II', role: 'Fourth Engineer', startDate: '15/04/2024', endDate: '10/01/2025' }] },
    { id: 'c9', name: 'Ahmed Hassan', role: 'Oiler / Motorman', department: 'engine', email: 'a.hassan@mozukmarine.com', phoneNumber: '+20 100 123 4567', nationality: 'Egyptian', dateOfBirth: '11/04/1994', passportNumber: 'EG-3301928', passportExpiry: '22/01/2029', seamanBookNo: 'SB-EG-55102', seamanBookExpiry: '14/04/2027', signOnDate: '20/05/2026', signOnLocation: 'Alexandria', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Oiler / Motorman', startDate: '20/05/2026' }, { shipName: 'MOZUK MARINER', role: 'Wiper', startDate: '05/02/2023', endDate: '30/11/2024' }] },
    { id: 'c10', name: 'Giuseppe Rossi', role: 'Chief Cook', department: 'kitchen', email: 'g.rossi@mozukmarine.com', phoneNumber: '+39 333 123 4567', nationality: 'Italian', dateOfBirth: '05/07/1980', passportNumber: 'IT-9920194', passportExpiry: '11/11/2031', seamanBookNo: 'SB-IT-22910', seamanBookExpiry: '01/09/2028', signOnDate: '15/02/2026', signOnLocation: 'Genoa', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Chief Cook', startDate: '15/02/2026' }, { shipName: 'MSC OSCAR', role: 'Second Cook', startDate: '10/03/2022', endDate: '15/01/2024' }] },
    { id: 'c11', name: 'Manny Pacquiao', role: 'Messman / Steward', department: 'kitchen', email: 'm.pacquiao@mozukmarine.com', phoneNumber: '+63 920 111 2222', nationality: 'Filipino', dateOfBirth: '17/12/1996', passportNumber: 'PH-4401928', passportExpiry: '28/02/2030', seamanBookNo: 'SB-PH-99210', seamanBookExpiry: '15/10/2029', signOnDate: '01/03/2026', signOnLocation: 'Manila', assignedShipId: 'ship-1', assignedShipName: 'SIRIOS BULK II', vesselHistory: [{ shipName: 'SIRIOS BULK II', role: 'Messman / Steward', startDate: '01/03/2026' }] },

    { id: 'c201', name: 'Capt. Alexander Wright', role: 'Master / Captain', department: 'master', email: 'a.wright@mozukmarine.com', phoneNumber: '+1 416 555 0192', nationality: 'Canadian', signOnDate: '10/02/2026', seamanBookNo: 'SB-993012', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Master / Captain', startDate: '10/02/2026' }] },
    { id: 'c203', name: 'Carlos Mendez', role: 'Chief Officer', department: 'deck', email: 'c.mendez@mozukmarine.com', phoneNumber: '+63 917 555 8899', nationality: 'Filipino', signOnDate: '15/03/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Chief Officer', startDate: '15/03/2026' }] },
    { id: 'c204', name: 'Li Wei', role: 'Second Officer', department: 'deck', email: 'l.wei@mozukmarine.com', phoneNumber: '+86 138 0000 1122', nationality: 'Chinese', signOnDate: '01/04/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Second Officer', startDate: '01/04/2026' }] },
    { id: 'c202', name: 'Hiroshi Tanaka', role: 'Chief Engineer', department: 'engine', email: 'h.tanaka@mozukmarine.com', phoneNumber: '+81 90 9988 7766', nationality: 'Japanese', signOnDate: '01/03/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Chief Engineer', startDate: '01/03/2026' }] },
    { id: 'c205', name: 'Lars Hansen', role: 'Second Engineer', department: 'engine', email: 'l.hansen@mozukmarine.com', phoneNumber: '+45 20 12 34 56', nationality: 'Danish', signOnDate: '20/03/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Second Engineer', startDate: '20/03/2026' }] },
    { id: 'c206', name: 'Francois Dubois', role: 'Chief Cook', department: 'kitchen', email: 'f.dubois@mozukmarine.com', phoneNumber: '+33 6 12 34 56 78', nationality: 'French', signOnDate: '25/02/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Chief Cook', startDate: '25/02/2026' }] },
    { id: 'c207', name: 'Pedro Gomez', role: 'Messman', department: 'kitchen', email: 'p.gomez@mozukmarine.com', phoneNumber: '+63 915 444 3322', nationality: 'Filipino', signOnDate: '10/03/2026', assignedShipId: 'ship-2', assignedShipName: 'EVER GIVEN', vesselHistory: [{ shipName: 'EVER GIVEN', role: 'Messman', startDate: '10/03/2026' }] },

    { id: 'c301', name: 'Capt. Jean-Luc Picard', role: 'Master / Captain', department: 'master', email: 'jl.picard@mozukmarine.com', phoneNumber: '+33 1 42 68 55 00', nationality: 'French', signOnDate: '20/01/2026', seamanBookNo: 'SB-170100', assignedShipId: 'ship-3', assignedShipName: 'MSC OSCAR', vesselHistory: [{ shipName: 'MSC OSCAR', role: 'Master / Captain', startDate: '20/01/2026' }] },
    { id: 'c303', name: 'William Riker', role: 'Chief Officer', department: 'deck', email: 'w.riker@mozukmarine.com', phoneNumber: '+1 212 555 0177', nationality: 'American', signOnDate: '01/02/2026', assignedShipId: 'ship-3', assignedShipName: 'MSC OSCAR', vesselHistory: [{ shipName: 'MSC OSCAR', role: 'Chief Officer', startDate: '01/02/2026' }] },
    { id: 'c302', name: 'Sven Lindqvist', role: 'Chief Engineer', department: 'engine', email: 's.lindqvist@mozukmarine.com', phoneNumber: '+46 8 123 4567', nationality: 'Swedish', signOnDate: '15/02/2026', assignedShipId: 'ship-3', assignedShipName: 'MSC OSCAR', vesselHistory: [{ shipName: 'MSC OSCAR', role: 'Chief Engineer', startDate: '15/02/2026' }] },
    { id: 'c304', name: 'Geordi La Forge', role: 'Electro-Technical Officer (ETO)', department: 'engine', email: 'g.laforge@mozukmarine.com', phoneNumber: '+1 312 555 0144', nationality: 'American', signOnDate: '20/02/2026', assignedShipId: 'ship-3', assignedShipName: 'MSC OSCAR', vesselHistory: [{ shipName: 'MSC OSCAR', role: 'Electro-Technical Officer (ETO)', startDate: '20/02/2026' }] },
    { id: 'c305', name: 'Neelix', role: 'Chief Cook', department: 'kitchen', email: 'neelix@mozukmarine.com', phoneNumber: '+1 800 555 0199', nationality: 'Talaxian', signOnDate: '05/03/2026', assignedShipId: 'ship-3', assignedShipName: 'MSC OSCAR', vesselHistory: [{ shipName: 'MSC OSCAR', role: 'Chief Cook', startDate: '05/03/2026' }] },

    { id: 'c401', name: 'Capt. Joao Silva', role: 'Master / Captain', department: 'master', email: 'j.silva@mozukmarine.com', phoneNumber: '+258 84 123 4567', nationality: 'Mozambican', signOnDate: '10/01/2026', seamanBookNo: 'SB-MZ-0019', assignedShipId: 'ship-4', assignedShipName: 'MOZUK MARINER', vesselHistory: [{ shipName: 'MOZUK MARINER', role: 'Master / Captain', startDate: '10/01/2026' }] },
    { id: 'c403', name: 'Antonio Cossa', role: 'Chief Officer', department: 'deck', email: 'a.cossa@mozukmarine.com', phoneNumber: '+258 82 987 6543', nationality: 'Mozambican', signOnDate: '01/02/2026', assignedShipId: 'ship-4', assignedShipName: 'MOZUK MARINER', vesselHistory: [{ shipName: 'MOZUK MARINER', role: 'Chief Officer', startDate: '01/02/2026' }] },
    { id: 'c402', name: 'Mateus Nhampossa', role: 'Chief Engineer', department: 'engine', email: 'm.nhampossa@mozukmarine.com', phoneNumber: '+258 84 555 1212', nationality: 'Mozambican', signOnDate: '12/01/2026', assignedShipId: 'ship-4', assignedShipName: 'MOZUK MARINER', vesselHistory: [{ shipName: 'MOZUK MARINER', role: 'Chief Engineer', startDate: '12/01/2026' }] },
    { id: 'c404', name: 'Inacio Tembe', role: 'Chief Cook', department: 'kitchen', email: 'i.tembe@mozukmarine.com', phoneNumber: '+258 87 333 4444', nationality: 'Mozambican', signOnDate: '25/01/2026', assignedShipId: 'ship-4', assignedShipName: 'MOZUK MARINER', vesselHistory: [{ shipName: 'MOZUK MARINER', role: 'Chief Cook', startDate: '25/01/2026' }] },
  ]);

  // Initial Ships Specifications & Data
  const [rawShips, setRawShips] = useState<Array<Omit<Ship, 'crew'> & { crew?: CrewMember[] }>>([
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
      visitors: [
        {
          id: 'v1',
          date: '25/09/2026',
          fullName: 'Johnathan Miller',
          company: 'DNV Classification Society',
          reason: 'Annual Class & Safety Equipment Inspection',
          timeIn: '08:30',
          timeOut: '',
          location: 'Rotterdam Port, Berth 4',
        },
        {
          id: 'v2',
          date: '24/09/2026',
          fullName: 'Carlos Silva',
          company: 'Wärtsilä Marine Services',
          reason: 'Main Engine Fuel Injection System Diagnostics',
          timeIn: '09:15',
          timeOut: '16:45',
          location: 'Rotterdam Port, Berth 4',
        },
        {
          id: 'v3',
          date: '22/09/2026',
          fullName: 'Capt. Robert Chen',
          company: 'Port State Control (PSC)',
          reason: 'Routine Flag & Environmental Compliance Audit',
          timeIn: '10:00',
          timeOut: '14:30',
          location: 'Antwerp Anchorage',
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
      visitors: [
        {
          id: 'v201',
          date: '25/09/2026',
          fullName: 'Sven Lindemann',
          company: 'ClassNK Surveyor',
          reason: 'Hull Thickness & Structural Survey',
          timeIn: '09:00',
          timeOut: '',
          location: 'Port of Hamburg, Berth 9',
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
      visitors: [
        {
          id: 'v301',
          date: '24/09/2026',
          fullName: 'Pierre Laurent',
          company: 'Bureau Veritas',
          reason: 'ISM Code Internal Safety Audit',
          timeIn: '11:00',
          timeOut: '15:20',
          location: 'Port of Felixstowe',
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
      visitors: [
        {
          id: 'v401',
          date: '25/09/2026',
          fullName: 'Inacio Tembe Jr.',
          company: 'INAMAR Maritime Authority',
          reason: 'Port Safety & Bunkering License Inspection',
          timeIn: '08:00',
          timeOut: '12:00',
          location: 'Maputo Port, Berth 2',
        },
      ],
    },
  ]);

  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [selectedCrewForProfile, setSelectedCrewForProfile] = useState<CrewMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync theme changes to html element & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mozuk_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Synchronized Ships with Crew from companyCrew database
  const ships: Ship[] = rawShips.map((ship) => ({
    ...ship,
    crew: companyCrew.filter((c) => c.assignedShipId === ship.id),
  }));

  const selectedShip = ships.find((s) => s.id === selectedShipId) || null;

  // Handlers for Ships
  const handleAddShip = (newShip: Ship) => {
    setRawShips((prev) => [newShip, ...prev]);
    setSelectedShipId(newShip.id);
  };

  const handleRemoveShip = (shipId: string) => {
    setRawShips((prev) => prev.filter((s) => s.id !== shipId));
    // Unassign crew on this ship
    setCompanyCrew((prev) =>
      prev.map((c) => (c.assignedShipId === shipId ? { ...c, assignedShipId: undefined, assignedShipName: undefined } : c))
    );
    if (selectedShipId === shipId) {
      setSelectedShipId(null);
    }
  };

  const handleUpdateShip = (updatedShip: Ship) => {
    setRawShips((prev) =>
      prev.map((s) => (s.id === updatedShip.id ? updatedShip : s))
    );
    // Sync crew changes if updatedShip.crew modified
    if (updatedShip.crew) {
      setCompanyCrew((prev) => {
        const otherCrew = prev.filter((c) => c.assignedShipId !== updatedShip.id);
        const shipCrew = updatedShip.crew.map((c) => ({
          ...c,
          assignedShipId: updatedShip.id,
          assignedShipName: updatedShip.name,
        }));
        return [...shipCrew, ...otherCrew];
      });
    }
  };

  // Handlers for Company Master Crew Roster
  const handleAddCompanyCrew = (newCrew: CrewMember) => {
    setCompanyCrew((prev) => [newCrew, ...prev]);
  };

  const handleUpdateCompanyCrew = (updatedCrew: CrewMember) => {
    setCompanyCrew((prev) =>
      prev.map((c) => (c.id === updatedCrew.id ? updatedCrew : c))
    );
  };

  const handleRemoveCompanyCrew = (crewId: string) => {
    setCompanyCrew((prev) => prev.filter((c) => c.id !== crewId));
  };

  const handleAssignExistingCrewToShip = (
    crewId: string,
    role?: string,
    signOnDate?: string,
    signOnLocation?: string
  ) => {
    if (!selectedShip) return;

    setCompanyCrew((prev) =>
      prev.map((c) => {
        if (c.id === crewId) {
          const newRole = role || c.role;
          const newSignOn = signOnDate ? formatDate(signOnDate) : c.signOnDate;
          const newLocation = signOnLocation || c.signOnLocation;

          const history = c.vesselHistory || [];
          const activeIdx = history.findIndex((h) => !h.endDate && h.shipName === selectedShip.name);

          let updatedHistory = [...history];
          if (activeIdx === -1) {
            updatedHistory = updatedHistory.map((h) => (!h.endDate ? { ...h, endDate: newSignOn } : h));
            updatedHistory.unshift({
              shipName: selectedShip.name,
              role: newRole,
              startDate: newSignOn,
            });
          }

          return {
            ...c,
            role: newRole,
            signOnDate: newSignOn,
            signOnLocation: newLocation,
            assignedShipId: selectedShip.id,
            assignedShipName: selectedShip.name,
            vesselHistory: updatedHistory,
          };
        }
        return c;
      })
    );
  };

  const handleUnassignCrewFromShip = (crewId: string) => {
    setCompanyCrew((prev) =>
      prev.map((c) => {
        if (c.id === crewId) {
          const history = (c.vesselHistory || []).map((h) =>
            !h.endDate ? { ...h, endDate: getTodayDDMMYYYY() } : h
          );
          return {
            ...c,
            assignedShipId: undefined,
            assignedShipName: undefined,
            vesselHistory: history,
          };
        }
        return c;
      })
    );
  };

  // Fleet Overview Metrics
  const totalFleetCount = ships.length;
  const totalCrewCount = companyCrew.length;
  const totalOnboardCrewCount = companyCrew.filter((c) => c.assignedShipId).length;
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
              onClick={() => setSelectedShipId(null)}
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
                onClick={() => setSelectedShipId(null)}
                className="px-3.5 py-2 rounded-full btn-mozuk-secondary font-bold text-xs"
              >
                ← Back to Fleet Directory
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
          <div className="space-y-10">
            {/* Mozuk Marine Fleet Banner */}
            <div className="mozuk-glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-glass-border)] pb-4 mb-5">
                <div>
                  <h2 className="text-2xl font-['Space_Grotesk',sans-serif] font-bold text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                    Ship Owner Fleet Operations Portal
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
                    Integrated with Mozuk Marine's engineering standards. Access fleet vessel profiles, master crew database, statutory technical certificates, and maintenance repair logs.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Register Vessel
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
                    <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase">Company Crew Roster</div>
                    <div className="font-['Space_Grotesk',sans-serif] font-extrabold text-[var(--text-main)] text-xl leading-tight">
                      {totalCrewCount} Personnel
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mt-0.5">
                      ({totalOnboardCrewCount} onboard)
                    </div>
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

            {/* 1. Fleet Directory */}
            <ShipList
              ships={ships}
              onSelectShip={(ship) => setSelectedShipId(ship.id)}
              onRemoveShip={handleRemoveShip}
            />

            {/* 2. Company Master Crew Roster */}
            <CompanyCrewList
              companyCrew={companyCrew}
              ships={ships}
              onSelectShip={(ship) => setSelectedShipId(ship.id)}
              onSelectCrewMember={(crew) => setSelectedCrewForProfile(crew)}
              onAddCrewMember={handleAddCompanyCrew}
              onUpdateCrewMember={handleUpdateCompanyCrew}
              onRemoveCrewMember={handleRemoveCompanyCrew}
            />
          </div>
        ) : (
          <VesselProfilePage
            ship={selectedShip}
            companyCrew={companyCrew}
            onBack={() => setSelectedShipId(null)}
            onUpdateShip={handleUpdateShip}
            onAssignExistingCrewToShip={handleAssignExistingCrewToShip}
            onUnassignCrewFromShip={handleUnassignCrewFromShip}
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
