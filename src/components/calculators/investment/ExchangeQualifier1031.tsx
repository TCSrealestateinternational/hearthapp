"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function ExchangeQualifier1031() {
  const [salePrice, setSalePrice] = useState(500000);
  const [adjustedBasis, setAdjustedBasis] = useState(300000);
  const [mortgagePayoff, setMortgagePayoff] = useState(200000);
  const [closingCosts, setClosingCosts] = useState(15000);
  const [bootReceived, setBootReceived] = useState(0);

  const results = useMemo(() => {
    const realizedGain = salePrice - adjustedBasis;
    const recognizedGain = bootReceived > 0 ? Math.min(bootReceived, realizedGain) : 0;
    const netSaleProceeds = salePrice - closingCosts - mortgagePayoff;
    const minReplacementPrice = salePrice - bootReceived;
    const minEquityToReinvest = netSaleProceeds - bootReceived;

    return {
      realizedGain,
      recognizedGain,
      netSaleProceeds,
      minReplacementPrice,
      minEquityToReinvest,
    };
  }, [salePrice, adjustedBasis, mortgagePayoff, closingCosts, bootReceived]);

  return (
    <CalculatorShell
      title="1031 Exchange Qualifier"
      description="Determine key figures and requirements for a tax-deferred 1031 exchange."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Realized Gain"
              value={fmt(results.realizedGain)}
              variant={results.realizedGain >= 0 ? "primary" : "error"}
              detail="Total gain on the relinquished property"
            />
            <ResultCard
              label="Recognized (Taxable) Gain"
              value={fmt(results.recognizedGain)}
              variant={results.recognizedGain > 0 ? "error" : "success"}
              detail={
                results.recognizedGain > 0
                  ? "Taxable due to boot received"
                  : "Fully deferred if requirements met"
              }
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Exchange Requirements</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Sale Price" value={fmt(salePrice)} />
              <ResultRow label="Adjusted Basis" value={fmt(adjustedBasis)} />
              <ResultRow label="Mortgage Payoff" value={fmt(mortgagePayoff)} />
              <ResultRow label="Closing Costs" value={fmt(closingCosts)} />
              <ResultRow label="Net Sale Proceeds" value={fmt(results.netSaleProceeds)} bold />
              <ResultRow label="Boot Received" value={fmt(bootReceived)} />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Replacement Property Minimums</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow
                label="Minimum Replacement Price"
                value={fmt(results.minReplacementPrice)}
                bold
              />
              <ResultRow
                label="Minimum Equity to Reinvest"
                value={fmt(results.minEquityToReinvest)}
                bold
              />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Timeline Requirements</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  45
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Identification Period
                  </p>
                  <p className="text-xs text-text-secondary">
                    You must identify potential replacement properties within 45 days of closing on the relinquished property.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  180
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Exchange Period
                  </p>
                  <p className="text-xs text-text-secondary">
                    You must close on the replacement property within 180 days of closing on the relinquished property (or the tax return due date, whichever is earlier).
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary">
                  QI
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Qualified Intermediary Required
                  </p>
                  <p className="text-xs text-text-secondary">
                    All exchange funds must be held by a qualified intermediary. You cannot take constructive receipt of the proceeds.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Relinquished Property Sale Price"
            value={salePrice}
            onChange={setSalePrice}
            min={10000}
            max={10000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Adjusted Basis"
            value={adjustedBasis}
            onChange={setAdjustedBasis}
            min={0}
            max={10000000}
            step={5000}
            prefix="$"
          />
          <InputField
            label="Mortgage Payoff"
            value={mortgagePayoff}
            onChange={setMortgagePayoff}
            min={0}
            max={10000000}
            step={5000}
            prefix="$"
          />
          <InputField
            label="Closing Costs"
            value={closingCosts}
            onChange={setClosingCosts}
            min={0}
            max={500000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Boot Received (cash taken out)"
            value={bootReceived}
            onChange={setBootReceived}
            min={0}
            max={1000000}
            step={1000}
            prefix="$"
          />
        </div>
      }
      disclaimer="1031 exchange rules are complex and subject to IRS regulations. This calculator provides estimates only. Always work with a qualified tax advisor and qualified intermediary for any exchange transaction."
    />
  );
}
