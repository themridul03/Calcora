import React, { useState, useMemo } from 'react';
import { Layers, ChevronDown, ChevronUp, Copy, Check, Zap, Home, Award } from 'lucide-react';
import { RentVsBuyParams, Country } from '../../types';
import { calculateRentVsBuy } from '../../utils/housingCalculations';
import { getCountryInfo } from '../../utils/countries';

interface RentVsBuyProps {
  country: Country;
}

export const RentVsBuy: React.FC<RentVsBuyProps> = ({ country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [isProMode, setIsProMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [params, setParams] = useState<RentVsBuyParams>({
    homePrice: countryInfo.defaultHome,
    downPaymentPercent: 20,
    mortgageRate: 6.75,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1800,
    hoaMonthly: 150,
    maintenancePercent: 1.5,
    homeAppreciationRate: 3.5,
    buyingClosingCostsPercent: 3.0,
    sellingClosingCostsPercent: 6.0,
    
    // Rent Side
    monthlyRent: countryInfo.defaultRent,
    rentersInsuranceMonthly: 25,
    rentInflationRate: 3.5,
    investmentReturnRate: 8.0, // S&P 500 historical avg
  });

  const summary = useMemo(() => {
    return calculateRentVsBuy(params);
  }, [params]);

  const loadPreset = (home: number, rent: number) => {
    setParams(prev => ({
      ...prev,
      homePrice: home,
      monthlyRent: rent,
    }));
  };

  const copyHousingPlan = () => {
    const text = `Calcora 2026 Rent vs Buy Verdict:
Home Price: ${currencySymbol}${params.homePrice.toLocaleString()} vs Monthly Rent: ${currencySymbol}${params.monthlyRent.toLocaleString()}
Break-Even Year: ${summary.breakEvenYear ? `Year ${summary.breakEvenYear}` : 'Renting beats buying for all 30 years'}
Recommendation: ${summary.breakEvenYear ? `Rent if staying under ${summary.breakEvenYear} years. Buy if staying longer.` : 'Rent & invest down payment into S&P 500.'}
Calculated via Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Quick Picks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              ⚡ Easy Decision Mode
            </span>
            <span className="text-xs text-zinc-400">2026 Interest Rate Reality</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            2026 Rent vs Buy Decision Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            Compare total unrecoverable mortgage interest and fees against investing your down payment in the S&P 500.
          </p>
        </div>

        {/* 1-Tap Quick Home Picks */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">Scenarios:</span>
          <button
            onClick={() => loadPreset(350000, 1800)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Starter Condo ($350k)
          </button>
          <button
            onClick={() => loadPreset(550000, 2600)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Suburban Home ($550k)
          </button>
          <button
            onClick={() => loadPreset(950000, 4200)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Metro Tech City ($950k)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2 Big Sliders + Collapsible Pro Drawer */}
        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ff9f0a]" />
              Basic Inputs
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Instant math</span>
          </div>

          {/* 1. Target Home Purchase Price */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Target Home Purchase Price</label>
              <span className="text-lg font-black text-[#ff9f0a] font-mono">
                {currencySymbol}{params.homePrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={150000}
              max={1500000}
              step={10000}
              value={params.homePrice}
              onChange={e => setParams({ ...params, homePrice: Number(e.target.value) })}
              className="w-full accent-[#ff9f0a] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$150k</span>
              <span>$750k</span>
              <span>$1.5M+</span>
            </div>
          </div>

          {/* 2. Monthly Rent Equivalent */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Equivalent Monthly Rent</label>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {currencySymbol}{params.monthlyRent.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min={600}
              max={7000}
              step={50}
              value={params.monthlyRent}
              onChange={e => setParams({ ...params, monthlyRent: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$600</span>
              <span>$3,000</span>
              <span>$7,000+</span>
            </div>
          </div>

          {/* Progressive Disclosure: Collapsible Pro Drawer */}
          <div className="pt-2 border-t border-zinc-900">
            <button
              onClick={() => setIsProMode(!isProMode)}
              className="w-full py-2.5 px-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-between border border-zinc-800 transition"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#ff9f0a]" />
                {isProMode ? 'Hide Advanced Settings' : 'Customize Mortgage, HOA & Rates'}
              </span>
              {isProMode ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {isProMode && (
              <div className="mt-3 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3.5 text-xs animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Mortgage Rate (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={params.mortgageRate}
                      onChange={e => setParams({ ...params, mortgageRate: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Down Payment (%)</label>
                    <input
                      type="number"
                      min={3}
                      max={50}
                      value={params.downPaymentPercent}
                      onChange={e => setParams({ ...params, downPaymentPercent: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Property Tax (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={params.propertyTaxRate}
                      onChange={e => setParams({ ...params, propertyTaxRate: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Monthly HOA ({currencySymbol})</label>
                    <input
                      type="number"
                      value={params.hoaMonthly}
                      onChange={e => setParams({ ...params, hoaMonthly: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">S&P 500 Return (%/yr)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={params.investmentReturnRate}
                      onChange={e => setParams({ ...params, investmentReturnRate: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Home Appreciation (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={params.homeAppreciationRate}
                      onChange={e => setParams({ ...params, homeAppreciationRate: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: The Break-Even Timeline & Bottom Line */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* THE BREAK-EVEN VERDICT CARD */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-[#ff9f0a]/50 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/15 px-3 py-1 rounded-full border border-[#ff9f0a]/30 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#ff9f0a]" />
                The 2026 Verdict
              </span>

              <button
                onClick={copyHousingPlan}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? 'Copied!' : 'Copy Verdict'}</span>
              </button>
            </div>

            <div className="pt-1">
              <span className="text-xs text-zinc-400 block font-medium">True Break-Even Timeline</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-1">
                {summary.breakEvenYear !== null ? (
                  <span>
                    Buying breaks even at{' '}
                    <span className="text-[#ff9f0a]">Year {summary.breakEvenYear}</span>
                  </span>
                ) : (
                  <span className="text-emerald-400">Renting Beats Buying for All 30 Years!</span>
                )}
              </div>
            </div>

            {/* In Plain English Takeaway */}
            <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              💡 <strong>The Easy Takeaway:</strong> {summary.breakEvenYear !== null ? (
                <>
                  If you plan to live in this home for <strong>under {summary.breakEvenYear} years</strong>, you are richer renting and letting your {currencySymbol}{summary.totalCashToClose.toLocaleString()} down payment compound in the stock market. Buying only beats renting if you stay for {summary.breakEvenYear}+ years!
                </>
              ) : (
                <>
                  Because mortgage rates are {params.mortgageRate}%, your {currencySymbol}{summary.totalCashToClose.toLocaleString()} down payment grows much faster in the S&P 500 than home equity.
                </>
              )}
            </div>

            {/* Visual Timeline Comparison Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>Timeline Advantage:</span>
                <span>Break-Even: Year {summary.breakEvenYear || 30}</span>
              </div>
              <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden flex text-[10px] font-bold text-center">
                <div style={{ width: `${Math.min(100, ((summary.breakEvenYear || 30) / 30) * 100)}%` }} className="bg-emerald-500 text-black flex items-center justify-center truncate px-2">
                  Renting Wins (Years 1–{summary.breakEvenYear || 30})
                </div>
                {summary.breakEvenYear && summary.breakEvenYear < 30 && (
                  <div style={{ width: `${100 - ((summary.breakEvenYear / 30) * 100)}%` }} className="bg-[#ff9f0a] text-black flex items-center justify-center truncate px-2">
                    Buying Wins
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Monthly Out-of-Pocket Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <span className="text-zinc-400 text-[11px] block">Monthly Cost to Own:</span>
              <span className="text-xl font-bold text-white font-mono">
                {currencySymbol}{summary.monthlyTotalBuyCost.toLocaleString()}/mo
              </span>
              <span className="text-[10px] text-zinc-500 block">P&I, taxes, insurance, HOA, maintenance</span>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-1.5">
              <span className="text-zinc-400 text-[11px] block">Initial Rent Out-of-Pocket:</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {currencySymbol}{summary.monthlyRentInitial.toLocaleString()}/mo
              </span>
              <span className="text-[10px] text-zinc-500 block">
                Saves {currencySymbol}{Math.max(0, summary.monthlyTotalBuyCost - summary.monthlyRentInitial).toLocaleString()}/mo to invest
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
