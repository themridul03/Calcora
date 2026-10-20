import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Trash2, 
  Plus, 
  Sparkles, 
  TrendingDown, 
  Flame, 
  Snowflake, 
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CreditCardItem, Country } from '../../types';
import { simulateDebtPayoff } from '../../utils/debtCalculations';
import { getCountryInfo } from '../../utils/countries';
import { AdSenseBanner } from '../AdSenseBanner';

interface DebtMatrixProps {
  country: Country;
}

const DEFAULT_CARDS: CreditCardItem[] = [
  { id: '1', name: 'Chase / Amex Card', balance: 7200, apr: 28.49, minPaymentPercent: 2.5 },
  { id: '2', name: 'Capital One Card', balance: 4800, apr: 26.99, minPaymentPercent: 2.5 },
  { id: '3', name: 'Citi Card', balance: 3400, apr: 21.99, minPaymentPercent: 2.0 },
];

export const DebtMatrix: React.FC<DebtMatrixProps> = ({ country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [cards, setCards] = useState<CreditCardItem[]>(DEFAULT_CARDS);
  const [extraPayment, setExtraPayment] = useState<number>(250);
  const [isCardListOpen, setIsCardListOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const simulation = useMemo(() => {
    return simulateDebtPayoff(cards, extraPayment, 10.99, 36);
  }, [cards, extraPayment]);

  const loadPreset = (presetType: 'avg' | 'high' | 'small') => {
    if (presetType === 'avg') {
      setCards([
        { id: '1', name: 'High-APR Card', balance: 7500, apr: 29.99, minPaymentPercent: 2.5 },
        { id: '2', name: 'Store Credit Card', balance: 4500, apr: 26.49, minPaymentPercent: 2.5 },
        { id: '3', name: 'Standard Card', balance: 3400, apr: 21.99, minPaymentPercent: 2.0 },
      ]);
    } else if (presetType === 'high') {
      setCards([
        { id: '1', name: 'High Interest Card', balance: 6500, apr: 29.99, minPaymentPercent: 2.5 },
      ]);
    } else {
      setCards([
        { id: '1', name: 'Small Balance Card', balance: 3200, apr: 23.99, minPaymentPercent: 2.0 },
      ]);
    }
  };

  const addCard = () => {
    const newId = String(Date.now());
    setCards([
      ...cards,
      { id: newId, name: `Card #${cards.length + 1}`, balance: 2500, apr: 24.99, minPaymentPercent: 2.5 },
    ]);
    setIsCardListOpen(true);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const updateCard = (id: string, field: keyof CreditCardItem, val: string | number) => {
    setCards(
      cards.map(c => {
        if (c.id === id) {
          return { ...c, [field]: val };
        }
        return c;
      })
    );
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff9f0a', '#ffb340', '#10B981', '#34D399'],
    });
  };

  const { minimum, snowball, avalanche, consolidation } = simulation.results;

  const copyDebtPlan = () => {
    const text = `Calcora Debt Payoff Plan:
Total Balance: ${currencySymbol}${simulation.totalInitialDebt.toLocaleString()}
Recommended: Debt Avalanche (Saves ${currencySymbol}${(avalanche.interestSavedVsMinimum || 0).toLocaleString()})
Debt-Free Date: ${avalanche.debtFreeDate} (${Math.round(avalanche.totalMonths / 12)} yrs earlier vs minimums)
Calculated via Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Quick Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              ⚡ Easy Payoff Mode
            </span>
            <span className="text-xs text-zinc-400">Total Debt: {currencySymbol}{simulation.totalInitialDebt.toLocaleString()}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Credit Card Debt Payoff Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            Discover the fastest, cheapest way to eliminate credit card debt. Compare Avalanche vs Snowball vs 0% Consolidation in real time.
          </p>
        </div>

        {/* 1-Tap Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">Presets:</span>
          <button
            onClick={() => loadPreset('avg')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Average US ($15.4k)
          </button>
          <button
            onClick={() => loadPreset('high')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Single Card ($6.5k)
          </button>
          <button
            onClick={() => loadPreset('small')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Small ($3.2k)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Boost Slider + Collapsible Card Manager */}
        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ff9f0a]" />
              Payoff Levers
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Weighted APR: {simulation.weightedAvgApr}%</span>
          </div>

          {/* Extra Monthly Payment Slider */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Extra Monthly Debt Payoff Boost</label>
              <span className="text-lg font-black text-[#ff9f0a] font-mono">
                +{currencySymbol}{extraPayment}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={25}
              value={extraPayment}
              onChange={e => setExtraPayment(Number(e.target.value))}
              className="w-full accent-[#ff9f0a] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-zinc-400">
              Adding {currencySymbol}{extraPayment}/mo cuts your payoff time down significantly!
            </p>
          </div>

          {/* Quick Summary of Active Cards */}
          <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Active Balances</span>
              <span className="text-[10px] text-zinc-400">
                {cards.length} Credit Cards • Total: {currencySymbol}{simulation.totalInitialDebt.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setIsCardListOpen(!isCardListOpen)}
              className="px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>{isCardListOpen ? 'Close Editor' : 'Edit Cards'}</span>
              {isCardListOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Card List Editor */}
          {isCardListOpen && (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 animate-in fade-in duration-200">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Card Details</span>
                <button
                  onClick={addCard}
                  className="text-xs font-semibold text-[#ff9f0a] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Card
                </button>
              </div>

              {cards.map(card => (
                <div key={card.id} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={card.name}
                      onChange={e => updateCard(card.id, 'name', e.target.value)}
                      className="bg-transparent text-xs font-bold text-white border-b border-zinc-700 focus:outline-none focus:border-[#ff9f0a] px-1 py-0.5"
                    />
                    {cards.length > 1 && (
                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-zinc-500 hover:text-rose-400 p-0.5 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] text-zinc-400 block">Balance ({currencySymbol})</label>
                      <input
                        type="number"
                        value={card.balance}
                        onChange={e => updateCard(card.id, 'balance', Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-zinc-400 block">APR (%)</label>
                      <input
                        type="number"
                        step={0.1}
                        value={card.apr}
                        onChange={e => updateCard(card.id, 'apr', Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-rose-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Celebrate Button */}
          <button
            onClick={triggerConfetti}
            className="w-full py-2.5 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#ff9f0a] text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff9f0a]" />
            <span>Celebrate Payoff Goal 🎉</span>
          </button>
        </div>

        {/* Right Column: The Winner Banner & Clear Strategies */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* THE WINNER HERO CARD */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-[#ff9f0a]/50 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/15 px-3 py-1 rounded-full border border-[#ff9f0a]/30 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#ff9f0a]" />
                Top Recommendation: Debt Avalanche
              </span>

              <button
                onClick={copyDebtPlan}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Debt-Free Date</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {avalanche.debtFreeDate}
                </div>
              </div>

              <div>
                <span className="text-xs text-zinc-400 block font-medium">Interest Saved vs Minimums</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  +{currencySymbol}{(avalanche.interestSavedVsMinimum || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              💡 <strong>The Easy Takeaway:</strong> By targeting highest-APR cards first and putting your extra {currencySymbol}{extraPayment}/mo to work, you become 100% debt-free by{' '}
              <span className="text-[#ff9f0a] font-bold">{avalanche.debtFreeDate}</span>, saving{' '}
              <span className="text-emerald-400 font-bold">{currencySymbol}{(avalanche.interestSavedVsMinimum || 0).toLocaleString()}</span> compared to the bank's minimum payment trap!
            </div>
          </div>

          {/* 3 Strategy Snapshot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Avalanche */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Avalanche
                </span>
                <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">Math Win</span>
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Interest:</span>
                  <span className="font-mono text-white">{currencySymbol}{avalanche.totalInterestPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono text-white">{avalanche.totalMonths} months</span>
                </div>
              </div>
            </div>

            {/* Snowball */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <Snowflake className="w-3.5 h-3.5" /> Snowball
                </span>
                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">Quick Wins</span>
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Interest:</span>
                  <span className="font-mono text-white">{currencySymbol}{snowball.totalInterestPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono text-white">{snowball.totalMonths} months</span>
                </div>
              </div>
            </div>

            {/* Minimums */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-rose-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Minimums
                </span>
                <span className="text-[9px] font-bold text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded">Trap</span>
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Interest:</span>
                  <span className="font-mono text-rose-400">{currencySymbol}{minimum.totalInterestPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono text-rose-400">{Math.round(minimum.totalMonths / 12)} yrs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* In-Engine High-CTR Ad Placement */}
      <AdSenseBanner label="Sponsored Debt Relief & Credit Tools • Google AdSense" />

    </div>
  );
};
