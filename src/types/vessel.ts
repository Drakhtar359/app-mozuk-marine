export interface VesselHistoryEntry {
  shipName: string;
  role: string;
  startDate: string;
  endDate?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  department?: 'master' | 'deck' | 'engine' | 'kitchen';
  nationality: string;
  signOnDate: string;
  signOnLocation?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpiry?: string;
  seamanBookNo?: string;
  seamanBookExpiry?: string;
  vesselHistory?: VesselHistoryEntry[];
}

export interface TechnicalDoc {
  id: string;
  title: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  authority: string;
  status: 'valid' | 'expiring' | 'expired';
  category?: 'certifications' | 'technical_documentation' | 'misc';
}

export interface MaintenanceLog {
  id: string;
  title: string;
  category: 'Machinery' | 'Hull' | 'Electrical' | 'Safety' | 'Navigation';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  loggedDate: string;
  dueDate: string;
  reportedBy: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed';
}

export interface VisitorLog {
  id: string;
  date: string;
  fullName: string;
  company: string;
  reason: string;
  timeIn: string;
  timeOut?: string;
  location: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  type?: string;
  builtYear?: number;
  grossTonnage?: number;
  flag?: string;
  classification?: string;
  crew: CrewMember[];
  documents: TechnicalDoc[];
  maintenance: MaintenanceLog[];
  visitors?: VisitorLog[];
  addedAt: string;
}
