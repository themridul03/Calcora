export interface UKTaxInput {
  grossSalary: number; // e.g. £65,000
  pensionContributionPercent: number; // e.g. 5% salary sacrifice
  studentLoanPlan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';
  isContractorOutsideIR35: boolean;
  dayRate: number; // e.g. £550
  workingDaysPerYear: number; // e.g. 220
  annualBusinessExpenses: number; // e.g. £4,000
}

export interface UKTaxBreakdown {
  grossSalary: number;
  pensionDeduction: number;
  adjustedGross: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoanDeduction: number;
  totalDeductions: number;
  netAnnualTakeHome: number;
  netMonthlyTakeHome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  isTrappedIn60PercentTax: boolean;

  // Contractor comparison if enabled
  contractorGrossRevenue?: number;
  contractorNetTakeHome?: number;
  contractorAdvantage?: number;
}

export function calculateUKTax(input: UKTaxInput): UKTaxBreakdown {
  const pensionDeduction = Math.round(input.grossSalary * (input.pensionContributionPercent / 100));
  const adjustedGross = Math.max(0, input.grossSalary - pensionDeduction);

  // UK Personal Allowance Tapering (£1 lost for every £2 over £100,000)
  let personalAllowance = 12570;
  let isTrappedIn60PercentTax = false;

  if (adjustedGross > 100000) {
    const excess = adjustedGross - 100000;
    personalAllowance = Math.max(0, 12570 - excess / 2);
    if (adjustedGross <= 125140) {
      isTrappedIn60PercentTax = true;
    }
  }

  const taxableIncome = Math.max(0, adjustedGross - personalAllowance);

  // Income Tax Brackets (England/Wales/NI)
  let incomeTax = 0;
  const basicLimit = 50270 - 12570; // £37,700 band at 20%
  const higherLimit = 125140 - 12570;

  if (taxableIncome > 0) {
    const basicTaxable = Math.min(taxableIncome, basicLimit);
    incomeTax += basicTaxable * 0.20;

    if (taxableIncome > basicLimit) {
      const higherTaxable = Math.min(taxableIncome - basicLimit, higherLimit - basicLimit);
      incomeTax += higherTaxable * 0.40;
    }

    if (taxableIncome > higherLimit) {
      const additionalTaxable = taxableIncome - higherLimit;
      incomeTax += additionalTaxable * 0.45;
    }
  }

  // National Insurance (Class 1 Employee - 2025/2026: 8% on £12,570 to £50,270, 2% above)
  let nationalInsurance = 0;
  if (adjustedGross > 12570) {
    const mainBand = Math.min(adjustedGross, 50270) - 12570;
    nationalInsurance += mainBand * 0.08;
    if (adjustedGross > 50270) {
      nationalInsurance += (adjustedGross - 50270) * 0.02;
    }
  }

  // Student Loan
  let studentLoanDeduction = 0;
  switch (input.studentLoanPlan) {
    case 'plan1':
      if (adjustedGross > 24990) studentLoanDeduction = (adjustedGross - 24990) * 0.09;
      break;
    case 'plan2':
      if (adjustedGross > 27295) studentLoanDeduction = (adjustedGross - 27295) * 0.09;
      break;
    case 'plan4':
      if (adjustedGross > 31395) studentLoanDeduction = (adjustedGross - 31395) * 0.09;
      break;
    case 'plan5':
      if (adjustedGross > 25000) studentLoanDeduction = (adjustedGross - 25000) * 0.09;
      break;
    case 'postgrad':
      if (adjustedGross > 21000) studentLoanDeduction = (adjustedGross - 21000) * 0.06;
      break;
  }

  incomeTax = Math.round(incomeTax);
  nationalInsurance = Math.round(nationalInsurance);
  studentLoanDeduction = Math.round(studentLoanDeduction);

  const totalDeductions = incomeTax + nationalInsurance + studentLoanDeduction + pensionDeduction;
  const netAnnualTakeHome = input.grossSalary - totalDeductions;
  const netMonthlyTakeHome = Math.round(netAnnualTakeHome / 12);
  const effectiveTaxRate = Number(((totalDeductions / input.grossSalary) * 100).toFixed(1));

  // Determine marginal tax rate
  let marginalTaxRate = 20 + 8; // 28% basic
  if (adjustedGross > 50270 && adjustedGross <= 100000) {
    marginalTaxRate = 40 + 2; // 42% higher
  } else if (isTrappedIn60PercentTax) {
    marginalTaxRate = 40 + 20 + 2; // 62% tax trap!
  } else if (adjustedGross > 125140) {
    marginalTaxRate = 45 + 2; // 47%
  }

  // Contractor calculation if outside IR35
  let contractorGrossRevenue = 0;
  let contractorNetTakeHome = 0;
  let contractorAdvantage = 0;

  if (input.isContractorOutsideIR35) {
    contractorGrossRevenue = input.dayRate * input.workingDaysPerYear;
    const profitBeforeTax = Math.max(0, contractorGrossRevenue - input.annualBusinessExpenses);
    
    // Corporation Tax: 19% small profits rate up to £50k, tapering to 25% above £250k
    let corpTax = 0;
    if (profitBeforeTax <= 50000) {
      corpTax = profitBeforeTax * 0.19;
    } else {
      corpTax = profitBeforeTax * 0.25; // standard rate approx
    }
    
    const profitAfterCorpTax = profitBeforeTax - corpTax;
    // Assume taking £12,570 salary (0% PAYE/NI) + remainder in dividends
    const dividendPot = Math.max(0, profitAfterCorpTax - 12570);
    // Dividend tax (approx 8.75% basic, 33.75% higher)
    const dividendTax = dividendPot > 37700 
      ? 37700 * 0.0875 + (dividendPot - 37700) * 0.3375 
      : dividendPot * 0.0875;

    contractorNetTakeHome = Math.round(12570 + dividendPot - dividendTax);
    contractorAdvantage = contractorNetTakeHome - netAnnualTakeHome;
  }

  return {
    grossSalary: input.grossSalary,
    pensionDeduction,
    adjustedGross,
    personalAllowance: Math.round(personalAllowance),
    taxableIncome: Math.round(taxableIncome),
    incomeTax,
    nationalInsurance,
    studentLoanDeduction,
    totalDeductions,
    netAnnualTakeHome,
    netMonthlyTakeHome,
    effectiveTaxRate,
    marginalTaxRate,
    isTrappedIn60PercentTax,
    contractorGrossRevenue,
    contractorNetTakeHome,
    contractorAdvantage,
  };
}
