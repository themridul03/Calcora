import React from 'react';
import { ShieldCheck, ArrowUpRight, Award, Star, ExternalLink, Zap } from 'lucide-react';
import { CalculatorType, Country } from '../types';
import { getCountryInfo } from '../utils/countries';

interface MonetizationCardProps {
  activeTab: CalculatorType;
  country: Country;
}

export const MonetizationCard: React.FC<MonetizationCardProps> = ({ activeTab, country }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;


  // Content dynamically adapts to the exact high-CPC niche the user is viewing
  const getOfferData = () => {
    switch (activeTab) {
      case '1099-vs-w2':
        return {
          category: 'S-Corp & 1099 Tax Optimization',
          title: 'Form an LLC / S-Corp & Automate Write-Offs',
          badge: 'High Earner Pick',
          payoutNote: 'US/UK High-Intent Affiliate Example ($75–$150/lead)',
          bullets: [
            'Save up to $6,000/yr in self-employment tax with S-Corp election',
            'Automated mileage, home office & receipt tracking',
            'Business bank account + tax reserve bucket',
          ],
          cta: 'Compare Top LLC & Tax Platforms',
          sponsor: 'Collective / ZenBusiness / Tailor Brands Partner',
        };

      case 'debt-matrix':
        return {
          category: 'Debt Consolidation & 0% Balance Transfer',
          title: 'Consolidate High-APR Cards at 6.99% – 11.49% Fixed',
          badge: 'Top Rated',
          payoutNote: 'Financial Lead Gen Example ($50–$180/funded loan)',
          bullets: [
            'Check pre-qualified rates with soft credit pull (0 impact on score)',
            'Single fixed monthly payment replacing multiple 28% APR cards',
            'Average user saves $4,200+ in lifetime interest',
          ],
          cta: 'Check Pre-Qualified Rates (No Score Impact)',
          sponsor: 'SoFi / Marcus / Upstart / LendingClub Partner',
        };

      case 'rent-vs-buy':
        return {
          category: 'Mortgage Pre-Approval & High-Yield Savings',
          title: 'Lock In 2026 Competitive Mortgage & Down Payment Rates',
          badge: 'Competitive Rates',
          payoutNote: 'Mortgage & HYSA Affiliate ($80–$250/application)',
          bullets: [
            'Compare 30+ vetted direct lenders for lowest APR & closing costs',
            'High-Yield Savings Accounts (HYSA) paying 4.5%+ APY on down payment funds',
            'Instant pre-qualification letter for home shopping',
          ],
          cta: 'Compare Direct Mortgage & HYSA Rates',
          sponsor: 'Rocket Mortgage / LendingTree / Ally Bank Partner',
        };

      case 'uk-tax':
        return {
          category: 'UK SIPP Pension & Contractor Accounting',
          title: 'Open a Low-Fee SIPP Pension & Save 40%–60% HMRC Tax',
          badge: 'HMRC Approved',
          payoutNote: 'UK Investment & SIPP Commission (£40–£120/account)',
          bullets: [
            'Claim back 20% to 40% higher rate relief directly into your pension',
            'Escape the £100k–£125k 60% tax trap effortlessly',
            'FSCS protected up to £85,000 per banking institution',
          ],
          cta: 'Compare Top UK SIPP Providers',
          sponsor: 'Vanguard / Interactive Investor / PensionBee Partner',
        };

      case 'can-i-afford-it':
        return {
          category: 'High-Yield Wealth Stash & Cash Flow',
          title: 'Park Impulse Cash in 4.8% APY High-Yield Savings',
          badge: 'Smart Stash',
          payoutNote: 'Fintech & Savings Lead ($45–$120/signup)',
          bullets: [
            'Automate the 72-Hour Rule with sub-savings buckets',
            'Compound idle cash daily with zero lockup or withdrawal penalties',
            'FDIC/FSCS insured peace-of-mind up to statutory limits',
          ],
          cta: 'Unlock 4.8%+ High-Yield Accounts',
          sponsor: 'Marcus by Goldman Sachs / Wealthfront / Revolut',
        };

      case 'fire-calculator':
        return {
          category: 'Low-Fee Index Fund Brokerages & IRAs',
          title: 'Accelerate FIRE With Automated 0% Commission Indexing',
          badge: 'FIRE Community Favorite',
          payoutNote: 'Brokerage & Wealth Account Affiliate ($75–$200/funded account)',
          bullets: [
            'Invest in low-cost total market index funds (VTI / VOO / VWRL)',
            'Tax-advantaged Roth IRA, Mega Backdoor & ISA optimization',
            'Zero transaction fees, fractional shares & auto-rebalancing',
          ],
          cta: 'Explore Top FIRE Brokerages & IRAs',
          sponsor: 'Vanguard / Charles Schwab / Fidelity / Interactive Brokers',
        };

      case 'job-duel':
        return {
          category: 'Relocation & Remote Compensation Negotiation',
          title: 'Relocate & Keep More: Zero-Tax State Guide & Salary Negotiation',
          badge: 'High Earner Toolkit',
          payoutNote: 'Career & Relocation Services Affiliate ($60–$150/lead)',
          bullets: [
            'Maximize take-home by migrating to TX, FL, WA, TN, or NV',
            'Benchmark real compensation against verified tech payroll data',
            'Professional remote tax compliance & interstate filing suite',
          ],
          cta: 'Compare Cross-State Take-Home Strategies',
          sponsor: 'Levels.fyi / Deel / Carta / TurboTax Partner',
        };

      default:
        return {
          category: 'High-Yield Savings & Capital Preservation',
          title: 'Earn 4.5% – 5.2% APY on Liquid Cash Reserves',
          badge: 'Top Pick',
          payoutNote: 'High-Yield Savings Affiliate ($40–$100/account)',
          bullets: [
            'FDIC/FSCS insured protection for emergency funds and tax buckets',
            'Zero account fees, minimum balance requirements, or lockups',
            'Same-day electronic transfers between bank accounts',
          ],
          cta: 'Compare Top High-Yield Accounts',
          sponsor: 'Wealthfront / Marcus / Revolut Partner',
        };
    }
  };

  const offer = getOfferData();

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              {offer.badge}
            </span>
            <span className="text-xs text-gray-400">{offer.category}</span>
            <span className="text-[10px] font-mono text-emerald-300/70 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900 hidden md:inline">
              💰 {offer.payoutNote}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {offer.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300">
            {offer.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Action */}
        <div className="shrink-0 flex flex-col items-start sm:items-end justify-center gap-1">
          <button
            onClick={() => alert(`In production, this button routes to vetted affiliate partners (e.g. ${offer.sponsor}), generating recurring CPA/CPC revenue!`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20"
          >
            <span>{offer.cta}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-gray-500">
            Featured Partner • Free Soft Check
          </span>
        </div>

      </div>

    </div>
  );
};
