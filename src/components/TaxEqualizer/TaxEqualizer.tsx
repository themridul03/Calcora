import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { calculateTaxComparison, US_STATES, TaxComparisonInput } from '../../utils/taxCalculations';
import { Country } from '../../types';
import { getCountryInfo } from '../../utils/countries';
import { SupportedLanguage, getTranslation } from '../../utils/i18n';

interface TaxEqualizerProps {
  country: Country;
  language?: SupportedLanguage;
}

export const TaxEqualizer: React.FC<TaxEqualizerProps> = ({ country, language = 'en' }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [isProMode, setIsProMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [input, setInput] = useState<TaxComparisonInput>({
    targetSalary: 110000,
    stateCode: 'CA',
    has401kMatch: true,
    matchPercent: 4,
    ptoDays: 20,
    healthInsuranceValueAnnual: 6500,
    businessExpenses1099: 5000,
    billableWeeksPerYear: 48,
    hoursPerWeek: 40,
  });

  const result = useMemo(() => {
    return calculateTaxComparison(input);
  }, [input]);

  const t = (key: string) => getTranslation(language, key);

  const loadPreset = (salary: number, state: string) => {
    setInput(prev => ({
      ...prev,
      targetSalary: salary,
      stateCode: state,
    }));
  };

  const copyVerdict = () => {
    const text = `Calcora 1099 Equalizer Verdict:
W-2 Base Salary: ${currencySymbol}${input.targetSalary.toLocaleString()}
Needed 1099 Rate: ${currencySymbol}${result.needed1099HourlyRate.toFixed(2)}/hr (${currencySymbol}${result.needed1099Gross.toLocaleString()}/yr)
Multiplier: ${result.overheadMultiplier}x
Calculated via Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Percentages for the Visual Apple Breakdown Bar
  const takeHomePct = Math.round((result.w2NetTakeHome / result.w2Gross) * 100);
  const taxesPct = Math.round((result.w2TotalTax / result.w2Gross) * 100);
  const perksPct = Math.max(0, 100 - takeHomePct - taxesPct);

  return (
    <div className="space-y-6">
      
      {/* Competitor-Beating Header: Simple, Apple-Clean */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              {t('easyModeActive')}
            </span>
            <span className="text-xs text-zinc-400">IRS & State Tax Parity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t('equalizerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            {t('equalizerDesc')}
          </p>
        </div>

        {/* 1-Tap Quick Salary Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">{t('quickPicks')}</span>
          <button
            onClick={() => loadPreset(75000, 'TX')}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border ${
              input.targetSalary === 75000
                ? 'bg-[#ff9f0a] text-black border-[#ff9f0a]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            $75k Entry
          </button>
          <button
            onClick={() => loadPreset(110000, 'CA')}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border ${
              input.targetSalary === 110000
                ? 'bg-[#ff9f0a] text-black border-[#ff9f0a]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            $110k Mid
          </button>
          <button
            onClick={() => loadPreset(160000, 'CA')}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border ${
              input.targetSalary === 160000
                ? 'bg-[#ff9f0a] text-black border-[#ff9f0a]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            $160k Senior
          </button>
          <button
            onClick={() => loadPreset(225000, 'NY')}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border ${
              input.targetSalary === 225000
                ? 'bg-[#ff9f0a] text-black border-[#ff9f0a]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            $225k Lead
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Bottom Line on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2 Core Inputs + Collapsible Pro Details */}
        <div className="lg:col-span-5 bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-5">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ff9f0a]" />
              {t('basicInputs')}
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Real-time update</span>
          </div>

          {/* 1. Target Salary Slider */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">{t('targetSalary')}</label>
              <span className="text-lg font-black text-[#ff9f0a] font-mono">
                {currencySymbol}{input.targetSalary.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={40000}
              max={350000}
              step={5000}
              value={input.targetSalary}
              onChange={e => setInput({ ...input, targetSalary: Number(e.target.value) })}
              className="w-full accent-[#ff9f0a] h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$40k</span>
              <span>$150k</span>
              <span>$350k+</span>
            </div>
          </div>

          {/* 2. State Selector */}
          <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              {t('stateRes')}
            </label>
            <select
              value={input.stateCode}
              onChange={e => setInput({ ...input, stateCode: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-[#ff9f0a]"
            >
              {US_STATES.map(s => (
                <option key={s.code} value={s.code}>
                  {s.name} {s.hasNoIncomeTax ? '(0% Tax 🎉)' : `(~${(s.rate * 100).toFixed(1)}%)`}
                </option>
              ))}
            </select>
          </div>

          {/* Progressive Disclosure: Collapsible Pro Settings */}
          <div className="pt-2 border-t border-zinc-900">
            <button
              onClick={() => setIsProMode(!isProMode)}
              className="w-full py-2.5 px-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-between border border-zinc-800 transition"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#ff9f0a]" />
                {isProMode ? t('hideProSettings') : t('proSettingsBtn')}
              </span>
              {isProMode ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {isProMode && (
              <div className="mt-3 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3.5 text-xs animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Paid Time Off (PTO Days)</label>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={input.ptoDays}
                      onChange={e => setInput({ ...input, ptoDays: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">401(k) Match %</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={input.matchPercent}
                      onChange={e => setInput({ ...input, matchPercent: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Annual Health Subsidy</label>
                    <input
                      type="number"
                      value={input.healthInsuranceValueAnnual}
                      onChange={e => setInput({ ...input, healthInsuranceValueAnnual: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">1099 Business Write-Offs</label>
                    <input
                      type="number"
                      value={input.businessExpenses1099}
                      onChange={e => setInput({ ...input, businessExpenses1099: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-zinc-400">Billable Weeks / Year</label>
                    <span className="text-[10px] text-white font-mono">{input.billableWeeksPerYear} weeks ({52 - input.billableWeeksPerYear} wks vacation)</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={52}
                    value={input.billableWeeksPerYear}
                    onChange={e => setInput({ ...input, billableWeeksPerYear: Number(e.target.value) })}
                    className="w-full accent-[#ff9f0a] h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: The Apple "Bottom Line" Hero Widget */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* THE INSTANT VERDICT CARD */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-[#ff9f0a]/50 shadow-2xl relative overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/15 px-3 py-1 rounded-full border border-[#ff9f0a]/30">
                  {t('theBottomLine')}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {result.overheadMultiplier}x W-2 Rule
                </span>
              </div>

              {/* Copy Verdict Button */}
              <button
                onClick={copyVerdict}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{copied ? t('copied') : t('copyResult')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">{t('min1099Rate')}</span>
                <div className="text-3xl sm:text-4xl font-black text-[#ff9f0a] font-mono tracking-tight">
                  {currencySymbol}{result.needed1099HourlyRate.toFixed(2)}
                  <span className="text-sm font-normal text-zinc-400">/hr</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-zinc-400 block font-medium">{t('reqGross')}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {currencySymbol}{result.needed1099Gross.toLocaleString()}
                  <span className="text-xs font-normal text-zinc-400">/yr</span>
                </div>
              </div>
            </div>

            {/* In Plain English Summary */}
            <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              💡 <strong>{t('plainEnglishTitle')}</strong> To take home the exact same disposable cash as your{' '}
              <span className="text-white font-bold">{currencySymbol}{input.targetSalary.toLocaleString()} W-2</span>, you cannot bill less than{' '}
              <span className="text-[#ff9f0a] font-black">{currencySymbol}{result.needed1099HourlyRate}/hr</span>. Anything under this rate is effectively a pay cut due to self-employment taxes (15.3%) and unpaid downtime!
            </div>

            {/* Apple "Where $100 Goes" Visual Split Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>W-2 Compensation Split:</span>
                <span>Take-Home: {takeHomePct}% • Taxes: {taxesPct}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${takeHomePct}%` }} className="bg-[#ff9f0a] h-full" title={`Take Home: ${takeHomePct}%`}></div>
                <div style={{ width: `${taxesPct}%` }} className="bg-rose-500 h-full" title={`Taxes: ${taxesPct}%`}></div>
                <div style={{ width: `${perksPct}%` }} className="bg-cyan-500 h-full" title={`Employer Perks: ${perksPct}%`}></div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff9f0a]"></span> Net Take-Home ({currencySymbol}{result.w2NetTakeHome.toLocaleString()})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Total Taxes ({currencySymbol}{result.w2TotalTax.toLocaleString()})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Perks ({currencySymbol}{result.w2BenefitsValue.toLocaleString()})
                </span>
              </div>
            </div>

          </div>

          {/* Side by Side Snapshots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2 text-xs">
              <span className="font-bold text-white block">{t('w2Snapshot')}</span>
              <div className="flex justify-between text-zinc-400">
                <span>Base Salary:</span>
                <span className="font-mono text-white">{currencySymbol}{result.w2Gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>All Taxes (FICA+Fed+State):</span>
                <span className="font-mono text-rose-400">-{currencySymbol}{result.w2TotalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-zinc-800">
                <span>{t('disposableCash')}</span>
                <span className="font-mono">{currencySymbol}{result.w2NetTakeHome.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2 text-xs">
              <span className="font-bold text-white block">{t('contractorSnapshot')}</span>
              <div className="flex justify-between text-zinc-400">
                <span>Required Gross Invoiced:</span>
                <span className="font-mono text-[#ff9f0a]">{currencySymbol}{result.needed1099Gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>All Taxes (SE + Fed + State):</span>
                <span className="font-mono text-rose-400">-{currencySymbol}{result.totalTax1099.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-zinc-800">
                <span>{t('disposableCash')}</span>
                <span className="font-mono">{currencySymbol}{result.netTakeHome1099.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
