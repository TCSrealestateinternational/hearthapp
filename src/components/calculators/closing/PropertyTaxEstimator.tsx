"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function PropertyTaxEstimator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [assessedRatio, setAssessedRatio] = useState(100);
  const [taxRate, setTaxRate] = useState(1.2);
  const [homesteadExemption, setHomesteadExemption] = useState(0);
  const [seniorExemption, setSeniorExemption] = useState(0);
  const [veteranExemption, setVeteranExemption] = useState(0);

  const results = useMemo(() => {
    const assessedValue = homePrice * (assessedRatio / 100);
    const totalExemptions = homesteadExemption + seniorExemption + veteranExemption;
    const taxableValue = Math.max(0, assessedValue - totalExemptions);
    const annualTax = taxableValue * (taxRate / 100);
    const monthlyTax = annualTax / 12;
    const effectiveRate = homePrice > 0 ? (annualTax / homePrice) * 100 : 0;
    const taxSavings = totalExemptions * (taxRate / 100);

    return {
      assessedValue,
      totalExemptions,
      taxableValue,
      annualTax,
      monthlyTax,
      effectiveRate,
      taxSavings,
    };
  }, [homePrice, assessedRatio, taxRate, homesteadExemption, seniorExemption, veteranExemption]);

  return (
    <CalculatorShell
      title="Property Tax Estimator"
      description="Estimate annual and monthly property taxes based on assessed value, tax rate, and available exemptions."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Annual Property Tax"
              value={fmt(results.annualTax)}
              variant="primary"
              detail={`Effective rate: ${fmtPct(results.effectiveRate)}`}
            />
            <ResultCard
              label="Monthly Property Tax"
              value={fmt(results.monthlyTax)}
              variant="secondary"
              detail="Included in escrow payment"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Market Value (Home Price)" value={fmt(homePrice)} />
              <ResultRow label={`Assessed Value (${assessedRatio}%)`} value={fmt(results.assessedValue)} />
              <ResultRow label="Total Exemptions" value={fmt(results.totalExemptions)} />
              <ResultRow label="Taxable Value" value={fmt(results.taxableValue)} bold />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Details</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Tax Rate (millage)" value={fmtPct(taxRate)} />
              <ResultRow label="Effective Rate (after exemptions)" value={fmtPct(results.effectiveRate)} />
              <ResultRow label="Annual Tax" value={fmt(results.annualTax)} />
              <ResultRow label="Monthly Tax" value={fmt(results.monthlyTax)} />
              {results.taxSavings > 0 && (
                <ResultRow label="Annual Savings from Exemptions" value={fmt(results.taxSavings)} bold />
              )}
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Home Price (Market Value)"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Assessed Value Ratio"
            value={assessedRatio}
            onChange={setAssessedRatio}
            min={10}
            max={100}
            step={1}
            suffix="%"
            slider
          />
          <InputField
            label="Property Tax Rate"
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={5}
            step={0.01}
            suffix="%"
          />

          <Card variant="container">
            <CardHeader>
              <CardTitle>Exemptions</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <InputField
                label="Homestead Exemption"
                value={homesteadExemption}
                onChange={setHomesteadExemption}
                min={0}
                max={100000}
                step={1000}
                prefix="$"
              />
              <InputField
                label="Senior Exemption"
                value={seniorExemption}
                onChange={setSeniorExemption}
                min={0}
                max={100000}
                step={1000}
                prefix="$"
              />
              <InputField
                label="Veteran Exemption"
                value={veteranExemption}
                onChange={setVeteranExemption}
                min={0}
                max={100000}
                step={1000}
                prefix="$"
              />
            </div>
          </Card>
        </div>
      }
      disclaimer="Property tax rates and exemptions vary by county and municipality. Check with your local tax assessor for exact rates and available exemptions."
    />
  );
}
