import { CreditCardItem, DebtPayoffResult } from '../types';

export interface DebtSimulationResult {
  results: Record<'minimum' | 'snowball' | 'avalanche' | 'consolidation', DebtPayoffResult>;
  monthlyTimeline: Array<{
    month: number;
    minimumBalance: number;
    snowballBalance: number;
    avalancheBalance: number;
    consolidationBalance: number;
  }>;
  totalInitialDebt: number;
  weightedAvgApr: number;
}

export function simulateDebtPayoff(
  cards: CreditCardItem[],
  extraMonthlyPayment: number,
  consolidationApr: number = 10.99,
  consolidationTermMonths: number = 36
): DebtSimulationResult {
  const totalInitialDebt = cards.reduce((sum, c) => sum + c.balance, 0);

  if (totalInitialDebt <= 0 || cards.length === 0) {
    const emptyResult: DebtPayoffResult = {
      strategy: 'minimum',
      totalMonths: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
      debtFreeDate: 'Now',
    };
    return {
      results: {
        minimum: { ...emptyResult, strategy: 'minimum' },
        snowball: { ...emptyResult, strategy: 'snowball' },
        avalanche: { ...emptyResult, strategy: 'avalanche' },
        consolidation: { ...emptyResult, strategy: 'consolidation' },
      },
      monthlyTimeline: [],
      totalInitialDebt: 0,
      weightedAvgApr: 0,
    };
  }

  const weightedAvgApr = Number(
    (cards.reduce((sum, c) => sum + c.balance * c.apr, 0) / totalInitialDebt).toFixed(2)
  );

  // 1. Minimum payment simulation
  const minResult = simulateStrategy(cards, 0, 'minimum');

  // 2. Snowball simulation (lowest balance first)
  const snowballResult = simulateStrategy(cards, extraMonthlyPayment, 'snowball');

  // 3. Avalanche simulation (highest APR first)
  const avalancheResult = simulateStrategy(cards, extraMonthlyPayment, 'avalanche');

  // 4. Consolidation Loan simulation
  const consolidationResult = simulateConsolidation(
    totalInitialDebt,
    consolidationApr,
    consolidationTermMonths
  );

  // Calculate comparisons vs Minimum
  snowballResult.interestSavedVsMinimum = Math.max(0, minResult.totalInterestPaid - snowballResult.totalInterestPaid);
  avalancheResult.interestSavedVsMinimum = Math.max(0, minResult.totalInterestPaid - avalancheResult.totalInterestPaid);
  consolidationResult.interestSavedVsMinimum = Math.max(0, minResult.totalInterestPaid - consolidationResult.totalInterestPaid);

  // Build combined timeline (up to 48 months or min of all)
  const maxMonthsToTrack = Math.min(60, Math.max(snowballResult.totalMonths, avalancheResult.totalMonths, 36));
  const timeline: Array<{
    month: number;
    minimumBalance: number;
    snowballBalance: number;
    avalancheBalance: number;
    consolidationBalance: number;
  }> = [];

  for (let m = 0; m <= maxMonthsToTrack; m += 3) {
    timeline.push({
      month: m,
      minimumBalance: Math.max(0, Math.round(totalInitialDebt * Math.pow(0.975, m))),
      snowballBalance: Math.max(0, Math.round(totalInitialDebt - (totalInitialDebt / Math.max(1, snowballResult.totalMonths)) * m)),
      avalancheBalance: Math.max(0, Math.round(totalInitialDebt - (totalInitialDebt / Math.max(1, avalancheResult.totalMonths)) * m)),
      consolidationBalance: Math.max(0, Math.round(totalInitialDebt - (totalInitialDebt / consolidationTermMonths) * m)),
    });
  }

  return {
    results: {
      minimum: minResult,
      snowball: snowballResult,
      avalanche: avalancheResult,
      consolidation: consolidationResult,
    },
    monthlyTimeline: timeline,
    totalInitialDebt,
    weightedAvgApr,
  };
}

function simulateStrategy(
  cards: CreditCardItem[],
  extraMonthly: number,
  strategy: 'minimum' | 'snowball' | 'avalanche'
): DebtPayoffResult {
  // Deep clone card balances
  let activeCards = cards.map(c => ({ ...c }));
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  const maxMonths = 360; // 30 years cap

  // Baseline minimum payments sum
  const baselineMinPayment = activeCards.reduce((sum, c) => {
    return sum + Math.max(25, c.balance * (c.minPaymentPercent / 100));
  }, 0);
  const totalMonthlyBudget = baselineMinPayment + extraMonthly;

  while (months < maxMonths) {
    const remainingBalance = activeCards.reduce((sum, c) => sum + c.balance, 0);
    if (remainingBalance <= 0.01) break;

    months++;

    // Apply monthly interest
    for (const card of activeCards) {
      if (card.balance > 0) {
        const monthlyInterest = card.balance * (card.apr / 100 / 12);
        card.balance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    }

    if (strategy === 'minimum') {
      // Just pay minimum on each
      for (const card of activeCards) {
        if (card.balance > 0) {
          const minPay = Math.min(card.balance, Math.max(25, card.balance * (card.minPaymentPercent / 100)));
          card.balance -= minPay;
          totalPaid += minPay;
        }
      }
    } else {
      // Snowball or Avalanche
      let availableBudget = totalMonthlyBudget;

      // 1. Pay minimums first
      for (const card of activeCards) {
        if (card.balance > 0) {
          const minPay = Math.min(card.balance, Math.max(25, card.balance * (card.minPaymentPercent / 100)));
          card.balance -= minPay;
          totalPaid += minPay;
          availableBudget -= minPay;
        }
      }

      // 2. Sort cards according to strategy
      const sortedCards = activeCards
        .filter(c => c.balance > 0)
        .sort((a, b) => {
          if (strategy === 'snowball') return a.balance - b.balance; // lowest balance first
          return b.apr - a.apr; // highest APR first
        });

      // 3. Put all remaining budget towards priority card
      for (const targetCard of sortedCards) {
        if (availableBudget <= 0) break;
        const extraPay = Math.min(targetCard.balance, availableBudget);
        targetCard.balance -= extraPay;
        totalPaid += extraPay;
        availableBudget -= extraPay;
      }
    }
  }

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + months);
  const debtFreeDate = futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    strategy,
    totalMonths: months,
    totalInterestPaid: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    debtFreeDate,
  };
}

function simulateConsolidation(
  totalDebt: number,
  apr: number,
  termMonths: number
): DebtPayoffResult {
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    (totalDebt * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalPaid = monthlyPayment * termMonths;
  const totalInterest = totalPaid - totalDebt;

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + termMonths);
  const debtFreeDate = futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    strategy: 'consolidation',
    totalMonths: termMonths,
    totalInterestPaid: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    debtFreeDate,
    monthlySavingsVsMinimum: Math.round(monthlyPayment),
  };
}
