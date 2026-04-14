"use client";

import { useState, useMemo } from "react";
import type { LoanType, FinanceScenario } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Save } from "lucide-react";

interface FinanceCalculatorProps {
  onSave: (scenario: Omit<FinanceScenario, "id" | "createdAt">) => void;
  transactionId: string;
  saving?: boolean;
}

function formatDollars(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export function FinanceCalculator({
  onSave,
  transactionId,
  saving = false,
}: FinanceCalculatorProps) {
  const [name, setName] = useState("");
  const [offerPrice, setOfferPrice] = useState(250000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [loanType, setLoanType] = useState<LoanType>("conventional");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);
  const [closingCostPct, setClosingCostPct] = useState(3);
  const [sellerConcessions, setSellerConcessions] = useState(0);
  const [prepaids, setPrepaids] = useState(2000);
  const [expanded, setExpanded] = useState(false);

  const calc = useMemo(() => {
    const downPayment = offerPrice * (downPaymentPct / 100);
    const loanAmount = offerPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    // P&I: M = P[r(1+r)^n]/[(1+r)^n-1]
    let monthlyPI = 0;
    if (monthlyRate > 0 && totalPayments > 0) {
      const factor = Math.pow(1 + monthlyRate, totalPayments);
      monthlyPI = loanAmount * ((monthlyRate * factor) / (factor - 1));
    }

    // PMI
    let monthlyPMI = 0;
    if (loanType === "conventional" && downPaymentPct < 20) {
      monthlyPMI = (loanAmount * 0.0085) / 12;
    } else if (loanType === "fha") {
      monthlyPMI = (loanAmount * 0.0085) / 12;
    }

    const monthlyTax = (offerPrice * (propertyTaxRate / 100)) / 12;
    const monthlyTotal =
      monthlyPI + monthlyPMI + monthlyTax + homeInsurance + hoa;

    const closingCosts = offerPrice * (closingCostPct / 100);
    const cashToClose =
      downPayment + closingCosts + prepaids - sellerConcessions;

    return {
      downPayment,
      loanAmount,
      monthlyPI,
      monthlyPMI,
      monthlyTax,
      monthlyTotal,
      closingCosts,
      cashToClose,
    };
  }, [
    offerPrice,
    downPaymentPct,
    interestRate,
    loanTermYears,
    loanType,
    propertyTaxRate,
    homeInsurance,
    hoa,
    closingCostPct,
    sellerConcessions,
    prepaids,
  ]);

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      transactionId,
      name: name.trim(),
      offerPrice,
      downPaymentPct,
      interestRate,
      loanTermYears,
      loanType,
      propertyTaxRate,
      homeInsurance,
      hoa,
      closingCostPct,
      sellerConcessions,
      prepaids,
      monthlyPI: calc.monthlyPI,
      monthlyPMI: calc.monthlyPMI,
      monthlyTotal: calc.monthlyTotal,
      cashToClose: calc.cashToClose,
    });
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-primary text-white border-0 rounded-2xl">
          <p className="text-sm opacity-80">Estimated Monthly Payment</p>
          <p className="text-3xl font-bold mt-1">
            {formatDollars(calc.monthlyTotal)}
          </p>
          <p className="text-xs opacity-60 mt-1">
            P&I {formatDollars(calc.monthlyPI)}
            {calc.monthlyPMI > 0 &&
              ` + PMI ${formatDollars(calc.monthlyPMI)}`}
          </p>
        </Card>
        <Card className="bg-secondary text-white border-0 rounded-2xl">
          <p className="text-sm opacity-80">Cash to Close</p>
          <p className="text-3xl font-bold mt-1">
            {formatDollars(calc.cashToClose)}
          </p>
          <p className="text-xs opacity-60 mt-1">
            Down {formatDollars(calc.downPayment)} + Closing{" "}
            {formatDollars(calc.closingCosts)}
          </p>
        </Card>
      </div>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {/* Offer price with slider */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Offer Price: {formatDollars(offerPrice)}
            </label>
            <input
              type="range"
              min={offerPrice - 20000}
              max={offerPrice + 20000}
              step={1000}
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label={`Down Payment (${downPaymentPct}%)`}
              type="number"
              value={downPaymentPct}
              onChange={setDownPaymentPct}
              min={0}
              max={100}
              step={0.5}
              suffix="%"
            />
            <InputField
              label="Interest Rate"
              type="number"
              value={interestRate}
              onChange={setInterestRate}
              min={0}
              max={15}
              step={0.125}
              suffix="%"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary"
              >
                <option value="conventional">Conventional</option>
                <option value="fha">FHA</option>
                <option value="va">VA</option>
                <option value="usda">USDA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Term
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary"
              >
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
              </select>
            </div>
          </div>

          {(loanType === "va" || loanType === "usda") && (
            <p className="text-sm text-cta bg-cta/10 p-2 rounded-xl">
              Note: VA and USDA loans have specific eligibility requirements and
              may include a funding fee. Check with your lender for details.
            </p>
          )}

          {/* Collapsible breakdown */}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="detailed-breakdown"
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
            {expanded ? "Hide" : "Show"} detailed breakdown
          </button>

          {expanded && (
            <div id="detailed-breakdown" className="space-y-4 pt-2 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Property Tax Rate"
                  type="number"
                  value={propertyTaxRate}
                  onChange={setPropertyTaxRate}
                  step={0.1}
                  suffix="%"
                />
                <InputField
                  label="Home Insurance (monthly)"
                  type="number"
                  value={homeInsurance}
                  onChange={setHomeInsurance}
                  prefix="$"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="HOA (monthly)"
                  type="number"
                  value={hoa}
                  onChange={setHoa}
                  prefix="$"
                />
                <InputField
                  label="Closing Cost %"
                  type="number"
                  value={closingCostPct}
                  onChange={setClosingCostPct}
                  step={0.5}
                  suffix="%"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Seller Concessions"
                  type="number"
                  value={sellerConcessions}
                  onChange={setSellerConcessions}
                  prefix="$"
                />
                <InputField
                  label="Prepaids"
                  type="number"
                  value={prepaids}
                  onChange={setPrepaids}
                  prefix="$"
                />
              </div>

              {/* Monthly breakdown */}
              <div className="bg-primary-light rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Principal & Interest</span>
                  <span className="font-medium">{formatDollars(calc.monthlyPI)}</span>
                </div>
                {calc.monthlyPMI > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">PMI</span>
                    <span className="font-medium">
                      {formatDollars(calc.monthlyPMI)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Property Tax</span>
                  <span className="font-medium">
                    {formatDollars(calc.monthlyTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Insurance</span>
                  <span className="font-medium">{formatDollars(homeInsurance)}</span>
                </div>
                {hoa > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">HOA</span>
                    <span className="font-medium">{formatDollars(hoa)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border font-semibold">
                  <span>Total Monthly</span>
                  <span>{formatDollars(calc.monthlyTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Save scenario */}
      <Card>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Scenario Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "123 Main St - 20% down"'
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary"
            />
          </div>
          <Button
            variant="cta"
            onClick={handleSave}
            disabled={!name.trim()}
            loading={saving}
          >
            <Save size={16} />
            Save
          </Button>
        </div>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary">
        These estimates are for informational purposes only and are not a loan
        commitment or guarantee. Actual rates, payments, and closing costs may
        vary. Consult with your lender for accurate figures.
      </p>
    </div>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string;
  type: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary ${
            prefix ? "pl-7" : ""
          } ${suffix ? "pr-7" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
