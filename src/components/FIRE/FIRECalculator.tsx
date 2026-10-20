import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Country } from '../../types';
import { getCountryInfo } from '../../utils/countries';
import confetti from 'canvas-confetti';

interface FIRECalculatorProps {
  country: Country;
}

export const FIRECalculator: React.FC<FIRECalculatorProps> = ({ country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [currentAge, setCurrentAge] = useState<number>(29);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(65000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1500);
  const [annualExpenses, setAnnualExpenses] = useState<number>(48000);
  const [expectedReturn, setExpectedReturn] = useState<number>(8.0);
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState<number>(4.0); // 4% Rule
  const [copied, setCopied] = useState<boolean>(false);

  const fire = useMemo(() => {
    // 4% Rule: FIRE Number = Annual Expenses / (SWR / 100)
    const fireNumber = Math.round(annualExpenses / (safeWithdrawalRate / 100));
    const leanFireNumber = Math.round(fireNumber * 0.75);
    const fatFireNumber = Math.round(fireNumber * 1.5);

    const monthlyReturn = expectedReturn / 100 / 12;

    // Simulate month-by-month compounding
    let balance = currentNetWorth;
    let months = 0;
    const maxMonths = 12 * 60; // 60 years cap

    let coastFireAge: number | null = null;
    let leanFireAge: number | null = null;
    let fireAge: number | null = null;

    while (months < maxMonths && balance < fatFireNumber * 1.2) {
      months++;
      balance = balance * (1 + monthlyReturn) + monthlyInvestment;

      const simulatedAge = currentAge + Math.floor(months / 12);

      // Check Coast FIRE (where current balance alone without new additions would reach FIRE by age 60)
      if (!coastFireAge && currentAge < 60) {
        const yearsTo60 = 60 - simulatedAge;
        const projectedAt60 = balance * Math.pow(1 + expectedReturn / 100, yearsTo60);
        if (projectedAt60 >= fireNumber) {
          coastFireAge = simulatedAge;
        }
      }

      if (!leanFireAge && balance >= leanFireNumber) {
        leanFireAge = simulatedAge;
      }

      if (!fireAge && balance >= fireNumber) {
        fireAge = simulatedAge;
        break;
      }
    }

    const yearsToFire = fireAge ? fireAge - currentAge : Math.round(months / 12);
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + (yearsToFire * 12));
    const fireTargetDate = futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return {
      fireNumber,
      leanFireNumber,
      fatFireNumber,
      fireAge: fireAge || (currentAge + Math.round(months / 12)),
      yearsToFire,
      fireTargetDate,
      coastFireAge: coastFireAge || currentAge + 5,
      leanFireAge: leanFireAge || currentAge + 7,
    };
  }, [currentAge, currentNetWorth, monthlyInvestment, annualExpenses, expectedReturn, safeWithdrawalRate]);

  const loadPreset = (age: number, netWorth: number, monthly: number, expense: number) => {
    setCurrentAge(age);
    setCurrentNetWorth(netWorth);
    setMonthlyInvestment(monthly);
    setAnnualExpenses(expense);
  };

  const copyPlan = () => {
    const text = `Calcora FIRE Freedom Plan:
Target FIRE Number: ${currencySymbol}${fire.fireNumber.toLocaleString()} (via ${safeWithdrawalRate}% Safe Withdrawal)
Retirement Freedom Age: Age ${fire.fireAge} (${fire.fireTargetDate})
Coast FIRE Age: Age ${fire.coastFireAge}
Monthly Contribution: ${currencySymbol}${monthlyInvestment.toLocaleString()}/mo
Simulated on Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff9f0a', '#10B981', '#34D399', '#6EE7B7'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              🔥 FIRE Movement Engine
            </span>
            <span className="text-xs text-zinc-400">Financial Independence, Retire Early</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            FIRE Retirement Freedom Calculator
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            Discover the exact age you can quit your 9-to-5 forever. Based on the proven Trinity Study 4% Safe Withdrawal Rule.
          </p>
        </div>

        {/* 1-Tap Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">Presets:</span>
          <button
            onClick={() => loadPreset(25, 20000, 1000, 40000)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Early 20s Hustler
          </button>
          <button
            onClick={() => loadPreset(32, 120000, 2500, 55000)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Mid 30s High Earner
          </button>
          <button
            onClick={() => loadPreset(40, 350000, 3500, 75000)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            40s Sprint
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders */}
        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#ff9f0a]" />
            Your FIRE Timeline Levers
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Current Age</label>
              <input
                type="number"
                min={18}
                max={75}
                value={currentAge}
                onChange={e => setCurrentAge(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Current Net Worth ({currencySymbol})</label>
              <input
                type="number"
                step={5000}
                value={currentNetWorth}
                onChange={e => setCurrentNetWorth(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Monthly Investment Slider */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Monthly Investment Amount</label>
              <span className="text-base font-black text-[#ff9f0a] font-mono">
                {currencySymbol}{monthlyInvestment.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={10000}
              step={100}
              value={monthlyInvestment}
              onChange={e => setMonthlyInvestment(Number(e.target.value))}
              className="w-full accent-[#ff9f0a] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$200/mo</span>
              <span>$5,000/mo</span>
              <span>$10,000/mo</span>
            </div>
          </div>

          {/* Annual Living Expenses */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Annual Living Expenses in Retirement</label>
              <span className="text-base font-black text-white font-mono">
                {currencySymbol}{annualExpenses.toLocaleString()}/yr
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={200000}
              step={2000}
              value={annualExpenses}
              onChange={e => setAnnualExpenses(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-zinc-400">
              Rule of 25: You need 25x this annual expense to never work again.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Investment Return (%/yr)</label>
              <input
                type="number"
                step={0.5}
                value={expectedReturn}
                onChange={e => setExpectedReturn(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Safe Withdrawal Rate (%)</label>
              <input
                type="number"
                step={0.25}
                value={safeWithdrawalRate}
                onChange={e => setSafeWithdrawalRate(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: The FIRE Hero Verdict */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* THE FREEDOM NUMBER CARD */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-[#ff9f0a]/50 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/15 px-3 py-1 rounded-full border border-[#ff9f0a]/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff9f0a]" />
                Your Financial Freedom Age
              </span>

              <button
                onClick={copyPlan}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Full Retirement Age</span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  Age {fire.fireAge}
                </div>
                <span className="text-xs text-[#ff9f0a] font-mono mt-0.5 block">
                  {fire.yearsToFire} years to freedom ({fire.fireTargetDate})
                </span>
              </div>

              <div>
                <span className="text-xs text-zinc-400 block font-medium">Your FIRE Freedom Number</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {currencySymbol}{fire.fireNumber.toLocaleString()}
                </div>
                <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                  Portfolio generates {currencySymbol}{annualExpenses.toLocaleString()}/yr forever
                </span>
              </div>
            </div>

            {/* In Plain English */}
            <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              💡 <strong>The Easy Takeaway:</strong> By investing <span className="text-[#ff9f0a] font-bold">{currencySymbol}{monthlyInvestment.toLocaleString()}/mo</span> into index funds, you will never need a boss or paycheck again after <span className="text-white font-bold">Age {fire.fireAge}</span>. Your investments will generate enough returns to replace your {currencySymbol}{annualExpenses.toLocaleString()}/yr expenses indefinitely!
            </div>

            <button
              onClick={triggerCelebrate}
              className="w-full py-2.5 px-4 rounded-full bg-[#ff9f0a] hover:bg-[#ffb340] text-black font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              Celebrate Your Financial Independence Roadmap 🎉
            </button>
          </div>

          {/* 3 FIRE Milestone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Coast FIRE */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 text-xs">Coast FIRE</span>
                <span className="text-[9px] font-mono text-zinc-400">Milestone 1</span>
              </div>
              <span className="text-lg font-black text-white font-mono block">
                Age {fire.coastFireAge}
              </span>
              <p className="text-[10px] text-zinc-400">
                Stop investing extra; your pot will grow to retirement on its own!
              </p>
            </div>

            {/* Lean FIRE */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">Lean FIRE</span>
                <span className="text-[9px] font-mono text-zinc-400">Milestone 2</span>
              </div>
              <span className="text-lg font-black text-white font-mono block">
                {currencySymbol}{fire.leanFireNumber.toLocaleString()}
              </span>
              <p className="text-[10px] text-zinc-400">
                Enough to cover bare-bones living costs without working.
              </p>
            </div>

            {/* Fat FIRE */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs">Fat FIRE</span>
                <span className="text-[9px] font-mono text-zinc-400">Luxury</span>
              </div>
              <span className="text-lg font-black text-white font-mono block">
                {currencySymbol}{fire.fatFireNumber.toLocaleString()}
              </span>
              <p className="text-[10px] text-zinc-400">
                Retire in total luxury with 1.5x regular expenses.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
