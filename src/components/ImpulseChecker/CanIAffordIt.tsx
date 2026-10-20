import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Zap,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Country } from '../../types';
import { getCountryInfo } from '../../utils/countries';
import confetti from 'canvas-confetti';
import { AdSenseBanner } from '../AdSenseBanner';

interface CanIAffordItProps {
  country: Country;
}

export const CanIAffordIt: React.FC<CanIAffordItProps> = ({ country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [itemName, setItemName] = useState<string>('Flagship Smartphone');
  const [itemPrice, setItemPrice] = useState<number>(1299);
  const [annualSalary, setAnnualSalary] = useState<number>(countryInfo.defaultSalary);
  const [savingsCash, setSavingsCash] = useState<number>(18000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(3500);
  const [isNeed, setIsNeed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const analysis = useMemo(() => {
    // Effective hourly net wage (assuming 2,080 annual hours, ~25% blended taxes)
    const grossHourly = annualSalary / 2080;
    const netHourly = Math.max(1, grossHourly * 0.74);
    
    // Life hours worked
    const hoursWorked = Math.round((itemPrice / netHourly) * 10) / 10;
    const workDays = Math.round((hoursWorked / 8) * 10) / 10;

    // S&P 500 Opportunity Cost (8% CAGR)
    const value10Yr = Math.round(itemPrice * Math.pow(1.08, 10));
    const value20Yr = Math.round(itemPrice * Math.pow(1.08, 20));

    // Emergency fund check: 3 months reserve
    const emergencyReserve = monthlyExpenses * 3;
    const cashRemaining = savingsCash - itemPrice;
    const isEmergencySafe = cashRemaining >= emergencyReserve;
    const priceToIncomeRatio = (itemPrice / annualSalary) * 100;

    // Decision Logic
    let status: 'safe' | 'caution' | 'danger' = 'safe';
    let verdictText = '';

    if (!isEmergencySafe || priceToIncomeRatio > 15) {
      status = 'danger';
      verdictText = `HARD NO: This purchase dips into your 3-month emergency safety buffer (${currencySymbol}${emergencyReserve.toLocaleString()}) or exceeds 15% of your annual income!`;
    } else if (hoursWorked > 40 || priceToIncomeRatio > 5 || !isNeed) {
      status = 'caution';
      verdictText = `72-HOUR RULE: Sleep on this for 3 days. You must trade ${hoursWorked} hours of your life for this. If you still crave it on Friday, proceed thoughtfully.`;
    } else {
      status = 'safe';
      verdictText = `SAFE TO BUY: This purchase takes only ${hoursWorked} hours of work and leaves your emergency safety net 100% intact!`;
    }

    return {
      netHourly: Math.round(netHourly * 100) / 100,
      hoursWorked,
      workDays,
      value10Yr,
      value20Yr,
      isEmergencySafe,
      cashRemaining,
      status,
      verdictText,
    };
  }, [itemPrice, annualSalary, savingsCash, monthlyExpenses, isNeed, currencySymbol]);

  const loadPreset = (name: string, price: number, need: boolean) => {
    setItemName(name);
    setItemPrice(price);
    setIsNeed(need);
  };

  const copyRoast = () => {
    const text = `Calcora Impulse Reality Check:
Item: ${itemName} (${currencySymbol}${itemPrice.toLocaleString()})
Hours of Life Worked: ${analysis.hoursWorked} hours (${analysis.workDays} work days)
Invested in S&P 500 (10 yrs): ${currencySymbol}${analysis.value10Yr.toLocaleString()}
Verdict: ${analysis.verdictText}
Tested on Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff9f0a', '#10B981', '#34D399'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              🔥 Viral Reality Engine
            </span>
            <span className="text-xs text-zinc-400">Life-Hours & S&P 500 Opportunity Cost</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            "Can I Afford This?" Impulse Buy Checker
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            Never regret a purchase again. Calculate how many literal hours of your life at work this item costs and what it would be worth compounded in index funds.
          </p>
        </div>

        {/* 1-Tap Impulse Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">Presets:</span>
          <button
            onClick={() => loadPreset('Flagship Smartphone', 1299, false)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            📱 iPhone ($1.3k)
          </button>
          <button
            onClick={() => loadPreset('1-Week Vacation', 4200, false)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            🏖️ Vacation ($4.2k)
          </button>
          <button
            onClick={() => loadPreset('SUV Car Down Payment', 12000, false)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            🚗 Car ($12k)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Impulse Inputs */}
        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#ff9f0a]" />
            What are you eyeing?
          </h3>

          {/* Item Name & Price */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Item or Experience Name</label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff9f0a]"
                placeholder="e.g. Designer Watch, OLED TV, Trip to Bali"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-zinc-400">Total Price Tag ({currencySymbol})</label>
                <span className="text-base font-black text-[#ff9f0a] font-mono">
                  {currencySymbol}{itemPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                value={itemPrice}
                onChange={e => setItemPrice(Math.max(1, Number(e.target.value)))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#ff9f0a]"
              />
            </div>
          </div>

          {/* Financial Profile Context */}
          <div className="pt-3 border-t border-zinc-900 space-y-3">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Your Cash & Income Baseline</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Annual Salary ({currencySymbol})</label>
                <input
                  type="number"
                  step={5000}
                  value={annualSalary}
                  onChange={e => setAnnualSalary(Math.max(10000, Number(e.target.value)))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Current Savings Cash ({currencySymbol})</label>
                <input
                  type="number"
                  step={1000}
                  value={savingsCash}
                  onChange={e => setSavingsCash(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Monthly Cost of Living / Expenses ({currencySymbol})</label>
              <input
                type="number"
                step={250}
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(Math.max(500, Number(e.target.value)))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                3-Month Emergency Safety Buffer: {currencySymbol}{(monthlyExpenses * 3).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-zinc-300">Is this an absolute critical NEED?</label>
              <input
                type="checkbox"
                checked={isNeed}
                onChange={e => setIsNeed(e.target.checked)}
                className="w-4 h-4 accent-[#ff9f0a] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: The Brutal Reality & Apple Verdict Card */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* THE VERDICT HERO CARD */}
          <div className={`p-6 rounded-3xl border-2 shadow-2xl relative overflow-hidden space-y-4 ${
            analysis.status === 'safe'
              ? 'bg-gradient-to-br from-emerald-950/60 via-zinc-950 to-black border-emerald-500/50'
              : analysis.status === 'caution'
              ? 'bg-gradient-to-br from-amber-950/60 via-zinc-950 to-black border-[#ff9f0a]/50'
              : 'bg-gradient-to-br from-rose-950/60 via-zinc-950 to-black border-rose-500/50'
          }`}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  analysis.status === 'safe'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : analysis.status === 'caution'
                    ? 'bg-[#ff9f0a]/20 text-[#ff9f0a] border-[#ff9f0a]/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {analysis.status === 'safe' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {analysis.status === 'caution' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {analysis.status === 'danger' && <XCircle className="w-3.5 h-3.5" />}
                  {analysis.status === 'safe' ? 'VERDICT: SAFE TO BUY' : analysis.status === 'caution' ? 'VERDICT: 72-HOUR PAUSE' : 'VERDICT: FINANCIAL DANGER'}
                </span>
              </div>

              <button
                onClick={copyRoast}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? 'Copied Roast!' : 'Share Roast'}</span>
              </button>
            </div>

            {/* Brutal Life Hours Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
              <div>
                <span className="text-xs text-zinc-400 block font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#ff9f0a]" /> Life Traded at Work
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {analysis.hoursWorked}
                  <span className="text-base font-normal text-zinc-400"> hours</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  ~{analysis.workDays} full working shifts at your desk
                </span>
              </div>

              <div>
                <span className="text-xs text-zinc-400 block font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> S&P 500 in 10 Years
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  {currencySymbol}{analysis.value10Yr.toLocaleString()}
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  or {currencySymbol}{analysis.value20Yr.toLocaleString()} in 20 yrs
                </span>
              </div>
            </div>

            {/* Plain English Roast */}
            <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              💡 <strong>The Reality:</strong> {analysis.verdictText}
            </div>

          </div>

          {/* 3 Reality Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Take-Home Wage</span>
              <span className="text-lg font-bold text-white font-mono block">
                {currencySymbol}{analysis.netHourly}/hr
              </span>
              <span className="text-[10px] text-zinc-500 block">What you actually pocket after tax</span>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Emergency Cash Left</span>
              <span className={`text-lg font-bold font-mono block ${analysis.isEmergencySafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currencySymbol}{analysis.cashRemaining.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                {analysis.isEmergencySafe ? '3-Month buffer safe' : 'Below 3-month buffer!'}
              </span>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">The 2X Rule Test</span>
              <span className="text-lg font-bold text-white font-mono block">
                {currencySymbol}{(itemPrice * 2).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block">Can you afford to buy it twice?</span>
            </div>

          </div>

        </div>

      </div>

      {/* In-Engine High-CTR Ad Placement */}
      <AdSenseBanner label="Sponsored Savings & Investment Offers • Google AdSense" />

    </div>
  );
};
