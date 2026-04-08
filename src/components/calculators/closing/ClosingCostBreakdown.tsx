"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function ClosingCostBreakdown() {
  const [homePrice, setHomePrice] = useState(350000);
  const [loanAmount, setLoanAmount] = useState(280000);

  // Lender fees
  const [originationFee, setOriginationFee] = useState(2800);
  const [appraisal, setAppraisal] = useState(500);
  const [creditReport, setCreditReport] = useState(50);
  const [floodCert, setFloodCert] = useState(25);
  const [survey, setSurvey] = useState(400);

  // Title fees
  const [titleSearch, setTitleSearch] = useState(300);
  const [titleInsurance, setTitleInsurance] = useState(1750);
  const [recordingFees, setRecordingFees] = useState(250);
  const [transferTax, setTransferTax] = useState(700);

  // Professional fees
  const [attorneyFees, setAttorneyFees] = useState(1000);

  // Prepaids
  const [escrowDeposit, setEscrowDeposit] = useState(2100);
  const [prepaidInterest, setPrepaidInterest] = useState(750);
  const [homeInsurancePrepaid, setHomeInsurancePrepaid] = useState(1800);

  // Recalculate defaults when home price or loan amount changes
  const handleHomePriceChange = (val: number) => {
    setHomePrice(val);
    setTitleInsurance(Math.round(val * 0.005));
    setTransferTax(Math.round(val * 0.002));
    setEscrowDeposit(Math.round((val * 0.012) / 12 * 2));
  };

  const handleLoanAmountChange = (val: number) => {
    setLoanAmount(val);
    setOriginationFee(Math.round(val * 0.01));
    setPrepaidInterest(Math.round((val * 0.065) / 365 * 15));
  };

  const results = useMemo(() => {
    const lenderFees = originationFee + appraisal + creditReport + floodCert + survey;
    const titleFees = titleSearch + titleInsurance + recordingFees + transferTax;
    const professionalFees = attorneyFees;
    const prepaids = escrowDeposit + prepaidInterest + homeInsurancePrepaid;
    const total = lenderFees + titleFees + professionalFees + prepaids;
    const pctOfPrice = (total / homePrice) * 100;

    return {
      lenderFees,
      titleFees,
      professionalFees,
      prepaids,
      total,
      pctOfPrice,
    };
  }, [
    homePrice, originationFee, appraisal, creditReport, floodCert, survey,
    titleSearch, titleInsurance, recordingFees, transferTax,
    attorneyFees, escrowDeposit, prepaidInterest, homeInsurancePrepaid,
  ]);

  return (
    <CalculatorShell
      title="Closing Cost Breakdown"
      description="Edit each line item to match your Loan Estimate and see your total closing costs."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Total Closing Costs"
            value={fmt(results.total)}
            variant="primary"
            detail={`${results.pctOfPrice.toFixed(1)}% of home price`}
            breakdown={[
              { label: "Lender Fees", value: fmt(results.lenderFees) },
              { label: "Title & Gov Fees", value: fmt(results.titleFees) },
              { label: "Professional Fees", value: fmt(results.professionalFees) },
              { label: "Prepaids & Escrow", value: fmt(results.prepaids) },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Home Price" value={fmt(homePrice)} />
              <ResultRow label="Loan Amount" value={fmt(loanAmount)} />
              <ResultRow label="Total Closing Costs" value={fmt(results.total)} bold />
              <ResultRow label="Cash Needed at Closing" value={fmt(homePrice - loanAmount + results.total)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-6">
          <div className="space-y-4">
            <InputField
              label="Home Price"
              value={homePrice}
              onChange={handleHomePriceChange}
              min={50000}
              max={2000000}
              step={5000}
              prefix="$"
              slider
            />
            <InputField
              label="Loan Amount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
              min={0}
              max={homePrice}
              step={5000}
              prefix="$"
              slider
            />
          </div>

          <Card variant="container">
            <CardHeader>
              <CardTitle>Lender Fees</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <InputField
                label="Origination Fee"
                value={originationFee}
                onChange={setOriginationFee}
                min={0}
                max={20000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Appraisal"
                value={appraisal}
                onChange={setAppraisal}
                min={0}
                max={2000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Credit Report"
                value={creditReport}
                onChange={setCreditReport}
                min={0}
                max={200}
                step={5}
                prefix="$"
              />
              <InputField
                label="Flood Certification"
                value={floodCert}
                onChange={setFloodCert}
                min={0}
                max={100}
                step={5}
                prefix="$"
              />
              <InputField
                label="Survey"
                value={survey}
                onChange={setSurvey}
                min={0}
                max={1500}
                step={25}
                prefix="$"
              />
            </div>
          </Card>

          <Card variant="container">
            <CardHeader>
              <CardTitle>Title & Government Fees</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <InputField
                label="Title Search"
                value={titleSearch}
                onChange={setTitleSearch}
                min={0}
                max={1000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Title Insurance"
                value={titleInsurance}
                onChange={setTitleInsurance}
                min={0}
                max={10000}
                step={50}
                prefix="$"
              />
              <InputField
                label="Recording Fees"
                value={recordingFees}
                onChange={setRecordingFees}
                min={0}
                max={1000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Transfer Tax"
                value={transferTax}
                onChange={setTransferTax}
                min={0}
                max={20000}
                step={50}
                prefix="$"
              />
            </div>
          </Card>

          <Card variant="container">
            <CardHeader>
              <CardTitle>Professional Fees</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <InputField
                label="Attorney / Settlement Fees"
                value={attorneyFees}
                onChange={setAttorneyFees}
                min={0}
                max={5000}
                step={50}
                prefix="$"
              />
            </div>
          </Card>

          <Card variant="container">
            <CardHeader>
              <CardTitle>Prepaids & Escrow</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <InputField
                label="Escrow Deposit (Tax & Insurance)"
                value={escrowDeposit}
                onChange={setEscrowDeposit}
                min={0}
                max={10000}
                step={50}
                prefix="$"
              />
              <InputField
                label="Prepaid Interest"
                value={prepaidInterest}
                onChange={setPrepaidInterest}
                min={0}
                max={5000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Homeowner Insurance (annual prepaid)"
                value={homeInsurancePrepaid}
                onChange={setHomeInsurancePrepaid}
                min={0}
                max={5000}
                step={50}
                prefix="$"
              />
            </div>
          </Card>
        </div>
      }
      disclaimer="Adjust each line item to match the fees on your actual Loan Estimate. Defaults are approximations and will vary by lender and location."
    />
  );
}
