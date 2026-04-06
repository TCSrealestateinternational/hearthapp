import type { ChecklistItem } from "@/types";

export const SELLER_STAGES = [
  "Phase 1 — Pre-Listing",
  "Phase 2 — Home Preparation",
  "Phase 3 — Active Listing",
  "Phase 4 — Offer Received",
  "Phase 5 — Under Contract",
  "Phase 6 — Inspection",
  "Phase 7 — Appraisal",
  "Phase 8 — Financing / Clear to Close",
  "Phase 9 — Closing Prep",
  "Phase 10 — Closing Day",
] as const;

export const SELLER_CHECKLIST_TEMPLATE: Omit<
  ChecklistItem,
  "completed" | "completedAt" | "completedBy"
>[] = [
  // ── Phase 1 — Pre-Listing ─────────────────────────────────
  { id: "s-001", label: "Listing appointment scheduled", stage: "Phase 1 — Pre-Listing" },
  { id: "s-002", label: "Pre-listing CMA completed and reviewed", stage: "Phase 1 — Pre-Listing" },
  { id: "s-003", label: "Seller net proceeds estimate prepared and reviewed", stage: "Phase 1 — Pre-Listing" },
  { id: "s-004", label: "Listing agreement signed", stage: "Phase 1 — Pre-Listing" },
  { id: "s-005", label: "Seller portal (Hearth) activated", stage: "Phase 1 — Pre-Listing" },
  { id: "s-006", label: "Seller goals documented (timeline, price priority, terms)", stage: "Phase 1 — Pre-Listing" },
  { id: "s-007", label: "Seller's mortgage payoff requested (if applicable)", stage: "Phase 1 — Pre-Listing" },
  { id: "s-008", label: "HOA information gathered if applicable", stage: "Phase 1 — Pre-Listing" },
  { id: "s-009", label: "Property survey located if available", stage: "Phase 1 — Pre-Listing" },
  { id: "s-010", label: "Seller disclosure form completed", stage: "Phase 1 — Pre-Listing" },
  { id: "s-011", label: "Lead-based paint disclosure completed if applicable (pre-1978 homes)", stage: "Phase 1 — Pre-Listing" },
  { id: "s-012", label: "Home warranty discussed: seller offering or not", stage: "Phase 1 — Pre-Listing" },
  { id: "s-013", label: "Preferred closing date / possession date noted", stage: "Phase 1 — Pre-Listing" },
  { id: "s-014", label: "Showing instructions determined", stage: "Phase 1 — Pre-Listing" },
  { id: "s-015", label: "ShowingTime account set up for property", stage: "Phase 1 — Pre-Listing" },

  // ── Phase 2 — Home Preparation ────────────────────────────
  { id: "s-016", label: "Pre-listing inspection discussed with seller", stage: "Phase 2 — Home Preparation" },
  { id: "s-017", label: "Pre-listing inspection completed if seller chose it", stage: "Phase 2 — Home Preparation" },
  { id: "s-018", label: "Repair list prioritized with seller", stage: "Phase 2 — Home Preparation" },
  { id: "s-019", label: "Agreed repairs completed", stage: "Phase 2 — Home Preparation" },
  { id: "s-020", label: "Declutter and deep clean completed", stage: "Phase 2 — Home Preparation" },
  { id: "s-021", label: "Staging completed or staging consultation done", stage: "Phase 2 — Home Preparation" },
  { id: "s-022", label: "Curb appeal addressed", stage: "Phase 2 — Home Preparation" },
  { id: "s-023", label: "Professional photos scheduled", stage: "Phase 2 — Home Preparation" },
  { id: "s-024", label: "Professional photos completed and delivered", stage: "Phase 2 — Home Preparation" },
  { id: "s-025", label: "Video / virtual tour completed if applicable", stage: "Phase 2 — Home Preparation" },
  { id: "s-026", label: "Drone photography completed if applicable", stage: "Phase 2 — Home Preparation" },
  { id: "s-027", label: "Floor plan created if applicable", stage: "Phase 2 — Home Preparation" },

  // ── Phase 3 — Active Listing ──────────────────────────────
  { id: "s-028", label: "MLS listing drafted and reviewed by seller", stage: "Phase 3 — Active Listing" },
  { id: "s-029", label: "MLS listing live and accurate", stage: "Phase 3 — Active Listing" },
  { id: "s-030", label: "Yard sign installed", stage: "Phase 3 — Active Listing" },
  { id: "s-031", label: "Lockbox installed", stage: "Phase 3 — Active Listing" },
  { id: "s-032", label: "Listing syndicated to Zillow, Realtor.com, etc.", stage: "Phase 3 — Active Listing" },
  { id: "s-033", label: "Social media marketing launched", stage: "Phase 3 — Active Listing" },
  { id: "s-034", label: "Open house scheduled if applicable", stage: "Phase 3 — Active Listing" },
  { id: "s-035", label: "Open house completed if applicable", stage: "Phase 3 — Active Listing" },
  { id: "s-036", label: "Showing feedback collected after each showing", stage: "Phase 3 — Active Listing" },
  { id: "s-037", label: "Feedback shared with seller regularly", stage: "Phase 3 — Active Listing" },
  { id: "s-038", label: "Weekly market update provided to seller", stage: "Phase 3 — Active Listing" },
  { id: "s-039", label: "Price reduction discussed if needed", stage: "Phase 3 — Active Listing" },
  { id: "s-040", label: "Price reduction executed if approved by seller", stage: "Phase 3 — Active Listing" },
  { id: "s-041", label: "Days on market tracked and shared with seller", stage: "Phase 3 — Active Listing" },

  // ── Phase 4 — Offer Received ──────────────────────────────
  { id: "s-042", label: "Offer received — seller notified immediately", stage: "Phase 4 — Offer Received" },
  { id: "s-043", label: "Purchase price reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-044", label: "Earnest money amount reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-045", label: "Financing type reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-046", label: "Contingencies reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-047", label: "Requested closing date reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-048", label: "Personal property inclusions or exclusions reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-049", label: "Repair requests or credits reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-050", label: "Possession date reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-051", label: "Buyer pre-approval letter reviewed", stage: "Phase 4 — Offer Received" },
  { id: "s-052", label: "Buyer proof of funds reviewed if cash offer", stage: "Phase 4 — Offer Received" },
  { id: "s-053", label: "Multiple offer process explained if applicable", stage: "Phase 4 — Offer Received" },
  { id: "s-054", label: "Seller response determined and submitted", stage: "Phase 4 — Offer Received" },
  { id: "s-055", label: "Contract fully executed (all signatures)", stage: "Phase 4 — Offer Received" },
  { id: "s-056", label: "Earnest money receipt confirmed", stage: "Phase 4 — Offer Received" },
  { id: "s-057", label: "Contract copies sent to all parties", stage: "Phase 4 — Offer Received" },

  // ── Phase 5 — Under Contract ──────────────────────────────
  { id: "s-058", label: "Key dates calendar created and shared with seller", stage: "Phase 5 — Under Contract" },
  { id: "s-059", label: "Title company / attorney contacted", stage: "Phase 5 — Under Contract" },
  { id: "s-060", label: "Title search ordered", stage: "Phase 5 — Under Contract" },
  { id: "s-061", label: "Any title issues identified and resolved", stage: "Phase 5 — Under Contract" },
  { id: "s-062", label: "HOA documents ordered and delivered to buyer if applicable", stage: "Phase 5 — Under Contract" },
  { id: "s-063", label: "Seller begins packing / moving arrangements", stage: "Phase 5 — Under Contract" },

  // ── Phase 6 — Inspection ──────────────────────────────────
  { id: "s-064", label: "Buyer inspection scheduled — seller notified of date and time", stage: "Phase 6 — Inspection" },
  { id: "s-065", label: "Seller vacates property during inspection", stage: "Phase 6 — Inspection" },
  { id: "s-066", label: "Inspection completed", stage: "Phase 6 — Inspection" },
  { id: "s-067", label: "Buyer repair request received", stage: "Phase 6 — Inspection" },
  { id: "s-068", label: "Repair request reviewed with seller", stage: "Phase 6 — Inspection" },
  { id: "s-069", label: "Seller response determined and submitted", stage: "Phase 6 — Inspection" },
  { id: "s-070", label: "Repair negotiation resolved in writing", stage: "Phase 6 — Inspection" },
  { id: "s-071", label: "Agreed repairs completed by seller (if any)", stage: "Phase 6 — Inspection" },
  { id: "s-072", label: "Repair receipts collected and provided to buyer (if applicable)", stage: "Phase 6 — Inspection" },
  { id: "s-073", label: "Re-inspection completed if requested and agreed", stage: "Phase 6 — Inspection" },

  // ── Phase 7 — Appraisal ───────────────────────────────────
  { id: "s-074", label: "Appraisal scheduled — seller notified of date and time", stage: "Phase 7 — Appraisal" },
  { id: "s-075", label: "Seller vacates during appraisal", stage: "Phase 7 — Appraisal" },
  { id: "s-076", label: "Comparable sales list prepared and provided to appraiser", stage: "Phase 7 — Appraisal" },
  { id: "s-077", label: "Appraisal completed", stage: "Phase 7 — Appraisal" },
  { id: "s-078", label: "Appraisal result received and reviewed with seller", stage: "Phase 7 — Appraisal" },
  { id: "s-079", label: "Appraisal contingency resolved", stage: "Phase 7 — Appraisal" },

  // ── Phase 8 — Financing / Clear to Close ──────────────────
  { id: "s-080", label: "Lender confirms buyer is clear to close", stage: "Phase 8 — Financing / Clear to Close" },
  { id: "s-081", label: "Closing disclosure issued", stage: "Phase 8 — Financing / Clear to Close" },
  { id: "s-082", label: "Seller net proceeds amount confirmed with title", stage: "Phase 8 — Financing / Clear to Close" },
  { id: "s-083", label: "Seller wire instructions confirmed with title company", stage: "Phase 8 — Financing / Clear to Close" },
  { id: "s-084", label: "Seller warned about wire fraud — verify directly with title", stage: "Phase 8 — Financing / Clear to Close" },
  { id: "s-085", label: "Seller payoff amount confirmed with title", stage: "Phase 8 — Financing / Clear to Close" },

  // ── Phase 9 — Closing Prep ────────────────────────────────
  { id: "s-086", label: "Closing date, time, and location confirmed with seller", stage: "Phase 9 — Closing Prep" },
  { id: "s-087", label: "Seller ID requirements confirmed", stage: "Phase 9 — Closing Prep" },
  { id: "s-088", label: "Final walkthrough by buyer scheduled", stage: "Phase 9 — Closing Prep" },
  { id: "s-089", label: "Final walkthrough completed — no issues (or issues resolved)", stage: "Phase 9 — Closing Prep" },
  { id: "s-090", label: "Utilities: seller confirms transfer dates", stage: "Phase 9 — Closing Prep" },
  { id: "s-091", label: "All personal property removed from home", stage: "Phase 9 — Closing Prep" },
  { id: "s-092", label: "All keys, garage openers, mailbox keys, codes gathered for transfer", stage: "Phase 9 — Closing Prep" },
  { id: "s-093", label: "Home left in agreed condition per contract", stage: "Phase 9 — Closing Prep" },

  // ── Phase 10 — Closing Day ────────────────────────────────
  { id: "s-094", label: "Closing completed", stage: "Phase 10 — Closing Day" },
  { id: "s-095", label: "Keys transferred to buyer", stage: "Phase 10 — Closing Day" },
  { id: "s-096", label: "Seller net proceeds confirmed received", stage: "Phase 10 — Closing Day" },
  { id: "s-097", label: "Closing documents copies given to seller", stage: "Phase 10 — Closing Day" },
  { id: "s-098", label: "Agent delivered closing documents to broker", stage: "Phase 10 — Closing Day" },
];
