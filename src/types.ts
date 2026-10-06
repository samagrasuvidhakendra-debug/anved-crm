/**
 * ACS SOLAR - Enterprise Data Types & Schemas
 */

export type UserLayer =
  | 'SUPER_ADMIN' // Layer 1: Super Admin
  | 'FRANCHISE_OWNER' // Layer 2: Franchise Owners
  | 'OFFICE_SALES_TELECALLER' // Layer 3: Office Sales Team / Telecaller
  | 'FIELD_VISIT_TEAM'; // Layer 4: Field Visiting Team

export type UserRole =
  | 'SUPER_ADMIN'
  | 'FRANCHISE_OWNER'
  | 'OFFICE_SALES_TELECALLER'
  | 'TELECALLER'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'FIELD_VISIT_TEAM'
  | 'SITE_SURVEYOR'
  | 'INSTALLATION_TEAM'
  | 'ACCOUNT_STAFF';

export function getUserLayer(role: UserRole): UserLayer {
  if (role === 'SUPER_ADMIN') return 'SUPER_ADMIN';
  if (role === 'FRANCHISE_OWNER') return 'FRANCHISE_OWNER';
  if (
    role === 'OFFICE_SALES_TELECALLER' ||
    role === 'TELECALLER' ||
    role === 'SALES_MANAGER' ||
    role === 'ACCOUNT_STAFF'
  ) {
    return 'OFFICE_SALES_TELECALLER';
  }
  return 'FIELD_VISIT_TEAM'; // FIELD_VISIT_TEAM, SITE_SURVEYOR, SALES_EXECUTIVE, INSTALLATION_TEAM
}

export function getUserLayerTitle(layer: UserLayer): string {
  switch (layer) {
    case 'SUPER_ADMIN':
      return 'Layer 1: Super Admin';
    case 'FRANCHISE_OWNER':
      return 'Layer 2: Franchise Owner';
    case 'OFFICE_SALES_TELECALLER':
      return 'Layer 3: Office Sales & Telecaller';
    case 'FIELD_VISIT_TEAM':
      return 'Layer 4: Field Visiting Team';
  }
}

export type UserStatus = 'active' | 'inactive' | 'disabled' | 'suspended';
export type ThemeMode = 'dark' | 'light';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password?: string;
  role: UserRole;
  franchiseId: string; // 'all' for SUPER_ADMIN or franchise code like 'ACS-MH-01'
  franchiseName?: string;
  status: UserStatus;
  joiningDate: string;
  profilePhoto?: string;
  assignedTeam?: string;
  theme?: ThemeMode;
  alternateMobile?: string;
  address?: string;
  bio?: string;
  // Area & DISCOM Specific Settings
  state?: string;
  city?: string;
  district?: string;
  areaName?: string;
  assignedPincodes?: string[];
  assignedDiscoms?: string[];
  operatingRegion?: string;
  // Sales team attributes
  salesTargetKW?: number;
  monthlyTargetAmount?: number;
  commissionRate?: string;
  territoryBeat?: string;
  reportsToName?: string;
  reportsToRole?: string;
  addedByUserId?: string;
  addedByUserName?: string;
}

export interface Franchise {
  id: string;
  franchiseName: string;
  franchiseCode: string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail: string;
  address: string;
  city: string;
  state: string;
  district?: string;
  areaName?: string;
  pincode: string;
  assignedPincodes?: string[];
  assignedDiscoms?: string[];
  operatingRegion?: string;
  startDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  notes?: string;
}

export type PropertyType = 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural' | 'Other';
export type SolarRequirement = 'Rooftop Solar' | 'Ground Solar' | 'Solar Pump' | 'Rooftop On-Grid' | 'Rooftop Off-Grid' | 'Rooftop Hybrid' | 'Ground Mount' | 'Other';
export type SolarRequirementType = SolarRequirement;
export type LeadStatus = 'New' | 'Contacted' | 'Site Visit' | 'Quotation' | 'Negotiation' | 'Won' | 'Lost';
export type LeadSource = 'Website' | 'Referral' | 'Facebook' | 'Instagram' | 'Google' | 'Walk-in' | 'Telecalling' | 'Field Agent' | 'Exhibition' | 'Other';

export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Accepted' | 'Rejected';

export interface Lead {
  id: string;
  franchiseId: string;
  name?: string;
  customerName: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  propertyType: PropertyType;
  solarRequirement: SolarRequirement;
  systemCapacity?: string;
  expectedCapacityKW?: number;
  electricityBill?: number;
  electricityBillMonthly?: number;
  monthlyConsumption?: number;
  monthlyConsumptionUnits?: number;
  leadSource: LeadSource;
  status: LeadStatus;
  nextFollowUpDate: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CustomerStatus = 'Prospective' | 'Active Customer' | 'Completed Customer' | 'Inactive' | string;

export interface Customer {
  id: string;
  franchiseId: string;
  name: string;
  mobile?: string;
  phone?: string;
  alternateMobile?: string;
  alternatePhone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  propertyType: PropertyType;
  solarRequirement?: SolarRequirement;
  systemCapacity?: string;
  customerStatus?: CustomerStatus;
  electricityBill?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  isPMSuryaGhar?: boolean;
  pmSuryaGharId?: string;
  pmSuryaGharData?: PMSuryaGharCustomerRecord;
}

export interface GeotagLocation {
  latitude: number;
  longitude: number;
  accuracy?: number; // meters
  altitude?: number | null;
  timestamp?: string;
  formattedAddress?: string;
  compassHeading?: number; // 180 for South
  compassDirection?: string; // "180° South (True Azimuth)"
}

export interface PMSuryaGharCustomerRecord {
  id: string; // e.g. "PMSG-2026-001"
  customerId?: string;
  consumerName: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Electricity Details
  consumerNumber: string; // CA / Consumer ID on Electricity Bill
  discomName: string; // e.g. MSEDCL, Tata Power, BESCOM, etc.
  sanctionedLoadKW: number;
  proposedCapacityKW: number;
  estimatedSubsidyAmount: number; // Tiered subsidy: 1kW=₹30,000, 2kW=₹60,000, 3kW+=₹78,000

  // Mandatory Documents
  electricityBillUrl: string;
  electricityBillFileName?: string;

  // Aadhaar Both Sides
  aadhaarNumber: string; // 12 digits
  aadhaarFrontUrl: string;
  aadhaarFrontFileName?: string;
  aadhaarBackUrl: string;
  aadhaarBackFileName?: string;

  // Photo of the Site
  sitePhotoUrl: string;
  sitePhotoFileName?: string;
  additionalSitePhotos?: { url: string; name: string }[];
  roofType?: RoofType;

  // Video of the Site from South Direction
  siteVideoSouthUrl: string;
  siteVideoSouthFileName?: string;
  videoDuration?: string;
  isSouthDirectionConfirmed: boolean;

  // Geotagged Location
  geotag: GeotagLocation;

  // Scheme & Portal Lifecycle
  schemeStatus: 'Pending Verification' | 'Documents Ready for Portal' | 'National Portal Submitted' | 'DISCOM Approved';
  nationalPortalAppNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  franchiseId: string;
  franchiseName?: string;
  submittedBy?: string;
}

export type FollowUpType = 'Phone Call' | 'WhatsApp' | 'Site Visit' | 'Office Meeting' | 'Other';

export interface FollowUp {
  id: string;
  franchiseId: string;
  leadId?: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerMobile?: string;
  date?: string;
  followUpDate?: string;
  time: string;
  assignedUserId?: string;
  assignedUserName?: string;
  assignedStaffName?: string;
  type?: FollowUpType;
  purpose?: string;
  notes: string;
  status: 'Today' | 'Upcoming' | 'Overdue' | 'Completed' | 'Pending';
  createdAt?: string;
}

export type ProjectStatus =
  | 'Booking Confirmed'
  | 'Site Survey'
  | 'Quotation'
  | 'Material Planning'
  | 'Structure Installation'
  | 'Solar Panel Installation'
  | 'Inverter & Electrical Work'
  | 'Net Metering Process'
  | 'Final Inspection'
  | 'Plant Commissioning'
  | 'Customer Handover'
  | 'Completed'
  | 'Order Confirmed'
  | 'Advance Payment'
  | 'Installation Scheduled'
  | 'Installation in Progress'
  | 'Installation'
  | 'Quality Inspection'
  | 'Inspection'
  | 'Net Metering Application'
  | 'Commissioning & Handover'
  | 'Commissioning';

export type StructureType = 'Elevated' | 'Standard' | 'Tin Shed' | 'Custom';

export interface Project {
  id: string;
  projectId?: string; // e.g. "PRJ-2026-001"
  projectName?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerMobile?: string;
  customerAddress?: string;
  franchiseId: string;
  franchiseName?: string;
  systemCapacity?: string;
  systemCapacityKW?: number;
  panel?: string;
  panelBrand?: string;
  panelQuantity?: number;
  inverter?: string;
  inverterBrand?: string;
  structure?: string;
  structureType?: StructureType;
  totalQuotationValue?: number;
  quotationAmount?: number;
  finalAmount: number;
  advanceReceived?: number;
  receivedAmount?: number;
  pendingAmount: number;
  installationDate?: string;
  commissioningDate?: string;
  assignedTeam?: string;
  assignedInstallationLead?: string;
  quotationNumber?: string;
  status: ProjectStatus;
  createdAt?: string;
  notes?: string;
}

export type RoofType = 'RCC Flat' | 'Tin Shed' | 'Tiled' | 'Elevated Metal' | 'Elevated' | 'Ground' | 'Other';
export type ShadowCondition = 'Shadow Free' | 'No Shadow' | 'Partial Shadow' | 'Heavy Shadow';

export interface SiteSurvey {
  id: string;
  projectId?: string;
  customerId?: string;
  customerName: string;
  customerMobile?: string;
  franchiseId: string;
  siteAddress?: string;
  address?: string;
  roofType: RoofType;
  roofDimensions?: string; // e.g. "35 ft x 45 ft"
  roofArea?: number; // sq ft
  roofAreaSqFt?: number;
  availableArea?: number; // sq ft
  shadowFreeAreaSqFt?: number;
  shadowCondition: ShadowCondition;
  meterDetails?: string;
  electricalPanelDetails?: string;
  cableDistanceMeters?: number;
  earthingRequirement?: string;
  structureRequirement?: string;
  connectionType?: 'Single Phase' | 'Three Phase';
  sanctionedLoadKW?: number;
  averageMonthlyBill?: number;
  consumerNumber?: string;
  discomName?: string;
  electricityBillNo?: string;
  recommendedCapacity?: string;
  recommendedCapacityKW?: number;
  surveyNotes?: string;
  notes?: string;
  surveyorName: string;
  surveyDate: string;
  photos: string[];
  electricityBillPhoto?: string;
  electricityMeterPhoto?: string;
  electricalPanelPhoto?: string;
  rooftopPhotos?: string[];
  structureAreaPhoto?: string;
  rooftopVideoUrl?: string; // Field employee rooftop video upload
  rooftopVideoName?: string;
  gpsLocation?: GeotagLocation;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Correction Required' | 'Completed' | 'Scheduled' | 'In Progress';
  correctionNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Support Ticket System (Section 13)
export type SupportTicketCategory =
  | 'Technical Support'
  | 'Solar Product Issue'
  | 'Installation Issue'
  | 'Net Metering Issue'
  | 'Customer Issue'
  | 'Quotation Issue'
  | 'Payment Information Issue'
  | 'Software Issue'
  | 'Other';

export type SupportTicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  franchiseId: string;
  franchiseName: string;
  createdByUserId: string;
  createdByName: string;
  category: SupportTicketCategory;
  subject: string;
  description: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: SupportTicketStatus;
  assignedToName?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt?: string;
  relatedCustomerName?: string;
  relatedProjectId?: string;
}

// Simple Fuel Support Record (Section 10)
export interface FuelRecord {
  id: string;
  franchiseId: string;
  franchiseName?: string;
  userId: string;
  fieldSalesPersonName: string;
  date: string; // YYYY-MM-DD
  fuelAmount: number; // ₹ provided
  purpose: string; // e.g. "Rooftop survey & customer visit"
  basicNotes?: string;
  createdAt?: string;
}

export interface Quotation {
  id: string;
  quotationNo?: string; // e.g. "ACS-QT-2026-042"
  quotationNumber?: string;
  customerId?: string;
  customerName: string;
  clientName?: string;
  billAddress?: string;
  representativeName?: string;
  representativeNo?: string;
  state?: string;
  city?: string;
  uploadBillUrl?: string;
  remarks?: string;
  meterNo?: string;
  meterUnits?: number | string;
  unitKw?: number | string;
  rate?: number | string;
  selectStructure?: string;
  selectRoof?: string;
  structureRoofRate?: number | string;
  structureRoofAmount?: number | string;
  selectPanelType?: string;
  panelTypeRate?: number | string;
  markupAmount?: number | string;
  totalAmount?: number | string;
  amount70?: number | string;
  gst5?: number | string;
  amount30?: number | string;
  gst18?: number | string;
  projectAmount?: number | string;
  annualCapacity?: string;
  avgPowerGeneration?: string;
  savingPerUnit?: string;

  systemType?: string;
  specifications?: { part: string; make: string; spec: string }[];
  clientScope?: string[];
  terms?: string[];

  customerMobile: string;
  customerAddress: string;
  franchiseId: string;
  systemCapacity?: string;
  systemCapacityKW?: number;
  panel?: string;
  panelBrand?: string;
  panelQuantity?: number;
  inverter?: string;
  inverterBrand?: string;
  inverterCapacity?: string;
  structure?: string;
  structureType?: StructureType;
  bosIncluded?: boolean;
  installationIncluded?: boolean;
  transportationIncluded?: boolean;
  netMeteringAssistance?: boolean;
  installation?: number;
  transportation?: number;
  otherCharges?: number;
  basePrice?: number;
  discount: number;
  taxableValue?: number;
  taxRate?: number; // e.g. 13.8% or 18%
  gstRate?: number;
  taxAmount?: number;
  gstAmount?: number;
  finalAmount: number;
  paymentTerms?: string;
  advancePercentage?: number;
  deliveryPercentage?: number;
  commissioningPercentage?: number;
  validityDays: number;
  date?: string;
  status: QuotationStatus | string;
  notes?: string;
  createdAt?: string;
}

export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Bank Transfer (NEFT/RTGS)' | 'Cheque' | 'Cash' | 'Card';
export type PaymentStage = 'Advance' | 'Installation' | 'Commissioning' | 'Final';

export interface Payment {
  id: string;
  receiptNo?: string;
  receiptNumber?: string;
  projectId?: string;
  projectTitle?: string;
  customerId?: string;
  customerName: string;
  franchiseId: string;
  amount: number;
  stage?: PaymentStage;
  date?: string;
  paymentDate?: string;
  method?: PaymentMethod;
  paymentMode?: PaymentMethod;
  transactionReference: string;
  receivedByName?: string;
  status: 'Pending' | 'Partial' | 'Paid' | 'Completed';
  notes?: string;
  createdAt?: string;
}

export type ProductCategory =
  | 'Solar Panel'
  | 'Inverter'
  | 'Structure'
  | 'Cable'
  | 'Battery'
  | 'Accessories'
  | 'Installation'
  | 'Other';

export interface Product {
  id: string;
  productName: string;
  category: ProductCategory;
  brand: string;
  model: string;
  capacity: string;
  description: string;
  price: number;
  gstRate: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sku: string;
  image?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'Normal' | 'High' | 'Urgent';
  targetAudience: 'All Franchise Owners' | 'Selected Franchises' | 'Selected Users' | 'Specific Role';
  targetFranchiseIds?: string[];
  targetRole?: UserRole;
  publishDate: string;
  expiryDate: string;
  createdBy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | 'New Lead'
    | 'Lead Assigned'
    | 'Follow-up Reminder'
    | 'Overdue Follow-up'
    | 'Quotation Created'
    | 'Payment Received'
    | 'Payment Pending'
    | 'Installation Scheduled'
    | 'Project Updated'
    | 'Project Completed'
    | 'Admin Announcement';
  franchiseId?: string;
  targetUserId?: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  videoUrl?: string;
  steps: string[];
  status: 'Published' | 'Draft';
  order: number;
  targetRoles?: string[];
}

export type AppGuideArticle = GuideStep;

export interface AuditLog {
  id: string;
  user: string;
  userName?: string;
  userRole: string;
  action: string;
  franchiseId: string;
  franchiseName: string;
  recordType: string;
  recordId: string;
  entity?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
  pendingAction?: {
    type: 'createQuotation' | 'createLead' | 'createFollowUp' | 'updateProject';
    summary: string;
    payload: any;
  };
}

// ==========================================
// Sales Force Live Location & GPS Tracking
// ==========================================
export type SalesActivityType =
  | 'CHECK_IN'
  | 'CLIENT_VISIT'
  | 'SITE_SURVEY'
  | 'TRANSIT'
  | 'LEAD_MEETING'
  | 'PMSG_VERIFICATION'
  | 'CHECK_OUT';

export interface SalesLocationLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userMobile: string;
  profilePhoto?: string;
  franchiseId: string;
  franchiseName: string;
  timestamp: string; // ISO string
  timeFormatted: string; // e.g. "10:15 AM"
  date: string; // e.g. "2026-09-19"
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  speedKmH?: number;
  batteryLevel: number;
  networkStatus: string;
  locationName: string;
  landmark?: string;
  city: string;
  state: string;
  activityType: SalesActivityType;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  leadId?: string;
  leadName?: string;
  customerName?: string;
  customerAddress?: string;
  notes?: string;
  distanceCoveredKm?: number;
  durationMinutes?: number;
  photoUrl?: string;
  mapsGroundingIntel?: string;
  verifiedByGoogleMaps?: boolean;
  googleMapsUrl?: string;
}

export interface SalesRepLiveStatus {
  userId: string;
  userName: string;
  userRole: UserRole;
  mobile: string;
  profilePhoto?: string;
  franchiseId: string;
  franchiseName: string;
  territoryBeat: string;
  currentStatus: 'ON_DUTY' | 'AT_CLIENT' | 'IN_TRANSIT' | 'OFF_DUTY';
  lastPingTime: string;
  lastAddress: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  batteryLevel: number;
  networkProvider: string;
  todayDistanceKm: number;
  visitsCompletedToday: number;
  activeLeadName?: string;
}

export interface DownlineBusinessSummary {
  franchiseId: string;
  franchiseName: string;
  city: string;
  state: string;
  status: string;
  ownerName: string;
  ownerMobile: string;
  totalSalesStaff: number;
  totalTechStaff: number;
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  conversionRate: number;
  totalCustomers: number;
  pmSuryaGharCustomers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBookedKw: number;
  totalBusinessValue: number;
  collectedAmount: number;
  pendingReceivables: number;
  recentActivity: string;
}

// ==========================================
// HRMS & Attendance System
// ==========================================
export type AttendanceStatus =
  | 'PRESENT'
  | 'ON_FIELD'
  | 'LATE'
  | 'HALF_DAY'
  | 'ABSENT'
  | 'ON_LEAVE'
  | 'HOLIDAY';

export type AttendancePunchType = 'WEB_DESK' | 'MOBILE_GPS' | 'MANUAL_ADMIN';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userLayer: UserLayer;
  userMobile: string;
  profilePhoto?: string;
  franchiseId: string;
  franchiseName: string;
  date: string; // YYYY-MM-DD
  punchInTime?: string; // e.g. "09:15 AM"
  punchOutTime?: string; // e.g. "06:30 PM"
  status: AttendanceStatus;
  punchType: AttendancePunchType;
  // Field Visiting Team Geolocation verification
  punchInLatitude?: number;
  punchInLongitude?: number;
  punchInAddress?: string;
  punchInAccuracy?: number;
  punchInSelfieUrl?: string;
  punchOutLatitude?: number;
  punchOutLongitude?: number;
  punchOutAddress?: string;
  totalWorkingHours?: number; // e.g. 8.5
  totalBreakMinutes?: number;
  overtimeHours?: number;
  // Field Visits Completed
  fieldVisitsCount?: number;
  distanceCoveredKm?: number;
  // Office Telecaller metrics
  callsMadeCount?: number;
  leadsGeneratedCount?: number;
  notes?: string;
  approvedBy?: string;
}

export type LeaveType = 'CASUAL_LEAVE' | 'SICK_LEAVE' | 'PAID_LEAVE' | 'COMP_OFF' | 'UNPAID_LEAVE';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userLayer: UserLayer;
  franchiseId: string;
  franchiseName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  reviewRemarks?: string;
}

export interface FieldExpenseClaim {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  franchiseId: string;
  franchiseName: string;
  date: string;
  purpose: string; // e.g. "Site Visit to Borivali Rooftop Survey"
  travelMode: 'BIKE' | 'CAR' | 'PUBLIC_TRANSIT';
  startingKm?: number;
  endingKm?: number;
  totalKm: number;
  perKmRate: number; // e.g. ₹5/km for bike, ₹9/km for car
  fuelAmount: number;
  foodMiscAmount: number;
  totalClaimAmount: number;
  receiptAttachment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAmount?: number;
  reviewedBy?: string;
  reviewedOn?: string;
  notes?: string;
}
