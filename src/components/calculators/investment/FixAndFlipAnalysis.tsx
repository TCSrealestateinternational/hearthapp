"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function FixAndFlipAnalysis() {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [rehabCosts, setRehabCosts] = useState(50000);
  const [holdingCostsPerMonth, setHoldingCostsPerMonth] = useState(2000);
  const [holdingPeriod, setHoldingPeriod] = useState(6);
  const [closingCostsBuyPct, setClosingCostsBuyPct] = useState(2);
  const [closingCostsSellPct, setClosingCostsSellPct] = useState(3);
  const [arv, setArv] = useState(350000);
  const [commissionPct, setCommissionPct] = useState(5);

  const results = useMemo(() => {
    const closingCostsBuy = purchasePrice * (closingCostsBuyPct / 100);
    const totalHoldingCosts = holdingCostsPerMonth * holdingPeriod;
    const totalInvestment =
      purchasePrice + rehabCosts + closingCostsBuy + totalHoldingCosts;

    const commission = arv * (commissionPct / 100);
    const closingCostsSell = arv * (closingCostsSellPct / 100);
    const saleProceeds = arv - commission - closingCostsSell;

    const profit = saleProceeds - totalInvestment;
    const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    const annualizedROI =
      holdingPeriod > 0 && totalInvestment > 0
        ? (Math.pow(1 + profit / totalInvestment, 12 / holdingPeriod) - 1) * 100
        : 0;

    return {
      closingCostsBuy,
      totalHoldingCosts,
      totalInvestment,
      commission,
      closingCostsSell,
      saleProceeds,
      profit,
      roi,
      annualizedROI,
    };
  }, [
    purchasePrice,
    rehabCosts,
    holdingCostsPerMonth,
    holdingPeriod,
    closingCostsBuyPct,
    closingCostsSellPct,
    arv,
    commissionPct,
  ]);

  const profitVariant = results.profit >= 0 ? "success" : "error";

  return (
    <CalculatorShell
      title="Fix & Flip Analysis"
      description="Analyze the potential profit, ROI, and annualized return on a fix-and-flip investment."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Projected Profit"
              value={fmt(results.profit)}
              variant={profitVariant}
              detail={results.profit >= 0 ? "Profitable flip" : "Loss on flip"}
            />
            <ResultCard
              label="ROI"
              value={fmtPct(results.roi)}
              variant={results.roi >= 0 ? "primary" : "error"}
              detail={`${holdingPeriod} month holding period`}
            />
            <ResultCard
              label="Annualized ROI"
              value={fmtPct(results.annualizedROI)}
              variant={results.annualizedROI >= 20 ? "success" : "primary"}
              detail="Projected annual return"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Purchase Price" value={fmt(purchasePrice)} />
              <ResultRow label="Rehab Costs" value={fmt(rehabCosts)} />
              <ResultRow label="Closing Costs (Buy)" value={fmt(results.closingCostsBuy)} />
              <ResultRow
                label={`Holding Costs (${holdingPeriod} mo.)`}
                value={fmt(results.totalHoldingCosts)}
              />
              <ResultRow label="Total Investment" value={fmt(results.totalInvestment)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sale Proceeds</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="After Repair Value (ARV)" value={fmt(arv)} />
              <ResultRow label="Agent Commission" value={`-${fmt(results.commission)}`} />
              <ResultRow label="Closing Costs (Sell)" value={`-${fmt(results.closingCostsSell)}`} />
              <ResultRow label="Net Sale Proceeds" value={fmt(results.saleProceeds)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Rehab Costs"
            value={rehabCosts}
            onChange={setRehabCosts}
            min={0}
            max={500000}
            step={1000}
            prefix="$"
          />
          <InputField
            label="Holding Costs (per month)"
            value={holdingCostsPerMonth}
            onChange={setHoldingCostsPerMonth}
            min={0}
            max={20000}
            step={100}
            prefix="$"
          />
          <InputField
            label="Holding Period (months)"
            value={holdingPeriod}
            onChange={setHoldingPeriod}
            min={1}
            max={36}
            step={1}
            slider
          />
          <InputField
            label="Closing Costs - Buy"
            value={closingCostsBuyPct}
            onChange={setClosingCostsBuyPct}
            min={0}
            max={10}
            step={0.25}
            suffix="%"
          />
          <InputField
            label="Closing Costs - Sell"
            value={closingCostsSellPct}
            onChange={setClosingCostsSellPct}
            min={0}
            max={10}
            step={0.25}
            suffix="%"
          />
          <InputField
            label="After Repair Value (ARV)"
            value={arv}
            onChange={setArv}
            min={10000}
            max={5000000}
            step={5000}
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
          />
        </div>
      }
    />
  );
}
