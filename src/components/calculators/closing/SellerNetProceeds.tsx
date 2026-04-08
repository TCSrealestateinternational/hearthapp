"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function SellerNetProceeds() {
  const [salePrice, setSalePrice] = useState(350000);
  const [mortgagePayoff, setMortgagePayoff] = useState(200000);
  const [commissionPct, setCommissionPct] = useState(6);
  const [closingCosts, setClosingCosts] = useState(3500);
  const [repairs, setRepairs] = useState(0);
  const [sellerConcessions, setSellerConcessions] = useState(0);
  const [otherFees, setOtherFees] = useState(0);

  const results = useMemo(() => {
    const commission = salePrice * (commissionPct / 100);
    const totalDeductions = mortgagePayoff + commission + closingCosts + repairs + sellerConcessions + otherFees;
    const netProceeds = salePrice - totalDeductions;
    const netProceedsPct = salePrice > 0 ? (netProceeds / salePrice) * 100 : 0;

    return {
      commission,
      totalDeductions,
      netProceeds,
      netProceedsPct,
    };
  }, [salePrice, mortgagePayoff, commissionPct, closingCosts, repairs, sellerConcessions, otherFees]);

  return (
    <CalculatorShell
      title="Seller Net Proceeds Calculator"
      description="Estimate how much you'll walk away with after selling your home."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Estimated Net Proceeds"
            value={fmt(results.netProceeds)}
            variant={results.netProceeds >= 0 ? "success" : "error"}
            detail={`${results.netProceedsPct.toFixed(1)}% of sale price`}
            breakdown={[
              { label: "Sale Price", value: fmt(salePrice) },
              { label: "Total Deductions", value: `-${fmt(results.totalDeductions)}` },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Deduction Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Mortgage Payoff" value={fmt(mortgagePayoff)} />
              <ResultRow label={`Commission (${fmtPct(commissionPct)})`} value={fmt(results.commission)} />
              <ResultRow label="Closing Costs" value={fmt(closingCosts)} />
              <ResultRow label="Repairs & Credits" value={fmt(repairs)} />
              <ResultRow label="Seller Concessions" value={fmt(sellerConcessions)} />
              <ResultRow label="Other Fees" value={fmt(otherFees)} />
              <ResultRow label="Total Deductions" value={fmt(results.totalDeductions)} bold />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Sale Price" value={fmt(salePrice)} />
              <ResultRow label="Total Deductions" value={`-${fmt(results.totalDeductions)}`} />
              <ResultRow label="Net Proceeds" value={fmt(results.netProceeds)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Sale Price"
            value={salePrice}
            onChange={setSalePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Mortgage Payoff Balance"
            value={mortgagePayoff}
            onChange={setMortgagePayoff}
            min={0}
            max={salePrice}
            step={1000}
            prefix="$"
            slider
          />
          <InputField
            label="Agent Commission"
            value={commissionPct}
            onChange={setCommissionPct}
            min={0}
            max={10}
            step={0.25}
            suffix="%"
            slider
          />
          <InputField
            label="Closing Costs (title, taxes, etc.)"
            value={closingCosts}
            onChange={setClosingCosts}
            min={0}
            max={50000}
            step={250}
            prefix="$"
          />
          <InputField
            label="Repairs & Credits"
            value={repairs}
            onChange={setRepairs}
            min={0}
            max={50000}
            step={250}
            prefix="$"
          />
          <InputField
            label="Seller Concessions"
            value={sellerConcessions}
            onChange={setSellerConcessions}
            min={0}
            max={50000}
            step={250}
            prefix="$"
          />
          <InputField
            label="Other Fees"
            value={otherFees}
            onChange={setOtherFees}
            min={0}
            max={25000}
            step={100}
            prefix="$"
          />
        </div>
      }
      disclaimer="This is an estimate. Actual net proceeds depend on your specific mortgage terms, local transfer taxes, and negotiated fees. Consult your agent or attorney for exact figures."
    />
  );
}
