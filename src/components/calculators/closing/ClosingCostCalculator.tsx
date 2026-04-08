"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const STATE_OPTIONS = [
  { value: "custom", label: "Custom %" },
  { value: "AL", label: "Alabama" },
  { value: "AZ", label: "Arizona" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "KY", label: "Kentucky" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "NC", label: "North Carolina" },
  { value: "NJ", label: "New Jersey" },
  { value: "NY", label: "New York" },
  { value: "OH", label: "Ohio" },
  { value: "PA", label: "Pennsylvania" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
];

/** Approximate buyer closing cost % by state (of home price, excluding lender fees) */
const STATE_CLOSING_PCT: Record<string, number> = {
  AL: 2.0, AZ: 2.5, CA: 1.8, CO: 2.2, CT: 3.0, FL: 2.5, GA: 2.3,
  IL: 3.5, IN: 2.0, KY: 2.3, MA: 2.8, MI: 2.8, MN: 2.5, NC: 2.2,
  NJ: 3.5, NY: 4.0, OH: 2.5, PA: 3.2, TN: 2.2, TX: 2.5, VA: 2.3,
  WA: 2.5,
};

export function ClosingCostCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [loanAmount, setLoanAmount] = useState(280000);
  const [state, setState] = useState("custom");
  const [customClosingPct, setCustomClosingPct] = useState(2.5);

  const results = useMemo(() => {
    const closingPct = state === "custom" ? customClosingPct : (STATE_CLOSING_PCT[state] ?? 2.5);

    // Lender fees (based on loan amount)
    const originationFee = loanAmount * 0.01;
    const appraisal = 500;
    const creditReport = 50;
    const floodCert = 25;
    const inspection = 400;

    // Title & government fees (based on home price)
    const titleInsurance = homePrice * 0.005;
    const recordingFees = 250;
    const attorneyFees = homePrice > 500000 ? 1500 : 1000;

    // Transfer taxes & state-variable costs
    const transferTax = homePrice * (closingPct / 100) * 0.25;

    // Prepaids
    const prepaidTaxes = (homePrice * 0.012) / 12 * 3; // 3 months property tax at 1.2%
    const prepaidInsurance = 150 * 3; // 3 months homeowner insurance
    const prepaidInterest = (loanAmount * 0.065) / 365 * 15; // ~15 days interest at 6.5%

    const lenderFees = originationFee + appraisal + creditReport + floodCert + inspection;
    const titleGovFees = titleInsurance + recordingFees + attorneyFees + transferTax;
    const prepaids = prepaidTaxes + prepaidInsurance + prepaidInterest;
    const totalClosingCosts = lenderFees + titleGovFees + prepaids;
    const closingCostPctActual = (totalClosingCosts / homePrice) * 100;

    return {
      originationFee,
      appraisal,
      creditReport,
      floodCert,
      inspection,
      titleInsurance,
      recordingFees,
      attorneyFees,
      transferTax,
      prepaidTaxes,
      prepaidInsurance,
      prepaidInterest,
      lenderFees,
      titleGovFees,
      prepaids,
      totalClosingCosts,
      closingCostPctActual,
      closingPct,
    };
  }, [homePrice, loanAmount, state, customClosingPct]);

  return (
    <CalculatorShell
      title="Closing Cost Calculator"
      description="Estimate your buyer closing costs including lender fees, title charges, government fees, and prepaids."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Estimated Total Closing Costs"
            value={fmt(results.totalClosingCosts)}
            variant="primary"
            detail={`${fmtPct(results.closingCostPctActual)} of home price`}
            breakdown={[
              { label: "Lender Fees", value: fmt(results.lenderFees) },
              { label: "Title & Gov Fees", value: fmt(results.titleGovFees) },
              { label: "Prepaids & Escrow", value: fmt(results.prepaids) },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Lender Fees</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Origination Fee (1%)" value={fmt(results.originationFee)} />
              <ResultRow label="Appraisal" value={fmt(results.appraisal)} />
              <ResultRow label="Credit Report" value={fmt(results.creditReport)} />
              <ResultRow label="Flood Certification" value={fmt(results.floodCert)} />
              <ResultRow label="Home Inspection" value={fmt(results.inspection)} />
              <ResultRow label="Subtotal" value={fmt(results.lenderFees)} bold />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Title & Government Fees</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Title Insurance" value={fmt(results.titleInsurance)} />
              <ResultRow label="Recording Fees" value={fmt(results.recordingFees)} />
              <ResultRow label="Attorney Fees" value={fmt(results.attorneyFees)} />
              <ResultRow label="Transfer Tax" value={fmt(results.transferTax)} />
              <ResultRow label="Subtotal" value={fmt(results.titleGovFees)} bold />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prepaids & Escrow</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Prepaid Property Tax (3 mo)" value={fmt(results.prepaidTaxes)} />
              <ResultRow label="Prepaid Insurance (3 mo)" value={fmt(results.prepaidInsurance)} />
              <ResultRow label="Prepaid Interest (~15 days)" value={fmt(results.prepaidInterest)} />
              <ResultRow label="Subtotal" value={fmt(results.prepaids)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={0}
            max={homePrice}
            step={5000}
            prefix="$"
            slider
          />
          <SelectField
            label="Location"
            value={state}
            onChange={setState}
            options={STATE_OPTIONS}
          />
          {state === "custom" && (
            <InputField
              label="Closing Cost %"
              value={customClosingPct}
              onChange={setCustomClosingPct}
              min={0}
              max={10}
              step={0.1}
              suffix="%"
              slider
            />
          )}
        </div>
      }
    />
  );
}
