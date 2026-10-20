import React, { useState, useMemo } from 'react';
import { 
  Swords, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Copy, 
  Check, 
  Sparkles, 
  MapPin, 
  Building,
  ArrowRight
} from 'lucide-react';
import { Country } from '../../types';
import { getCountryInfo } from '../../utils/countries';
import confetti from 'canvas-confetti';
import { AdSenseBanner } from '../AdSenseBanner';

interface JobDuelProps {
  country: Country;
}

interface JobOffer {
  title: string;
  city: string;
  salary: number;
  bonus: number;
  stateTaxRate: number; // in %
  monthlyRent: number;
  match401kPercent: number;
}

export const JobDuel: React.FC<JobDuelProps> = ({ country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [copied, setCopied] = useState<boolean>(false);

  const [offerA, setOfferA] = useState<JobOffer>({
    title: 'Offer A: Austin TX (Low Tax)',
    city: 'Austin, Texas',
    salary: 130000,
    bonus: 10000,
    stateTaxRate: 0.0, // 0% state tax
    monthlyRent: 2100,
    match401kPercent: 4.0,
  });

  const [offerB, setOfferB] = useState<JobOffer>({
    title: 'Offer B: San Francisco CA (High Tax)',
    city: 'San Francisco, CA',
    salary: 165000,
    bonus: 15000,
    stateTaxRate: 9.3, // 9.3% CA tax
    monthlyRent: 3600,
    match401kPercent: 5.0,
  });

  const duel = useMemo(() => {
    const calcNetDisposable = (offer: JobOffer) => {
      const grossIncome = offer.salary + offer.bonus;
      const federalTaxEstimate = grossIncome * 0.18; // approx effective federal tax
      const stateTax = grossIncome * (offer.stateTaxRate / 100);
      const ficaTax = Math.min(grossIncome, 176100) * 0.0765;
      const totalTax = federalTaxEstimate + stateTax + ficaTax;
      const netPay = grossIncome - totalTax;

      const annualRent = offer.monthlyRent * 12;
      const matchBonus = offer.salary * (offer.match401kPercent / 100);

      // True Disposable Cash after local shelter and taxes
      const disposableCash = Math.round(netPay - annualRent + matchBonus);

      return {
        grossIncome,
        totalTax: Math.round(totalTax),
        netPay: Math.round(netPay),
        annualRent,
        matchBonus: Math.round(matchBonus),
        disposableCash,
      };
    };

    const resA = calcNetDisposable(offerA);
    const resB = calcNetDisposable(offerB);

    const diff = resA.disposableCash - resB.disposableCash;
    const winner = diff >= 0 ? 'A' : 'B';
    const winningAmount = Math.abs(diff);

    return {
      resA,
      resB,
      winner,
      winningAmount,
      diff,
    };
  }, [offerA, offerB]);

  const loadPreset = (preset: 'austin-sf' | 'london-dubai' | 'remote-ny') => {
    if (preset === 'austin-sf') {
      setOfferA({
        title: 'Offer A: Austin TX',
        city: 'Austin, TX',
        salary: 130000,
        bonus: 10000,
        stateTaxRate: 0.0,
        monthlyRent: 2100,
        match401kPercent: 4.0,
      });
      setOfferB({
        title: 'Offer B: San Francisco CA',
        city: 'San Francisco, CA',
        salary: 165000,
        bonus: 15000,
        stateTaxRate: 9.3,
        monthlyRent: 3600,
        match401kPercent: 5.0,
      });
    } else if (preset === 'london-dubai') {
      setOfferA({
        title: 'Offer A: Dubai UAE (0% Tax)',
        city: 'Dubai',
        salary: 120000,
        bonus: 12000,
        stateTaxRate: 0.0,
        monthlyRent: 2400,
        match401kPercent: 0,
      });
      setOfferB({
        title: 'Offer B: London UK (40% Tax)',
        city: 'London',
        salary: 135000,
        bonus: 10000,
        stateTaxRate: 15.0,
        monthlyRent: 2900,
        match401kPercent: 5.0,
      });
    } else {
      setOfferA({
        title: 'Offer A: Fully Remote (Midwest)',
        city: 'Remote / Low Cost City',
        salary: 115000,
        bonus: 5000,
        stateTaxRate: 3.5,
        monthlyRent: 1400,
        match401kPercent: 4.0,
      });
      setOfferB({
        title: 'Offer B: In-Office NYC',
        city: 'New York City',
        salary: 150000,
        bonus: 15000,
        stateTaxRate: 10.0,
        monthlyRent: 3800,
        match401kPercent: 4.0,
      });
    }
  };

  const copyDuelResult = () => {
    const text = `Calcora Job Offer Duel:
${offerA.title}: ${currencySymbol}${offerA.salary.toLocaleString()} base (Rent: ${currencySymbol}${offerA.monthlyRent}/mo) -> Net Disposable Cash: ${currencySymbol}${duel.resA.disposableCash.toLocaleString()}/yr
${offerB.title}: ${currencySymbol}${offerB.salary.toLocaleString()} base (Rent: ${currencySymbol}${offerB.monthlyRent}/mo) -> Net Disposable Cash: ${currencySymbol}${duel.resB.disposableCash.toLocaleString()}/yr
WINNER: Offer ${duel.winner} delivers +${currencySymbol}${duel.winningAmount.toLocaleString()} more real cash in your pocket!
Compared via Calcora (https://calcora.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const triggerCelebrate = () => {
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#ff9f0a', '#10B981', '#6366F1'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              ⚔️ Job Offer Duel
            </span>
            <span className="text-xs text-zinc-400">Real Disposable Cash After Local Taxes & Rent</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Side-by-Side Job Offer Duel
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-0.5">
            Never get fooled by a higher headline salary. Compare 2 competing offers to see which one leaves more actual savings in your bank account.
          </p>
        </div>

        {/* 1-Tap Matchups */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 font-medium mr-1">Duels:</span>
          <button
            onClick={() => loadPreset('austin-sf')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Austin vs SF
          </button>
          <button
            onClick={() => loadPreset('london-dubai')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Dubai vs London
          </button>
          <button
            onClick={() => loadPreset('remote-ny')}
            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
          >
            Remote vs NYC
          </button>
        </div>
      </div>

      {/* WINNER HERO BANNER */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-[#ff9f0a]/50 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/15 px-3 py-1 rounded-full border border-[#ff9f0a]/30 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#ff9f0a]" />
            Official Verdict: Offer {duel.winner} Wins!
          </span>

          <button
            onClick={copyDuelResult}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
            <span>{copied ? 'Copied Comparison!' : 'Share Comparison'}</span>
          </button>
        </div>

        <div className="pt-1">
          <span className="text-xs text-zinc-400 block font-medium">Net Disposable Free Cash Advantage</span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight mt-1">
            +{currencySymbol}{duel.winningAmount.toLocaleString()}
            <span className="text-sm font-normal text-zinc-400">/year extra cash</span>
          </div>
        </div>

        {/* Plain English */}
        <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed">
          💡 <strong>The Easy Takeaway:</strong> Even though {duel.winner === 'A' ? offerB.title : offerA.title} might show a different nominal base,{' '}
          <strong className="text-white">{duel.winner === 'A' ? offerA.title : offerB.title}</strong> leaves you with{' '}
          <span className="text-emerald-400 font-black">+{currencySymbol}{duel.winningAmount.toLocaleString()} more disposable savings</span> every year after accounting for local state tax, city rents, and retirement perks!
        </div>
      </div>

      {/* 2 Offer Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Offer A Card */}
        <div className={`p-5 rounded-3xl border-2 space-y-4 ${
          duel.winner === 'A' ? 'bg-zinc-950 border-[#ff9f0a]/50 shadow-xl' : 'bg-zinc-950 border-zinc-900 opacity-90'
        }`}>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={offerA.title}
              onChange={e => setOfferA({ ...offerA, title: e.target.value })}
              className="bg-transparent text-sm font-black text-white border-b border-zinc-700 focus:outline-none focus:border-[#ff9f0a] px-1 py-0.5"
            />
            {duel.winner === 'A' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🏆 Winner
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Base Salary ({currencySymbol})</label>
                <input
                  type="number"
                  step={2000}
                  value={offerA.salary}
                  onChange={e => setOfferA({ ...offerA, salary: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Bonus / Equity ({currencySymbol})</label>
                <input
                  type="number"
                  step={1000}
                  value={offerA.bonus}
                  onChange={e => setOfferA({ ...offerA, bonus: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Monthly Rent ({currencySymbol})</label>
                <input
                  type="number"
                  step={100}
                  value={offerA.monthlyRent}
                  onChange={e => setOfferA({ ...offerA, monthlyRent: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">State Tax Rate (%)</label>
                <input
                  type="number"
                  step={0.5}
                  value={offerA.stateTaxRate}
                  onChange={e => setOfferA({ ...offerA, stateTaxRate: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Offer A Bottom Line */}
          <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Total Estimated Taxes:</span>
              <span className="font-mono text-rose-400">-{currencySymbol}{duel.resA.totalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Annual Rent Outflow:</span>
              <span className="font-mono text-rose-400">-{currencySymbol}{duel.resA.annualRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>401(k) / Pension Match:</span>
              <span className="font-mono text-emerald-400">+{currencySymbol}{duel.resA.matchBonus.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
              <span>Net Disposable Cash:</span>
              <span className="font-mono text-[#ff9f0a]">{currencySymbol}{duel.resA.disposableCash.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>

        {/* Offer B Card */}
        <div className={`p-5 rounded-3xl border-2 space-y-4 ${
          duel.winner === 'B' ? 'bg-zinc-950 border-[#ff9f0a]/50 shadow-xl' : 'bg-zinc-950 border-zinc-900 opacity-90'
        }`}>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={offerB.title}
              onChange={e => setOfferB({ ...offerB, title: e.target.value })}
              className="bg-transparent text-sm font-black text-white border-b border-zinc-700 focus:outline-none focus:border-[#ff9f0a] px-1 py-0.5"
            />
            {duel.winner === 'B' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🏆 Winner
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Base Salary ({currencySymbol})</label>
                <input
                  type="number"
                  step={2000}
                  value={offerB.salary}
                  onChange={e => setOfferB({ ...offerB, salary: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Bonus / Equity ({currencySymbol})</label>
                <input
                  type="number"
                  step={1000}
                  value={offerB.bonus}
                  onChange={e => setOfferB({ ...offerB, bonus: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Monthly Rent ({currencySymbol})</label>
                <input
                  type="number"
                  step={100}
                  value={offerB.monthlyRent}
                  onChange={e => setOfferB({ ...offerB, monthlyRent: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">State Tax Rate (%)</label>
                <input
                  type="number"
                  step={0.5}
                  value={offerB.stateTaxRate}
                  onChange={e => setOfferB({ ...offerB, stateTaxRate: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Offer B Bottom Line */}
          <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Total Estimated Taxes:</span>
              <span className="font-mono text-rose-400">-{currencySymbol}{duel.resB.totalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Annual Rent Outflow:</span>
              <span className="font-mono text-rose-400">-{currencySymbol}{duel.resB.annualRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>401(k) / Pension Match:</span>
              <span className="font-mono text-emerald-400">+{currencySymbol}{duel.resB.matchBonus.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
              <span>Net Disposable Cash:</span>
              <span className="font-mono text-[#ff9f0a]">{currencySymbol}{duel.resB.disposableCash.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>

      </div>

      {/* In-Engine High-CTR Ad Placement */}
      <AdSenseBanner label="Sponsored Career & Relocation Services • Google AdSense" />

    </div>
  );
};
