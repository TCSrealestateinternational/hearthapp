"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ProjectionRow {
  year: number;
  monthlyRent: number;
  annualGross: number;
  vacancyLoss: number;
  netAnnualIncome: number;
}

export function RentalIncomeProjector() {
  const [currentMonthlyRent, setCurrentMonthlyRent] = useState(2000);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(3);
  const [yearsToProject, setYearsToProject] = useState(10);
  const [vacancyRate, setVacancyRate] = useState(5);

  const results = useMemo(() => {
    const rows: ProjectionRow[] = [];
    let cumulativeNet = 0;
    let rent = currentMonthlyRent;

    for (let year = 1; year <= yearsToProject; year++) {
      if (year > 1) {
        rent = rent * (1 + annualRentIncrease / 100);
      }
      const annualGross = rent * 12;
      const vacancyLoss = annualGross * (vacancyRate / 100);
      const netAnnualIncome = annualGross - vacancyLoss;
      cumulativeNet += netAnnualIncome;

      rows.push({
        year,
        monthlyRent: rent,
        annualGross,
        vacancyLoss,
        netAnnualIncome,
      });
    }

    const finalYearRent = rows.length > 0 ? rows[rows.length - 1].monthlyRent : currentMonthlyRent;

    return { rows, cumulativeNet, finalYearRent };
  }, [currentMonthlyRent, annualRentIncrease, yearsToProject, vacancyRate]);

  return (
    <CalculatorShell
      title="Rental Income Projector"
      description="Project your rental income growth over time with annual rent increases and vacancy adjustments."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Cumulative Net Income"
              value={fmt(results.cumulativeNet)}
              variant="primary"
              detail={`Over ${yearsToProject} year${yearsToProject !== 1 ? "s" : ""}`}
            />
            <ResultCard
              label={`Year ${yearsToProject} Monthly Rent`}
              value={fmt(results.finalYearRent)}
              variant="secondary"
              detail={`${fmtPct(annualRentIncrease)} annual increase`}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Projection</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="text-left py-2 pr-2">Year</th>
                    <th className="text-right py-2 px-2">Mo. Rent</th>
                    <th className="text-right py-2 px-2">Annual Gross</th>
                    <th className="text-right py-2 px-2">Vacancy</th>
                    <th className="text-right py-2 pl-2">Net Income</th>
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row) => (
                    <tr
                      key={row.year}
                      className="border-b border-border/50 text-text-primary"
                    >
                      <td className="py-2 pr-2">{row.year}</td>
                      <td className="text-right py-2 px-2">{fmt(row.monthlyRent)}</td>
                      <td className="text-right py-2 px-2">{fmt(row.annualGross)}</td>
                      <td className="text-right py-2 px-2">-{fmt(row.vacancyLoss)}</td>
                      <td className="text-right py-2 pl-2 font-medium">
                        {fmt(row.netAnnualIncome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border font-semibold text-text-primary">
                    <td className="py-2 pr-2" colSpan={4}>
                      Cumulative Net Income
                    </td>
                    <td className="text-right py-2 pl-2">{fmt(results.cumulativeNet)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Current Monthly Rent"
            value={currentMonthlyRent}
            onChange={setCurrentMonthlyRent}
            min={0}
            max={50000}
            step={50}
            prefix="$"
          />
          <InputField
            label="Annual Rent Increase"
            value={annualRentIncrease}
            onChange={setAnnualRentIncrease}
            min={0}
            max={20}
            step={0.25}
            suffix="%"
            slider
          />
          <InputField
            label="Years to Project"
            value={yearsToProject}
            onChange={setYearsToProject}
            min={1}
            max={30}
            step={1}
            slider
          />
          <InputField
            label="Vacancy Rate"
            value={vacancyRate}
            onChange={setVacancyRate}
            min={0}
            max={50}
            step={0.5}
            suffix="%"
            slider
          />
        </div>
      }
    />
  );
}
