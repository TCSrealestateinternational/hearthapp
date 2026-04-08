import type { GlossaryTerm, GlossaryCategory } from "@/types";

/** Category display order for the glossary page */
export const CATEGORY_ORDER: GlossaryCategory[] = [
  "Pre-Offer & Market Analysis",
  "Offer & Acceptance",
  "Property Inspection & Appraisal",
  "Financing & Mortgage",
  "Title & Ownership",
  "Closing & Settlement",
  "Contingencies",
  "Property Types & Structures",
  "Property Features & Condition",
  "Special Assessments & Fees",
  "Investment-Specific Terms",
  "Land & Farm-Specific",
  "New Construction",
  "Taxes & Financial Aspects",
  "Legal & Administrative",
  "Issues & Problems",
  "Communication & Timelines",
  "Post-Closing",
  "General",
];

export const defaultGlossaryTerms: GlossaryTerm[] = [
  // ━━ Pre-Offer & Market Analysis ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-cma",
    term: "Comparative Market Analysis (CMA)",
    plainDefinition:
      "A report showing what similar homes in your area have sold for recently. It helps you understand if a house's asking price is fair.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "Your agent prepares a CMA so you know whether the listing price is reasonable before you make an offer.",
    sellerContext:
      "Your agent uses a CMA to help you set a competitive listing price that attracts buyers.",
    relatedTerms: ["Market value", "Appraisal", "List price"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-market-value",
    term: "Market value",
    plainDefinition:
      "What a home is realistically worth based on recent sales of similar properties in the area.",
    category: "Pre-Offer & Market Analysis",
    buyerContext: "Knowing market value helps you avoid overpaying for a home.",
    sellerContext:
      "Pricing near market value helps attract serious buyers quickly.",
    relatedTerms: ["Comparative Market Analysis (CMA)", "Appraisal"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraisal",
    term: "Appraisal",
    plainDefinition:
      "An official evaluation of a home's value, ordered by your lender to make sure the house is worth the money you're borrowing.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "Your lender requires an appraisal before finalizing your loan. If the appraisal comes in low, you may need to renegotiate.",
    sellerContext:
      "A low appraisal can delay or derail a sale if the buyer can't cover the gap.",
    relatedTerms: ["Appraisal value", "Appraiser", "Appraisal gap"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-list-price",
    term: "List price",
    plainDefinition:
      "The asking price the seller puts on the property when it goes on the market.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "The list price is the starting point for your offer\u2014your agent will help you decide whether to offer above, below, or at list price.",
    sellerContext:
      "Setting the right list price is critical\u2014too high and buyers pass, too low and you leave money on the table.",
    relatedTerms: ["Asking price", "Offer price", "Market value"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-asking-price",
    term: "Asking price",
    plainDefinition:
      "Same as list price\u2014what the seller wants for the home.",
    category: "Pre-Offer & Market Analysis",
    relatedTerms: ["List price", "Offer price"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-offer-price",
    term: "Offer price",
    plainDefinition: "The amount you're willing to pay for the home.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "Your agent helps you determine a competitive offer price based on the CMA and market conditions.",
    sellerContext:
      "You'll compare the offer price to your list price and decide whether to accept, counter, or reject.",
    relatedTerms: ["List price", "Counter-offer", "Offer"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mls",
    term: "Multiple Listing Service (MLS)",
    plainDefinition:
      "A database of homes for sale in your area that real estate agents use to show available properties to buyers.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "Your agent searches the MLS to find homes that match your criteria.",
    sellerContext:
      "Listing on the MLS gives your property maximum exposure to buyers and their agents.",
    relatedTerms: ["Days on market (DOM)", "List price"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-dom",
    term: "Days on market (DOM)",
    plainDefinition:
      "How many days a home has been listed for sale. A higher number might mean the price is too high or there's an issue with the property.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "A high DOM might give you more negotiating power\u2014the seller may be more willing to accept a lower offer.",
    sellerContext:
      "If your DOM is climbing, it may be time to adjust your price or marketing strategy.",
    relatedTerms: ["Multiple Listing Service (MLS)", "Market conditions"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-market-conditions",
    term: "Market conditions",
    plainDefinition:
      "The overall state of the real estate market\u2014either favoring buyers (prices dropping, more inventory) or sellers (prices rising, less inventory).",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "In a buyer's market, you have more negotiating power. In a seller's market, expect competition.",
    sellerContext:
      "In a seller's market, you may receive multiple offers. In a buyer's market, pricing and presentation become even more important.",
    relatedTerms: ["Days on market (DOM)", "Comparative Market Analysis (CMA)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-equity",
    term: "Equity",
    plainDefinition:
      "The amount of the home you actually own. If your home is worth $300,000 and you owe $200,000, your equity is $100,000.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "You build equity over time as you pay down your mortgage and your home's value increases.",
    sellerContext:
      "Your equity determines how much cash you'll walk away with after selling and paying off your mortgage.",
    relatedTerms: ["Down payment", "Loan-to-value (LTV)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-emd",
    term: "Earnest money deposit (EMD)",
    plainDefinition:
      "Money you put down when you make an offer to show the seller you're serious about buying. It's typically held by the title company and applied to your down payment at closing.",
    category: "Pre-Offer & Market Analysis",
    buyerContext:
      "Your EMD is at risk if you back out without a valid contingency. Typically 1\u20133% of the purchase price.",
    sellerContext:
      "A larger EMD signals a more committed buyer. You may keep it if the buyer backs out without cause.",
    relatedTerms: ["Down payment", "Offer", "Contingencies"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Offer & Acceptance ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-offer",
    term: "Offer",
    plainDefinition:
      "Your formal proposal to buy a home at a specific price with certain terms and conditions.",
    category: "Offer & Acceptance",
    buyerContext:
      "Your agent helps you craft a competitive offer that balances price with favorable terms.",
    sellerContext:
      "You'll review each offer with your agent and decide whether to accept, counter, or reject.",
    relatedTerms: ["Counter-offer", "Acceptance", "Purchase agreement"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-counter-offer",
    term: "Counter-offer",
    plainDefinition:
      "The seller's response to your offer with different terms (usually a higher price, different closing date, etc.).",
    category: "Offer & Acceptance",
    buyerContext:
      "Receiving a counter-offer means the seller is interested but wants to negotiate.",
    sellerContext:
      "A counter-offer lets you adjust the terms without rejecting the buyer entirely.",
    relatedTerms: ["Offer", "Acceptance", "Terms and conditions"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-acceptance",
    term: "Acceptance",
    plainDefinition:
      "When both buyer and seller agree on the same terms. This creates a binding contract.",
    category: "Offer & Acceptance",
    relatedTerms: ["Contract", "Effective date", "Purchase agreement"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-contract",
    term: "Contract",
    plainDefinition:
      "A legal agreement between buyer and seller outlining all the terms of the sale.",
    category: "Offer & Acceptance",
    relatedTerms: ["Purchase agreement", "Terms and conditions"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-purchase-agreement",
    term: "Purchase agreement",
    plainDefinition:
      "The official written contract that details the price, closing date, contingencies, and other conditions of the sale.",
    category: "Offer & Acceptance",
    relatedTerms: ["Contract", "Contingencies", "Closing timeline"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-terms-conditions",
    term: "Terms and conditions",
    plainDefinition:
      "The specific details of the deal: price, closing date, what's included, repairs, etc.",
    category: "Offer & Acceptance",
    relatedTerms: ["Purchase agreement", "Contingencies"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-contingencies",
    term: "Contingencies",
    plainDefinition:
      "Conditions that must be met for the sale to move forward (e.g., you get financing approved, the home passes inspection).",
    category: "Offer & Acceptance",
    buyerContext:
      "Contingencies protect you\u2014they let you back out without losing your earnest money if something goes wrong.",
    sellerContext:
      "Fewer contingencies in an offer means less risk of the deal falling through.",
    relatedTerms: [
      "Inspection period",
      "Appraisal contingency",
      "Financing contingency",
    ],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-inspection-period",
    term: "Inspection period",
    plainDefinition:
      "The time window you have to hire an inspector to examine the home for problems.",
    category: "Offer & Acceptance",
    buyerContext:
      "Don't skip the inspection\u2014it's your chance to uncover hidden problems before you're locked in.",
    sellerContext:
      "During this period, the buyer may request repairs or credits based on the inspection findings.",
    relatedTerms: ["Home inspection", "Inspection report", "Contingencies"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraisal-contingency",
    term: "Appraisal contingency",
    plainDefinition:
      "A condition stating the sale will only go through if the home appraises for at least the agreed-upon price.",
    category: "Offer & Acceptance",
    buyerContext:
      "This protects you from overpaying\u2014if the appraisal is low, you can renegotiate or walk away.",
    sellerContext:
      "Buyers who waive this contingency are taking on more risk, which can make their offer more attractive.",
    relatedTerms: ["Appraisal", "Appraisal gap", "Appraisal contingency waiver"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-financing-contingency",
    term: "Financing contingency",
    plainDefinition:
      "A condition stating the sale depends on you getting approved for a mortgage loan.",
    category: "Offer & Acceptance",
    buyerContext:
      "This protects you if your loan falls through\u2014you can exit the deal and keep your earnest money.",
    sellerContext:
      "Cash offers or pre-approved buyers who waive this contingency reduce the risk of financing issues.",
    relatedTerms: ["Pre-approval", "Contingencies", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-closing-timeline",
    term: "Closing timeline",
    plainDefinition:
      "How many days from acceptance until you close (typically 30\u201345 days).",
    category: "Offer & Acceptance",
    relatedTerms: ["Effective date", "Acceptance"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-effective-date",
    term: "Effective date",
    plainDefinition: "The date when the contract officially begins.",
    category: "Offer & Acceptance",
    relatedTerms: ["Acceptance", "Closing timeline", "Contract"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Property Inspection & Appraisal ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-home-inspection",
    term: "Home inspection",
    plainDefinition:
      "A professional examination of the home's condition\u2014roof, plumbing, electrical, foundation, HVAC, etc. It costs $300\u2013500 and takes 2\u20133 hours.",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "You typically pay for the inspection. It's one of the best investments you'll make\u2014it can save you thousands.",
    sellerContext:
      "Consider a pre-listing inspection to identify and fix problems before buyers find them.",
    relatedTerms: ["Inspector", "Inspection report", "Repair request"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-inspector",
    term: "Inspector",
    plainDefinition:
      "The licensed professional who examines the home and writes a detailed report of its condition.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Home inspection", "Inspection report"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-inspection-report",
    term: "Inspection report",
    plainDefinition:
      "A detailed written account of the home's condition, including any problems found.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Home inspection", "Repair request", "Inspector"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-repair-request",
    term: "Repair request",
    plainDefinition:
      "A formal ask from the buyer asking the seller to fix specific issues found during inspection (or credit money at closing instead).",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "Focus on major issues\u2014structural, safety, and mechanical\u2014rather than cosmetic items.",
    sellerContext:
      "You can agree to repairs, offer a credit, reduce the price, or decline.",
    relatedTerms: ["Repair credit", "Inspection report", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-repair-credit",
    term: "Repair credit",
    plainDefinition:
      "Money the seller agrees to give you at closing instead of making repairs themselves.",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "A repair credit lets you handle repairs yourself after closing, using contractors you trust.",
    sellerContext:
      "Offering a credit is often easier than coordinating repairs before closing.",
    relatedTerms: ["Repair request", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraisal-value",
    term: "Appraisal value",
    plainDefinition:
      "The official value determined by the appraiser, used by your lender to decide how much to loan.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Appraisal", "Appraiser", "Appraisal gap"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraiser",
    term: "Appraiser",
    plainDefinition:
      "A licensed professional hired by your lender to determine the home's fair market value.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Appraisal", "Appraisal value"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraisal-gap",
    term: "Appraisal gap",
    plainDefinition:
      "When the home appraises for less than the purchase price. You'll need to cover the difference out of pocket or renegotiate the price.",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "Be prepared for this\u2014discuss with your agent whether to include an appraisal gap clause in your offer.",
    sellerContext:
      "If the appraisal comes in low, you may need to lower your price or the deal could fall apart.",
    relatedTerms: ["Appraisal", "Appraisal contingency", "Appraisal contingency waiver"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-appraisal-contingency-waiver",
    term: "Appraisal contingency waiver",
    plainDefinition:
      "You agree to buy the home even if it appraises for less than your offer price (risky for buyers).",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "Only waive this if you have cash to cover a potential gap. It makes your offer stronger but increases your risk.",
    sellerContext:
      "An offer with this waiver is more attractive because you won't lose the deal over a low appraisal.",
    relatedTerms: ["Appraisal contingency", "Appraisal gap"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-property-condition-disclosure",
    term: "Property condition disclosure",
    plainDefinition:
      "A seller's written statement about the home's condition, repairs, and any known problems.",
    category: "Property Inspection & Appraisal",
    buyerContext:
      "Review this carefully\u2014it tells you what the seller knows about the property's condition.",
    sellerContext:
      "Be honest and thorough\u2014failing to disclose known issues can lead to legal liability after closing.",
    relatedTerms: ["Home inspection", "Inspection report"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-title-search",
    term: "Title search",
    plainDefinition:
      "An investigation into the property's ownership history to make sure the seller actually owns it and there are no hidden claims against it.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Title report"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-title-report",
    term: "Title report",
    plainDefinition:
      "A document showing the results of the title search\u2014whether the title is clear or if there are problems.",
    category: "Property Inspection & Appraisal",
    relatedTerms: ["Title search"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Financing & Mortgage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-loan",
    term: "Loan",
    plainDefinition:
      "Money borrowed from a lender that you must repay with interest.",
    category: "Financing & Mortgage",
    relatedTerms: ["Mortgage", "Lender", "Loan amount"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mortgage",
    term: "Mortgage",
    plainDefinition:
      "A specific type of loan used to buy real estate. The property serves as collateral\u2014if you don't pay, the lender can take it.",
    category: "Financing & Mortgage",
    relatedTerms: ["Loan", "Lender", "Down payment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-lender",
    term: "Lender",
    plainDefinition:
      "The bank or financial institution that lends you money to buy the home.",
    category: "Financing & Mortgage",
    relatedTerms: ["Loan officer", "Pre-approval", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-loan-officer",
    term: "Loan officer",
    plainDefinition:
      "The person at the lender who works with you to process your mortgage application.",
    category: "Financing & Mortgage",
    relatedTerms: ["Lender", "Pre-approval", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-pre-approval",
    term: "Pre-approval",
    plainDefinition:
      "A lender's written confirmation that you qualify for a specific loan amount based on your finances (needed before making an offer).",
    category: "Financing & Mortgage",
    buyerContext:
      "Get pre-approved before you start house hunting\u2014sellers take pre-approved buyers more seriously.",
    sellerContext:
      "Always ask for proof of pre-approval with any offer to confirm the buyer can actually get financing.",
    relatedTerms: ["Pre-qualification", "Lender", "Loan officer"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-pre-qualification",
    term: "Pre-qualification",
    plainDefinition:
      "A preliminary estimate of how much you might be able to borrow (less official than pre-approval).",
    category: "Financing & Mortgage",
    relatedTerms: ["Pre-approval", "Lender"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-loan-amount",
    term: "Loan amount",
    plainDefinition:
      "The total money the lender will give you (the purchase price minus your down payment).",
    category: "Financing & Mortgage",
    relatedTerms: ["Down payment", "Loan", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-down-payment",
    term: "Down payment",
    plainDefinition:
      "The money you contribute upfront to buy the home. Typically 3\u201320% of the purchase price.",
    category: "Financing & Mortgage",
    buyerContext:
      "A larger down payment means a smaller loan and lower monthly payments. It can also help you avoid PMI.",
    sellerContext:
      "Buyers with larger down payments are generally seen as stronger, more financially secure buyers.",
    relatedTerms: ["Loan amount", "Earnest money deposit (EMD)", "Equity"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-ltv",
    term: "Loan-to-value (LTV)",
    plainDefinition:
      "The percentage of the home's value that you're borrowing. If you put 20% down, your LTV is 80%.",
    category: "Financing & Mortgage",
    relatedTerms: ["Down payment", "Mortgage insurance (PMI)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-interest-rate",
    term: "Interest rate",
    plainDefinition:
      "The percentage the lender charges you each year for borrowing money.",
    category: "Financing & Mortgage",
    relatedTerms: ["Fixed rate", "Adjustable rate (ARM)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-fixed-rate",
    term: "Fixed rate",
    plainDefinition:
      "An interest rate that stays the same for the entire loan (most common and safest).",
    category: "Financing & Mortgage",
    relatedTerms: ["Interest rate", "Adjustable rate (ARM)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-arm",
    term: "Adjustable rate (ARM)",
    plainDefinition:
      "An interest rate that starts low but can increase after a set period (riskier, rates can spike).",
    category: "Financing & Mortgage",
    relatedTerms: ["Interest rate", "Fixed rate"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-amortization",
    term: "Amortization",
    plainDefinition:
      "The process of paying off your loan gradually over time through regular monthly payments.",
    category: "Financing & Mortgage",
    relatedTerms: ["Principal and interest (P&I)", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-pi",
    term: "Principal and interest (P&I)",
    plainDefinition:
      "The two main parts of your monthly mortgage payment: principal is the loan amount you're paying down, interest is the cost of borrowing.",
    category: "Financing & Mortgage",
    relatedTerms: ["Amortization", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-pmi",
    term: "Mortgage insurance (PMI)",
    plainDefinition:
      "Insurance you pay monthly if your down payment is less than 20%. It protects the lender if you stop paying.",
    category: "Financing & Mortgage",
    relatedTerms: ["Down payment", "Loan-to-value (LTV)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-escrow",
    term: "Escrow account",
    plainDefinition:
      "Money set aside from your monthly payment to cover property taxes and homeowners insurance (your lender manages it).",
    category: "Financing & Mortgage",
    relatedTerms: ["Property tax", "Homeowners insurance"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-property-tax",
    term: "Property tax",
    plainDefinition:
      "Annual tax you pay to the local government based on your home's value. Amount varies by location.",
    category: "Financing & Mortgage",
    relatedTerms: ["Escrow account", "Tax assessment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-homeowners-insurance",
    term: "Homeowners insurance",
    plainDefinition:
      "Insurance that protects your home against damage from fire, theft, weather, etc. Required by lenders.",
    category: "Financing & Mortgage",
    relatedTerms: ["Escrow account"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-hoa-fees",
    term: "HOA fees",
    plainDefinition:
      "Monthly or annual fees you pay if your home is in a planned community. Covers maintenance, common areas, amenities.",
    category: "Financing & Mortgage",
    relatedTerms: ["HOA (Homeowners Association)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-dti",
    term: "Debt-to-income ratio (DTI)",
    plainDefinition:
      "The percentage of your gross monthly income that goes toward debt payments (including the new mortgage). Lenders typically want this under 43%.",
    category: "Financing & Mortgage",
    relatedTerms: ["Underwriting", "Pre-approval"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-credit-score",
    term: "Credit score",
    plainDefinition:
      "A number (300\u2013850) that reflects your credit history and ability to repay loans. Higher scores get better interest rates.",
    category: "Financing & Mortgage",
    relatedTerms: ["Underwriting", "Interest rate"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-underwriting",
    term: "Underwriting",
    plainDefinition:
      "The lender's process of reviewing your finances, credit, employment, and the property to approve the loan.",
    category: "Financing & Mortgage",
    relatedTerms: ["Loan commitment", "Clear to close"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-loan-commitment",
    term: "Loan commitment",
    plainDefinition:
      "The lender's written promise to fund your loan if all conditions are met.",
    category: "Financing & Mortgage",
    relatedTerms: ["Underwriting", "Clear to close"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-clear-to-close",
    term: "Clear to close",
    plainDefinition:
      "The lender's final approval\u2014all conditions have been met and the loan is ready to fund.",
    category: "Financing & Mortgage",
    relatedTerms: ["Underwriting", "Loan commitment", "Closing disclosure"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-closing-disclosure",
    term: "Closing disclosure",
    plainDefinition:
      "A document showing all the loan terms, interest rate, monthly payment, and closing costs. You receive it 3 days before closing.",
    category: "Financing & Mortgage",
    relatedTerms: ["Clear to close", "Closing costs"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Title & Ownership ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-title-insurance",
    term: "Title insurance",
    plainDefinition:
      "Insurance that protects you against legal claims on the property or title defects discovered later. Usually a one-time fee at closing.",
    category: "Title & Ownership",
    relatedTerms: ["Title company", "Title search", "Title defect"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-title-company",
    term: "Title company",
    plainDefinition:
      "The neutral third party that handles the closing, verifies ownership, and issues title insurance.",
    category: "Title & Ownership",
    relatedTerms: ["Title insurance", "Closing"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-deed",
    term: "Deed",
    plainDefinition:
      "The legal document that transfers ownership of the property from seller to buyer.",
    category: "Title & Ownership",
    relatedTerms: ["Warranty deed", "Quitclaim deed", "Recorded deed"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-warranty-deed",
    term: "Warranty deed",
    plainDefinition:
      "A deed where the seller guarantees they own the property free and clear and have the right to sell it.",
    category: "Title & Ownership",
    relatedTerms: ["Deed", "Quitclaim deed"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-quitclaim-deed",
    term: "Quitclaim deed",
    plainDefinition:
      "A deed where the seller transfers whatever interest they have without guaranteeing they fully own it (less protection for buyer).",
    category: "Title & Ownership",
    relatedTerms: ["Deed", "Warranty deed"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-title-defect",
    term: "Title defect",
    plainDefinition:
      "A problem with ownership, such as a lien, unpaid debt, or unclear ownership history.",
    category: "Title & Ownership",
    relatedTerms: ["Cloud on title", "Lien", "Title insurance"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-lien",
    term: "Lien",
    plainDefinition:
      "A legal claim against the property because of unpaid debt (property taxes, contractor work, judgment, etc.).",
    category: "Title & Ownership",
    relatedTerms: ["Judgment lien", "Tax lien", "Mechanic's lien"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-judgment-lien",
    term: "Judgment lien",
    plainDefinition:
      "A lien placed on the property because someone won a court case against the owner for unpaid debt.",
    category: "Title & Ownership",
    relatedTerms: ["Lien"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-tax-lien",
    term: "Tax lien",
    plainDefinition:
      "A lien placed on the property for unpaid property taxes or income taxes.",
    category: "Title & Ownership",
    relatedTerms: ["Lien", "Property tax"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mechanics-lien",
    term: "Mechanic's lien",
    plainDefinition:
      "A lien placed on the property by contractors or suppliers who weren't paid for work or materials.",
    category: "Title & Ownership",
    relatedTerms: ["Lien"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-ucc-filing",
    term: "UCC filing",
    plainDefinition:
      "A public record filed for personal property claims (like equipment or fixtures used in business on the property).",
    category: "Title & Ownership",
    relatedTerms: ["Lien", "Encumbrance"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cloud-on-title",
    term: "Cloud on title",
    plainDefinition:
      "An issue or claim that makes the title unclear or questionable.",
    category: "Title & Ownership",
    relatedTerms: ["Title defect", "Title search"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-encumbrance",
    term: "Encumbrance",
    plainDefinition:
      "Any claim, lien, or restriction on the property that could affect your ownership or use of it.",
    category: "Title & Ownership",
    relatedTerms: ["Lien", "Easement", "Deed restriction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-easement",
    term: "Easement",
    plainDefinition:
      "The legal right for someone else to use part of your property (e.g., utility company needs access for power lines).",
    category: "Title & Ownership",
    relatedTerms: ["Encumbrance", "Deed restriction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-covenant",
    term: "Covenant",
    plainDefinition:
      "A rule or restriction on how the property can be used (e.g., \u201cno commercial businesses allowed\u201d).",
    category: "Title & Ownership",
    relatedTerms: ["Deed restriction", "HOA (Homeowners Association)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-deed-restriction",
    term: "Deed restriction",
    plainDefinition:
      "A legal limitation on how the property can be used, often tied to the original developer or neighborhood rules.",
    category: "Title & Ownership",
    relatedTerms: ["Covenant", "Encumbrance"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Closing & Settlement ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-closing",
    term: "Closing",
    plainDefinition:
      "The final meeting where you sign all documents, get the keys, and officially become the owner. The lender funds the loan and the deed is recorded.",
    category: "Closing & Settlement",
    relatedTerms: ["Settlement", "Closing costs", "Closing date"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-settlement",
    term: "Settlement",
    plainDefinition:
      "Another term for closing; when all parties come together to finalize the sale.",
    category: "Closing & Settlement",
    relatedTerms: ["Closing"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-closing-attorney",
    term: "Closing attorney / Closing agent",
    plainDefinition:
      "The lawyer or professional who oversees the closing, verifies documents, and ensures everything is legal and correct.",
    category: "Closing & Settlement",
    relatedTerms: ["Closing", "Title company"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-closing-costs",
    term: "Closing costs",
    plainDefinition:
      "Fees and charges paid at closing, including title insurance, appraisal, underwriting, attorney fees, taxes, etc. Usually 2\u20135% of the purchase price.",
    category: "Closing & Settlement",
    buyerContext:
      "Ask your lender for a closing cost estimate early so there are no surprises.",
    sellerContext:
      "Your closing costs include agent commission, transfer taxes, and attorney fees.",
    relatedTerms: ["Buyer closing costs", "Seller closing costs", "Closing disclosure"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-seller-concessions",
    term: "Seller concessions",
    plainDefinition:
      "Money the seller agrees to pay toward the buyer's closing costs (instead of lowering the price).",
    category: "Closing & Settlement",
    relatedTerms: ["Closing costs", "Repair credit"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-buyer-closing-costs",
    term: "Buyer closing costs",
    plainDefinition:
      "Fees the buyer pays at closing (appraisal, inspection, title insurance, lender fees, attorney, taxes, etc.).",
    category: "Closing & Settlement",
    relatedTerms: ["Closing costs", "Seller concessions"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-seller-closing-costs",
    term: "Seller closing costs",
    plainDefinition:
      "Fees the seller pays at closing (realtor commission, title insurance, transfer taxes, attorney fees, etc.).",
    category: "Closing & Settlement",
    relatedTerms: ["Closing costs", "Realtor commission"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-realtor-commission",
    term: "Realtor commission",
    plainDefinition:
      "The fee paid to real estate agents, typically 5\u20136% of the sale price, split between buyer's and seller's agents. Usually paid by the seller.",
    category: "Closing & Settlement",
    relatedTerms: ["Commission split", "Seller closing costs"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-title-insurance-premium",
    term: "Title insurance premium",
    plainDefinition:
      "The one-time fee for title insurance, protecting against ownership claims and title defects.",
    category: "Closing & Settlement",
    relatedTerms: ["Title insurance", "Closing costs"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-closing-date",
    term: "Closing date",
    plainDefinition:
      "The agreed-upon day when the sale officially closes and you become the owner.",
    category: "Closing & Settlement",
    relatedTerms: ["Closing", "Possession date"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-walk-through",
    term: "Walk-through / Final walk-through",
    plainDefinition:
      "A last visit to the property before closing to verify repairs were made and the home is in the agreed-upon condition.",
    category: "Closing & Settlement",
    relatedTerms: ["Closing", "Repair request"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-wire-transfer",
    term: "Wire transfer",
    plainDefinition:
      "The electronic transfer of your down payment and closing costs to the title company before closing.",
    category: "Closing & Settlement",
    relatedTerms: ["Closing costs", "Down payment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-recorded-deed",
    term: "Recorded deed",
    plainDefinition:
      "The deed is officially filed with the county, making the transfer of ownership public record and legally binding.",
    category: "Closing & Settlement",
    relatedTerms: ["Deed", "Closing"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-possession-date",
    term: "Possession date",
    plainDefinition:
      "The date you get the keys and can move into the property (usually the closing date).",
    category: "Closing & Settlement",
    relatedTerms: ["Closing date", "Keys"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-keys",
    term: "Keys",
    plainDefinition:
      "Physical or digital access to the home; you receive them at closing.",
    category: "Closing & Settlement",
    relatedTerms: ["Possession date", "Closing"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Contingencies ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-contingency",
    term: "Contingency",
    plainDefinition:
      "A condition that must be met for the sale to happen. If the condition isn't met, you can walk away without penalty.",
    category: "Contingencies",
    relatedTerms: ["Contingencies", "Inspection contingency", "Financing contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-inspection-contingency",
    term: "Inspection contingency",
    plainDefinition:
      "The sale is conditional on the home passing inspection or you being satisfied with repairs.",
    category: "Contingencies",
    relatedTerms: ["Home inspection", "Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-sale-contingency",
    term: "Sale of buyer's current home contingency",
    plainDefinition:
      "The sale is conditional on the buyer successfully selling their current home (common for people buying before selling).",
    category: "Contingencies",
    relatedTerms: ["Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-insurance-contingency",
    term: "Insurance contingency",
    plainDefinition:
      "The sale is conditional on the home being insurable at a reasonable cost.",
    category: "Contingencies",
    relatedTerms: ["Homeowners insurance", "Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-hoa-approval-contingency",
    term: "HOA approval contingency",
    plainDefinition:
      "The sale is conditional on the HOA approving the new buyer (some communities have approval requirements).",
    category: "Contingencies",
    relatedTerms: ["HOA (Homeowners Association)", "Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-radon-contingency",
    term: "Radon contingency",
    plainDefinition:
      "The sale is conditional on radon testing results being acceptable or the seller fixing radon issues.",
    category: "Contingencies",
    relatedTerms: ["Radon", "Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-termite-contingency",
    term: "Termite/Pest inspection contingency",
    plainDefinition:
      "The sale is conditional on a pest inspection showing no major termite or pest problems.",
    category: "Contingencies",
    relatedTerms: ["Termites / Pests", "Contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-contingency-removal",
    term: "Clear to close contingency removal",
    plainDefinition:
      "When all contingencies have been satisfied and the sale can proceed to closing.",
    category: "Contingencies",
    relatedTerms: ["Contingency", "Clear to close"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Property Types & Structures ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-single-family",
    term: "Single-family home",
    plainDefinition:
      "A house designed for one family with its own lot; doesn't share walls with other homes.",
    category: "Property Types & Structures",
    relatedTerms: ["Condo / Condominium", "Townhome"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-condo",
    term: "Condo / Condominium",
    plainDefinition:
      "A unit in a multi-unit building where you own the interior space and share ownership of common areas. Subject to HOA fees.",
    category: "Property Types & Structures",
    relatedTerms: ["HOA fees", "Condo association"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-townhome",
    term: "Townhome",
    plainDefinition:
      "A narrow, multi-story home, usually attached to other townhomes by shared walls, with its own entrance and yard.",
    category: "Property Types & Structures",
    relatedTerms: ["Single-family home", "Condo / Condominium"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-multi-family",
    term: "Multi-family",
    plainDefinition:
      "A building with multiple rental units (duplex, triplex, four-plex, apartment complex, etc.).",
    category: "Property Types & Structures",
    relatedTerms: ["Duplex", "Triplex", "Four-plex"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-duplex",
    term: "Duplex",
    plainDefinition:
      "A property with two separate living units (can be side-by-side or stacked), each with its own entrance.",
    category: "Property Types & Structures",
    relatedTerms: ["Multi-family", "Triplex"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-triplex",
    term: "Triplex",
    plainDefinition: "A property with three separate living units.",
    category: "Property Types & Structures",
    relatedTerms: ["Multi-family", "Duplex", "Four-plex"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-four-plex",
    term: "Four-plex",
    plainDefinition: "A property with four separate living units.",
    category: "Property Types & Structures",
    relatedTerms: ["Multi-family", "Triplex"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-vacant-land",
    term: "Land / Vacant land",
    plainDefinition:
      "Raw, undeveloped property with no building on it.",
    category: "Property Types & Structures",
    relatedTerms: ["Acreage", "Zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-commercial-property",
    term: "Commercial property",
    plainDefinition:
      "Property used for business purposes (office, retail, restaurant, warehouse, etc.), not residential.",
    category: "Property Types & Structures",
    relatedTerms: ["Commercial zoning", "Investment property"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-investment-property",
    term: "Investment property",
    plainDefinition:
      "Property purchased with the intention of making money through rental income or resale (not your primary home).",
    category: "Property Types & Structures",
    relatedTerms: ["Rental income", "Primary residence"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-primary-residence",
    term: "Primary residence",
    plainDefinition:
      "The home where you live most of the time; eligible for certain tax benefits and may have different financing rules.",
    category: "Property Types & Structures",
    relatedTerms: ["Second home / Vacation home", "Investment property"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-second-home",
    term: "Second home / Vacation home",
    plainDefinition:
      "A property you own in addition to your primary residence, used occasionally.",
    category: "Property Types & Structures",
    relatedTerms: ["Primary residence"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-fixer-upper",
    term: "Fixer-upper",
    plainDefinition:
      "A home that needs significant repairs or renovations, typically priced lower because of its condition.",
    category: "Property Types & Structures",
    relatedTerms: ["As-is condition", "Rehab / Renovation"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Property Features & Condition ━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-square-footage",
    term: "Square footage",
    plainDefinition:
      "The total interior living space of the home, measured in square feet.",
    category: "Property Features & Condition",
    relatedTerms: ["Lot size"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-lot-size",
    term: "Lot size",
    plainDefinition:
      "The total land area the property sits on, usually measured in square feet or acres.",
    category: "Property Features & Condition",
    relatedTerms: ["Square footage", "Acreage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-bedroom",
    term: "Bedroom (BR)",
    plainDefinition:
      "A room designed for sleeping (typically has a closet and window).",
    category: "Property Features & Condition",
    relatedTerms: ["Bathroom (BA)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-bathroom",
    term: "Bathroom (BA)",
    plainDefinition:
      "A room with a toilet and sink; a full bath includes a bathtub or shower.",
    category: "Property Features & Condition",
    relatedTerms: ["Half-bath", "Full bath"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-half-bath",
    term: "Half-bath",
    plainDefinition:
      "A bathroom with only a toilet and sink (no shower or tub).",
    category: "Property Features & Condition",
    relatedTerms: ["Full bath", "Bathroom (BA)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-full-bath",
    term: "Full bath",
    plainDefinition:
      "A complete bathroom with toilet, sink, shower, and/or bathtub.",
    category: "Property Features & Condition",
    relatedTerms: ["Half-bath", "Bathroom (BA)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-kitchen",
    term: "Kitchen",
    plainDefinition: "The room for cooking and food preparation.",
    category: "Property Features & Condition",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-living-room",
    term: "Living room",
    plainDefinition: "The main gathering space in the home.",
    category: "Property Features & Condition",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-garage",
    term: "Garage",
    plainDefinition:
      "An enclosed space for parking vehicles, which may also be used for storage.",
    category: "Property Features & Condition",
    relatedTerms: ["Parking space"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-parking-space",
    term: "Parking space",
    plainDefinition:
      "A designated area for parking a vehicle (especially in condos or apartments).",
    category: "Property Features & Condition",
    relatedTerms: ["Garage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-basement",
    term: "Basement",
    plainDefinition:
      "The level(s) below ground; can be finished (living space) or unfinished (storage/utility space).",
    category: "Property Features & Condition",
    relatedTerms: ["Crawl space"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-crawl-space",
    term: "Crawl space",
    plainDefinition:
      "A shallow area between the ground and the first floor, used for utilities and ventilation.",
    category: "Property Features & Condition",
    relatedTerms: ["Basement", "Foundation"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-attic",
    term: "Attic",
    plainDefinition:
      "The space under the roof, typically used for storage or can be finished into living space.",
    category: "Property Features & Condition",
    relatedTerms: ["Roof"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-roof",
    term: "Roof",
    plainDefinition:
      "The covering that protects the home from weather; typically lasts 15\u201325 years depending on material.",
    category: "Property Features & Condition",
    relatedTerms: ["Structural integrity"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-plumbing",
    term: "Plumbing",
    plainDefinition:
      "The system of pipes and fixtures for water and sewage.",
    category: "Property Features & Condition",
    relatedTerms: ["HVAC", "Electrical"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-electrical",
    term: "Electrical",
    plainDefinition:
      "The system that delivers power throughout the home; includes wiring, panel, outlets.",
    category: "Property Features & Condition",
    relatedTerms: ["Plumbing", "HVAC"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-hvac",
    term: "HVAC",
    plainDefinition:
      "Heating, Ventilation, and Air Conditioning\u2014the system that controls temperature and air quality.",
    category: "Property Features & Condition",
    relatedTerms: ["Plumbing", "Electrical"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-foundation",
    term: "Foundation",
    plainDefinition:
      "The base structure that supports the entire home; critical to structural integrity.",
    category: "Property Features & Condition",
    relatedTerms: ["Structural integrity", "Foundation problem"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-structural-integrity",
    term: "Structural integrity",
    plainDefinition:
      "The overall soundness of the home's structure; no major cracks, settling, or damage.",
    category: "Property Features & Condition",
    relatedTerms: ["Foundation", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-as-is",
    term: "As-is condition",
    plainDefinition:
      "The home is sold in its current state with no repairs by the seller.",
    category: "Property Features & Condition",
    relatedTerms: ["Fixer-upper", "Repair request"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-move-in-ready",
    term: "Move-in ready",
    plainDefinition:
      "The home is in good condition and ready to live in immediately after closing.",
    category: "Property Features & Condition",
    relatedTerms: ["As-is condition"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Special Assessments & Fees ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-hoa",
    term: "HOA (Homeowners Association)",
    plainDefinition:
      "An organization in a planned community that sets rules, maintains common areas, and collects fees from residents.",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA fees", "Special assessment", "Covenant"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-hoa-dues",
    term: "HOA fees / Dues",
    plainDefinition:
      "Monthly or annual fees paid to the HOA to cover maintenance, insurance, and amenities.",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA (Homeowners Association)", "Special assessment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-special-assessment",
    term: "Special assessment",
    plainDefinition:
      "An extra one-time fee charged by the HOA for unexpected major repairs or improvements (roof replacement, parking lot resurfacing, etc.).",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA (Homeowners Association)", "Building assessment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-condo-association",
    term: "Condo association",
    plainDefinition:
      "Similar to an HOA but specifically for condo buildings; manages the building, insurance, and common areas.",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA (Homeowners Association)", "Condo / Condominium"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-building-assessment",
    term: "Building assessment",
    plainDefinition:
      "An evaluation of a condo or multi-unit building to determine if major repairs are needed soon.",
    category: "Special Assessments & Fees",
    relatedTerms: ["Special assessment", "Condo association"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-community-amenities",
    term: "Community amenities",
    plainDefinition:
      "Shared facilities in a planned community (pool, gym, clubhouse, tennis courts, parks, etc.).",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA (Homeowners Association)", "HOA fees / Dues"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mandatory-membership",
    term: "Mandatory membership",
    plainDefinition:
      "You're required to join and pay fees for the HOA or condo association if you own property in the community.",
    category: "Special Assessments & Fees",
    relatedTerms: ["HOA (Homeowners Association)"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Investment-Specific Terms ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-rental-income",
    term: "Rental income",
    plainDefinition:
      "The money you collect from tenants each month for renting the property.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Cash flow", "Tenant"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-tenant",
    term: "Tenant",
    plainDefinition:
      "A person who rents and lives in your property.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Lease", "Rental income"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-lease",
    term: "Lease",
    plainDefinition:
      "A legal contract between landlord and tenant stating rent amount, lease term, rules, and responsibilities.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Tenant", "Eviction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-eviction",
    term: "Eviction",
    plainDefinition:
      "The legal process of removing a tenant who hasn't paid rent or violated the lease.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Tenant", "Lease"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cash-flow",
    term: "Cash flow",
    plainDefinition:
      "The monthly or yearly profit after subtracting all expenses (mortgage, taxes, insurance, maintenance, etc.) from rental income.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Rental income", "Operating expenses", "Net operating income (NOI)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cap-rate",
    term: "Cap rate (Capitalization rate)",
    plainDefinition:
      "A way to measure investment return. Calculated as: Net Operating Income \u00f7 Property Price. Higher cap rates often mean better returns for investors.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Net operating income (NOI)", "Cash-on-cash return"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cash-on-cash",
    term: "Cash-on-cash return",
    plainDefinition:
      "The annual profit compared to the amount of cash you actually invested (your down payment and closing costs).",
    category: "Investment-Specific Terms",
    relatedTerms: ["Return on investment (ROI)", "Cap rate (Capitalization rate)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-roi",
    term: "Return on investment (ROI)",
    plainDefinition:
      "The percentage of profit you make on your investment compared to the money you put in.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Cash-on-cash return", "Cap rate (Capitalization rate)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-buy-and-hold",
    term: "Buy-and-hold strategy",
    plainDefinition:
      "Purchasing a property and keeping it long-term to collect rent and benefit from appreciation.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Fix-and-flip", "Cash flow"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-fix-and-flip",
    term: "Fix-and-flip",
    plainDefinition:
      "Buying a property that needs work, renovating it, and selling it for profit (typically within 6\u201312 months).",
    category: "Investment-Specific Terms",
    relatedTerms: ["ARV (After Repair Value)", "Flip", "Rehab / Renovation"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-wholesale",
    term: "Wholesale",
    plainDefinition:
      "A short-term investing strategy where you get a property under contract and sell the contract to another investor for profit without rehabbing.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Assignment of contract", "Bird dog"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-bird-dog",
    term: "Bird dog",
    plainDefinition:
      "Someone who finds deals and brings them to investors, often earning a finder's fee.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Wholesale"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-assignment-of-contract",
    term: "Assignment of contract",
    plainDefinition:
      "The ability to transfer your contract rights to another buyer/investor before closing.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Wholesale"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-due-diligence",
    term: "Due diligence",
    plainDefinition:
      "The research and investigation you do on a property before making an offer (inspections, title work, market analysis, etc.).",
    category: "Investment-Specific Terms",
    relatedTerms: ["Home inspection", "Title search", "Investment analysis"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-rehab",
    term: "Rehab / Renovation",
    plainDefinition:
      "Repairing and upgrading a property to increase its value or appeal.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Fix-and-flip", "ARV (After Repair Value)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-vacancy-rate",
    term: "Vacancy rate",
    plainDefinition:
      "The percentage of time a rental property sits empty without a tenant.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Rental income", "Operating expenses"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-operating-expenses",
    term: "Operating expenses",
    plainDefinition:
      "The costs to run a rental property: mortgage, insurance, property taxes, maintenance, utilities (if you pay them), management fees, vacancy reserves.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Net operating income (NOI)", "Cash flow"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-noi",
    term: "Net operating income (NOI)",
    plainDefinition:
      "The profit from a rental property before accounting for debt service (mortgage payments). Calculated as: Gross Income - Operating Expenses.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Operating expenses", "Cap rate (Capitalization rate)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-1031-exchange",
    term: "1031 exchange",
    plainDefinition:
      "A tax-advantaged strategy allowing you to sell one investment property and buy another without paying capital gains tax (must follow strict rules).",
    category: "Investment-Specific Terms",
    relatedTerms: ["Like-kind property", "Capital gains"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-like-kind-property",
    term: "Like-kind property",
    plainDefinition:
      "In a 1031 exchange, the replacement property must be \"like-kind\"\u2014generally means investment real estate (rules vary by property type).",
    category: "Investment-Specific Terms",
    relatedTerms: ["1031 exchange"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-depreciation",
    term: "Depreciation",
    plainDefinition:
      "An accounting deduction that allows you to deduct a portion of the property's value each year on your taxes, reducing your taxable income.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Cost basis", "Depreciation deduction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cost-basis",
    term: "Cost basis",
    plainDefinition:
      "The original purchase price plus improvements and costs\u2014used to calculate capital gains when you sell.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Capital gains", "Depreciation"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-capital-gains",
    term: "Capital gains",
    plainDefinition:
      "The profit you make when you sell a property for more than you paid for it (cost basis).",
    category: "Investment-Specific Terms",
    relatedTerms: ["Short-term capital gains", "Long-term capital gains", "Cost basis"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-short-term-capital-gains",
    term: "Short-term capital gains",
    plainDefinition:
      "Profit from selling a property you've owned less than 1 year; taxed as ordinary income (higher tax rate).",
    category: "Investment-Specific Terms",
    relatedTerms: ["Long-term capital gains", "Capital gains"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-long-term-capital-gains",
    term: "Long-term capital gains",
    plainDefinition:
      "Profit from selling a property you've owned more than 1 year; taxed at a lower, preferential rate.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Short-term capital gains", "Capital gains"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-investment-analysis",
    term: "Investment analysis",
    plainDefinition:
      "A detailed evaluation of a potential investment property's financial potential and risks.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Property analysis", "Due diligence"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-property-analysis",
    term: "Property analysis",
    plainDefinition:
      "Researching a property's condition, location, market value, and investment potential.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Investment analysis", "Due diligence"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-flip",
    term: "Flip",
    plainDefinition:
      "To buy a property, make improvements, and sell it quickly for profit.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Fix-and-flip", "ARV (After Repair Value)"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-arv",
    term: "ARV (After Repair Value)",
    plainDefinition:
      "The estimated value of a property after all renovations are completed; used to determine if a fix-and-flip deal is profitable.",
    category: "Investment-Specific Terms",
    relatedTerms: ["Fix-and-flip", "Rehab / Renovation"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Land & Farm-Specific ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-acreage",
    term: "Acreage",
    plainDefinition:
      "The total amount of land measured in acres (1 acre = 43,560 square feet).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Lot size", "Land / Vacant land"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-zoning",
    term: "Zoning",
    plainDefinition:
      "Government regulations that determine what a property can be used for (residential, commercial, agricultural, etc.).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Agricultural zoning", "Residential zoning", "Commercial zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-agricultural-zoning",
    term: "Agricultural zoning",
    plainDefinition:
      "Land zoned for farming, crops, livestock, and farm operations (not residential homes).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Zoning", "Farm classification"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-residential-zoning",
    term: "Residential zoning",
    plainDefinition: "Land designated for homes and residential use.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Zoning", "Commercial zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-commercial-zoning",
    term: "Commercial zoning",
    plainDefinition:
      "Land designated for business use (offices, retail, restaurants, etc.).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Zoning", "Residential zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-farm-classification",
    term: "Farm classification",
    plainDefinition:
      "A legal designation that qualifies property for agricultural tax benefits in some states (usually requires minimum acreage and income from farming).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Agricultural zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-timber-rights",
    term: "Timber rights",
    plainDefinition:
      "The legal right to harvest and sell timber from the property.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Mineral rights", "Water rights"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mineral-rights",
    term: "Mineral rights",
    plainDefinition:
      "The legal right to extract and profit from minerals (oil, gas, coal, etc.) beneath the property.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Timber rights", "Water rights"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-water-rights",
    term: "Water rights",
    plainDefinition:
      "The legal right to use water from a well, spring, or stream on the property.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Timber rights", "Mineral rights"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-pasture",
    term: "Pasture",
    plainDefinition:
      "Land used for grazing livestock (cattle, sheep, horses, etc.).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Cropland", "Hay land"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-cropland",
    term: "Cropland",
    plainDefinition:
      "Land used for growing crops (corn, soybeans, hay, etc.).",
    category: "Land & Farm-Specific",
    relatedTerms: ["Pasture", "Hay land"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-hay-land",
    term: "Hay land",
    plainDefinition: "Land dedicated to growing hay for animal feed.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Cropland", "Pasture"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-subdivision-potential",
    term: "Subdivision potential",
    plainDefinition:
      "Whether the land can legally be divided into smaller parcels and sold separately.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Development potential", "Zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-development-potential",
    term: "Development potential",
    plainDefinition:
      "The possibility of building or developing the land for residential, commercial, or other use.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Subdivision potential", "Zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-boundary-survey",
    term: "Boundary survey",
    plainDefinition:
      "A professional measurement and mapping of the exact property lines and borders.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Survey", "Property lines"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-survey",
    term: "Survey",
    plainDefinition:
      "A detailed map showing the property's legal boundaries, improvements, easements, and other features.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Boundary survey", "Property lines"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-property-lines",
    term: "Property lines",
    plainDefinition: "The official legal boundaries of your property.",
    category: "Land & Farm-Specific",
    relatedTerms: ["Survey", "Boundary survey", "Encroachment"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ New Construction ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-new-construction",
    term: "New construction",
    plainDefinition:
      "A home that has never been lived in before; recently built.",
    category: "New Construction",
    relatedTerms: ["Builder", "Construction loan"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-builder",
    term: "Builder",
    plainDefinition:
      "The company or individual responsible for constructing the home.",
    category: "New Construction",
    relatedTerms: ["Builder warranty", "Punch list"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-construction-loan",
    term: "Construction loan",
    plainDefinition:
      "A short-term loan that pays for the cost of building; converts to a permanent mortgage after completion.",
    category: "New Construction",
    relatedTerms: ["Permanent loan", "New construction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-permanent-loan",
    term: "Permanent loan",
    plainDefinition:
      "The long-term mortgage you get after construction is complete.",
    category: "New Construction",
    relatedTerms: ["Construction loan", "Mortgage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-warranty",
    term: "Warranty",
    plainDefinition:
      "A builder's promise to repair or fix problems that arise for a set period (typically 1\u201310 years depending on issue type).",
    category: "New Construction",
    relatedTerms: ["Builder warranty", "Structural warranty", "Mechanical warranty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-builder-warranty",
    term: "Builder warranty",
    plainDefinition:
      "The manufacturer's or builder's guarantee that systems and materials will work properly for a specific period.",
    category: "New Construction",
    relatedTerms: ["Warranty", "Structural warranty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-structural-warranty",
    term: "Structural warranty",
    plainDefinition:
      "A warranty covering major structural components (foundation, framing, roof) against defects, typically 10 years.",
    category: "New Construction",
    relatedTerms: ["Builder warranty", "Mechanical warranty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mechanical-warranty",
    term: "Mechanical warranty",
    plainDefinition:
      "A warranty covering mechanical systems (HVAC, plumbing, electrical) against defects, typically 2\u20135 years.",
    category: "New Construction",
    relatedTerms: ["Structural warranty", "Builder warranty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-punch-list",
    term: "Punch list",
    plainDefinition:
      "A detailed list of small repairs or touch-ups needed before you take possession of the new home.",
    category: "New Construction",
    relatedTerms: ["Final walk-through", "Builder"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-certificate-of-occupancy",
    term: "Certificate of Occupancy (CO)",
    plainDefinition:
      "The official government approval that the home is completed and safe to live in.",
    category: "New Construction",
    relatedTerms: ["New construction", "Builder closing"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-final-walk-through",
    term: "Final walk-through",
    plainDefinition:
      "Your inspection of the completed home before closing to verify all work is done and matches the contract.",
    category: "New Construction",
    relatedTerms: ["Punch list", "Builder closing"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-builder-closing",
    term: "Builder closing",
    plainDefinition:
      "The closing process for a new construction home; often handled slightly differently than resale closings.",
    category: "New Construction",
    relatedTerms: ["Closing", "New construction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-model-home",
    term: "Model home",
    plainDefinition:
      "A fully furnished and decorated home on the builder's property showing what homes in the development will look like.",
    category: "New Construction",
    relatedTerms: ["Spec home", "Custom build"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-spec-home",
    term: "Spec home",
    plainDefinition:
      "A home the builder constructed \"on speculation\" without a specific buyer, hoping to sell it after completion.",
    category: "New Construction",
    relatedTerms: ["Model home", "Custom build"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-custom-build",
    term: "Custom build",
    plainDefinition:
      "A home built specifically to your specifications and design preferences on your lot or the builder's lot.",
    category: "New Construction",
    relatedTerms: ["Model home", "Spec home", "Construction loan"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Taxes & Financial Aspects ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-tax-rate",
    term: "Tax rate",
    plainDefinition:
      "The percentage used to calculate your property tax based on the home's assessed value.",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Property tax", "Tax assessment"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-tax-assessment",
    term: "Tax assessment",
    plainDefinition:
      "The estimated value of your property used by the government to calculate property taxes.",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Property tax", "Tax rate"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-tax-credit",
    term: "Tax credit",
    plainDefinition:
      "A direct reduction in the taxes you owe (more valuable than a deduction).",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Mortgage interest deduction", "Property tax deduction"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-capital-gains-tax",
    term: "Capital gains tax",
    plainDefinition:
      "Federal tax on the profit you make when selling an investment property (different rates for short-term vs. long-term gains).",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Capital gains", "Short-term capital gains", "Long-term capital gains"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-inheritance-tax",
    term: "Inheritance tax",
    plainDefinition:
      "A tax paid when you inherit property (varies by state; some states don't have this).",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Gift tax"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-gift-tax",
    term: "Gift tax",
    plainDefinition:
      "A federal tax on large gifts of money or property, though there's an annual exclusion amount.",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Inheritance tax"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-1099",
    term: "1099 (for independent contractors / commissions)",
    plainDefinition:
      "A tax form issued to real estate agents and contractors reporting income earned (not a W-2 job).",
    category: "Taxes & Financial Aspects",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-schedule-e",
    term: "Schedule E (rental income on taxes)",
    plainDefinition:
      "The tax form where you report rental income and expenses from investment properties.",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Rental income", "Operating expenses"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-depreciation-deduction",
    term: "Depreciation deduction",
    plainDefinition:
      "A tax deduction allowing you to deduct a portion of a rental property's cost each year, reducing taxable income.",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Depreciation", "Cost basis"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mortgage-interest-deduction",
    term: "Mortgage interest deduction",
    plainDefinition:
      "A tax deduction for interest paid on your primary home mortgage (available if you itemize deductions).",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Property tax deduction", "Interest rate"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-property-tax-deduction",
    term: "Property tax deduction",
    plainDefinition:
      "A tax deduction for property taxes paid on your primary home (available if you itemize deductions).",
    category: "Taxes & Financial Aspects",
    relatedTerms: ["Mortgage interest deduction", "Property tax"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Legal & Administrative ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-re-attorney",
    term: "Attorney / Real estate attorney",
    plainDefinition:
      "A lawyer specializing in real estate who reviews contracts, handles closings, and provides legal advice.",
    category: "Legal & Administrative",
    relatedTerms: ["Closing attorney / Closing agent"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-realtor",
    term: "REALTOR\u00ae (trademarked term)",
    plainDefinition:
      "A registered trademark for real estate agents who are members of the National Association of REALTORS and follow a code of ethics.",
    category: "Legal & Administrative",
    relatedTerms: ["License", "Commission split"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-license",
    term: "License",
    plainDefinition:
      "The official credential required to legally work as a real estate agent or broker.",
    category: "Legal & Administrative",
    relatedTerms: ["Broker's license", "Salesperson's license"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-brokers-license",
    term: "Broker's license",
    plainDefinition:
      "A higher-level license allowing someone to operate their own real estate brokerage and supervise agents.",
    category: "Legal & Administrative",
    relatedTerms: ["License", "Salesperson's license"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-salespersons-license",
    term: "Salesperson's license",
    plainDefinition:
      "A real estate license allowing someone to work as an agent under a broker.",
    category: "Legal & Administrative",
    relatedTerms: ["License", "Broker's license"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-commission-split",
    term: "Commission split",
    plainDefinition:
      "How the total real estate commission is divided among the involved agents (often 50-50 or by agreement).",
    category: "Legal & Administrative",
    relatedTerms: ["Realtor commission"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-dual-agency",
    term: "Dual agency",
    plainDefinition:
      "When one agent or brokerage represents both the buyer and seller in the same transaction (must disclose and buyer/seller must consent).",
    category: "Legal & Administrative",
    relatedTerms: ["Conflict of interest", "Fiduciary duty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-conflict-of-interest",
    term: "Conflict of interest",
    plainDefinition:
      "A situation where an agent's loyalties or financial interests are divided, compromising their ability to serve a client fairly.",
    category: "Legal & Administrative",
    relatedTerms: ["Dual agency", "Fiduciary duty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-fiduciary-duty",
    term: "Fiduciary duty",
    plainDefinition:
      "The legal obligation of an agent to act in the best interest of their client, not themselves.",
    category: "Legal & Administrative",
    relatedTerms: ["Dual agency", "Conflict of interest"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-statute-of-frauds",
    term: "Statute of frauds",
    plainDefinition:
      "A law requiring certain contracts (including real estate) to be in writing to be enforceable.",
    category: "Legal & Administrative",
    relatedTerms: ["Contract", "Purchase agreement"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Issues & Problems ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-defect",
    term: "Defect",
    plainDefinition:
      "A problem or flaw with the property (structural, mechanical, cosmetic, etc.).",
    category: "Issues & Problems",
    relatedTerms: ["Defective title", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-defective-title",
    term: "Defective title",
    plainDefinition:
      "A problem with ownership, such as liens, unpaid debts, or unclear ownership history.",
    category: "Issues & Problems",
    relatedTerms: ["Title defect", "Cloud on title"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-encroachment",
    term: "Encroachment",
    plainDefinition:
      "When a neighbor's structure or improvement crosses onto your property line.",
    category: "Issues & Problems",
    relatedTerms: ["Property lines", "Survey"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-code-violation",
    term: "Code violation",
    plainDefinition:
      "When a property doesn't meet local building codes or regulations.",
    category: "Issues & Problems",
    relatedTerms: ["Code enforcement", "Non-compliant"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-code-enforcement",
    term: "Code enforcement",
    plainDefinition:
      "The government agency that ensures properties comply with local building and zoning codes.",
    category: "Issues & Problems",
    relatedTerms: ["Code violation", "Non-compliant"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-non-compliant",
    term: "Non-compliant",
    plainDefinition:
      "A property that doesn't meet current building codes or regulations.",
    category: "Issues & Problems",
    relatedTerms: ["Code violation", "Code enforcement"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-unpermitted-work",
    term: "Unpermitted work / Unpermitted addition",
    plainDefinition:
      "Work or improvements done without the required building permits and inspections.",
    category: "Issues & Problems",
    relatedTerms: ["Code violation", "Non-compliant"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-structural-issue",
    term: "Structural issue",
    plainDefinition:
      "A problem with the home's foundation, frame, or major supporting elements.",
    category: "Issues & Problems",
    relatedTerms: ["Foundation problem", "Structural integrity"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-foundation-problem",
    term: "Foundation problem",
    plainDefinition:
      "Cracks, settling, water damage, or weakness in the foundation (serious and expensive to fix).",
    category: "Issues & Problems",
    relatedTerms: ["Foundation", "Structural issue"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-water-damage",
    term: "Water damage",
    plainDefinition:
      "Damage caused by water intrusion (leaks, flooding, moisture), leading to rot, mold, or structural damage.",
    category: "Issues & Problems",
    relatedTerms: ["Mold", "Flood zone"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mold",
    term: "Mold",
    plainDefinition:
      "Fungal growth (often from moisture) that can cause health problems and requires professional remediation.",
    category: "Issues & Problems",
    relatedTerms: ["Water damage"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-radon",
    term: "Radon",
    plainDefinition:
      "A colorless, odorless radioactive gas that can accumulate in basements and cause lung cancer; detected by testing.",
    category: "Issues & Problems",
    relatedTerms: ["Radon contingency", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-termites",
    term: "Termites / Pests",
    plainDefinition:
      "Wood-eating insects or other pests that can cause structural damage; detected by pest inspection.",
    category: "Issues & Problems",
    relatedTerms: ["Termite/Pest inspection contingency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-asbestos",
    term: "Asbestos",
    plainDefinition:
      "A hazardous material used in older homes for insulation and fireproofing; poses serious health risks if disturbed.",
    category: "Issues & Problems",
    relatedTerms: ["Lead paint", "Home inspection"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-lead-paint",
    term: "Lead paint",
    plainDefinition:
      "Paint used before 1978 that contains lead, a toxic substance especially harmful to children; requires professional testing and removal.",
    category: "Issues & Problems",
    relatedTerms: ["Asbestos", "Property condition disclosure"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-septic-system",
    term: "Septic system",
    plainDefinition:
      "A private waste treatment system (instead of municipal sewer) that treats household waste on-site; requires regular maintenance.",
    category: "Issues & Problems",
    relatedTerms: ["Well water"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-well-water",
    term: "Well water",
    plainDefinition:
      "Private water source instead of municipal water; requires testing for safety and regular maintenance.",
    category: "Issues & Problems",
    relatedTerms: ["Septic system"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-flood-zone",
    term: "Flood zone",
    plainDefinition:
      "An area determined by FEMA to have high risk of flooding; affects insurance costs and may require special flood insurance.",
    category: "Issues & Problems",
    relatedTerms: ["Flood insurance", "FEMA flood map"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-flood-insurance",
    term: "Flood insurance",
    plainDefinition:
      "Insurance protecting against water damage from flooding; required if the property is in a flood zone.",
    category: "Issues & Problems",
    relatedTerms: ["Flood zone", "FEMA flood map"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-fema-flood-map",
    term: "FEMA flood map",
    plainDefinition:
      "The official map showing which areas are in flood zones and the level of flood risk.",
    category: "Issues & Problems",
    relatedTerms: ["Flood zone", "Flood insurance"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-wetlands",
    term: "Wetlands",
    plainDefinition:
      "Environmentally protected areas with water and special ecosystems; building restrictions apply.",
    category: "Issues & Problems",
    relatedTerms: ["Environmental issue", "Zoning"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-environmental-issue",
    term: "Environmental issue",
    plainDefinition:
      "A contamination or pollution problem with the land or groundwater that may affect the property's value and use.",
    category: "Issues & Problems",
    relatedTerms: ["Wetlands", "Due diligence"],
    createdAt: new Date("2025-01-01"),
  },

  // ━━ Communication & Timelines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "default-due-diligence-period",
    term: "Due diligence period",
    plainDefinition:
      "The timeframe during which you can investigate the property, do inspections, and back out if needed.",
    category: "Communication & Timelines",
    relatedTerms: ["Due diligence", "Inspection period"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-deadline",
    term: "Deadline",
    plainDefinition:
      "The specific date and time by which an action must be completed (offer response, inspection completion, etc.).",
    category: "Communication & Timelines",
    relatedTerms: ["Extension", "Closing timeline"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-extension",
    term: "Extension",
    plainDefinition:
      "A written agreement to move a deadline to a later date.",
    category: "Communication & Timelines",
    relatedTerms: ["Deadline"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-notice",
    term: "Notice",
    plainDefinition:
      "A formal written communication (e.g., notice to remove contingencies, notice of default).",
    category: "Communication & Timelines",
    relatedTerms: ["Contingencies"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-communication",
    term: "Communication",
    plainDefinition:
      "Ongoing dialogue between buyer's agent, seller's agent, and attorneys to manage the transaction.",
    category: "Communication & Timelines",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-dual-agency-disclosure",
    term: "Dual agency disclosure",
    plainDefinition:
      "A document stating that the agent or brokerage represents both buyer and seller, and both parties acknowledge and consent.",
    category: "Communication & Timelines",
    relatedTerms: ["Dual agency"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-buyer-rep-agreement",
    term: "Buyer representation agreement",
    plainDefinition:
      "A contract between you and your real estate agent stating they represent your interests as a buyer.",
    category: "Communication & Timelines",
    relatedTerms: ["Listing agreement", "Fiduciary duty"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-listing-agreement",
    term: "Listing agreement",
    plainDefinition:
      "A contract between the seller and the real estate agent agreeing to list and sell the property (typically 90 days).",
    category: "Communication & Timelines",
    relatedTerms: ["Buyer representation agreement", "MLS listing period"],
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "default-mls-listing-period",
    term: "MLS listing period",
    plainDefinition:
      "How long a property is listed on the MLS (typically 90 days, can be extended or withdrawn).",
    category: "Communication & Timelines",
    relatedTerms: ["Multiple Listing Service (MLS)", "Listing agreement"],
    createdAt: new Date("2025-01-01"),
  },
];
