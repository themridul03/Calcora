export type CountryCode = string;

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  defaultSalary: number;
  defaultHome: number;
  defaultRent: number;
  taxSystem: string;
  retirementSystem: string;
}

export type Country = string;


export type CalculatorType = 
  | '1099-vs-w2' 
  | 'debt-matrix' 
  | 'rent-vs-buy' 
  | 'can-i-afford-it' 
  | 'fire-calculator' 
  | 'job-duel' 
  | 'uk-tax' 
  | 'suggestions';

export interface USStateTax {
  name: string;
  code: string;
  rate: number;
  hasNoIncomeTax: boolean;
}

export interface CreditCardItem {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPaymentPercent: number;
}

export interface DebtPayoffResult {
  strategy: 'minimum' | 'snowball' | 'avalanche' | 'consolidation';
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  debtFreeDate: string;
  monthlySavingsVsMinimum?: number;
  interestSavedVsMinimum?: number;
}

export interface RentVsBuyParams {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  hoaMonthly: number;
  maintenancePercent: number;
  homeAppreciationRate: number;
  buyingClosingCostsPercent: number;
  sellingClosingCostsPercent: number;
  
  // Rent side
  monthlyRent: number;
  rentersInsuranceMonthly: number;
  rentInflationRate: number;
  investmentReturnRate: number;
}

export interface RentVsBuyYearResult {
  year: number;
  buyTotalCost: number;
  rentTotalCost: number;
  buyNetWorth: number;
  rentNetWorth: number;
  netAdvantage: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'tax' | 'debt' | 'housing' | 'investment';
  title: string;
  impact: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
}
