"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface OfferNetCalcProps {
  offers: {
    id: string;
    buyerName: string;
    offerPrice: number;
    sellerConcessions: number;
  }[];
  listPrice: number;
}

function formatDollars(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export function OfferNetCalculator({ offers, listPrice }: OfferNetCalcProps) {
  const [commissionPct, setCommissionPct] = useState(6);
  const [mortgagePayoff, setMortgagePayoff] = useState(0);
  const [closingCosts, setClosingCosts] = useState(2000);
  const [repairs, setRepairs] = useState(0);

  const calculations = useMemo(() => {
    return offers.map((offer) => {
      const commission = offer.offerPrice * (commissionPct / 100);
      const totalDeductions =
        commission +
        mortgagePayoff +
        closingCosts +
        repairs +
        offer.sellerConcessions;
      const netProceeds = offer.offerPrice - totalDeductions;
      return {
        ...offer,
        commission,
        totalDeductions,
        netProceeds,
      };
    });
  }, [offers, commissionPct, mortgagePayoff, closingCosts, repairs]);

  const highestNet = Math.max(...calculations.map((c) => c.netProceeds));

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Costs</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Commission (%)
            </label>
            <input
              type="number"
              value={commissionPct}
              onChange={(e) => setCommissionPct(Number(e.target.value))}
              step={0.5}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Mortgage Payoff
            </label>
            <input
              type="number"
              value={mortgagePayoff}
              onChange={(e) => setMortgagePayoff(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Closing Costs
            </label>
            <input
              type="number"
              value={closingCosts}
              onChange={(e) => setClosingCosts(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Repairs/Credits
            </label>
            <input
              type="number"
              value={repairs}
              onChange={(e) => setRepairs(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>
        </div>
      </Card>

      {/* Results */}
      {calculations.length > 0 ? (
        <div className="space-y-3">
          {calculations.map((calc) => (
            <Card
              key={calc.id}
              className={
                calc.netProceeds === highestNet && calculations.length > 1
                  ? "ring-2 ring-cta"
                  : ""
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-text-primary">
                    {calc.buyerName}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Offer: {formatDollars(calc.offerPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Net Proceeds</p>
                  <p
                    className={`text-xl font-bold ${
                      calc.netProceeds >= 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {formatDollars(calc.netProceeds)}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Commission ({commissionPct}%)</span>
                  <span>-{formatDollars(calc.commission)}</span>
                </div>
                {mortgagePayoff > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Mortgage Payoff</span>
                    <span>-{formatDollars(mortgagePayoff)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Closing Costs</span>
                  <span>-{formatDollars(closingCosts)}</span>
                </div>
                {repairs > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Repairs/Credits</span>
                    <span>-{formatDollars(repairs)}</span>
                  </div>
                )}
                {calc.sellerConcessions > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Seller Concessions</span>
                    <span>-{formatDollars(calc.sellerConcessions)}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-text-secondary py-4">
            No offers to calculate. Offers will appear here when received.
          </p>
        </Card>
      )}

      <p className="text-xs text-text-secondary">
        These are estimates only. Actual proceeds may vary based on final
        settlement figures. Consult your agent for accurate numbers.
      </p>
    </div>
  );
}
