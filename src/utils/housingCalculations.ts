import { RentVsBuyParams, RentVsBuyYearResult } from '../types';

export interface HousingComparisonSummary {
  monthlyMortgagePI: number;
  monthlyTotalBuyCost: number;
  initialDownPayment: number;
  initialBuyingClosingCosts: number;
  totalCashToClose: number;
  
  monthlyRentInitial: number;
  breakEvenYear: number | null; // null if renting remains better through 30 years
  year5Advantage: { winner: 'buy' | 'rent'; amount: number };
  year10Advantage: { winner: 'buy' | 'rent'; amount: number };
  year30Advantage: { winner: 'buy' | 'rent'; amount: number };
  
  yearlyTimeline: RentVsBuyYearResult[];
}

export function calculateRentVsBuy(params: RentVsBuyParams): HousingComparisonSummary {
  const downPayment = params.homePrice * (params.downPaymentPercent / 100);
  const loanAmount = params.homePrice - downPayment;
  const buyingClosingCosts = params.homePrice * (params.buyingClosingCostsPercent / 100);
  const totalCashToClose = downPayment + buyingClosingCosts;

  // Monthly Mortgage P&I
  const monthlyRate = params.mortgageRate / 100 / 12;
  const totalPayments = params.loanTermYears * 12;
  let monthlyPI = 0;
  if (monthlyRate > 0) {
    monthlyPI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else {
    monthlyPI = loanAmount / totalPayments;
  }

  const monthlyPropertyTax = (params.homePrice * (params.propertyTaxRate / 100)) / 12;
  const monthlyHomeInsurance = params.homeInsuranceAnnual / 12;
  const monthlyMaintenance = (params.homePrice * (params.maintenancePercent / 100)) / 12;
  const monthlyTotalBuyCost = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + params.hoaMonthly + monthlyMaintenance;

  // 30-Year Simulation
  let homeValue = params.homePrice;
  let remainingLoan = loanAmount;
  let currentRent = params.monthlyRent + params.rentersInsuranceMonthly;
  let rentInvestmentPortfolio = totalCashToClose; // renter starts with down payment cash invested
  let buyTotalCumulativeCost = totalCashToClose;
  let rentTotalCumulativeCost = 0;

  const yearlyTimeline: RentVsBuyYearResult[] = [];
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= 30; year++) {
    // 12 months for this year
    for (let m = 1; m <= 12; m++) {
      // Mortgage amortization
      if (remainingLoan > 0) {
        const interest = remainingLoan * monthlyRate;
        const principal = Math.min(remainingLoan, monthlyPI - interest);
        remainingLoan -= principal;
      }

      // Inflation on expenses
      const monthlyBuyExpenses =
        monthlyPI +
        monthlyPropertyTax * Math.pow(1.025, year - 1) +
        monthlyHomeInsurance * Math.pow(1.03, year - 1) +
        params.hoaMonthly * Math.pow(1.03, year - 1) +
        monthlyMaintenance * Math.pow(1.025, year - 1);

      buyTotalCumulativeCost += monthlyBuyExpenses;
      rentTotalCumulativeCost += currentRent;

      // Cash flow difference: does renter save cash each month to invest?
      const monthlySavingsForRenter = monthlyBuyExpenses - currentRent;
      const monthlyInvestmentRate = params.investmentReturnRate / 100 / 12;

      // Grow existing portfolio + add monthly savings
      rentInvestmentPortfolio = rentInvestmentPortfolio * (1 + monthlyInvestmentRate) + monthlySavingsForRenter;
    }

    // Home appreciation
    homeValue = homeValue * (1 + params.homeAppreciationRate / 100);
    // Rent inflation
    currentRent = currentRent * (1 + params.rentInflationRate / 100);

    // Selling costs
    const sellingCosts = homeValue * (params.sellingClosingCostsPercent / 100);
    const buyNetWorth = Math.round(homeValue - Math.max(0, remainingLoan) - sellingCosts);
    const rentNetWorth = Math.round(rentInvestmentPortfolio);
    const netAdvantage = buyNetWorth - rentNetWorth;

    if (breakEvenYear === null && netAdvantage > 0) {
      breakEvenYear = year;
    }

    yearlyTimeline.push({
      year,
      buyTotalCost: Math.round(buyTotalCumulativeCost),
      rentTotalCost: Math.round(rentTotalCumulativeCost),
      buyNetWorth,
      rentNetWorth,
      netAdvantage,
    });
  }

  const getAdvantageAt = (targetYear: number) => {
    const entry = yearlyTimeline.find(y => y.year === targetYear) || yearlyTimeline[yearlyTimeline.length - 1];
    const diff = entry.netAdvantage;
    return {
      winner: diff >= 0 ? ('buy' as const) : ('rent' as const),
      amount: Math.abs(diff),
    };
  };

  return {
    monthlyMortgagePI: Math.round(monthlyPI),
    monthlyTotalBuyCost: Math.round(monthlyTotalBuyCost),
    initialDownPayment: Math.round(downPayment),
    initialBuyingClosingCosts: Math.round(buyingClosingCosts),
    totalCashToClose: Math.round(totalCashToClose),
    monthlyRentInitial: Math.round(params.monthlyRent + params.rentersInsuranceMonthly),
    breakEvenYear,
    year5Advantage: getAdvantageAt(5),
    year10Advantage: getAdvantageAt(10),
    year30Advantage: getAdvantageAt(30),
    yearlyTimeline,
  };
}
