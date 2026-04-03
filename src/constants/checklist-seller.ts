import type { ChecklistItem } from "@/types";

export const SELLER_STAGES = [
  "Pre-Listing",
  "Active Listing",
  "Under Contract",
  "Inspections & Appraisal",
  "Closing",
] as const;

export const SELLER_CHECKLIST_TEMPLATE: Omit<
  ChecklistItem,
  "completed" | "completedAt" | "completedBy"
>[] = [
  // Pre-Listing
  {
    id: "s-1",
    label: "Declutter and deep clean the home",
    stage: "Pre-Listing",
  },
  {
    id: "s-2",
    label: "Complete repairs and touch-ups",
    stage: "Pre-Listing",
  },
  {
    id: "s-3",
    label: "Review CMA and set list price",
    stage: "Pre-Listing",
  },
  {
    id: "s-4",
    label: "Sign listing agreement",
    stage: "Pre-Listing",
  },

  // Active Listing
  {
    id: "s-5",
    label: "Professional photos and staging",
    stage: "Active Listing",
  },
  {
    id: "s-6",
    label: "Property listed on MLS",
    stage: "Active Listing",
  },
  {
    id: "s-7",
    label: "Open houses and showings scheduled",
    stage: "Active Listing",
  },
  {
    id: "s-8",
    label: "Review showing feedback",
    stage: "Active Listing",
  },

  // Under Contract
  {
    id: "s-9",
    label: "Review and accept offer",
    stage: "Under Contract",
  },
  {
    id: "s-10",
    label: "Verify buyer's pre-approval",
    stage: "Under Contract",
  },
  {
    id: "s-11",
    label: "Earnest money received by escrow",
    stage: "Under Contract",
  },
  {
    id: "s-12",
    label: "Provide seller disclosures",
    stage: "Under Contract",
  },

  // Inspections & Appraisal
  {
    id: "s-13",
    label: "Accommodate buyer's home inspection",
    stage: "Inspections & Appraisal",
  },
  {
    id: "s-14",
    label: "Negotiate repair requests",
    stage: "Inspections & Appraisal",
  },
  {
    id: "s-15",
    label: "Accommodate appraisal visit",
    stage: "Inspections & Appraisal",
  },
  {
    id: "s-16",
    label: "Appraisal meets or exceeds sale price",
    stage: "Inspections & Appraisal",
  },

  // Closing
  {
    id: "s-17",
    label: "Buyer's final walk-through completed",
    stage: "Closing",
  },
  {
    id: "s-18",
    label: "Review settlement statement",
    stage: "Closing",
  },
  {
    id: "s-19",
    label: "Sign closing documents",
    stage: "Closing",
  },
  {
    id: "s-20",
    label: "Hand over keys and celebrate!",
    stage: "Closing",
  },
];
