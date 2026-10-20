import { CalculatorType } from '../types';

export interface RouteMeta {
  id: CalculatorType;
  path: string;
  canonicalUrl: string;
  title: string;
  metaTitle: (countryName: string, currencySymbol: string) => string;
  metaDescription: string;
  heading: string;
  subheading: string;
  breadcrumbName: string;
}

export const BASE_URL = 'https://calcora-roan.vercel.app';

export const ROUTES: Record<CalculatorType, RouteMeta> = {
  '1099-vs-w2': {
    id: '1099-vs-w2',
    path: '/calculators/1099-vs-w2',
    canonicalUrl: `${BASE_URL}/calculators/1099-vs-w2`,
    title: '1099 vs W-2 Equalizer & Self-Employment Tax Calculator',
    metaTitle: (countryName, symbol) => `1099 vs W-2 Equalizer & Self-Employment Tax Calculator (${countryName}) | Calcora`,
    metaDescription: 'Calculate the exact 1099 contractor equivalent hourly rate to match a W-2 salary after self-employment tax (15.3%), QBI deduction, health insurance, and PTO.',
    heading: '1099 vs W-2 Contractor Equalizer & Tax Parity',
    subheading: 'Calculate your exact contractor billing rate to match salary take-home after self-employment tax, healthcare, and retirement benefits.',
    breadcrumbName: '1099 vs W-2 Equalizer',
  },
  'debt-matrix': {
    id: 'debt-matrix',
    path: '/calculators/debt-payoff',
    canonicalUrl: `${BASE_URL}/calculators/debt-payoff`,
    title: 'Credit Card Debt Payoff Calculator — Avalanche vs Snowball',
    metaTitle: (countryName, symbol) => `Credit Card Debt Payoff Calculator — Avalanche vs Snowball (${symbol}) | Calcora`,
    metaDescription: 'Compare Debt Avalanche, Debt Snowball, and Consolidation Loans. See exact debt-free dates, interest saved, and visual amortization curves.',
    heading: 'Credit Card Debt Payoff Matrix & Strategy Engine',
    subheading: 'Compare mathematical Debt Avalanche against behavioral Debt Snowball and 0% balance transfer consolidation in real time.',
    breadcrumbName: 'Debt Payoff Matrix',
  },
  'rent-vs-buy': {
    id: 'rent-vs-buy',
    path: '/calculators/rent-vs-buy',
    canonicalUrl: `${BASE_URL}/calculators/rent-vs-buy`,
    title: '2026 Rent vs Buy Calculator & S&P 500 Opportunity Cost',
    metaTitle: (countryName, symbol) => `2026 Rent vs Buy Calculator & S&P 500 Opportunity Cost (${countryName}) | Calcora`,
    metaDescription: 'Does buying build more wealth than renting? Compare mortgage interest, HOA, and property taxes against compounding down payments in index funds.',
    heading: '2026 Rent vs Buy Decision Engine & Wealth Modeler',
    subheading: 'Pit 6.5%+ mortgage interest, property taxes, and maintenance against compounding your down payment in broad-market index funds.',
    breadcrumbName: 'Rent vs Buy Engine',
  },
  'can-i-afford-it': {
    id: 'can-i-afford-it',
    path: '/calculators/can-i-afford-it',
    canonicalUrl: `${BASE_URL}/calculators/can-i-afford-it`,
    title: 'Can I Afford This? Impulse Buy & Life-Hours Traded Calculator',
    metaTitle: (countryName, symbol) => `Can I Afford This? Impulse Buy & Life-Hours Traded Calculator (${symbol}) | Calcora`,
    metaDescription: 'See how many hours of your life an impulse purchase actually costs, calculate S&P 500 compound growth opportunity cost, and apply the viral 72-Hour Rule.',
    heading: 'Can I Afford This? Impulse Buy & Life-Hours Calculator',
    subheading: 'Convert retail prices into exact hours of human life traded and calculate the 20-year S&P 500 compounding opportunity cost.',
    breadcrumbName: 'Can I Afford This?',
  },
  'fire-calculator': {
    id: 'fire-calculator',
    path: '/calculators/fire-retirement',
    canonicalUrl: `${BASE_URL}/calculators/fire-retirement`,
    title: 'FIRE Calculator — Financial Independence & Early Retirement Age',
    metaTitle: (countryName, symbol) => `FIRE Calculator — Financial Independence & Early Retirement Age (${countryName}) | Calcora`,
    metaDescription: 'Calculate your exact FIRE Freedom Number using the Trinity Study 4% Safe Withdrawal Rule, Coast FIRE, Lean FIRE, and compounding investment runway.',
    heading: 'FIRE Retirement Freedom & Target Age Calculator',
    subheading: 'Calculate your exact Freedom Number using the Trinity Study 4% Safe Withdrawal Rule, Coast FIRE, and Lean/Fat milestones.',
    breadcrumbName: 'FIRE Retirement',
  },
  'job-duel': {
    id: 'job-duel',
    path: '/calculators/job-offer-comparison',
    canonicalUrl: `${BASE_URL}/calculators/job-offer-comparison`,
    title: 'Job Offer Duel — Side-by-Side Salary & Cost of Living Comparison',
    metaTitle: (countryName, symbol) => `Job Offer Duel — Side-by-Side Salary & Cost of Living Comparison (${symbol}) | Calcora`,
    metaDescription: 'Compare two competing tech or remote job offers side-by-side. Factor in state income taxes, local rent, 401(k) matching, and real monthly disposable cash.',
    heading: 'Side-by-Side Job Offer Duel & Relocation Arbitrage',
    subheading: 'Pit two competing job offers against each other factoring in zero-tax states, local rents, and true disposable cash flow.',
    breadcrumbName: 'Job Offer Duel',
  },
  'uk-tax': {
    id: 'uk-tax',
    path: '/uk/salary-sacrifice-calculator',
    canonicalUrl: `${BASE_URL}/uk/salary-sacrifice-calculator`,
    title: 'UK 60% Marginal Tax Trap & Salary Sacrifice Calculator 2025/2026',
    metaTitle: (countryName, symbol) => `UK 60% Marginal Tax Trap & Salary Sacrifice Calculator 2025/2026 | Calcora`,
    metaDescription: 'Navigate the HMRC £100k–£125k personal allowance taper. Calculate pension salary sacrifice savings and 30-hour free childcare protection.',
    heading: 'UK 60% Marginal Tax Trap & Salary Sacrifice Optimizer',
    subheading: 'Escape the HMRC £100k–£125k personal allowance clawback and protect 30-hour free childcare subsidies using pension salary sacrifice.',
    breadcrumbName: 'UK Salary Sacrifice',
  },
  'suggestions': {
    id: 'suggestions',
    path: '/suggestions',
    canonicalUrl: `${BASE_URL}/suggestions`,
    title: 'Smart Financial Insights & Feature Request Roadmap',
    metaTitle: (countryName, symbol) => `Smart Financial Insights & Feature Request Roadmap | Calcora`,
    metaDescription: 'Actionable tax optimization hacks, S-Corp shielding tips, and community feature requests for Calcora.',
    heading: 'Financial Insights & Community Feature Roadmap',
    subheading: 'Actionable tax optimization strategies, capital allocation levers, and community-upvoted financial engineering roadmap.',
    breadcrumbName: 'Suggestions & Roadmap',
  },
};

// Map URL pathname to internal calculator ID
export function getCalculatorFromPathname(pathname: string): CalculatorType | null {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  for (const [id, config] of Object.entries(ROUTES)) {
    if (config.path === cleanPath) {
      return id as CalculatorType;
    }
  }
  return null;
}

// Backward compatibility map for legacy hash fragments
export const LEGACY_HASH_MAP: Record<string, string> = {
  '#1099-vs-w2': '/calculators/1099-vs-w2',
  '#debt-matrix': '/calculators/debt-payoff',
  '#rent-vs-buy': '/calculators/rent-vs-buy',
  '#can-i-afford-it': '/calculators/can-i-afford-it',
  '#fire-calculator': '/calculators/fire-retirement',
  '#job-duel': '/calculators/job-offer-comparison',
  '#uk-tax': '/uk/salary-sacrifice-calculator',
  '#suggestions': '/suggestions',
};

// All crawlable canonical URLs for the sitemap
export const ALL_CANONICAL_ROUTES = [
  '/',
  '/calculators/1099-vs-w2',
  '/calculators/debt-payoff',
  '/calculators/rent-vs-buy',
  '/calculators/can-i-afford-it',
  '/calculators/fire-retirement',
  '/calculators/job-offer-comparison',
  '/uk/salary-sacrifice-calculator',
  '/suggestions',
];
