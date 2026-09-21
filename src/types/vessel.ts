export interface MarineTrafficLocation {
  latitude: number;
  longitude: number;
  status: 'Underway' | 'At Anchor' | 'Moored / In Port' | 'Under Maintenance';
  speedKnots: number;
  headingDegrees: number;
  currentPort?: string;
  destination: string;
  eta: string;
  lastAisUpdate: string;
  source: 'MarineTraffic Live AIS';
}

export interface Ship {
  id: string;
  name: string; // Mandatory
  imo: string;  // Mandatory
  type?: string; // Optional
  builtYear?: number; // Optional
  grossTonnage?: number; // Optional
  location: MarineTrafficLocation;
  addedAt: string;
}
