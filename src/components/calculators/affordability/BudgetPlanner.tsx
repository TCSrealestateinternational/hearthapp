"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

function BarSegment({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (amount / total) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium">
          {fmt(amount)} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function BudgetPlanner() {
  const [monthlyTakeHome, setMonthlyTakeHome] = useState(5500);
  const [currentRent, setCurrentRent] = useState(1500);
  const [savingsGoal, setSavingsGoal] = useState(500);

  // Other expenses
  const [utilities, setUtilities] = useState(200);
  const [carExpense, setCarExpense] = useState(450);
  const [food, setFood] = useState(600);
  const [insuranceExpense, setInsuranceExpense] = useState(300);
  const [entertainment, setEntertainment] = useState(200);
  const [otherExpenses, setOtherExpenses] = useState(150);

  const results = useMemo(() => {
    const totalOtherExpenses =
      utilities + carExpense + food + insuranceExpense + entertainment + otherExpenses;

    // Current situation
    const currentTotalExpenses = currentRent + totalOtherExpenses + savingsGoal;
    const currentRemaining = monthlyTakeHome - currentTotalExpenses;

    // Recommended: 30% of take-home for housing
    const recommendedHousing = monthlyTakeHome * 0.3;
    const recommendedTotalExpenses = recommendedHousing + totalOtherExpenses + savingsGoal;
    const recommendedRemaining = monthlyTakeHome - recommendedTotalExpenses;

    // Max available for housing (after all other expenses and savings)
    const maxForHousing = monthlyTakeHome - totalOtherExpenses - savingsGoal;

    // Housing as percentage of take-home
    const currentHousingPct = monthlyTakeHome > 0
      ? (currentRent / monthlyTakeHome) * 100
      : 0;
    const recommendedHousingPct = 30;

    return {
      totalOtherExpenses,
      currentTotalExpenses,
      currentRemaining,
      recommendedHousing,
      recommendedTotalExpenses,
      recommendedRemaining,
      maxForHousing,
      currentHousingPct,
      recommendedHousingPct,
    };
  }, [monthlyTakeHome, currentRent, savingsGoal, utilities, carExpense, food, insuranceExpense, entertainment, otherExpenses]);

  return (
    <CalculatorShell
      title="Housing Budget Planner"
      description="Compare your current housing cost against recommended guidelines and see how much you can realistically afford."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Current Housing"
              value={fmt(currentRent)}
              variant={results.currentHousingPct <= 30 ? "success" : results.currentHousingPct <= 40 ? "secondary" : "error"}
              detail={`${results.currentHousingPct.toFixed(0)}% of take-home`}
            />
            <ResultCard
              label="Recommended (30%)"
              value={fmt(results.recommendedHousing)}
              variant="primary"
              detail={`${results.recommendedHousingPct}% of take-home`}
            />
            <ResultCard
              label="Max Available"
              value={fmt(results.maxForHousing)}
              variant="secondary"
              detail="After expenses & savings"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Visualization</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Current Budget
              </p>
              <BarSegment
                label="Housing (Rent)"
                amount={currentRent}
                total={monthlyTakeHome}
                color="bg-primary"
              />
              <BarSegment
                label="Other Expenses"
                amount={results.totalOtherExpenses}
                total={monthlyTakeHome}
                color="bg-secondary"
              />
              <BarSegment
                label="Savings"
                amount={savingsGoal}
                total={monthlyTakeHome}
                color="bg-success"
              />
              <BarSegment
                label="Remaining"
                amount={Math.max(0, results.currentRemaining)}
                total={monthlyTakeHome}
                color="bg-surface-container-high"
              />

              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">
                  Recommended Budget (30% Housing)
                </p>
                <BarSegment
                  label="Housing"
                  amount={results.recommendedHousing}
                  total={monthlyTakeHome}
                  color="bg-primary"
                />
                <div className="mt-4">
                  <BarSegment
                    label="Other Expenses"
                    amount={results.totalOtherExpenses}
                    total={monthlyTakeHome}
                    color="bg-secondary"
                  />
                </div>
                <div className="mt-4">
                  <BarSegment
                    label="Savings"
                    amount={savingsGoal}
                    total={monthlyTakeHome}
                    color="bg-success"
                  />
                </div>
                <div className="mt-4">
                  <BarSegment
                    label="Remaining"
                    amount={Math.max(0, results.recommendedRemaining)}
                    total={monthlyTakeHome}
                    color="bg-surface-container-high"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Monthly Take-Home Pay" value={fmt(monthlyTakeHome)} />
              <ResultRow label="Current Rent/Housing" value={fmt(currentRent)} />
              <ResultRow label="Recommended Housing (30%)" value={fmt(results.recommendedHousing)} />
              <ResultRow label="Other Expenses" value={fmt(results.totalOtherExpenses)} />
              <ResultRow label="Savings Goal" value={fmt(savingsGoal)} />
              <ResultRow label="Current Remaining" value={fmt(results.currentRemaining)} bold />
            </div>
          </Card>

          {results.currentRemaining < 0 && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-4 text-sm text-error">
              Your current expenses exceed your take-home pay by{" "}
              <strong>{fmt(Math.abs(results.currentRemaining))}</strong> per month.
              Consider reducing expenses or increasing income.
            </div>
          )}
        </div>
      }
      inputs={
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Income & Housing</h4>
            <div className="space-y-4">
              <InputField
                label="Monthly Take-Home Pay"
                value={monthlyTakeHome}
                onChange={setMonthlyTakeHome}
                min={0}
                max={30000}
                step={100}
                prefix="$"
                slider
              />
              <InputField
                label="Current Rent / Housing Cost"
                value={currentRent}
                onChange={setCurrentRent}
                min={0}
                max={10000}
                step={50}
                prefix="$"
              />
              <InputField
                label="Monthly Savings Goal"
                value={savingsGoal}
                onChange={setSavingsGoal}
                min={0}
                max={5000}
                step={50}
                prefix="$"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Monthly Expenses</h4>
            <div className="space-y-4">
              <InputField
                label="Utilities"
                value={utilities}
                onChange={setUtilities}
                min={0}
                max={1000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Car (payment, gas, insurance)"
                value={carExpense}
                onChange={setCarExpense}
                min={0}
                max={3000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Food & Groceries"
                value={food}
                onChange={setFood}
                min={0}
                max={3000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Insurance (health, life, etc.)"
                value={insuranceExpense}
                onChange={setInsuranceExpense}
                min={0}
                max={2000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Entertainment & Subscriptions"
                value={entertainment}
                onChange={setEntertainment}
                min={0}
                max={2000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Other Expenses"
                value={otherExpenses}
                onChange={setOtherExpenses}
                min={0}
                max={5000}
                step={25}
                prefix="$"
              />
            </div>
          </div>
        </div>
      }
      disclaimer="The 30% rule is a general guideline. Your ideal housing budget depends on your full financial picture, location, and personal priorities."
    />
  );
}
