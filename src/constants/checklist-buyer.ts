import type { ChecklistItem } from "@/types";

export const BUYER_STAGES = [
  "Pre-Approval",
  "House Hunting",
  "Under Contract",
  "Inspections & Appraisal",
  "Closing",
] as const;

export const BUYER_CHECKLIST_TEMPLATE: Omit<
  ChecklistItem,
  "completed" | "completedAt" | "completedBy"
>[] = [
  // Pre-Approval
  { id: "b-1", label: "Get pre-approved with lender", stage: "Pre-Approval" },
  {
    id: "b-2",
    label: "Gather financial documents (pay stubs, tax returns, bank statements)",
    stage: "Pre-Approval",
  },
  {
    id: "b-3",
    label: "Review credit report and address issues",
    stage: "Pre-Approval",
  },
  {
    id: "b-4",
    label: "Determine budget and monthly payment comfort zone",
    stage: "Pre-Approval",
  },

  // House Hunting
  {
    id: "b-5",
    label: "Create wish list (must-haves vs. nice-to-haves)",
    stage: "House Hunting",
  },
  {
    id: "b-6",
    label: "Tour properties and take notes",
    stage: "House Hunting",
  },
  {
    id: "b-7",
    label: "Research neighborhoods and schools",
    stage: "House Hunting",
  },
  {
    id: "b-8",
    label: "Compare top properties side-by-side",
    stage: "House Hunting",
  },

  // Under Contract
  {
    id: "b-9",
    label: "Submit offer and negotiate terms",
    stage: "Under Contract",
  },
  {
    id: "b-10",
    label: "Sign purchase agreement",
    stage: "Under Contract",
  },
  {
    id: "b-11",
    label: "Submit earnest money deposit",
    stage: "Under Contract",
  },
  {
    id: "b-12",
    label: "Secure homeowner's insurance",
    stage: "Under Contract",
  },

  // Inspections & Appraisal
  {
    id: "b-13",
    label: "Schedule home inspection",
    stage: "Inspections & Appraisal",
  },
  {
    id: "b-14",
    label: "Review inspection report and negotiate repairs",
    stage: "Inspections & Appraisal",
  },
  {
    id: "b-15",
    label: "Appraisal ordered by lender",
    stage: "Inspections & Appraisal",
  },
  {
    id: "b-16",
    label: "Review appraisal results",
    stage: "Inspections & Appraisal",
  },

  // Closing
  { id: "b-17", label: "Final loan approval received", stage: "Closing" },
  { id: "b-18", label: "Review closing disclosure", stage: "Closing" },
  { id: "b-19", label: "Do final walk-through", stage: "Closing" },
  { id: "b-20", label: "Sign closing documents and get keys!", stage: "Closing" },
];
