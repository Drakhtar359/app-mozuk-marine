export interface CrewMember {
  id: string;
  name: string;
  role: string;
  nationality: string;
  signOnDate: string;
  seamanBookNo?: string;
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

export interface Ship {
  id: string;
  name: string; // Mandatory
  imo: string;  // Mandatory
  type?: string; // Optional
  builtYear?: number; // Optional
  grossTonnage?: number; // Optional
  flag?: string;
  classification?: string;
  crew: CrewMember[];
  documents: TechnicalDoc[];
  maintenance: MaintenanceLog[];
  addedAt: string;
}
