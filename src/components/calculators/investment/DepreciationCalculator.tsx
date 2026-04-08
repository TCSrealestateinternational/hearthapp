"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const ASSET_TYPES = [
  { value: "27.5", label: "Residential (27.5 years)" },
  { value: "39", label: "Commercial (39 years)" },
];

const TAX_BRACKETS = [
  { rate: 22, label: "22%" },
  { rate: 24, label: "24%" },
  { rate: 32, label: "32%" },
];

export function DepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [landValuePct, setLandValuePct] = useState(20);
  const [assetType, setAssetType] = useState("27.5");

  const results = useMemo(() => {
    const landValue = purchasePrice * (landValuePct / 100);
    const depreciableBasis = purchasePrice - landValue;
    const usefulLife = Number(assetType);
    const annualDepreciation = usefulLife > 0 ? depreciableBasis / usefulLife : 0;
    const monthlyDepreciation = annualDepreciation / 12;

    const taxSavings = TAX_BRACKETS.map((bracket) => ({
      rate: bracket.rate,
      label: bracket.label,
      annual: annualDepreciation * (bracket.rate / 100),
      monthly: (annualDepreciation * (bracket.rate / 100)) / 12,
    }));

    return {
      landValue,
      depreciableBasis,
      usefulLife,
      annualDepreciation,
      monthlyDepreciation,
      taxSavings,
    };
  }, [purchasePrice, landValuePct, assetType]);

  return (
    <CalculatorShell
      title="Depreciation Calculator"
      description="Calculate straight-line depreciation and estimated tax savings for your investment property."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Annual Depreciation"
              value={fmt(results.annualDepreciation)}
              variant="primary"
              detail={`${results.usefulLife}-year straight-line schedule`}
              breakdown={[
                { label: "Monthly Depreciation", value: fmt(results.monthlyDepreciation) },
                { label: "Depreciable Basis", value: fmt(results.depreciableBasis) },
              ]}
            />
            <ResultCard
              label="Monthly Depreciation"
              value={fmt(results.monthlyDepreciation)}
              variant="secondary"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Basis Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Purchase Price" value={fmt(purchasePrice)} />
              <ResultRow label="Land Value" value={`-${fmt(results.landValue)} (${landValuePct}%)`} />
              <ResultRow label="Depreciable Basis" value={fmt(results.depreciableBasis)} bold />
              <ResultRow label="Useful Life" value={`${results.usefulLife} years`} />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estimated Annual Tax Savings</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {results.taxSavings.map((bracket) => (
                <ResultRow
                  key={bracket.rate}
                  label={`At ${bracket.label} tax bracket`}
                  value={`${fmt(bracket.annual)}/yr (${fmt(bracket.monthly)}/mo)`}
                />
              ))}
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Property Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Land Value"
            value={landValuePct}
            onChange={setLandValuePct}
            min={0}
            max={80}
            step={1}
            suffix="%"
            slider
          />
          <SelectField
            label="Asset Type"
            value={assetType}
            onChange={setAssetType}
            options={ASSET_TYPES}
          />
        </div>
      }
      disclaimer="Depreciation calculations are for estimation only. Consult a tax professional for advice specific to your situation."
    />
  );
}
