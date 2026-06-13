// Database entity / core domain model    test

import { AddonType, PlanStatus, PlanTier, PlanType, Role, TicketGroup, TicketStatus } from "./product.entity";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;  // Hashed password in DB
  createdAt: Date;
  updatedAt: Date;
}

// For API responses (excluding sensitive data)
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  permissionGroup: string[];
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  
  // Relations
  createdBy?: Admin | null;
  createdAdmins?: Admin[];
  pdevProductCategories?: any[]; // PdevProductCategory[]
  pdevProducts?: any[]; // PdevProduct[]
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  disabled: boolean;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Stripe & Credits
  stripeId: string | null;
  staff: number;
  certCredits: number;
  unitCredits: number;
  totalCertCredits: number;
  totalPdevUsersCredited: number;
  moneySavedWithMembership: number;

  // Compliance & Tokens
  termAndCondAgreed: boolean;
  privacyPolicyAgreed: boolean;
  cookiePolicyAgreed: boolean;
  marketingConsent: boolean;

  // Retention & Lifecycle
  scheduledDeletion: boolean;
  deletionAt: Date | null;

  // B2B / Marketing Metadata
  jobRole: string;
  company: string;
  interestType: string;
  leadSource: string;
  trainingResourcesDownloads: number;

  // JSON Columns
  abnDetails: Record<string, any> | null;

  // Relations
  memberships?: Membership[];
  billingAddresses?: BillingAddress[];
  pdevUsers?: PdevUser[];
  courseResults?: any[]; // PdevProductCourseResult[]
  helpTickets?: any[]; // HelpAndSupport[]
  orders?: any[]; // Order[]
  cart?: any | null; // Cart?
  logTrails?: any[]; // LogTrail[]
}

export interface AffiliateUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  termAndCondAgreed: boolean;
  privacyPolicyAgeed: boolean; // Kept typo formulation
  cookiePolicyAgreed: boolean;
  scheduledDeletion: boolean;
  deletionAt: Date | null;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  logTrails?: any[]; // LogTrail[]
}

export interface PdevUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  disabled: boolean;
  authToken: string | null;
  generalUserId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  generalUser?: User;
  courseResults?: any[]; // PdevProductCourseResult[]
  logTrails?: any[]; // LogTrail[]
}

export interface Membership {
  id: string;
  userId: string;
  type: PlanType;
  planTier: PlanTier;
  status: PlanStatus;
  paymentId: string | null;
  membershipId: string | null;
  
  // Balances
  totalStaffSeats: number;
  totalCertCredits: number;
  totalUnitCredits: number;

  placedAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  addons?: MembershipAddon[];
}

export interface MembershipAddon {
  id: string;
  membershipId: string;
  addonType: AddonType;
  quantity: number;
  status: PlanStatus;
  paymentId: string | null;
  placedAt: Date;
  updatedAt: Date;

  // Relations
  membership?: Membership;
}

export interface BillingAddress {
  id: string;
  userId: string;
  title: string | null;
  postalAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
}

export enum AppointmentStatus {
  Under_Review = 'Under Review',
  Pending = 'Pending',
  Approved = 'Approved',
  Scheduled = 'Scheduled',
  Rejected = 'Rejected',
}

export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  position: string;
  phoneNumber: string;
  state: string;
  message: string;
  services: string[];
  status: AppointmentStatus;
  scheduledDateTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HelpAndSupport {
  id: string;
  title: string;
  body: string;
  status: TicketStatus; // From your initial schema definitions
  group: TicketGroup;   // From your initial schema definitions
  type: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User | null;
}

export interface PendingEmailCache {
  newEmail: string;
  otp: string;
}