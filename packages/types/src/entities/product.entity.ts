import { Cart, CartItem } from "./order.entity";
import { Admin, PdevUser, User } from "./user.entity";

export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  FACILITY = 'FACILITY',
  RECRUITER = 'RECRUITER',
}

export enum PlanType {
  PRODEV = 'PRODEV',
  GROUP = 'GROUP',
  EMPLOYER = 'EMPLOYER',
}

export enum PlanTier {
  BASIC = 'BASIC',
  STARTER = 'STARTER',
  PREMIUM = 'PREMIUM',
  ESSENTIAL = 'ESSENTIAL',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum PlanStatus {
  SUCCEEDED = 'succeeded',
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TicketStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export enum TicketGroup {
  PAYMENT = 'PAYMENT',
  GENERAL = 'GENERAL',
  ORDER = 'ORDER',
  MEMBERSHIP = 'MEMBERSHIP',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK = 'BANK',
  CREDITS = 'CREDITS',
}

export enum TitleEnum {
  Mr = 'Mr',
  Mrs = 'Mrs',
  Ms = 'Ms',
  Dr = 'Dr',
  Prof = 'Prof',
  None = 'None',
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum TargetProductType {
  Product = 'Product',
  PdevProduct = 'PdevProduct',
}

export enum LogCategory {
  AUTH = 'AUTH',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  COURSE_TRAINING = 'COURSE_TRAINING',
  SYSTEM = 'SYSTEM',
}

export enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  WARNING = 'WARNING',
}

export enum LogStage {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum AddonType {
  CERT_CREDIT = 'CERT_CREDIT',
  UNIT_CREDIT = 'UNIT_CREDIT',
  STAFF_SEAT = 'STAFF_SEAT',
}

export enum GroupType {
  Elective_Units = 'Elective Units',
  Core_Units = 'Core Units',
}

export enum QualificationLevel {
  Advanced_Diploma = 'Advanced Diploma',
  Certificate_I = 'Certificate I',
  Certificate_II = 'Certificate II',
  Certificate_III = 'Certificate III',
  Certificate_IV = 'Certificate IV',
  Diploma = 'Diploma',
  Graduate_Diploma = 'Graduate Diploma',
}

export enum VersionStatus {
  AVAILABLE = 'available',
  UPDATE = 'update',
  LOCKED = 'locked',
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  aboutUnit: string[];
  targetLearnerDescription: string | null;
  targetLearnerBullets: string[];
  learningOutcomesDescription: string | null;
  learningOutcomesBullets: string[];
  productDetails: string[];
  productDetailsSections: Record<string, any>[]; // Handled as Json[] Array
  link: string | null;
  price: number;
  salePrice: number;
  group: GroupType;
  qualificationLevel: QualificationLevel[];
  preOrder: boolean;
  fileUploaded: boolean;
  versionNumber: number;
  versionStatus: VersionStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  categories?: Category[];
  subcategories?: Subcategory[];
  cartItems?: any[]; // CartItem[]
  couponProducts?: any[]; // CouponProduct[]
}

export interface Category {
  id: string;
  mongoId: string | null;
  name: string;
  abbreviation: string;
  headline: string | null;
  subHeadline: string | null;
  url: string | null;
  disable: boolean;
  iconUrl: string;
  isNewlyUpdated: boolean;
  newProductFlagExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  subcategories?: Subcategory[];
  products?: Product[];
}

export interface Subcategory {
  id: string;
  mongoId: string | null;
  name: string;
  url: string | null;
  disable: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: Category;
  products?: Product[];
}

export interface PdevProductCategory {
  id: string;
  name: string;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;

  // Relations
  createdBy?: Admin;
  products?: PdevProduct[];
}

export interface PdevProduct {
  id: string;
  fileId: string;
  name: string;
  description: string | null;
  fileUploaded: boolean;
  iconUrl: string;
  features: string[];
  courseFor: string[];
  objectives: string[];
  includes: string[];
  parentId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  fileData?: PdevFileData[];
  parent?: PdevProductCategory;
  createdBy?: Admin;
  couponProducts?: CouponProduct[];
  cartItems?: CartItem[];
}

export interface PdevFileData {
  id: string;
  question: string;
  questionData: string[];
  options: string[];
  answer: string[];
  productId: string;

  // Relations
  product?: PdevProduct;
}

export interface PdevProductCourseResult {
  id: string;
  correctAnswers: string;
  totalQuestions: string;
  fileId: string;
  progress: number;
  staffUserId: string;
  generalUserId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  staffUser?: PdevUser;
  generalUser?: User;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType; // From your initial schema definitions
  value: number | string; // Handled as Decimal
  maxRedemptions: number | null;
  redemptionsCount: number;
  limitPerUser: number;
  minOrderAmount: number | string; // Handled as Decimal
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  applicableProducts?: CouponProduct[];
  carts?: Cart[];
}

export interface CouponProduct {
  id: string;
  couponId: string;
  productId: string;
  productType: TargetProductType; // From your initial schema definitions

  // Relations
  coupon?: Coupon;
  product?: Product | null;
  pdevProduct?: PdevProduct | null;
}