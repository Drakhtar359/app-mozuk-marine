export type VesselStatus = 'Underway' | 'In Port' | 'Anchored' | 'Maintenance';

export type VesselType = 
  | 'Container Ship' 
  | 'Oil Tanker' 
  | 'Bulk Carrier' 
  | 'LNG Carrier' 
  | 'Offshore Support' 
  | 'Tugboat';

export type CIIRating = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Particulars {
  imo: string;
  mmsi: string;
  callSign: string;
  flag: string;
  flagCode: string; // ISO 2-letter
  type: VesselType;
  builtYear: number;
  shipyard: string;
  classificationSociety: string;
  lengthOverallMeters: number;
  beamMeters: number;
  maxDraftMeters: number;
  deadweightTons: number;
  grossTonnage: number;
}

export interface VoyageInfo {
  status: VesselStatus;
  origin: string;
  destination: string;
  departureTime: string;
  eta: string;
  speedKnots: number;
  headingDegrees: number;
  latitude: number;
  longitude: number;
  currentPort?: string;
  distanceToGoNm: number;
  seaState: 'Calm (0-1m)' | 'Moderate (1-2.5m)' | 'Rough (2.5-4m)' | 'Heavy (>4m)';
}

export interface Telemetry {
  engineRpm: number;
  engineLoadPct: number;
  hfoFuelTonsPerDay: number;
  mgoFuelTonsPerDay: number;
  hfoTankPct: number;
  mgoTankPct: number;
  generatorLoadPct: number;
  lubeOilTempC: number;
  coolingWaterTempC: number;
}

export interface Certificate {
  id: string;
  name: string;
  code: string;
  issueDate: string;
  expiryDate: string;
  authority: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface CrewMember {
  role: string;
  name: string;
  nationality: string;
  signOnDate: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  category: 'Machinery' | 'Safety' | 'Hull' | 'Electrical' | 'Navigation';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'open' | 'in_progress' | 'completed';
}

export interface Vessel {
  id: string;
  name: string;
  image: string;
  ciiRating: CIIRating;
  particulars: Particulars;
  voyage: VoyageInfo;
  telemetry: Telemetry;
  certificates: Certificate[];
  crew: CrewMember[];
  workOrders: WorkOrder[];
}

export interface AlertNotification {
  id: string;
  vesselId: string;
  vesselName: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'Compliance' | 'Telemetry' | 'Weather' | 'Maintenance';
  message: string;
  timestamp: string;
  read: boolean;
}
