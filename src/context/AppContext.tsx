import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Franchise,
  Customer,
  Lead,
  FollowUp,
  Project,
  SiteSurvey,
  Quotation,
  Payment,
  Product,
  Announcement,
  NotificationItem,
  GuideStep,
  AuditLog,
  ProjectStatus,
  LeadStatus,
  UserStatus,
  QuotationStatus,
  ThemeMode,
  PMSuryaGharCustomerRecord,
  SalesLocationLog,
  SalesRepLiveStatus,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveStatus,
  FieldExpenseClaim,
  SupportTicket,
  SupportTicketStatus,
  FuelRecord
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FRANCHISES,
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_FOLLOWUPS,
  INITIAL_PROJECTS,
  INITIAL_SITE_SURVEYS,
  INITIAL_QUOTATIONS,
  INITIAL_PAYMENTS,
  INITIAL_PRODUCTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_GUIDES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_FUEL_RECORDS
} from '../data/mockData';
import { INITIAL_PM_SURYA_GHAR_RECORDS } from '../data/pmSuryaGharMockData';
import { INITIAL_SALES_LOCATION_LOGS, INITIAL_SALES_LIVE_STATUS } from '../data/salesLocationMockData';
import {
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_EXPENSE_CLAIMS
} from '../data/hrmsMockData';

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string, otp?: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  allUsers: User[];
  allFranchises: Franchise[];
  isSuperAdmin: boolean;
  isFranchiseOwner: boolean;
  selectedAdminFranchiseFilter: string; // 'all' or specific franchiseId
  setSelectedAdminFranchiseFilter: (id: string) => void;

  // View Mode: 'desktop' | 'mobile_frame'
  deviceFrame: 'mobile' | 'tablet' | 'desktop';
  setDeviceFrame: (mode: 'mobile' | 'tablet' | 'desktop') => void;

  // Theme & Appearance (User-specific)
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Data Collections (Filtered by tenant)
  franchises: Franchise[];
  customers: Customer[];
  leads: Lead[];
  followUps: FollowUp[];
  projects: Project[];
  siteSurveys: SiteSurvey[];
  quotations: Quotation[];
  payments: Payment[];
  products: Product[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  guides: GuideStep[];
  auditLogs: AuditLog[];

  // Network & Sync status
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  pendingSyncCount: number;

  // App Guide Tour
  showFirstLaunchGuide: boolean;
  setShowFirstLaunchGuide: (show: boolean) => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;

  // PM Surya Ghar Yojana
  pmSuryaGharRecords: PMSuryaGharCustomerRecord[];
  addPMSuryaGharRecord: (record: Omit<PMSuryaGharCustomerRecord, 'id' | 'createdAt' | 'updatedAt'>) => PMSuryaGharCustomerRecord;
  updatePMSuryaGharRecord: (id: string, updates: Partial<PMSuryaGharCustomerRecord>) => void;
  deletePMSuryaGharRecord: (id: string) => void;

  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'createdAt'>) => FollowUp;
  completeFollowUp: (followUpId: string) => void;
  rescheduleFollowUp: (followUpId: string, newDate: string, newTime: string) => void;

  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;

  addSiteSurvey: (survey: Omit<SiteSurvey, 'id'>) => SiteSurvey;
  updateSiteSurvey: (surveyId: string, updates: Partial<SiteSurvey>) => void;

  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;
  updateQuotationStatus: (quotationId: string, status: QuotationStatus) => void;

  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNo'>) => Payment;

  addFranchise: (franchise: Omit<Franchise, 'id'>) => Franchise;
  updateFranchise: (franchiseId: string, updates: Partial<Franchise>) => void;
  deleteFranchise: (franchiseId: string) => void;

  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  updateUserStatus: (userId: string, status: UserStatus) => void;
  deleteUser: (userId: string) => void;

  // HRMS & Attendance System
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  expenseClaims: FieldExpenseClaim[];
  filteredAttendanceRecords: AttendanceRecord[];
  filteredLeaveRequests: LeaveRequest[];
  filteredExpenseClaims: FieldExpenseClaim[];
  punchIn: (punchData: Partial<AttendanceRecord>) => AttendanceRecord;
  punchOut: (attendanceId: string, checkoutData?: Partial<AttendanceRecord>) => void;
  updateAttendanceStatus: (attendanceId: string, status: AttendanceStatus) => void;
  applyLeave: (leaveData: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => LeaveRequest;
  updateLeaveStatus: (leaveId: string, status: LeaveStatus, remarks?: string) => void;
  submitExpenseClaim: (claimData: Omit<FieldExpenseClaim, 'id' | 'status'>) => FieldExpenseClaim;
  updateExpenseClaimStatus: (claimId: string, status: 'APPROVED' | 'REJECTED', approvedAmount?: number, remarks?: string) => void;

  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Announcement;
  markNotificationAsRead: (notificationId: string) => void;

  addGuide: (guide: Omit<GuideStep, 'id'>) => GuideStep;
  updateGuide: (guideId: string, updates: Partial<GuideStep>) => void;
  deleteGuide: (guideId: string) => void;

  addAuditLog: (action: string, recordType: string, recordId: string, details: string) => void;
  
  quotationDefaults: {
    systemTypes: string[];
    specifications: { part: string; make: string; spec: string }[];
    clientScope: string[];
    terms: string[];
  };
  updateQuotationDefaults: (defaults: Partial<AppContextType['quotationDefaults']>) => void;

  // Sales Personnel GPS & Location History Tracking (Super Admin & Managers)
  salesLocationLogs: SalesLocationLog[];
  salesRepLiveStatus: SalesRepLiveStatus[];
  filteredSalesLocationLogs: SalesLocationLog[];
  filteredSalesRepLiveStatus: SalesRepLiveStatus[];
  addSalesLocationLog: (log: Omit<SalesLocationLog, 'id' | 'timestamp' | 'timeFormatted' | 'date'>) => SalesLocationLog;
  updateSalesRepLiveStatus: (statusUpdates: Partial<SalesRepLiveStatus> & { userId: string }) => void;
  pingSalesRepGPS: (userId: string) => void;

  // Support Ticket System (Section 13)
  supportTickets: SupportTicket[];
  filteredSupportTickets: SupportTicket[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => SupportTicket;
  updateSupportTicketStatus: (
    ticketId: string,
    status: SupportTicketStatus,
    resolutionNotes?: string,
    assignedToName?: string
  ) => void;

  // Simple Fuel Support Records (Section 10)
  fuelRecords: FuelRecord[];
  filteredFuelRecords: FuelRecord[];
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt'>) => FuelRecord;
  deleteFuelRecord: (id: string) => void;

  // Helpers
  switchUserRole: (userId: string) => void;
  isUserSuspended: (user: User) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'acs_solar_v1_';

function loadStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return defaultValue;
  }
}

function saveStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users and Auth
  const [allUsers, setAllUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = loadStored<User | null>('currentUser', null);
    return stored || INITIAL_USERS[1]; // Default to Franchise Owner: Rajesh Patil (Mumbai West)
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadStored('isAuthenticated', true);
  });

  // Franchises
  const [allFranchises, setAllFranchises] = useState<Franchise[]>(() => loadStored('franchises', INITIAL_FRANCHISES));
  const [selectedAdminFranchiseFilter, setSelectedAdminFranchiseFilter] = useState<string>('all');

  // Device Frame Mode: Default to desktop/expanded view with 1-click mobile toggle
  const [deviceFrame, setDeviceFrameState] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    return loadStored<'mobile' | 'tablet' | 'desktop'>('deviceFrame', 'desktop');
  });

  const setDeviceFrame = (mode: 'mobile' | 'tablet' | 'desktop') => {
    setDeviceFrameState(mode);
    saveStored('deviceFrame', mode);
  };

  // Business Data
  const [customers, setCustomers] = useState<Customer[]>(() => loadStored('customers', INITIAL_CUSTOMERS));
  const [leads, setLeads] = useState<Lead[]>(() => loadStored('leads', INITIAL_LEADS));
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => loadStored('followups', INITIAL_FOLLOWUPS));
  const [projects, setProjects] = useState<Project[]>(() => loadStored('projects', INITIAL_PROJECTS));
  const [siteSurveys, setSiteSurveys] = useState<SiteSurvey[]>(() => loadStored('surveys', INITIAL_SITE_SURVEYS));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadStored('quotations', INITIAL_QUOTATIONS));
  const [payments, setPayments] = useState<Payment[]>(() => loadStored('payments', INITIAL_PAYMENTS));
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadStored('announcements', INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [guides, setGuides] = useState<GuideStep[]>(() => loadStored('guides', INITIAL_GUIDES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStored('auditLogs', INITIAL_AUDIT_LOGS));
  const [pmSuryaGharRecords, setPmSuryaGharRecords] = useState<PMSuryaGharCustomerRecord[]>(() =>
    loadStored('pmSuryaGharRecords', INITIAL_PM_SURYA_GHAR_RECORDS)
  );

  // Sales Personnel GPS & Location History State
  const [salesLocationLogs, setSalesLocationLogs] = useState<SalesLocationLog[]>(() =>
    loadStored('salesLocationLogs', INITIAL_SALES_LOCATION_LOGS)
  );
  const [salesRepLiveStatus, setSalesRepLiveStatus] = useState<SalesRepLiveStatus[]>(() =>
    loadStored('salesRepLiveStatus', INITIAL_SALES_LIVE_STATUS)
  );

  // HRMS & Attendance System State
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadStored('attendanceRecords', INITIAL_ATTENDANCE_RECORDS)
  );
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() =>
    loadStored('leaveRequests', INITIAL_LEAVE_REQUESTS)
  );
  const [expenseClaims, setExpenseClaims] = useState<FieldExpenseClaim[]>(() =>
    loadStored('expenseClaims', INITIAL_EXPENSE_CLAIMS)
  );

  // Support Tickets System (Section 13)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadStored('supportTickets', INITIAL_SUPPORT_TICKETS)
  );

  // Simple Fuel Support Records (Section 10)
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(() =>
    loadStored('fuelRecords', INITIAL_FUEL_RECORDS)
  );

  useEffect(() => {
    saveStored('attendanceRecords', attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    saveStored('leaveRequests', leaveRequests);
  }, [leaveRequests]);

  useEffect(() => {
    saveStored('expenseClaims', expenseClaims);
  }, [expenseClaims]);

  useEffect(() => {
    saveStored('supportTickets', supportTickets);
  }, [supportTickets]);

  useEffect(() => {
    saveStored('fuelRecords', fuelRecords);
  }, [fuelRecords]);

  useEffect(() => {
    saveStored('salesLocationLogs', salesLocationLogs);
  }, [salesLocationLogs]);

  useEffect(() => {
    saveStored('salesRepLiveStatus', salesRepLiveStatus);
  }, [salesRepLiveStatus]);

  const [quotationDefaults, setQuotationDefaults] = useState(() => loadStored('quotationDefaults', {
    systemTypes: ['On-Grid', 'Off-Grid', 'Hybrid'],
    specifications: [
      { part: 'Solar Inverter', make: 'Growatt/ Ksolare or Similar', spec: 'Efficient Power Generation.' },
      { part: 'DC Wire/ AC Wire', make: 'Polycab/ Finolex or Reputed', spec: 'Longer Life' },
      { part: 'Structure', make: 'Galvanized GI', spec: 'Long life & Stability' },
      { part: 'Lightening Arrester,Earthing Pit', make: 'As per MNRE Standard', spec: 'As per operator recommended' },
      { part: 'BOS,PVC Pipe', make: 'As per MNRE Standard', spec: 'As per site requirement' }
    ],
    clientScope: [
      'Shifting of Meter to the nearest point of solar installation.',
      'Provide all the papers and documentation required for Net Metering.',
      'Provide a suitable and secure space for storage of equipment and materials.',
      'Permission & approval for Net-Metering.',
      'Net metering charges to be paid as per actual to electricity operator.',
      'Facilitate access of work crew to the work site 7 days a week.',
      'Facilitate interfacing with the client\'s resident engineering staff for consultation as needed.',
      'Provision of water during cleaning of solar panels.',
      'Providing labor manpower at the site.',
      'Additional ladder to access the roof.',
      'Core cutting if the earthing location has RCC surface.'
    ],
    terms: [
      '80% advance order booking',
      '20% after installation'
    ]
  }));

  const updateQuotationDefaults = (defaults: Partial<AppContextType['quotationDefaults']>) => {
    setQuotationDefaults(prev => ({ ...prev, ...defaults }));
  };

  // Sync / Offline status
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [showFirstLaunchGuide, setShowFirstLaunchGuide] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => saveStored('users', allUsers), [allUsers]);
  useEffect(() => saveStored('currentUser', currentUser), [currentUser]);
  useEffect(() => saveStored('isAuthenticated', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveStored('franchises', allFranchises), [allFranchises]);
  useEffect(() => saveStored('customers', customers), [customers]);
  useEffect(() => saveStored('leads', leads), [leads]);
  useEffect(() => saveStored('followups', followUps), [followUps]);
  useEffect(() => saveStored('projects', projects), [projects]);
  useEffect(() => saveStored('surveys', siteSurveys), [siteSurveys]);
  useEffect(() => saveStored('quotations', quotations), [quotations]);
  useEffect(() => saveStored('payments', payments), [payments]);
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('announcements', announcements), [announcements]);
  useEffect(() => saveStored('notifications', notifications), [notifications]);
  useEffect(() => saveStored('guides', guides), [guides]);
  useEffect(() => saveStored('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveStored('pmSuryaGharRecords', pmSuryaGharRecords), [pmSuryaGharRecords]);
  useEffect(() => saveStored('quotationDefaults', quotationDefaults), [quotationDefaults]);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isFranchiseOwner = currentUser.role === 'FRANCHISE_OWNER';

  // Audit logger helper
  const addAuditLog = (action: string, recordType: string, recordId: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      user: currentUser.name,
      userRole: currentUser.role,
      action,
      franchiseId: currentUser.franchiseId,
      franchiseName: currentUser.franchiseName || 'ACS Solar',
      recordType,
      recordId,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '103.21.144.' + Math.floor(Math.random() * 200 + 10)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // User-specific Theme Preference
  const getUserTheme = (user: User | null): ThemeMode => {
    if (!user) return 'dark';
    if (user.theme) return user.theme;
    const stored = loadStored<ThemeMode | null>(`theme_${user.id}`, null);
    return stored || 'dark';
  };

  const [theme, setThemeState] = useState<ThemeMode>(() => getUserTheme(currentUser));

  // When currentUser changes, synchronize theme to active user's saved preference
  useEffect(() => {
    if (currentUser) {
      const userTheme = getUserTheme(currentUser);
      setThemeState(userTheme);
    }
  }, [currentUser?.id]);

  // Synchronize theme with DOM root and document.body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (currentUser) {
      // 1. Save in user-specific localStorage key
      saveStored(`theme_${currentUser.id}`, newTheme);
      // 2. Update currentUser in state & storage
      const updatedUser: User = { ...currentUser, theme: newTheme };
      setCurrentUser(updatedUser);
      saveStored('currentUser', updatedUser);
      // 3. Update allUsers in state & storage
      setAllUsers(prev => {
        const updated = prev.map(u => (u.id === currentUser.id ? { ...u, theme: newTheme } : u));
        saveStored('users', updated);
        return updated;
      });
      addAuditLog('THEME_PREFERENCE_CHANGED', 'User', currentUser.id, `Theme preference updated to ${newTheme.toUpperCase()} mode for ${currentUser.name}`);
    }
  };

  // Consistency sync: ensure all users belonging to a Suspended franchise have their status marked suspended
  useEffect(() => {
    const suspendedFranchiseIds = new Set(
      allFranchises
        .filter(f => f.status === 'Suspended')
        .flatMap(f => [f.id, f.franchiseCode])
        .filter(Boolean)
    );

    if (suspendedFranchiseIds.size > 0) {
      let changed = false;
      const syncedUsers = allUsers.map(u => {
        if (u.role !== 'SUPER_ADMIN' && suspendedFranchiseIds.has(u.franchiseId)) {
          if (u.status === 'active') {
            changed = true;
            return { ...u, status: 'suspended' as const };
          }
        }
        return u;
      });

      if (changed) {
        setAllUsers(syncedUsers);
        saveStored('users', syncedUsers);
        if (currentUser && suspendedFranchiseIds.has(currentUser.franchiseId) && currentUser.status === 'active') {
          const updatedCur = { ...currentUser, status: 'suspended' as const };
          setCurrentUser(updatedCur);
          saveStored('currentUser', updatedCur);
        }
      }
    }
  }, [allFranchises]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Helper to determine if user or their franchise is suspended
  const isUserSuspended = (u: User): boolean => {
    if (u.status === 'suspended') return true;
    if (u.status === 'disabled') return true;
    if (u.role === 'SUPER_ADMIN') return false;
    const linkedFranchise = allFranchises.find(
      f => f.id === u.franchiseId || f.franchiseCode === u.franchiseId
    );
    return linkedFranchise?.status === 'Suspended';
  };

  // Switch User
  const switchUserRole = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      const isSuspended = isUserSuspended(user);
      if (isSuspended || user.status === 'disabled') {
        const reason = user.status === 'disabled'
          ? `User account ${user.name} is disabled by Headquarters.`
          : `Franchise Owner ID / Account for ${user.name} is SUSPENDED by Headquarters.`;
        setNotifications(prev => [
          {
            id: `NOTIF-${Date.now()}`,
            title: 'Access Restricted - ID Suspended',
            message: `${reason} Access denied.`,
            type: 'Admin Announcement',
            isRead: false,
            createdAt: 'Just now',
            link: 'users'
          },
          ...prev
        ]);
        addAuditLog('Login Denied', 'User', user.id, `Denied access attempt for suspended/disabled user ${user.name}`);
        return;
      }
      setCurrentUser(user);
      setIsAuthenticated(true);
      saveStored('currentUser', user);
      saveStored('isAuthenticated', true);
      // Auto adjust device frame for convenience
      if (user.role === 'SUPER_ADMIN') {
        setDeviceFrame('desktop');
      } else {
        setDeviceFrame('mobile');
      }
      addAuditLog('User Session Switched', 'User', user.id, `Switched view to ${user.name} (${user.role})`);
    }
  };

  // Dedicated Login method for all users
  const login = (identifier: string, password?: string, otp?: string): { success: boolean; error?: string; user?: User } => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter your email or mobile number.' };
    }

    const cleanDigits = trimmed.replace(/\D/g, '');
    const user = allUsers.find(u => {
      const userEmail = u.email.toLowerCase();
      const userDigits = u.mobile.replace(/\D/g, '');
      return (
        userEmail === trimmed ||
        (cleanDigits.length >= 8 && userDigits.includes(cleanDigits)) ||
        u.id.toLowerCase() === trimmed ||
        u.name.toLowerCase() === trimmed
      );
    });

    if (!user) {
      return { success: false, error: 'No user account found matching this Email or Mobile.' };
    }

    // Check if user or their franchise is suspended or disabled
    const userIsSuspended = isUserSuspended(user);
    if (userIsSuspended || user.status === 'disabled') {
      const reason = user.status === 'disabled'
        ? `Account for ${user.name} is disabled by Headquarters.`
        : `Franchise Owner / User ID for ${user.name} is SUSPENDED by Headquarters (${user.franchiseName || user.franchiseId}).`;
      addAuditLog('Login Blocked', 'User', user.id, `Blocked login for suspended user/franchise: ${user.name}`);
      return { success: false, error: `${reason} Access restricted.` };
    }

    // Check OTP or Password
    if (otp !== undefined) {
      if (!otp.trim() || otp.trim().length < 4) {
        return { success: false, error: 'Please enter a valid 4-digit verification code.' };
      }
    } else if (password !== undefined) {
      const expectedPass = user.password || (user.role === 'SUPER_ADMIN' ? 'admin' : 'solar');
      const p = password.trim();
      if (p && p !== expectedPass && p !== 'solar' && p !== 'admin' && p !== 'solar123' && p !== 'admin123') {
        return { success: false, error: 'Incorrect password. (Default demo password is "solar" or "admin")' };
      }
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    saveStored('currentUser', user);
    saveStored('isAuthenticated', true);

    if (user.role === 'SUPER_ADMIN') {
      setDeviceFrame('desktop');
    }

    addAuditLog('User Logged In', 'User', user.id, `User ${user.name} (${user.role}) logged in successfully`);

    return { success: true, user };
  };

  // Dedicated Logout method for all users
  const logout = () => {
    if (currentUser) {
      addAuditLog('User Logged Out', 'User', currentUser.id, `User ${currentUser.name} signed out`);
    }
    setIsAuthenticated(false);
    saveStored('isAuthenticated', false);
  };

  // MULTI-TENANT FILTERING
  // For Super Admin: Can view all OR filter by selectedAdminFranchiseFilter
  // For Franchise users: Strictly filtered to currentUser.franchiseId
  const filterByTenant = <T extends { franchiseId: string }>(items: T[]): T[] => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return items;
      return items.filter(item => item.franchiseId === selectedAdminFranchiseFilter);
    }
    return items.filter(item => item.franchiseId === currentUser.franchiseId);
  };

  const filteredCustomers = useMemo(() => filterByTenant(customers), [customers, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredLeads = useMemo(() => filterByTenant(leads), [leads, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredFollowUps = useMemo(() => filterByTenant(followUps), [followUps, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredProjects = useMemo(() => filterByTenant(projects), [projects, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredSiteSurveys = useMemo(() => filterByTenant(siteSurveys), [siteSurveys, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredQuotations = useMemo(() => filterByTenant(quotations), [quotations, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredPayments = useMemo(() => filterByTenant(payments), [payments, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);
  const filteredPMSuryaGharRecords = useMemo(() => filterByTenant(pmSuryaGharRecords), [pmSuryaGharRecords, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);

  // Sales Personnel GPS & Location History filtering (Super Admin can see all or by franchise downline)
  const filteredSalesLocationLogs = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return salesLocationLogs;
      return salesLocationLogs.filter(log => log.franchiseId === selectedAdminFranchiseFilter);
    }
    return salesLocationLogs.filter(log => log.franchiseId === currentUser.franchiseId);
  }, [salesLocationLogs, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);

  const filteredSalesRepLiveStatus = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return salesRepLiveStatus;
      return salesRepLiveStatus.filter(rep => rep.franchiseId === selectedAdminFranchiseFilter);
    }
    return salesRepLiveStatus.filter(rep => rep.franchiseId === currentUser.franchiseId);
  }, [salesRepLiveStatus, currentUser, isSuperAdmin, selectedAdminFranchiseFilter]);

  // HRMS Filtering: Super Admin sees all or by franchise; Franchise Owner sees franchise team; Staff sees self
  const filteredAttendanceRecords = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return attendanceRecords;
      return attendanceRecords.filter(att => att.franchiseId === selectedAdminFranchiseFilter);
    }
    if (isFranchiseOwner) {
      return attendanceRecords.filter(att => att.franchiseId === currentUser.franchiseId);
    }
    return attendanceRecords.filter(att => att.userId === currentUser.id);
  }, [attendanceRecords, currentUser, isSuperAdmin, isFranchiseOwner, selectedAdminFranchiseFilter]);

  const filteredLeaveRequests = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return leaveRequests;
      return leaveRequests.filter(lv => lv.franchiseId === selectedAdminFranchiseFilter);
    }
    if (isFranchiseOwner) {
      return leaveRequests.filter(lv => lv.franchiseId === currentUser.franchiseId);
    }
    return leaveRequests.filter(lv => lv.userId === currentUser.id);
  }, [leaveRequests, currentUser, isSuperAdmin, isFranchiseOwner, selectedAdminFranchiseFilter]);

  const filteredExpenseClaims = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return expenseClaims;
      return expenseClaims.filter(exp => exp.franchiseId === selectedAdminFranchiseFilter);
    }
    if (isFranchiseOwner) {
      return expenseClaims.filter(exp => exp.franchiseId === currentUser.franchiseId);
    }
    return expenseClaims.filter(exp => exp.userId === currentUser.id);
  }, [expenseClaims, currentUser, isSuperAdmin, isFranchiseOwner, selectedAdminFranchiseFilter]);

  // Support Tickets Filtering: Super Admin sees all or by franchise; Franchise Owner sees their franchise tickets; Staff sees theirs
  const filteredSupportTickets = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return supportTickets;
      return supportTickets.filter(t => t.franchiseId === selectedAdminFranchiseFilter);
    }
    if (isFranchiseOwner) {
      return supportTickets.filter(t => t.franchiseId === currentUser.franchiseId);
    }
    return supportTickets.filter(t => t.createdByUserId === currentUser.id || t.franchiseId === currentUser.franchiseId);
  }, [supportTickets, currentUser, isSuperAdmin, isFranchiseOwner, selectedAdminFranchiseFilter]);

  // Fuel Records Filtering: Super Admin sees all or by franchise; Franchise Owner sees their franchise fuel records; Staff sees theirs
  const filteredFuelRecords = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedAdminFranchiseFilter === 'all') return fuelRecords;
      return fuelRecords.filter(f => f.franchiseId === selectedAdminFranchiseFilter);
    }
    if (isFranchiseOwner) {
      return fuelRecords.filter(f => f.franchiseId === currentUser.franchiseId);
    }
    return fuelRecords.filter(f => f.userId === currentUser.id || f.franchiseId === currentUser.franchiseId);
  }, [fuelRecords, currentUser, isSuperAdmin, isFranchiseOwner, selectedAdminFranchiseFilter]);

  // Notifications filtering: Super Admin sees all or system; users see their franchise or target
  const filteredNotifications = useMemo(() => {
    if (isSuperAdmin) return notifications;
    return notifications.filter(
      n => !n.franchiseId || n.franchiseId === currentUser.franchiseId || n.targetUserId === currentUser.id
    );
  }, [notifications, currentUser, isSuperAdmin]);

  // Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    if (isOffline) setPendingSyncCount(c => c + 1);

    addAuditLog('Lead Created', 'Lead', newLead.id, `New lead added: ${newLead.customerName} (${newLead.systemCapacity})`);

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Lead Added',
      message: `${newLead.customerName} looking for ${newLead.systemCapacity} (${newLead.propertyType})`,
      type: 'New Lead',
      franchiseId: newLead.franchiseId,
      isRead: false,
      createdAt: 'Just now',
      link: 'crm'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    const targetLead = leads.find(l => l.id === leadId);
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString().split('T')[0] } : l))
    );
    addAuditLog('Lead Status Updated', 'Lead', leadId, `Status updated to ${status}`);

    // Feature 6 requirement: Once converted into Won Project, create project automatically
    if (status === 'Won' && targetLead) {
      const alreadyHasProject = projects.some(
        p => (targetLead.name && p.customerName.toLowerCase() === (targetLead.name || '').toLowerCase()) ||
             (targetLead.customerName && p.customerName.toLowerCase() === (targetLead.customerName || '').toLowerCase())
      );
      if (!alreadyHasProject) {
        const capKw = targetLead.expectedCapacityKW || (targetLead.systemCapacity ? parseFloat(targetLead.systemCapacity) : 5) || 5;
        const estValue = targetLead.electricityBillMonthly ? targetLead.electricityBillMonthly * 24 : capKw * 65000;
        addProject({
          projectName: `${targetLead.name || targetLead.customerName || 'Solar Customer'} - ${capKw}kW EPC Project`,
          customerId: `CUST-${targetLead.id}`,
          customerName: targetLead.name || targetLead.customerName || 'Solar Customer',
          customerMobile: targetLead.mobile,
          customerAddress: `${targetLead.city || ''}, ${targetLead.state || ''}`,
          franchiseId: targetLead.franchiseId || currentUser.franchiseId || 'ACS-MH-01',
          franchiseName: currentUser.franchiseName || 'ACS Solar Territory',
          systemCapacity: `${capKw} kW`,
          systemCapacityKW: capKw,
          finalAmount: estValue,
          pendingAmount: estValue,
          status: 'Booking Confirmed',
          notes: `Auto-generated EPC Project from Won Lead #${targetLead.id}. Stage 1: Booking Confirmed.`
        });
      }
    }
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : l))
    );
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addAuditLog('Customer Created', 'Customer', newCustomer.id, `Created customer ${newCustomer.name}`);
    return newCustomer;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c))
    );
  };

  const addPMSuryaGharRecord = (
    data: Omit<PMSuryaGharCustomerRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): PMSuryaGharCustomerRecord => {
    const newRecord: PMSuryaGharCustomerRecord = {
      ...data,
      id: `PMSG-2026-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPmSuryaGharRecords(prev => [newRecord, ...prev]);

    // Check if existing customer matches by mobile or exact name
    const matchedCustomer = customers.find(
      c => (c.mobile && (c.mobile === newRecord.mobile || c.phone === newRecord.mobile)) ||
           c.name.toLowerCase() === newRecord.consumerName.toLowerCase()
    );

    if (matchedCustomer) {
      updateCustomer(matchedCustomer.id, {
        isPMSuryaGhar: true,
        pmSuryaGharId: newRecord.id,
        pmSuryaGharData: newRecord,
        customerStatus: 'Active Customer',
        address: newRecord.address || matchedCustomer.address,
        pincode: newRecord.pincode || matchedCustomer.pincode
      });
    } else {
      const createdCust = addCustomer({
        name: newRecord.consumerName,
        franchiseId: newRecord.franchiseId || currentUser.franchiseId || 'ACS-MH-01',
        phone: newRecord.mobile,
        mobile: newRecord.mobile,
        alternatePhone: newRecord.alternateMobile,
        alternateMobile: newRecord.alternateMobile,
        email: newRecord.email,
        address: newRecord.address,
        city: newRecord.city,
        state: newRecord.state,
        pincode: newRecord.pincode,
        propertyType: 'Residential',
        customerStatus: 'Active Customer',
        isPMSuryaGhar: true,
        pmSuryaGharId: newRecord.id,
        pmSuryaGharData: newRecord,
        notes: `PM Surya Ghar application: CA #${newRecord.consumerNumber}, ${newRecord.proposedCapacityKW}kW solar, Geotag: ${newRecord.geotag?.latitude?.toFixed(4)}, ${newRecord.geotag?.longitude?.toFixed(4)}`
      });
      newRecord.customerId = createdCust.id;
    }

    addAuditLog(
      'PM Surya Ghar Record Uploaded',
      'PMSuryaGhar',
      newRecord.id,
      `Uploaded PM Surya Ghar application for ${newRecord.consumerName} (${newRecord.proposedCapacityKW}kW, CA #${newRecord.consumerNumber}) with verified Geotag and South-facing site video.`
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'PM Surya Ghar Customer Uploaded',
      message: `${newRecord.consumerName} (${newRecord.proposedCapacityKW}kW) details, Aadhaar, Bill, South-facing video & GPS Geotag registered successfully.`,
      createdAt: 'Just now',
      isRead: false,
      type: 'Admin Announcement',
      franchiseId: newRecord.franchiseId,
      link: 'customers'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newRecord;
  };

  const updatePMSuryaGharRecord = (id: string, updates: Partial<PMSuryaGharCustomerRecord>) => {
    setPmSuryaGharRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : r))
    );
    addAuditLog('PM Surya Ghar Record Updated', 'PMSuryaGhar', id, 'Updated record details');
  };

  const deletePMSuryaGharRecord = (id: string) => {
    setPmSuryaGharRecords(prev => prev.filter(r => r.id !== id));
    addAuditLog('PM Surya Ghar Record Deleted', 'PMSuryaGhar', id, 'Deleted record');
  };

  const addFollowUp = (followUpData: Omit<FollowUp, 'id' | 'createdAt'>) => {
    const newFollowUp: FollowUp = {
      ...followUpData,
      id: `FLP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    addAuditLog('Follow-up Scheduled', 'FollowUp', newFollowUp.id, `Scheduled follow-up with ${newFollowUp.customerName}`);
    return newFollowUp;
  };

  const completeFollowUp = (followUpId: string) => {
    setFollowUps(prev =>
      prev.map(f => (f.id === followUpId ? { ...f, status: 'Completed' } : f))
    );
    addAuditLog('Follow-up Completed', 'FollowUp', followUpId, 'Marked as completed');
  };

  const rescheduleFollowUp = (followUpId: string, newDate: string, newTime: string) => {
    setFollowUps(prev =>
      prev.map(f => (f.id === followUpId ? { ...f, date: newDate, time: newTime, status: 'Upcoming' } : f))
    );
    addAuditLog('Follow-up Rescheduled', 'FollowUp', followUpId, `Rescheduled to ${newDate} at ${newTime}`);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `PRJ-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    addAuditLog('Project Created', 'Project', newProject.id, `Created solar project for ${newProject.customerName}`);
    return newProject;
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status } : p))
    );
    addAuditLog('Project Status Changed', 'Project', projectId, `Status changed to ${status}`);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Project Status Updated',
      message: `Project ${projectId} moved to ${status}`,
      type: 'Project Updated',
      isRead: false,
      createdAt: 'Just now',
      link: 'projects'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, ...updates } : p))
    );
    addAuditLog('Project Updated', 'Project', projectId, `Updated project details`);
  };

  const addSiteSurvey = (surveyData: Omit<SiteSurvey, 'id'>) => {
    const newSurvey: SiteSurvey = {
      ...surveyData,
      id: `SRV-${Date.now().toString().slice(-4)}`
    };
    setSiteSurveys(prev => [newSurvey, ...prev]);
    addAuditLog('Site Survey Conducted', 'SiteSurvey', newSurvey.id, `Completed survey for ${newSurvey.customerName}`);
    return newSurvey;
  };

  const updateSiteSurvey = (surveyId: string, updates: Partial<SiteSurvey>) => {
    setSiteSurveys(prev =>
      prev.map(s => (s.id === surveyId ? { ...s, ...updates } : s))
    );
  };

  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt'>) => {
    const newQuotation: Quotation = {
      ...quotationData,
      id: `QT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotations(prev => [newQuotation, ...prev]);
    addAuditLog('Quotation Generated', 'Quotation', newQuotation.quotationNo || newQuotation.quotationNumber || newQuotation.id, `Created quote for ${newQuotation.customerName}: ₹${newQuotation.finalAmount.toLocaleString('en-IN')}`);
    return newQuotation;
  };

  const updateQuotationStatus = (quotationId: string, status: QuotationStatus) => {
    setQuotations(prev =>
      prev.map(q => (q.id === quotationId ? { ...q, status } : q))
    );
    addAuditLog('Quotation Status Updated', 'Quotation', quotationId, `Quotation status updated to ${status}`);
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'createdAt' | 'receiptNo'>) => {
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY-${Date.now().toString().slice(-4)}`,
      receiptNo,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update project pending and advance amounts if linked
    if (newPayment.projectId) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id === newPayment.projectId) {
            const newAdvance = (p.advanceReceived || 0) + newPayment.amount;
            const newPending = Math.max(0, p.finalAmount - newAdvance);
            return {
              ...p,
              advanceReceived: newAdvance,
              pendingAmount: newPending
            };
          }
          return p;
        })
      );
    }

    addAuditLog('Payment Recorded', 'Payment', receiptNo, `Received ₹${newPayment.amount.toLocaleString('en-IN')} via ${newPayment.method}`);

    // Add notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Payment Received',
      message: `₹${newPayment.amount.toLocaleString('en-IN')} received for ${newPayment.projectTitle}`,
      type: 'Payment Received',
      franchiseId: newPayment.franchiseId,
      isRead: false,
      createdAt: 'Just now',
      link: 'payments'
    };
    setNotifications(prev => [notif, ...prev]);

    return newPayment;
  };

  const deleteFranchise = (franchiseId: string) => {
    const targetFranchise = allFranchises.find(f => f.id === franchiseId || f.franchiseCode === franchiseId);
    const targetName = targetFranchise?.franchiseName || franchiseId;

    setAllFranchises(prev => {
      const next = prev.filter(f => f.id !== franchiseId && f.franchiseCode !== franchiseId);
      saveStored('franchises', next);
      return next;
    });

    // Remove downline staff under this franchise
    setAllUsers(prev => {
      const next = prev.filter(u => u.franchiseId !== franchiseId && u.franchiseId !== targetFranchise?.franchiseCode);
      saveStored('users', next);
      return next;
    });

    addAuditLog(
      'Franchise Removed',
      'Franchise',
      franchiseId,
      `Super Admin removed franchise ${targetName} and decommissioned associated downline staff accounts.`
    );
  };

  // HRMS & Attendance System Implementation
  const punchIn = (punchData: Partial<AttendanceRecord>): AttendanceRecord => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userLayer: (currentUser.role === 'SUPER_ADMIN'
        ? 'SUPER_ADMIN'
        : currentUser.role === 'FRANCHISE_OWNER'
        ? 'FRANCHISE_OWNER'
        : currentUser.role === 'SITE_SURVEYOR' || currentUser.role === 'SALES_EXECUTIVE' || currentUser.role === 'INSTALLATION_TEAM' || currentUser.role === 'FIELD_VISIT_TEAM'
        ? 'FIELD_VISIT_TEAM'
        : 'OFFICE_SALES_TELECALLER') as any,
      userMobile: currentUser.mobile,
      profilePhoto: currentUser.profilePhoto,
      franchiseId: currentUser.franchiseId,
      franchiseName: currentUser.franchiseName || 'ACS Solar',
      date: todayStr,
      punchInTime: timeFormatted,
      status: (punchData.userRole === 'SITE_SURVEYOR' || currentUser.role === 'SITE_SURVEYOR' || currentUser.role === 'SALES_EXECUTIVE' || currentUser.role === 'FIELD_VISIT_TEAM')
        ? 'ON_FIELD'
        : 'PRESENT',
      punchType: punchData.punchType || (punchData.punchInLatitude ? 'MOBILE_GPS' : 'WEB_DESK'),
      totalWorkingHours: 0.1,
      totalBreakMinutes: 0,
      fieldVisitsCount: 0,
      distanceCoveredKm: 0,
      callsMadeCount: 0,
      leadsGeneratedCount: 0,
      ...punchData
    };

    setAttendanceRecords(prev => [newRecord, ...prev.filter(r => !(r.userId === currentUser.id && r.date === todayStr))]);

    addAuditLog(
      'Punch In Recorded',
      'Attendance',
      newRecord.id,
      `${currentUser.name} punched in at ${timeFormatted} (${newRecord.punchType}) ${newRecord.punchInAddress ? `- ${newRecord.punchInAddress}` : ''}`
    );

    return newRecord;
  };

  const punchOut = (attendanceId: string, checkoutData?: Partial<AttendanceRecord>) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setAttendanceRecords(prev =>
      prev.map(record => {
        if (record.id === attendanceId) {
          const workingHours = record.totalWorkingHours ? Math.max(record.totalWorkingHours, 7.5) : 8.0;
          return {
            ...record,
            punchOutTime: timeFormatted,
            totalWorkingHours: workingHours,
            ...checkoutData
          };
        }
        return record;
      })
    );

    addAuditLog(
      'Punch Out Recorded',
      'Attendance',
      attendanceId,
      `${currentUser.name} punched out at ${timeFormatted}`
    );
  };

  const updateAttendanceStatus = (attendanceId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev =>
      prev.map(record => (record.id === attendanceId ? { ...record, status } : record))
    );
    addAuditLog('Attendance Status Updated', 'Attendance', attendanceId, `Attendance record status changed to ${status}`);
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>): LeaveRequest => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `LV-${Date.now().toString().slice(-4)}`,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [newLeave, ...prev]);

    addAuditLog(
      'Leave Applied',
      'HRMS',
      newLeave.id,
      `${currentUser.name} submitted ${newLeave.leaveType.replace('_', ' ')} for ${newLeave.totalDays} day(s)`
    );

    return newLeave;
  };

  const updateLeaveStatus = (leaveId: string, status: LeaveStatus, remarks?: string) => {
    setLeaveRequests(prev =>
      prev.map(lv =>
        lv.id === leaveId
          ? {
              ...lv,
              status,
              reviewedBy: currentUser.name,
              reviewedOn: new Date().toISOString().split('T')[0],
              reviewRemarks: remarks
            }
          : lv
      )
    );

    addAuditLog(
      `Leave ${status}`,
      'HRMS',
      leaveId,
      `${currentUser.name} reviewed leave request: ${status}. Remarks: ${remarks || 'None'}`
    );
  };

  const submitExpenseClaim = (claimData: Omit<FieldExpenseClaim, 'id' | 'status'>): FieldExpenseClaim => {
    const newClaim: FieldExpenseClaim = {
      ...claimData,
      id: `EXP-${Date.now().toString().slice(-4)}`,
      status: 'PENDING'
    };
    setExpenseClaims(prev => [newClaim, ...prev]);

    addAuditLog(
      'Field Expense Claim Submitted',
      'HRMS',
      newClaim.id,
      `${currentUser.name} claimed ₹${newClaim.totalClaimAmount} for field travel (${newClaim.totalKm} km)`
    );

    return newClaim;
  };

  const updateExpenseClaimStatus = (
    claimId: string,
    status: 'APPROVED' | 'REJECTED',
    approvedAmount?: number,
    remarks?: string
  ) => {
    setExpenseClaims(prev =>
      prev.map(claim =>
        claim.id === claimId
          ? {
              ...claim,
              status,
              approvedAmount: approvedAmount !== undefined ? approvedAmount : claim.totalClaimAmount,
              reviewedBy: currentUser.name,
              reviewedOn: new Date().toISOString().split('T')[0],
              notes: remarks ? `${claim.notes || ''} | Review: ${remarks}` : claim.notes
            }
          : claim
      )
    );

    addAuditLog(
      `Expense Claim ${status}`,
      'HRMS',
      claimId,
      `${currentUser.name} marked expense claim as ${status}. Approved Amount: ₹${approvedAmount || 'Full'}`
    );
  };

  const addFranchise = (franchiseData: Omit<Franchise, 'id'>): Franchise => {
    const newFranchise: Franchise = {
      ...franchiseData,
      id: franchiseData.franchiseCode || `FRN-${Date.now().toString().slice(-4)}`
    };
    setAllFranchises(prev => {
      const next = [...prev, newFranchise];
      saveStored('franchises', next);
      return next;
    });
    addAuditLog('Franchise Added', 'Franchise', newFranchise.id, `Created franchise ${newFranchise.franchiseName} (${newFranchise.franchiseCode})`);
    return newFranchise;
  };

  const updateFranchise = (franchiseId: string, updates: Partial<Franchise>) => {
    let targetFranchiseCode = franchiseId;
    let targetFranchiseName = franchiseId;

    setAllFranchises(prev => {
      const next = prev.map(f => {
        if (f.id === franchiseId || f.franchiseCode === franchiseId) {
          targetFranchiseCode = f.franchiseCode || f.id;
          targetFranchiseName = f.franchiseName || f.id;
          return { ...f, ...updates };
        }
        return f;
      });
      saveStored('franchises', next);
      return next;
    });

    // If franchise status changed, cascade suspension or activation to all franchise users and owner
    if (updates.status !== undefined) {
      const newStatus = updates.status;
      setAllUsers(prev => {
        const nextUsers = prev.map(u => {
          if (
            u.role !== 'SUPER_ADMIN' &&
            (u.franchiseId === franchiseId || u.franchiseId === targetFranchiseCode)
          ) {
            let nextUserStatus: UserStatus = u.status;
            if (newStatus === 'Suspended') {
              nextUserStatus = 'suspended';
            } else if (newStatus === 'Active') {
              nextUserStatus = 'active';
            } else if (newStatus === 'Inactive') {
              nextUserStatus = 'inactive';
            }
            return {
              ...u,
              status: nextUserStatus
            };
          }
          return u;
        });
        saveStored('users', nextUsers);
        return nextUsers;
      });

      if (
        currentUser &&
        currentUser.role !== 'SUPER_ADMIN' &&
        (currentUser.franchiseId === franchiseId || currentUser.franchiseId === targetFranchiseCode)
      ) {
        const updatedCurrentUser: User = {
          ...currentUser,
          status: newStatus === 'Suspended' ? 'suspended' : newStatus === 'Active' ? 'active' : 'inactive'
        };
        setCurrentUser(updatedCurrentUser);
        saveStored('currentUser', updatedCurrentUser);
      }

      addAuditLog(
        newStatus === 'Suspended' ? 'Franchise ID Suspended' : 'Franchise Status Updated',
        'Franchise',
        franchiseId,
        `Franchise ${targetFranchiseName} status changed to ${newStatus}. All franchise owners and team member accounts set to ${newStatus === 'Suspended' ? 'SUSPENDED' : newStatus}.`
      );
    }

    // If area, territory, or DISCOM settings are updated, synchronize them to users in that franchise
    if (
      updates.state !== undefined ||
      updates.city !== undefined ||
      updates.district !== undefined ||
      updates.areaName !== undefined ||
      updates.assignedPincodes !== undefined ||
      updates.assignedDiscoms !== undefined ||
      updates.operatingRegion !== undefined
    ) {
      setAllUsers(prev => {
        const nextUsers = prev.map(u => {
          if (
            u.role !== 'SUPER_ADMIN' &&
            (u.franchiseId === franchiseId || u.franchiseId === targetFranchiseCode)
          ) {
            return {
              ...u,
              state: updates.state !== undefined ? updates.state : u.state,
              city: updates.city !== undefined ? updates.city : u.city,
              district: updates.district !== undefined ? updates.district : u.district,
              areaName: updates.areaName !== undefined ? updates.areaName : u.areaName,
              assignedPincodes: updates.assignedPincodes !== undefined ? updates.assignedPincodes : u.assignedPincodes,
              assignedDiscoms: updates.assignedDiscoms !== undefined ? updates.assignedDiscoms : u.assignedDiscoms,
              operatingRegion: updates.operatingRegion !== undefined ? updates.operatingRegion : u.operatingRegion
            };
          }
          return u;
        });
        saveStored('users', nextUsers);
        return nextUsers;
      });

      if (
        currentUser &&
        currentUser.role !== 'SUPER_ADMIN' &&
        (currentUser.franchiseId === franchiseId || currentUser.franchiseId === targetFranchiseCode)
      ) {
        const updatedUser: User = {
          ...currentUser,
          state: updates.state !== undefined ? updates.state : currentUser.state,
          city: updates.city !== undefined ? updates.city : currentUser.city,
          district: updates.district !== undefined ? updates.district : currentUser.district,
          areaName: updates.areaName !== undefined ? updates.areaName : currentUser.areaName,
          assignedPincodes: updates.assignedPincodes !== undefined ? updates.assignedPincodes : currentUser.assignedPincodes,
          assignedDiscoms: updates.assignedDiscoms !== undefined ? updates.assignedDiscoms : currentUser.assignedDiscoms,
          operatingRegion: updates.operatingRegion !== undefined ? updates.operatingRegion : currentUser.operatingRegion
        };
        setCurrentUser(updatedUser);
        saveStored('currentUser', updatedUser);
      }
    }

    addAuditLog('Franchise Updated', 'Franchise', franchiseId, `Franchise details & configuration updated`);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-4)}`
    };
    setAllUsers(prev => [...prev, newUser]);
    addAuditLog('User Created', 'User', newUser.id, `Created user ${newUser.name} with role ${newUser.role}`);
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => {
      const updated = prev.map(u => (u.id === userId ? { ...u, ...updates } : u));
      saveStored('users', updated);
      return updated;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser: User = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      saveStored('currentUser', updatedUser);

      // Keep franchise entity owner details in sync if franchise owner updates contact or name
      if (currentUser.franchiseId && (updates.name || updates.mobile || updates.email)) {
        setAllFranchises(prev => {
          const next = prev.map(f => {
            if (f.id === currentUser.franchiseId) {
              return {
                ...f,
                ownerName: updates.name || f.ownerName,
                ownerMobile: updates.mobile || f.ownerMobile,
                ownerEmail: updates.email || f.ownerEmail
              };
            }
            return f;
          });
          saveStored('franchises', next);
          return next;
        });
      }
    }
    addAuditLog('User Profile Updated', 'User', userId, `Updated details: ${Object.keys(updates).join(', ')}`);
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    updateUser(userId, updates);
  };

  const changePassword = (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    const expectedPass = user.password || (user.role === 'SUPER_ADMIN' ? 'admin' : 'solar');
    const currTrimmed = currentPassword.trim();
    if (!currTrimmed) {
      return { success: false, error: 'Please enter your current password.' };
    }

    // Validate current password (also support default demo master passwords 'solar' or 'admin')
    if (currTrimmed !== expectedPass && currTrimmed !== 'solar' && currTrimmed !== 'admin') {
      return {
        success: false,
        error: 'Current password is incorrect. (Default demo password is "solar" or "admin")'
      };
    }

    const newTrimmed = newPassword.trim();
    if (!newTrimmed || newTrimmed.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    if (newTrimmed === currTrimmed) {
      return { success: false, error: 'New password cannot be the same as your current password.' };
    }

    // Update in allUsers and currentUser
    setAllUsers(prev => {
      const updated = prev.map(u => (u.id === userId ? { ...u, password: newTrimmed } : u));
      saveStored('users', updated);
      return updated;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser: User = { ...currentUser, password: newTrimmed };
      setCurrentUser(updatedUser);
      saveStored('currentUser', updatedUser);
    }

    addAuditLog('Password Changed', 'User', userId, `Password successfully updated for user ${user.name}`);

    // Add security notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Security Notice: Password Updated',
      message: `Your account password was updated successfully. Please keep your new credentials secure.`,
      type: 'Admin Announcement',
      isRead: false,
      createdAt: 'Just now',
      link: 'more'
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true };
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    let affectedFranchiseId: string | undefined;
    let isFranchiseOwner = false;
    let targetUserName = '';

    setAllUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          targetUserName = u.name;
          if (u.role === 'FRANCHISE_OWNER') {
            isFranchiseOwner = true;
            affectedFranchiseId = u.franchiseId;
          }
          return { ...u, status };
        }
        return u;
      });
      saveStored('users', next);
      return next;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser: User = { ...currentUser, status };
      setCurrentUser(updatedUser);
      saveStored('currentUser', updatedUser);
    }

    // If a Franchise Owner ID status is updated, synchronize the franchise status!
    if (isFranchiseOwner && affectedFranchiseId) {
      if (status === 'suspended' || status === 'disabled') {
        setAllFranchises(prev => {
          const next = prev.map(f => {
            if (f.id === affectedFranchiseId || f.franchiseCode === affectedFranchiseId) {
              return { ...f, status: 'Suspended' as const };
            }
            return f;
          });
          saveStored('franchises', next);
          return next;
        });
        addAuditLog(
          'Franchise Suspended',
          'Franchise',
          affectedFranchiseId,
          `Franchise automatically suspended because Franchise Owner ID (${targetUserName}) was suspended.`
        );
      } else if (status === 'active') {
        setAllFranchises(prev => {
          const next = prev.map(f => {
            if (f.id === affectedFranchiseId || f.franchiseCode === affectedFranchiseId) {
              return { ...f, status: 'Active' as const };
            }
            return f;
          });
          saveStored('franchises', next);
          return next;
        });
        addAuditLog(
          'Franchise Reactivated',
          'Franchise',
          affectedFranchiseId,
          `Franchise restored to Active because Franchise Owner ID (${targetUserName}) was reactivated.`
        );
      }
    }

    addAuditLog('User Status Changed', 'User', userId, `User ${targetUserName || userId} status updated to ${status}`);
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog('User Removed', 'User', userId, `Removed user from franchise roster`);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `PRD-${Date.now().toString().slice(-4)}`
    };
    setProducts(prev => [...prev, newProduct]);
    addAuditLog('Product Added', 'Product', newProduct.id, `Added solar product ${newProduct.productName}`);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ANN-${Date.now().toString().slice(-4)}`
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addAuditLog('Announcement Published', 'Announcement', newAnnouncement.id, `Broadcasted: ${newAnnouncement.title}`);
    return newAnnouncement;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const addGuide = (guideData: Omit<GuideStep, 'id'>) => {
    const newGuide: GuideStep = {
      ...guideData,
      id: `GD-${Date.now().toString().slice(-4)}`
    };
    setGuides(prev => [...prev, newGuide]);
    addAuditLog('Guide Created', 'Guide', newGuide.id, `Added guide article: ${newGuide.title}`);
    return newGuide;
  };

  const updateGuide = (guideId: string, updates: Partial<GuideStep>) => {
    setGuides(prev =>
      prev.map(g => (g.id === guideId ? { ...g, ...updates } : g))
    );
  };

  const deleteGuide = (guideId: string) => {
    setGuides(prev => prev.filter(g => g.id !== guideId));
    addAuditLog('Guide Deleted', 'Guide', guideId, 'Guide removed');
  };

  // Sales Personnel Location History & GPS Actions
  const addSalesLocationLog = (logData: Omit<SalesLocationLog, 'id' | 'timestamp' | 'timeFormatted' | 'date'>): SalesLocationLog => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toISOString().split('T')[0];
    const newLog: SalesLocationLog = {
      ...logData,
      id: `LOC-LOG-${Date.now().toString().slice(-4)}`,
      timestamp: now.toISOString(),
      timeFormatted,
      date
    };
    setSalesLocationLogs(prev => [newLog, ...prev]);

    // Also update live status of this sales rep
    setSalesRepLiveStatus(prev =>
      prev.map(rep => {
        if (rep.userId === logData.userId) {
          const isVisit = logData.activityType === 'CLIENT_VISIT' || logData.activityType === 'LEAD_MEETING';
          return {
            ...rep,
            lastPingTime: 'Just now',
            lastAddress: logData.locationName,
            latitude: logData.latitude,
            longitude: logData.longitude,
            accuracyMeters: logData.accuracyMeters,
            batteryLevel: logData.batteryLevel,
            currentStatus: isVisit ? 'AT_CLIENT' : logData.activityType === 'TRANSIT' ? 'IN_TRANSIT' : 'ON_DUTY',
            visitsCompletedToday: rep.visitsCompletedToday + (isVisit ? 1 : 0),
            todayDistanceKm: Number(((rep.todayDistanceKm || 0) + (logData.distanceCoveredKm || 1.8)).toFixed(1)),
            activeLeadName: logData.leadName || logData.customerName || rep.activeLeadName
          };
        }
        return rep;
      })
    );

    addAuditLog('GPS Location Logged', 'SalesLocation', newLog.id, `Location log recorded for ${newLog.userName} at ${newLog.locationName}`);
    return newLog;
  };

  const updateSalesRepLiveStatus = (statusUpdates: Partial<SalesRepLiveStatus> & { userId: string }) => {
    setSalesRepLiveStatus(prev =>
      prev.map(rep => (rep.userId === statusUpdates.userId ? { ...rep, ...statusUpdates } : rep))
    );
  };

  const pingSalesRepGPS = (userId: string) => {
    setSalesRepLiveStatus(prev =>
      prev.map(rep => {
        if (rep.userId === userId) {
          return {
            ...rep,
            lastPingTime: 'Just now',
            accuracyMeters: Math.floor(Math.random() * 3) + 3
          };
        }
        return rep;
      })
    );
    const targetUser = allUsers.find(u => u.id === userId);
    addAuditLog('GPS Ping Requested', 'SalesTracking', userId, `Real-time GPS telemetry pinged for ${targetUser?.name || userId}`);
  };

  // Support Ticket System (Section 13)
  const addSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>): SupportTicket => {
    const ticketSeq = (supportTickets.length + 1).toString().padStart(3, '0');
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `TKT-${Date.now().toString().slice(-4)}`,
      ticketNumber: `TKT-2026-${ticketSeq}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    addAuditLog('Support Ticket Raised', 'SupportTicket', newTicket.ticketNumber, `Ticket #${newTicket.ticketNumber} [${newTicket.category}]: ${newTicket.subject}`);

    // Add alert notification
    const notif: NotificationItem = {
      id: `NOTIF-TKT-${Date.now()}`,
      title: `Support Ticket #${newTicket.ticketNumber}`,
      message: `${newTicket.createdByName}: ${newTicket.subject} (${newTicket.category})`,
      createdAt: 'Just now',
      isRead: false,
      type: 'Admin Announcement',
      franchiseId: newTicket.franchiseId,
      link: 'more'
    };
    setNotifications(prev => [notif, ...prev]);
    return newTicket;
  };

  const updateSupportTicketStatus = (
    ticketId: string,
    status: SupportTicketStatus,
    resolutionNotes?: string,
    assignedToName?: string
  ) => {
    setSupportTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              status,
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              ...(resolutionNotes ? { resolutionNotes } : {}),
              ...(assignedToName ? { assignedToName } : {})
            }
          : t
      )
    );
    addAuditLog('Support Ticket Updated', 'SupportTicket', ticketId, `Status updated to ${status}${resolutionNotes ? ` (${resolutionNotes})` : ''}`);
  };

  // Simple Fuel Support Records (Section 10)
  const addFuelRecord = (data: Omit<FuelRecord, 'id' | 'createdAt'>): FuelRecord => {
    const newRecord: FuelRecord = {
      ...data,
      id: `FUEL-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setFuelRecords(prev => [newRecord, ...prev]);
    addAuditLog('Fuel Support Logged', 'FuelRecord', newRecord.id, `₹${newRecord.fuelAmount} fuel support logged for ${newRecord.fieldSalesPersonName} (${newRecord.purpose})`);
    return newRecord;
  };

  const deleteFuelRecord = (id: string) => {
    setFuelRecords(prev => prev.filter(f => f.id !== id));
    addAuditLog('Fuel Support Deleted', 'FuelRecord', id, 'Deleted fuel support entry');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        allUsers,
        allFranchises,
        isSuperAdmin,
        isFranchiseOwner,
        selectedAdminFranchiseFilter,
        setSelectedAdminFranchiseFilter,
        deviceFrame,
        setDeviceFrame,
        franchises: allFranchises,
        customers: filteredCustomers,
        leads: filteredLeads,
        followUps: filteredFollowUps,
        projects: filteredProjects,
        siteSurveys: filteredSiteSurveys,
        quotations: filteredQuotations,
        payments: filteredPayments,
        products,
        announcements,
        notifications: filteredNotifications,
        guides,
        auditLogs,
        salesLocationLogs,
        salesRepLiveStatus,
        filteredSalesLocationLogs,
        filteredSalesRepLiveStatus,
        addSalesLocationLog,
        updateSalesRepLiveStatus,
        pingSalesRepGPS,
        // HRMS & Attendance
        attendanceRecords,
        leaveRequests,
        expenseClaims,
        filteredAttendanceRecords,
        filteredLeaveRequests,
        filteredExpenseClaims,
        punchIn,
        punchOut,
        updateAttendanceStatus,
        applyLeave,
        updateLeaveStatus,
        submitExpenseClaim,
        updateExpenseClaimStatus,
        deleteFranchise,
        isOffline,
        setIsOffline,
        pendingSyncCount,
        showFirstLaunchGuide,
        setShowFirstLaunchGuide,
        addLead,
        updateLeadStatus,
        updateLead,
        addCustomer,
        updateCustomer,
        pmSuryaGharRecords: filteredPMSuryaGharRecords,
        addPMSuryaGharRecord,
        updatePMSuryaGharRecord,
        deletePMSuryaGharRecord,
        addFollowUp,
        completeFollowUp,
        rescheduleFollowUp,
        addProject,
        updateProjectStatus,
        updateProject,
        addSiteSurvey,
        updateSiteSurvey,
        addQuotation,
        updateQuotationStatus,
        addPayment,
        addFranchise,
        updateFranchise,
        addUser,
        updateUser,
        updateUserProfile,
        changePassword,
        updateUserStatus,
        deleteUser,
        addProduct,
        updateProduct,
        addAnnouncement,
        markNotificationAsRead,
        addGuide,
        updateGuide,
        deleteGuide,
        addAuditLog,
        quotationDefaults,
        updateQuotationDefaults,
        // Support Ticket System (Section 13)
        supportTickets: filteredSupportTickets,
        filteredSupportTickets,
        addSupportTicket,
        updateSupportTicketStatus,
        // Simple Fuel Support (Section 10)
        fuelRecords: filteredFuelRecords,
        filteredFuelRecords,
        addFuelRecord,
        deleteFuelRecord,
        switchUserRole,
        isUserSuspended,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
