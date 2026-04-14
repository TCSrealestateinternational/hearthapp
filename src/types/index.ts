// ── Brokerage (multi-tenant root) ──────────────────────────────

export interface BrandTokens {
  primary: string;
  primaryLight: string;
  secondary: string;
  cta: string;
  ctaHover: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  surfaceContainer?: string;
  surfaceContainerHigh?: string;
}

export interface Brokerage {
  id: string;
  slug: string;
  name: string;
  agentName: string;
  agentTitle: string;
  agentEmail: string;
  agentPhone: string;
  licenseNumber: string;
  logoUrl: string;
  brandTokens: BrandTokens;
  driveFolderUrl?: string;
  createdAt: Date;
}

// ── User ───────────────────────────────────────────────────────

export type UserRole = "buyer" | "seller" | "dual" | "agent";
export type UserStatus = "pending" | "active";

export interface BrokerageProfile {
  roles: UserRole[];
  displayName?: string;
}

export interface User {
  id: string;
  brokerageId: string;
  brokerageIds?: string[];
  pendingBrokerageId?: string;
  brokerageProfiles?: Record<string, BrokerageProfile>;
  email: string;
  displayName: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  activeRole?: "buyer" | "seller";
  avatarUrl?: string;
  driveFolderUrl?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

// ── Transaction ────────────────────────────────────────────────

export type TransactionType = "buying" | "selling";
export type TransactionStatus =
  | "active"
  | "under-contract"
  | "closed"
  | "withdrawn";

export interface Transaction {
  id: string;
  brokerageId: string;
  clientId: string;
  type: TransactionType;
  status: TransactionStatus;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Property (buyer tracked) ───────────────────────────────────

export type PropertyStatus =
  | "interested"
  | "toured"
  | "offer-pending"
  | "offer-accepted"
  | "rejected"
  | "withdrawn";

export interface Property {
  id: string;
  transactionId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt?: number;
  lotSize?: string;
  garage?: string;
  hoa?: number;
  status: PropertyStatus;
  rating: number; // 1-5 stars
  notes: string;
  pros: string[];
  cons: string[];
  photos: string[];
  mlsUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Finance ────────────────────────────────────────────────────

export type LoanType = "conventional" | "fha" | "va" | "usda";

export interface FinanceScenario {
  id: string;
  transactionId: string;
  name: string;
  propertyId?: string;
  offerPrice: number;
  downPaymentPct: number;
  interestRate: number;
  loanTermYears: number;
  loanType: LoanType;
  propertyTaxRate: number;
  homeInsurance: number;
  hoa: number;
  closingCostPct: number;
  sellerConcessions: number;
  prepaids: number;
  // Calculated fields stored for quick display
  monthlyPI: number;
  monthlyPMI: number;
  monthlyTotal: number;
  cashToClose: number;
  createdAt: Date;
}

// ── Offer (seller received) ────────────────────────────────────

export type OfferStatus =
  | "received"
  | "countered"
  | "accepted"
  | "rejected"
  | "expired";

export interface Offer {
  id: string;
  transactionId: string;
  buyerName: string;
  offerPrice: number;
  downPaymentPct: number;
  loanType: LoanType;
  closingDate: string;
  contingencies: string[];
  sellerConcessions: number;
  status: OfferStatus;
  notes: string;
  receivedAt: Date;
}

// ── Listing (seller) ──────────────────────────────────────────

export type ListingStatus =
  | "coming-soon"
  | "active"
  | "pending"
  | "sold"
  | "withdrawn";

export interface Listing {
  id: string;
  transactionId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  listPrice: number;
  status: ListingStatus;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  photos: string[];
  showingLog: ShowingEntry[];
  timeline: TimelineEntry[];
  cmaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShowingEntry {
  date: string;
  time: string;
  feedback?: string;
}

export interface TimelineEntry {
  date: string;
  event: string;
}

// ── Checklist ──────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
  stage: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string; // userId
  notes?: string;
}

export interface ChecklistState {
  transactionId: string;
  items: ChecklistItem[];
  updatedAt: Date;
}

// ── Messaging ──────────────────────────────────────────────────

export interface Message {
  id: string;
  brokerageId: string;
  transactionId?: string;
  threadId?: string;
  senderId: string;
  senderName: string;
  senderRole: "agent" | "client";
  text: string;
  fileUrl?: string;
  fileName?: string;
  readAt?: Date;
  createdAt: Date;
}

export interface Thread {
  id: string; // same as clientId
  clientName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}

// ── Subscription ──────────────────────────────────────────────

export type SubscriptionPlan = "hearth_only" | "tracker_only" | "full_platform" | "white_label";
export type SubscriptionStatus = "active" | "trialing" | "suspended" | "cancelled";

export interface SubscriptionFeatures {
  reTracker: boolean;
  hearthPortal: boolean;
  whiteLabel: boolean;
  maxClients: number;
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  features: SubscriptionFeatures;
  trialEndsAt: Date | null;
  billingCycleEnd: Date | null;
  whiteLabel?: {
    brokerageSlug: string;
    customDomain?: string;
  };
}

// ── Milestone (subcollection of /transactions/{id}/milestones) ──

export interface Milestone {
  id: string;
  label: string;
  stage: string;
  completed: boolean;
  completedAt: Date | null;
  completedBy: string | null;
  clientVisible: boolean;
  notifyClient: boolean;
}

// ── Glossary ──────────────────────────────────────────────────

export type GlossaryCategory =
  | "Pre-Offer & Market Analysis"
  | "Offer & Acceptance"
  | "Property Inspection & Appraisal"
  | "Financing & Mortgage"
  | "Title & Ownership"
  | "Closing & Settlement"
  | "Contingencies"
  | "Property Types & Structures"
  | "Property Features & Condition"
  | "Special Assessments & Fees"
  | "Investment-Specific Terms"
  | "Land & Farm-Specific"
  | "New Construction"
  | "Taxes & Financial Aspects"
  | "Legal & Administrative"
  | "Issues & Problems"
  | "Communication & Timelines"
  | "Post-Closing"
  | "General";

export interface GlossaryTerm {
  id: string;
  term: string;
  plainDefinition: string;
  category?: GlossaryCategory;
  buyerContext?: string;
  sellerContext?: string;
  aslVideoUrl?: string;
  relatedTerms?: string[];
  createdAt: Date;
}

// ── Document ───────────────────────────────────────────────────

export interface Document {
  id: string;
  brokerageId: string;
  transactionId?: string;
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}
