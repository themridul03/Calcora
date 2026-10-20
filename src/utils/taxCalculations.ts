import { USStateTax } from '../types';

export const US_STATES: USStateTax[] = [
  { name: 'California', code: 'CA', rate: 0.093, hasNoIncomeTax: false },
  { name: 'Texas', code: 'TX', rate: 0.0, hasNoIncomeTax: true },
  { name: 'Florida', code: 'FL', rate: 0.0, hasNoIncomeTax: true },
  { name: 'New York', code: 'NY', rate: 0.0685, hasNoIncomeTax: false },
  { name: 'Washington', code: 'WA', rate: 0.0, hasNoIncomeTax: true },
  { name: 'Illinois', code: 'IL', rate: 0.0495, hasNoIncomeTax: false },
  { name: 'Pennsylvania', code: 'PA', rate: 0.0307, hasNoIncomeTax: false },
  { name: 'Massachusetts', code: 'MA', rate: 0.05, hasNoIncomeTax: false },
  { name: 'Colorado', code: 'CO', rate: 0.044, hasNoIncomeTax: false },
  { name: 'Tennessee', code: 'TN', rate: 0.0, hasNoIncomeTax: true },
  { name: 'Nevada', code: 'NV', rate: 0.0, hasNoIncomeTax: true },
  { name: 'North Carolina', code: 'NC', rate: 0.0475, hasNoIncomeTax: false },
  { name: 'Georgia', code: 'GA', rate: 0.0549, hasNoIncomeTax: false },
  { name: 'New Jersey', code: 'NJ', rate: 0.0637, hasNoIncomeTax: false },
  { name: 'Ohio', code: 'OH', rate: 0.035, hasNoIncomeTax: false },
];

export interface TaxComparisonInput {
  targetSalary: number; // e.g. 100,000
  stateCode: string;
  has401kMatch: boolean;
  matchPercent: number; // e.g. 4%
  ptoDays: number; // e.g. 20 days
  healthInsuranceValueAnnual: number; // e.g. $6,500
  businessExpenses1099: number; // e.g. $5,000 write-offs
  billableWeeksPerYear: number; // e.g. 48 weeks (taking 4 weeks off)
  hoursPerWeek: number; // e.g. 40
}

export interface TaxComparisonResult {
  // W-2 Breakdown
  w2Gross: number;
  w2FicaTax: number;
  w2FederalTax: number;
  w2StateTax: number;
  w2TotalTax: number;
  w2BenefitsValue: number;
  w2NetTakeHome: number;
  w2EffectiveTaxRate: number;

  // 1099 Equivalent to match W-2 net
  needed1099Gross: number;
  needed1099HourlyRate: number;
  seTax: number;
  fedTax1099: number;
  stateTax1099: number;
  totalTax1099: number;
  netTakeHome1099: number;
  overheadMultiplier: number; // e.g. 1.34x
}

export function calculateUSFederalTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  // 2025/2026 Single Filer Brackets
  const brackets = [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const b of brackets) {
    if (taxableIncome > b.limit) {
      tax += (b.limit - previousLimit) * b.rate;
      previousLimit = b.limit;
    } else {
      tax += (taxableIncome - previousLimit) * b.rate;
      break;
    }
  }

  return Math.round(tax);
}

export function calculateTaxComparison(input: TaxComparisonInput): TaxComparisonResult {
  const state = US_STATES.find(s => s.code === input.stateCode) || US_STATES[0];
  const standardDeduction = 15000;
  const ssWageBase = 176100;

  // --- 1. W-2 Calculation ---
  const w2Gross = input.targetSalary;
  // FICA: 6.2% Social Security up to wage base + 1.45% Medicare
  const ssTaxW2 = Math.min(w2Gross, ssWageBase) * 0.062;
  const medicareTaxW2 = w2Gross * 0.0145;
  const w2FicaTax = Math.round(ssTaxW2 + medicareTaxW2);

  // Federal Tax
  const w2TaxableIncome = Math.max(0, w2Gross - standardDeduction);
  const w2FederalTax = calculateUSFederalTax(w2TaxableIncome);

  // State Tax
  const w2StateTax = Math.round(Math.max(0, w2Gross - 5000) * state.rate);

  const w2TotalTax = w2FicaTax + w2FederalTax + w2StateTax;
  const w2NetTakeHome = w2Gross - w2TotalTax;

  // Benefits Value
  const ptoValue = Math.round((w2Gross / 260) * input.ptoDays);
  const matchValue = input.has401kMatch ? Math.round(w2Gross * (input.matchPercent / 100)) : 0;
  const w2BenefitsValue = ptoValue + matchValue + input.healthInsuranceValueAnnual;

  // Total Real W-2 Compensation Value
  const totalW2Value = w2NetTakeHome + (matchValue + input.healthInsuranceValueAnnual);

  // --- 2. 1099 Contractor Equalizer Calculation ---
  // To replace W-2, 1099 net cash (after out-of-pocket health + lost 401k match + business expenses)
  // must equal W-2 net cash + benefits.
  // We iteratively find the 1099 gross billing needed.
  let needed1099Gross = w2Gross * 1.30; // initial guess
  let tolerance = 50;
  let maxIters = 40;

  let seTax = 0;
  let fedTax1099 = 0;
  let stateTax1099 = 0;
  let netTakeHome1099 = 0;
  let totalTax1099 = 0;

  for (let i = 0; i < maxIters; i++) {
    const netBusinessProfit = Math.max(0, needed1099Gross - input.businessExpenses1099);
    const seNetSubjectToFica = netBusinessProfit * 0.9235;

    // SE Tax: 12.4% SS up to wage base + 2.9% Medicare
    const seSocialSecurity = Math.min(seNetSubjectToFica, ssWageBase) * 0.124;
    const seMedicare = seNetSubjectToFica * 0.029;
    seTax = Math.round(seSocialSecurity + seMedicare);

    // 50% SE deduction
    const halfSeDeduction = seTax * 0.5;

    // Self-employed health insurance deduction
    const healthDeduction = input.healthInsuranceValueAnnual;

    // QBI Deduction (20% of net qualified income if under threshold)
    const qbiDeduction = netBusinessProfit * 0.20;

    const fedTaxable1099 = Math.max(0, netBusinessProfit - standardDeduction - halfSeDeduction - healthDeduction - qbiDeduction);
    fedTax1099 = calculateUSFederalTax(fedTaxable1099);

    const stateTaxable1099 = Math.max(0, netBusinessProfit - standardDeduction - halfSeDeduction);
    stateTax1099 = Math.round(stateTaxable1099 * state.rate);

    totalTax1099 = seTax + fedTax1099 + stateTax1099;
    // Net disposable income after taxes, healthcare purchase, and business expenses
    netTakeHome1099 = needed1099Gross - totalTax1099 - input.businessExpenses1099 - input.healthInsuranceValueAnnual;

    const diff = netTakeHome1099 - (w2NetTakeHome + matchValue);
    if (Math.abs(diff) < tolerance) {
      break;
    }
    needed1099Gross -= diff * 0.7;
  }

  needed1099Gross = Math.round(needed1099Gross);
  const totalBillableHours = Math.max(1, input.billableWeeksPerYear * input.hoursPerWeek);
  const needed1099HourlyRate = Number((needed1099Gross / totalBillableHours).toFixed(2));
  const overheadMultiplier = Number((needed1099Gross / w2Gross).toFixed(2));

  return {
    w2Gross,
    w2FicaTax,
    w2FederalTax,
    w2StateTax,
    w2TotalTax,
    w2BenefitsValue,
    w2NetTakeHome,
    w2EffectiveTaxRate: Number(((w2TotalTax / w2Gross) * 100).toFixed(1)),

    needed1099Gross,
    needed1099HourlyRate,
    seTax,
    fedTax1099,
    stateTax1099,
    totalTax1099,
    netTakeHome1099: Math.round(netTakeHome1099),
    overheadMultiplier,
  };
}
