export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export function fmtPct(n: number): string {
  return n.toFixed(2) + "%";
}

/** Standard amortization P&I monthly payment */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return principal * ((r * factor) / (factor - 1));
}

/** Generate full amortization schedule */
export function amortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): { month: number; payment: number; principalPaid: number; interestPaid: number; balance: number }[] {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const pmt = monthlyPayment(principal, annualRate, years);
  const schedule: { month: number; payment: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = pmt - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({
      month: i,
      payment: pmt,
      principalPaid,
      interestPaid: interest,
      balance,
    });
  }
  return schedule;
}
