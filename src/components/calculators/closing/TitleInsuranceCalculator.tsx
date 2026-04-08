"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

/**
 * Approximate title insurance rates per $1,000 of coverage by state.
 * Rates vary by underwriter; these are representative midpoints.
 */
const STATE_RATES: Record<string, { owner: number; lender: number; simDiscount: number; label: string }> = {
  CA: { owner: 2.50, lender: 1.50, simDiscount: 0.40, label: "California" },
  FL: { owner: 5.75, lender: 5.75, simDiscount: 0.25, label: "Florida" },
  TX: { owner: 5.80, lender: 5.30, simDiscount: 0.00, label: "Texas (regulated)" },
  NY: { owner: 4.00, lender: 3.50, simDiscount: 0.30, label: "New York" },
  PA: { owner: 4.50, lender: 3.80, simDiscount: 0.35, label: "Pennsylvania" },
  IL: { owner: 3.50, lender: 2.80, simDiscount: 0.30, label: "Illinois" },
  OH: { owner: 3.25, lender: 2.60, simDiscount: 0.30, label: "Ohio" },
  GA: { owner: 3.50, lender: 2.75, simDiscount: 0.25, label: "Georgia" },
  NC: { owner: 2.00, lender: 1.75, simDiscount: 0.25, label: "North Carolina" },
  VA: { owner: 2.80, lender: 2.20, simDiscount: 0.30, label: "Virginia" },
  KY: { owner: 3.00, lender: 2.50, simDiscount: 0.30, label: "Kentucky" },
  NJ: { owner: 4.25, lender: 3.50, simDiscount: 0.35, label: "New Jersey" },
  WA: { owner: 3.00, lender: 2.25, simDiscount: 0.30, label: "Washington" },
  CO: { owner: 2.75, lender: 2.00, simDiscount: 0.25, label: "Colorado" },
  AZ: { owner: 3.25, lender: 2.50, simDiscount: 0.25, label: "Arizona" },
};

const STATE_OPTIONS = Object.entries(STATE_RATES).map(([value, { label }]) => ({
  value,
  label,
}));

export function TitleInsuranceCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [loanAmount, setLoanAmount] = useState(280000);
  const [state, setState] = useState("FL");

  const results = useMemo(() => {
    const rates = STATE_RATES[state] ?? STATE_RATES.FL;

    const ownerPremium = (homePrice / 1000) * rates.owner;
    const lenderPremium = (loanAmount / 1000) * rates.lender;

    // Simultaneous issue discount applies to the lender policy when purchased with owner's
    const simDiscountAmount = (loanAmount / 1000) * rates.simDiscount;
    const lenderWithDiscount = lenderPremium - simDiscountAmount;

    const separateTotal = ownerPremium + lenderPremium;
    const simultaneousTotal = ownerPremium + lenderWithDiscount;
    const totalSavings = separateTotal - simultaneousTotal;

    return {
      ownerPremium,
      lenderPremium,
      simDiscountAmount,
      lenderWithDiscount,
      separateTotal,
      simultaneousTotal,
      totalSavings,
      rates,
    };
  }, [homePrice, loanAmount, state]);

  return (
    <CalculatorShell
      title="Title Insurance Calculator"
      description="Estimate lender's and owner's title insurance premiums. Owner's title insurance is optional but recommended."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Lender's Title Insurance"
              value={fmt(results.lenderPremium)}
              variant="primary"
              detail="Required by lender"
            />
            <ResultCard
              label="Owner's Title Insurance"
              value={fmt(results.ownerPremium)}
              variant="secondary"
              detail="Optional but recommended"
            />
          </div>

          <ResultCard
            label="Combined (Simultaneous Issue)"
            value={fmt(results.simultaneousTotal)}
            variant="success"
            detail={results.totalSavings > 0
              ? `Save ${fmt(results.totalSavings)} vs. purchasing separately`
              : "No simultaneous issue discount in this state"
            }
            breakdown={[
              { label: "Owner's Policy", value: fmt(results.ownerPremium) },
              { label: "Lender's Policy", value: fmt(results.lenderPremium) },
              { label: "Simultaneous Discount", value: `-${fmt(results.simDiscountAmount)}` },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Rate Details</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="State" value={STATE_RATES[state]?.label ?? state} />
              <ResultRow label="Owner's Rate (per $1,000)" value={`$${results.rates.owner.toFixed(2)}`} />
              <ResultRow label="Lender's Rate (per $1,000)" value={`$${results.rates.lender.toFixed(2)}`} />
              <ResultRow label="Sim. Issue Discount (per $1,000)" value={`$${results.rates.simDiscount.toFixed(2)}`} />
              <ResultRow label="Separate Purchase Total" value={fmt(results.separateTotal)} />
              <ResultRow label="Simultaneous Issue Total" value={fmt(results.simultaneousTotal)} bold />
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
            label="State"
            value={state}
            onChange={setState}
            options={STATE_OPTIONS}
          />
        </div>
      }
      disclaimer="Title insurance rates are approximate and vary by underwriter, coverage amount, and location. Contact a title company for an exact quote."
    />
  );
}
