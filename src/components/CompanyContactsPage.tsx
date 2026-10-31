import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShipOwnerDetails,
  CompanyCustomer,
  CompanyEmployee,
  CompanyContactPerson,
} from '../types/vessel';
import { formatDate, getTodayDDMMYYYY } from '../utils/dateFormatter';
import { DateInput } from './DateInput';
import {
  Contact,
  Globe,
  Briefcase,
  UserCheck,
  Search,
  Plus,
  Mail,
  Edit,
  Trash2,
  X,
  MapPin,
  Calendar,
  Phone,
} from 'lucide-react';

const DEFAULT_CUSTOMERS: CompanyCustomer[] = [
  {
    id: 'cust-1',
    name: 'Maputo Logistics & Shipping S.A.',
    contactPerson: 'Maria Santos',
    contractType: 'Port Logistics & Vessel Chartering',
    email: 'm.santos@maputologistics.co.mz',
    phoneNumber: '+258 21 445 889',
    country: 'Mozambique',
    city: 'Maputo',
    notes: 'Long-term offshore supply vessel charter partner.',
  },
  {
    id: 'cust-2',
    name: 'Gulf Marine Energy Chartering Ltd',
    contactPerson: 'Ahmed Al-Mansoor',
    contractType: 'Offshore Energy Charterer',
    email: 'ahmed.mansoor@gulfenergy.ae',
    phoneNumber: '+971 4 399 2200',
    country: 'United Arab Emirates',
    city: 'Dubai',
    notes: 'Heavy lift & tug assistance charter agreements.',
  },
  {
    id: 'cust-3',
    name: 'Indian Ocean Bulk Carriers Pvt',
    contactPerson: 'Rajesh Kumar',
    contractType: 'Dry Bulk Cargo Partner',
    email: 'r.kumar@indianoceanbulk.in',
    phoneNumber: '+91 22 6789 4433',
    country: 'India',
    city: 'Mumbai',
    notes: 'Seasonal grain & mineral shipment contract holder.',
  },
];

interface CompanyContactsPageProps {
  ownerDetails: ShipOwnerDetails;
  onUpdateOwnerDetails?: (updatedDetails: ShipOwnerDetails) => void;
}

export const CompanyContactsPage: React.FC<CompanyContactsPageProps> = ({
  ownerDetails,
  onUpdateOwnerDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'employees' | 'contacts'>('customers');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // Local state for Customers list initialized from ownerDetails
  const [customersList, setCustomersList] = useState<CompanyCustomer[]>(
    ownerDetails.customers && ownerDetails.customers.length > 0
      ? ownerDetails.customers
      : DEFAULT_CUSTOMERS
  );

  // Local state for Employees list initialized from ownerDetails
  const [employeesList, setEmployeesList] = useState<CompanyEmployee[]>(
    ownerDetails.employees || []
  );

  // Local state for Contacts list initialized from ownerDetails
  const [contactPeopleList, setContactPeopleList] = useState<CompanyContactPerson[]>(
    ownerDetails.contactPeople || []
  );

  useEffect(() => {
    if (ownerDetails.customers && ownerDetails.customers.length > 0) {
      setCustomersList(ownerDetails.customers);
    }
  }, [ownerDetails.customers]);

  useEffect(() => {
    if (ownerDetails.employees) {
      setEmployeesList(ownerDetails.employees);
    }
  }, [ownerDetails.employees]);

  useEffect(() => {
    if (ownerDetails.contactPeople) {
      setContactPeopleList(ownerDetails.contactPeople);
    }
  }, [ownerDetails.contactPeople]);

  // Customer Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [custName, setCustName] = useState('');
  const [custContactPerson, setCustContactPerson] = useState('');
  const [custContractType, setCustContractType] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhoneNumber, setCustPhoneNumber] = useState('');
  const [custCountry, setCustCountry] = useState('Mozambique');
  const [custCity, setCustCity] = useState('Maputo');
  const [custNotes, setCustNotes] = useState('');

  // Employee Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [empName, setEmpName] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [empDateOfBirth, setEmpDateOfBirth] = useState('');
  const [empDateOfJoining, setEmpDateOfJoining] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhoneNumber, setEmpPhoneNumber] = useState('');
  const [empCountry, setEmpCountry] = useState('Mozambique');
  const [empCity, setEmpCity] = useState('Maputo');

  // Contact Person Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [cpFullName, setCpFullName] = useState('');
  const [cpPosition, setCpPosition] = useState('');
  const [cpCountry, setCpCountry] = useState('Mozambique');
  const [cpPhoneNumber, setCpPhoneNumber] = useState('');
  const [cpEmail, setCpEmail] = useState('');
  const [cpDescription, setCpDescription] = useState('');

  const filteredCustomers = customersList.filter((c) => {
    const query = customerSearchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.contactPerson.toLowerCase().includes(query) ||
      (c.contractType && c.contractType.toLowerCase().includes(query)) ||
      c.country.toLowerCase().includes(query) ||
      (c.city && c.city.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phoneNumber && c.phoneNumber.toLowerCase().includes(query)) ||
      (c.notes && c.notes.toLowerCase().includes(query))
    );
  });

  const filteredContactPeople = contactPeopleList.filter((person) => {
    const query = contactSearchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      person.fullName.toLowerCase().includes(query) ||
      person.position.toLowerCase().includes(query) ||
      person.country.toLowerCase().includes(query) ||
      (person.phoneNumber && person.phoneNumber.toLowerCase().includes(query)) ||
      (person.email && person.email.toLowerCase().includes(query)) ||
      (person.description && person.description.toLowerCase().includes(query))
    );
  });

  // Customer Handlers
  const handleOpenAddCustomerModal = () => {
    setEditingCustomerId(null);
    setCustName('');
    setCustContactPerson('');
    setCustContractType('');
    setCustEmail('');
    setCustPhoneNumber('');
    setCustCountry(ownerDetails.country || 'Mozambique');
    setCustCity('Maputo');
    setCustNotes('');
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomerModal = (cust: CompanyCustomer) => {
    setEditingCustomerId(cust.id);
    setCustName(cust.name);
    setCustContactPerson(cust.contactPerson);
    setCustContractType(cust.contractType || '');
    setCustEmail(cust.email || '');
    setCustPhoneNumber(cust.phoneNumber || '');
    setCustCountry(cust.country || 'Mozambique');
    setCustCity(cust.city || '');
    setCustNotes(cust.notes || '');
    setIsCustomerModalOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customersList.filter((c) => c.id !== id);
    setCustomersList(updated);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        customers: updated,
      });
    }
  };

  const handleSaveCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    let updatedList: CompanyCustomer[];
    if (editingCustomerId) {
      updatedList = customersList.map((cust) =>
        cust.id === editingCustomerId
          ? {
              ...cust,
              name: custName.trim(),
              contactPerson: custContactPerson.trim() || 'Primary Contact',
              contractType: custContractType.trim() || 'Client',
              email: custEmail.trim(),
              phoneNumber: custPhoneNumber.trim(),
              country: custCountry.trim() || 'Mozambique',
              city: custCity.trim(),
              notes: custNotes.trim(),
            }
          : cust
      );
    } else {
      const newCustomer: CompanyCustomer = {
        id: `cust-${Date.now()}`,
        name: custName.trim(),
        contactPerson: custContactPerson.trim() || 'Primary Contact',
        contractType: custContractType.trim() || 'Client',
        email: custEmail.trim(),
        phoneNumber: custPhoneNumber.trim(),
        country: custCountry.trim() || 'Mozambique',
        city: custCity.trim(),
        notes: custNotes.trim(),
      };
      updatedList = [newCustomer, ...customersList];
    }

    setCustomersList(updatedList);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        customers: updatedList,
      });
    }
    setIsCustomerModalOpen(false);
  };

  // Contact Person Handlers
  const handleOpenAddContactModal = () => {
    setEditingContactId(null);
    setCpFullName('');
    setCpPosition('');
    setCpCountry(ownerDetails.country || 'Mozambique');
    setCpPhoneNumber('');
    setCpEmail('');
    setCpDescription('');
    setIsContactModalOpen(true);
  };

  const handleOpenEditContactModal = (cp: CompanyContactPerson) => {
    setEditingContactId(cp.id);
    setCpFullName(cp.fullName);
    setCpPosition(cp.position);
    setCpCountry(cp.country || 'Mozambique');
    setCpPhoneNumber(cp.phoneNumber || '');
    setCpEmail(cp.email || '');
    setCpDescription(cp.description || '');
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    const updated = contactPeopleList.filter((c) => c.id !== id);
    setContactPeopleList(updated);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        contactPeople: updated,
      });
    }
  };

  const handleSaveContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpFullName.trim()) return;

    let updatedList: CompanyContactPerson[];
    if (editingContactId) {
      updatedList = contactPeopleList.map((cp) =>
        cp.id === editingContactId
          ? {
              ...cp,
              fullName: cpFullName.trim(),
              position: cpPosition.trim() || 'Company Representative',
              country: cpCountry.trim() || 'Mozambique',
              phoneNumber: cpPhoneNumber.trim(),
              email: cpEmail.trim(),
              description: cpDescription.trim(),
            }
          : cp
      );
    } else {
      const newContact: CompanyContactPerson = {
        id: `cp-${Date.now()}`,
        fullName: cpFullName.trim(),
        position: cpPosition.trim() || 'Company Representative',
        country: cpCountry.trim() || 'Mozambique',
        phoneNumber: cpPhoneNumber.trim(),
        email: cpEmail.trim(),
        description: cpDescription.trim(),
      };
      updatedList = [...contactPeopleList, newContact];
    }

    setContactPeopleList(updatedList);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        contactPeople: updatedList,
      });
    }
    setIsContactModalOpen(false);
  };

  // Employee Handlers
  const handleOpenAddEmployeeModal = () => {
    setEditingEmployeeId(null);
    setEmpName('');
    setEmpPosition('');
    setEmpDateOfBirth('');
    setEmpDateOfJoining('');
    setEmpEmail('');
    setEmpPhoneNumber('');
    setEmpCountry(ownerDetails.country || 'Mozambique');
    setEmpCity('Maputo');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployeeModal = (emp: CompanyEmployee) => {
    setEditingEmployeeId(emp.id);
    setEmpName(emp.name);
    setEmpPosition(emp.position);
    setEmpDateOfBirth(emp.dateOfBirth || '');
    setEmpDateOfJoining(emp.dateOfJoining || '');
    setEmpEmail(emp.email || '');
    setEmpPhoneNumber(emp.phoneNumber || '');
    setEmpCountry(emp.country || 'Mozambique');
    setEmpCity(emp.city || '');
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employeesList.filter((e) => e.id !== id);
    setEmployeesList(updated);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employees: updated,
      });
    }
  };

  const handleSaveEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;

    let updatedList: CompanyEmployee[];
    if (editingEmployeeId) {
      updatedList = employeesList.map((emp) =>
        emp.id === editingEmployeeId
          ? {
              ...emp,
              name: empName.trim(),
              position: empPosition.trim() || 'Staff',
              dateOfBirth: empDateOfBirth ? formatDate(empDateOfBirth) : '',
              dateOfJoining: empDateOfJoining ? formatDate(empDateOfJoining) : '',
              email: empEmail.trim(),
              phoneNumber: empPhoneNumber.trim(),
              country: empCountry.trim() || 'Mozambique',
              city: empCity.trim() || 'Maputo',
            }
          : emp
      );
    } else {
      const newEmployee: CompanyEmployee = {
        id: `emp-${Date.now()}`,
        name: empName.trim(),
        position: empPosition.trim() || 'Staff',
        dateOfBirth: empDateOfBirth ? formatDate(empDateOfBirth) : '',
        dateOfJoining: empDateOfJoining ? formatDate(empDateOfJoining) : formatDate(getTodayDDMMYYYY()),
        email: empEmail.trim(),
        phoneNumber: empPhoneNumber.trim(),
        country: empCountry.trim() || 'Mozambique',
        city: empCity.trim() || 'Maputo',
      };
      updatedList = [newEmployee, ...employeesList];
    }

    setEmployeesList(updatedList);
    if (onUpdateOwnerDetails) {
      onUpdateOwnerDetails({
        ...ownerDetails,
        employees: updatedList,
      });
    }
    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Mini-Header matching Dashboard, Fleet, Crew & Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--color-glass-border)] pb-4">
        <div>
          <h2 className="font-heading font-bold text-[var(--text-main)] text-xl flex items-center gap-2">
            <Contact className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
            Company Contacts
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] px-3 py-1.5 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <span className="text-[var(--text-muted)] font-semibold">Total Records:</span>
          <strong className="text-[var(--text-main)] font-mono text-sm">
            {customersList.length + employeesList.length + contactPeopleList.length}
          </strong>
        </div>
      </div>

      {/* Folder Directory Tabs Container */}
      <div className="pt-2">
        {/* Folder Flap Handles */}
        <div className="flex items-end gap-2 px-2 -mb-px relative z-10 overflow-x-auto flex-nowrap">
          {/* Tab 1: Customers */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`relative px-5 sm:px-6 py-3.5 rounded-none font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[var(--color-bg-alt)] text-[#28ada4] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
            }`}
          >
            {activeTab === 'customers' && (
              <motion.div
                layoutId="activeFolderTabBottomLine"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#28ada4] rounded-none z-30"
              />
            )}
            <Globe className="w-4 h-4 text-[#28ada4]" />
            <span>Customers</span>
          </button>

          {/* Tab 2: Employees */}
          <button
            onClick={() => setActiveTab('employees')}
            className={`relative px-5 sm:px-6 py-3.5 rounded-none font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-[var(--color-bg-alt)] text-[#28ada4] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
            }`}
          >
            {activeTab === 'employees' && (
              <motion.div
                layoutId="activeFolderTabBottomLine"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#28ada4] rounded-none z-30"
              />
            )}
            <Briefcase className="w-4 h-4 text-[#28ada4]" />
            <span>Employees</span>
          </button>

          {/* Tab 3: Contacts & Company Directory */}
          <button
            onClick={() => setActiveTab('contacts')}
            className={`relative px-5 sm:px-6 py-3.5 rounded-none font-extrabold text-xs transition-all duration-200 flex items-center gap-2.5 border border-b-0 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-[var(--color-bg-alt)] text-[#28ada4] border-[var(--color-glass-border-hover)] z-20 shadow-[0_-4px_16px_rgba(40,173,164,0.12)]'
                : 'bg-[var(--color-bg)]/60 hover:bg-[var(--color-bg-alt)]/80 text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--color-glass-border)] z-0 opacity-80 hover:opacity-100'
            }`}
          >
            {activeTab === 'contacts' && (
              <motion.div
                layoutId="activeFolderTabBottomLine"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#28ada4] rounded-none z-30"
              />
            )}
            <UserCheck className="w-4 h-4 text-[#28ada4]" />
            <span>Contacts & Company Directory</span>
          </button>
        </div>

        {/* Folder Content Body Container */}
        <div className="mozuk-glass-card rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 sm:p-8 border border-[var(--color-glass-border)] shadow-xl relative z-0">
          {/* TAB 1: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#28ada4]" />
                    Customers Directory ({filteredCustomers.length})
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Vessel charterers, cargo owners, port logistics partners, and commercial maritime clients.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition shadow-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpenAddCustomerModal}
                    className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Register Customer
                  </motion.button>
                </div>
              </div>

              <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
                <div className="w-full overflow-hidden">
                  <table className="w-full table-fixed text-left text-xs">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 w-[24%]">Customer & Contact</th>
                        <th className="py-2.5 px-2.5 w-[18%]">Service Type</th>
                        <th className="py-2.5 px-2.5 w-[21%]">Email Address</th>
                        <th className="py-2.5 px-2.5 w-[14%]">Phone</th>
                        <th className="py-2.5 px-2.5 w-[13%]">Location</th>
                        <th className="py-2.5 px-3 w-[10%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-glass-border)]">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                            {customersList.length === 0
                              ? 'No commercial customers registered yet. Click "+ Register Customer" to populate directory.'
                              : 'No customers match your search query.'}
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => (
                          <tr key={cust.id} className="hover:bg-[var(--color-glass-border)] transition">
                            {/* Name & Contact Person */}
                            <td className="py-2.5 px-3 align-middle overflow-hidden">
                              <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                                {cust.name}
                              </div>
                              <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5 truncate">
                                Rep: {cust.contactPerson}
                              </div>
                            </td>

                            {/* Contract Type */}
                            <td className="py-2.5 px-2.5 align-middle font-semibold text-[var(--text-main)] truncate">
                              {cust.contractType || 'General Client'}
                            </td>

                            {/* Email */}
                            <td className="py-2.5 px-2.5 align-middle font-mono text-xs text-[#28ada4] font-semibold overflow-hidden">
                              {cust.email ? (
                                <a href={`mailto:${cust.email}`} className="hover:underline flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-[#28ada4] shrink-0" />
                                  <span className="truncate">{cust.email}</span>
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>

                            {/* Phone */}
                            <td className="py-2.5 px-2.5 align-middle font-mono text-xs text-[var(--text-main)] font-bold truncate">
                              {cust.phoneNumber || '—'}
                            </td>

                            {/* Country & City */}
                            <td className="py-2.5 px-2.5 align-middle overflow-hidden">
                              <div className="font-bold text-[var(--text-main)] truncate">{cust.country}</div>
                              <div className="text-[11px] text-[var(--text-muted)] truncate">{cust.city}</div>
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 align-middle text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditCustomerModal(cust)}
                                  className="p-1.5 px-2 rounded-lg bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-[11px] font-bold transition inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCustomer(cust.id)}
                                  className="p-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition inline-flex items-center shrink-0 cursor-pointer"
                                  title="Delete customer record"
                                >
                                  <Trash2 className="w-3 h-3 text-[#991b1b] dark:text-[#e05252]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEES */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#28ada4]" />
                    Employees ({employeesList.length})
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Shore-based corporate personnel, superintendents, operations leads, and company staff.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenAddEmployeeModal}
                  className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1.5 transition shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Register Employee
                </motion.button>
              </div>

              <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
                <div className="w-full overflow-hidden">
                  <table className="w-full table-fixed text-left text-xs">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 w-[25%]">Employee & Position</th>
                        <th className="py-2.5 px-2 w-[11%]">DOB</th>
                        <th className="py-2.5 px-2 w-[11%]">Joined</th>
                        <th className="py-2.5 px-2 w-[20%]">Email Address</th>
                        <th className="py-2.5 px-2 w-[13%]">Phone</th>
                        <th className="py-2.5 px-2 w-[11%]">Location</th>
                        <th className="py-2.5 px-3 w-[9%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-glass-border)]">
                      {employeesList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-[var(--text-muted)]">
                            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                            No company employees registered yet. Click "+ Register Employee" to populate directory.
                          </td>
                        </tr>
                      ) : (
                        employeesList.map((emp) => (
                          <tr key={emp.id} className="hover:bg-[var(--color-glass-border)] transition">
                            {/* Name & Position */}
                            <td className="py-2.5 px-3 align-middle overflow-hidden">
                              <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5 truncate" title={emp.position}>
                                {emp.position}
                              </div>
                            </td>

                            {/* Date of Birth */}
                            <td className="py-2.5 px-2 align-middle font-mono text-[11px] text-[var(--text-main)] font-semibold truncate">
                              {emp.dateOfBirth || '—'}
                            </td>

                            {/* Date of Joining */}
                            <td className="py-2.5 px-2 align-middle font-mono text-[11px] text-[var(--text-main)] font-semibold truncate">
                              {emp.dateOfJoining || '—'}
                            </td>

                            {/* Email */}
                            <td className="py-2.5 px-2 align-middle font-mono text-[11px] text-[#28ada4] font-semibold overflow-hidden">
                              {emp.email ? (
                                <a href={`mailto:${emp.email}`} className="hover:underline flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-[#28ada4] shrink-0" />
                                  <span className="truncate">{emp.email}</span>
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>

                            {/* Phone */}
                            <td className="py-2.5 px-2 align-middle font-mono text-[11px] text-[var(--text-main)] font-bold truncate">
                              {emp.phoneNumber || '—'}
                            </td>

                            {/* Country & City */}
                            <td className="py-2.5 px-2 align-middle overflow-hidden">
                              <div className="font-bold text-[var(--text-main)] truncate">{emp.country}</div>
                              <div className="text-[11px] text-[var(--text-muted)] truncate">{emp.city}</div>
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 align-middle text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditEmployeeModal(emp)}
                                  className="p-1.5 px-2 rounded-lg bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-[11px] font-bold transition inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(emp.id)}
                                  className="p-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition inline-flex items-center shrink-0 cursor-pointer"
                                  title="Delete employee record"
                                >
                                  <Trash2 className="w-3 h-3 text-[#991b1b] dark:text-[#e05252]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS & COMPANY DIRECTORY */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--text-main)] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#28ada4]" />
                    Contacts & Company Directory ({filteredContactPeople.length})
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Authorized company representatives, DPAs, technical superintendents, and crewing directors.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-glass-border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#28ada4] transition shadow-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpenAddContactModal}
                    className="px-4 py-2 rounded-full btn-mozuk-primary text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Register Contact
                  </motion.button>
                </div>
              </div>

              <div className="mozuk-glass-card rounded-2xl shadow-lg overflow-hidden border border-[var(--color-glass-border)]">
                <div className="w-full overflow-hidden">
                  <table className="w-full table-fixed text-left text-xs">
                    <thead className="bg-[var(--color-bg-alt)] text-[var(--text-main)] text-[10px] uppercase border-b border-[var(--color-glass-border)] font-extrabold tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 w-[23%]">Contact & Position</th>
                        <th className="py-2.5 px-2.5 w-[12%]">Country</th>
                        <th className="py-2.5 px-2.5 w-[20%]">Email Address</th>
                        <th className="py-2.5 px-2.5 w-[14%]">Phone</th>
                        <th className="py-2.5 px-2.5 w-[21%]">Responsibilities</th>
                        <th className="py-2.5 px-3 w-[10%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-glass-border)]">
                      {filteredContactPeople.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                            <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-[var(--text-dim)]" />
                            {contactPeopleList.length === 0
                              ? 'No internal contacts listed. Click "+ Register Contact" to add team members.'
                              : 'No internal contacts match your search query.'}
                          </td>
                        </tr>
                      ) : (
                        filteredContactPeople.map((person) => (
                          <tr key={person.id} className="hover:bg-[var(--color-glass-border)] transition">
                            {/* Name & Position */}
                            <td className="py-2.5 px-3 align-middle overflow-hidden">
                              <div className="font-extrabold text-[var(--text-main)] text-xs truncate">
                                {person.fullName}
                              </div>
                              <div className="text-[11px] text-[#28ada4] font-semibold mt-0.5 truncate" title={person.position}>
                                {person.position}
                              </div>
                            </td>

                            {/* Country */}
                            <td className="py-2.5 px-2.5 align-middle font-bold text-[var(--text-main)] truncate">
                              {person.country}
                            </td>

                            {/* Email */}
                            <td className="py-2.5 px-2.5 align-middle font-mono text-[11px] text-[#28ada4] font-semibold overflow-hidden">
                              {person.email ? (
                                <a href={`mailto:${person.email}`} className="hover:underline flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-[#28ada4] shrink-0" />
                                  <span className="truncate">{person.email}</span>
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>

                            {/* Phone */}
                            <td className="py-2.5 px-2.5 align-middle font-mono text-[11px] text-[var(--text-main)] font-bold truncate">
                              {person.phoneNumber || '—'}
                            </td>

                            {/* Description */}
                            <td className="py-2.5 px-2.5 align-middle text-[var(--text-muted)] truncate" title={person.description}>
                              {person.description || '—'}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 align-middle text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditContactModal(person)}
                                  className="p-1.5 px-2 rounded-lg bg-[#28ada4]/10 hover:bg-[#28ada4]/20 text-[#28ada4] border border-[#28ada4]/30 text-[11px] font-bold transition inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContact(person.id)}
                                  className="p-1.5 rounded-lg bg-[#991b1b]/15 hover:bg-[#991b1b]/25 text-[#991b1b] dark:text-[#e05252] border border-[#991b1b]/30 hover:border-[#991b1b]/50 transition inline-flex items-center shrink-0 cursor-pointer"
                                  title="Delete contact record"
                                >
                                  <Trash2 className="w-3 h-3 text-[#991b1b] dark:text-[#e05252]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: REGISTER / EDIT COMPANY CUSTOMER */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsCustomerModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/30">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      {editingCustomerId ? 'Edit Customer Details' : 'Register New Customer Company'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Fill in client credentials, representative contact, and contract details.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveCustomerSubmit} className="p-6 space-y-4 text-xs">
                {/* Company Name */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Customer / Company Name <span className="text-[#28ada4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maputo Logistics & Shipping S.A."
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Contact Person & Service Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Primary Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Santos"
                      value={custContactPerson}
                      onChange={(e) => setCustContactPerson(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Service / Contract Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dry Bulk Chartering"
                      value={custContractType}
                      onChange={(e) => setCustContractType(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. chartering@client.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +258 21 445 889"
                      value={custPhoneNumber}
                      onChange={(e) => setCustPhoneNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Country & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mozambique"
                      value={custCountry}
                      onChange={(e) => setCustCountry(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maputo"
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Commercial Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Specific contract clauses, preferred ports, or vessel requirements..."
                    value={custNotes}
                    onChange={(e) => setCustNotes(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md cursor-pointer"
                  >
                    {editingCustomerId ? 'Save Changes' : 'Register Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: REGISTER / EDIT COMPANY EMPLOYEE */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsEmployeeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/30">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      {editingEmployeeId ? 'Edit Employee Details' : 'Register New Employee'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Shore-based staff profile, position title, and employment record.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveEmployeeSubmit} className="p-6 space-y-4 text-xs">
                {/* Employee Name */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Full Name <span className="text-[#28ada4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capt. Antonio Vance"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Position / Role Title <span className="text-[#28ada4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fleet Operations Director / DPA"
                    value={empPosition}
                    onChange={(e) => setEmpPosition(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Dates: DOB & Joining Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Date of Birth
                    </label>
                    <DateInput
                      value={empDateOfBirth}
                      onChange={setEmpDateOfBirth}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Joining Date
                    </label>
                    <DateInput
                      value={empDateOfJoining}
                      onChange={setEmpDateOfJoining}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. a.vance@mozukmarine.com"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +258 84 999 1122"
                      value={empPhoneNumber}
                      onChange={(e) => setEmpPhoneNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Country & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mozambique"
                      value={empCountry}
                      onChange={(e) => setEmpCountry(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maputo"
                      value={empCity}
                      onChange={(e) => setEmpCity(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md cursor-pointer"
                  >
                    {editingEmployeeId ? 'Save Changes' : 'Register Employee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: REGISTER / EDIT INTERNAL CONTACT PERSON */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsContactModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-[var(--color-bg-alt)] border border-[var(--color-glass-border-hover)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between bg-[var(--color-surface)] sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#28ada4]/10 text-[#28ada4] border border-[#28ada4]/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-extrabold text-base text-[var(--text-main)]">
                      {editingContactId ? 'Edit Directory Contact' : 'Register Directory Contact'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Add designated person ashore, superintendent, or management representative.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--color-glass-border)] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveContactSubmit} className="p-6 space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Contact Full Name <span className="text-[#28ada4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capt. Antonio Vance"
                    value={cpFullName}
                    onChange={(e) => setCpFullName(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Position & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Position / Title <span className="text-[#28ada4]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Designated Person Ashore (DPA)"
                      value={cpPosition}
                      onChange={(e) => setCpPosition(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Operating Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mozambique"
                      value={cpCountry}
                      onChange={(e) => setCpCountry(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. dpa@mozukmarine.com"
                      value={cpEmail}
                      onChange={(e) => setCpEmail(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--text-main)] font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +258 84 300 9988"
                      value={cpPhoneNumber}
                      onChange={(e) => setCpPhoneNumber(e.target.value)}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                    />
                  </div>
                </div>

                {/* Responsibilities / Notes */}
                <div>
                  <label className="block text-[var(--text-main)] font-bold mb-1">
                    Responsibilities / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 24/7 Designated Person Ashore for emergency response..."
                    value={cpDescription}
                    onChange={(e) => setCpDescription(e.target.value)}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[#28ada4]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-full btn-mozuk-secondary font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full btn-mozuk-primary font-bold text-xs shadow-md cursor-pointer"
                  >
                    {editingContactId ? 'Save Changes' : 'Register Contact'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
