import { CrewMember, CrewDocument } from '../types/vessel';

/**
 * Generates an authentic mix of certifications and documentation for a crew member.
 */
export function getDefaultCrewDocuments(crew: CrewMember): CrewDocument[] {
  if (crew.documents && crew.documents.length > 0) {
    return crew.documents;
  }

  const dept = crew.department || 'deck';
  const roleLower = (crew.role || '').toLowerCase();
  const nat = crew.nationality || 'International';

  const docs: CrewDocument[] = [];

  // 1. Department-Specific Certifications
  if (dept === 'master' || roleLower.includes('master') || roleLower.includes('captain')) {
    docs.push(
      {
        id: `doc-${crew.id}-1`,
        title: 'STCW II/2 Master Mariner Unlimited (CoC)',
        type: 'certification',
        documentNumber: `COC-MM-${Math.abs(hashString(crew.id + 'coc')) % 89999 + 10000}`,
        issueDate: '12/04/2023',
        expiryDate: '11/04/2028',
        authority: `${nat} Maritime Administration`,
        status: 'valid',
        fileSize: '3.4 MB',
      },
      {
        id: `doc-${crew.id}-2`,
        title: 'GMDSS General Operator Certificate (GOC)',
        type: 'certification',
        documentNumber: `GOC-GMDSS-${Math.abs(hashString(crew.id + 'goc')) % 8999 + 1000}`,
        issueDate: '18/06/2022',
        expiryDate: '17/06/2027',
        authority: 'International Telecommunication Union (ITU)',
        status: 'valid',
        fileSize: '1.8 MB',
      },
      {
        id: `doc-${crew.id}-3`,
        title: 'ECDIS & Radar ARPA Type-Specific Endorsement',
        type: 'certification',
        documentNumber: `ECDIS-${Math.abs(hashString(crew.id + 'ecdis')) % 8999 + 1000}`,
        issueDate: '05/01/2024',
        expiryDate: '04/01/2029',
        authority: 'Furuno / Transas Marine Navigation',
        status: 'valid',
        fileSize: '2.1 MB',
      },
      {
        id: `doc-${crew.id}-4`,
        title: 'Ship Security Officer (SSO / ISPS Code)',
        type: 'certification',
        documentNumber: `SSO-ISPS-${Math.abs(hashString(crew.id + 'sso')) % 8999 + 1000}`,
        issueDate: '20/09/2022',
        expiryDate: '19/09/2027',
        authority: 'Lloyds Register Security Training',
        status: 'valid',
        fileSize: '1.2 MB',
      }
    );
  } else if (dept === 'engine' || roleLower.includes('engineer') || roleLower.includes('eto') || roleLower.includes('fitter') || roleLower.includes('motorman')) {
    const isOfficer = roleLower.includes('chief') || roleLower.includes('second') || roleLower.includes('third') || roleLower.includes('fourth') || roleLower.includes('eto');
    docs.push(
      {
        id: `doc-${crew.id}-1`,
        title: isOfficer ? 'STCW III/2 Marine Engineer Officer CoC' : 'STCW III/4 Engine Watchkeeping Rating',
        type: 'certification',
        documentNumber: `ENG-COC-${Math.abs(hashString(crew.id + 'engcoc')) % 89999 + 10000}`,
        issueDate: '10/05/2023',
        expiryDate: '09/05/2028',
        authority: `${nat} Department of Transport & Maritime`,
        status: 'valid',
        fileSize: '3.1 MB',
      },
      {
        id: `doc-${crew.id}-2`,
        title: 'High Voltage Safety & Operation Certification',
        type: 'certification',
        documentNumber: `HV-SAF-${Math.abs(hashString(crew.id + 'hv')) % 8999 + 1000}`,
        issueDate: '14/11/2023',
        expiryDate: '13/11/2028',
        authority: 'DNV Maritime Academy',
        status: 'valid',
        fileSize: '1.9 MB',
      },
      {
        id: `doc-${crew.id}-3`,
        title: 'Ballast Water Treatment System (BWTS) Operator Certificate',
        type: 'certification',
        documentNumber: `BWTS-OP-${Math.abs(hashString(crew.id + 'bwts')) % 8999 + 1000}`,
        issueDate: '01/02/2024',
        expiryDate: '31/01/2029',
        authority: 'Alfa Laval / Mozuk Technical Training',
        status: 'valid',
        fileSize: '2.4 MB',
      }
    );
  } else if (dept === 'kitchen' || roleLower.includes('cook') || roleLower.includes('steward') || roleLower.includes('messman')) {
    docs.push(
      {
        id: `doc-${crew.id}-1`,
        title: "Ship's Cook Certificate of Qualification (MLC 2006)",
        type: 'certification',
        documentNumber: `COOK-MLC-${Math.abs(hashString(crew.id + 'cook')) % 89999 + 10000}`,
        issueDate: '15/03/2023',
        expiryDate: '14/03/2028',
        authority: 'Maritime Labour Standards Board',
        status: 'valid',
        fileSize: '2.0 MB',
      },
      {
        id: `doc-${crew.id}-2`,
        title: 'Food Safety & Marine Catering Hygiene Level 3',
        type: 'certification',
        documentNumber: `FSH-LV3-${Math.abs(hashString(crew.id + 'fsh')) % 8999 + 1000}`,
        issueDate: '10/08/2024',
        expiryDate: '09/08/2027',
        authority: 'Chartered Institute of Environmental Health',
        status: 'valid',
        fileSize: '1.4 MB',
      },
      {
        id: `doc-${crew.id}-3`,
        title: 'STCW Basic Safety Training (VI/1)',
        type: 'certification',
        documentNumber: `STCW-BST-${Math.abs(hashString(crew.id + 'bst')) % 8999 + 1000}`,
        issueDate: '01/06/2022',
        expiryDate: '31/05/2027',
        authority: `${nat} Maritime Training Institute`,
        status: 'valid',
        fileSize: '1.7 MB',
      }
    );
  } else {
    // Deck Department Ratings and Officers
    const isOfficer = roleLower.includes('officer') || roleLower.includes('mate');
    docs.push(
      {
        id: `doc-${crew.id}-1`,
        title: isOfficer ? 'STCW II/1 Officer of the Navigational Watch (OOW)' : 'STCW II/4 Navigational Watch Rating Certificate',
        type: 'certification',
        documentNumber: `DK-COC-${Math.abs(hashString(crew.id + 'dkcoc')) % 89999 + 10000}`,
        issueDate: '10/02/2023',
        expiryDate: '09/02/2028',
        authority: `${nat} Coastguard & Maritime Registry`,
        status: 'valid',
        fileSize: '2.8 MB',
      },
      {
        id: `doc-${crew.id}-2`,
        title: 'Proficiency in Survival Craft and Rescue Boats (PSCRB)',
        type: 'certification',
        documentNumber: `PSCRB-${Math.abs(hashString(crew.id + 'pscrb')) % 8999 + 1000}`,
        issueDate: '12/09/2022',
        expiryDate: '11/09/2027',
        authority: 'Maritime Safety Training Authority',
        status: 'valid',
        fileSize: '1.6 MB',
      },
      {
        id: `doc-${crew.id}-3`,
        title: 'Advanced Fire Fighting (STCW VI/3)',
        type: 'certification',
        documentNumber: `AFF-${Math.abs(hashString(crew.id + 'aff')) % 8999 + 1000}`,
        issueDate: '05/11/2022',
        expiryDate: '04/11/2027',
        authority: 'Fire Safety Maritime Academy',
        status: 'valid',
        fileSize: '1.8 MB',
      }
    );
  }

  // 2. Universal Documentation (Medical, Contracts, Passports, Vaccination)
  docs.push(
    {
      id: `doc-${crew.id}-5`,
      title: 'ENG1 Seafarer Medical Fitness Certificate',
      type: 'documentation',
      documentNumber: `MED-ENG1-${Math.abs(hashString(crew.id + 'eng1')) % 89999 + 10000}`,
      issueDate: '01/08/2025',
      expiryDate: '01/08/2027',
      authority: 'Approved Maritime Medical Practitioner',
      status: 'valid',
      fileSize: '1.1 MB',
    },
    {
      id: `doc-${crew.id}-6`,
      title: 'Seafarer Employment Agreement (SEA Contract)',
      type: 'documentation',
      documentNumber: `SEA-MOZUK-${Math.abs(hashString(crew.id + 'sea')) % 8999 + 1000}`,
      issueDate: crew.signOnDate || '01/02/2026',
      expiryDate: '01/02/2027',
      authority: 'Mozuk Marine Crewing Ltd',
      status: 'valid',
      fileSize: '4.2 MB',
    },
    {
      id: `doc-${crew.id}-7`,
      title: 'International Yellow Fever & Vaccination Record',
      type: 'documentation',
      documentNumber: `WHO-VAC-${Math.abs(hashString(crew.id + 'vac')) % 8999 + 1000}`,
      issueDate: '10/05/2021',
      expiryDate: 'Lifetime / Valid',
      authority: 'World Health Organization (WHO)',
      status: 'valid',
      fileSize: '950 KB',
    },
    {
      id: `doc-${crew.id}-8`,
      title: 'Pre-Boarding Drug & Alcohol Screening Clearance',
      type: 'documentation',
      documentNumber: `DAC-TEST-${Math.abs(hashString(crew.id + 'dac')) % 8999 + 1000}`,
      issueDate: '15/01/2026',
      expiryDate: '15/01/2027',
      authority: 'Eurofins Marine Toxicology Lab',
      status: 'valid',
      fileSize: '720 KB',
    }
  );

  return docs;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
