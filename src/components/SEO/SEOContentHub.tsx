import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Calculator, HelpCircle, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { Country, CalculatorType } from '../../types';
import { getCountryInfo } from '../../utils/countries';
import { ROUTES } from '../../utils/routes';

interface SEOContentHubProps {
  country: Country;
  activeTab: CalculatorType;
  onNavigate?: (path: string) => void;
}

export const SEOContentHub: React.FC<SEOContentHubProps> = ({ country, activeTab, onNavigate }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0 && onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'How much more should I charge as a 1099 contractor vs a W-2 salary?',
      a: `As an industry standard, contractors must charge between 1.35x and 1.50x of their target W-2 base salary. For instance, a $100,000 W-2 salary requires approximately $135,000 to $145,000 in gross 1099 billings ($70 to $75/hr for a 1,900-hour billable year). This buffer accounts for the 15.3% Self-Employment Tax (Social Security & Medicare), the replacement cost of employer health insurance ($6,000–$8,000/yr), lost 401(k) matching (typically 3%–6%), and 15–25 days of unpaid vacation and holidays.`,
    },
    {
      q: 'What is the exact mathematical difference between Debt Avalanche and Debt Snowball?',
      a: `The Debt Avalanche method orders debts strictly by highest APR (Annual Percentage Rate) down to the lowest. Mathematically, it saves the maximum amount of money in interest and achieves full debt freedom in the fewest total months. The Debt Snowball method orders debts strictly by lowest balance first, delivering rapid psychological wins and behavioral motivation by wiping out individual accounts quickly. If total financial efficiency is your goal, choose Avalanche; if you need momentum to stay disciplined, choose Snowball.`,
    },
    {
      q: 'Does renting build more wealth than buying a home in 2026?',
      a: `In a 6.5%+ mortgage rate climate, buying takes an average of 7 to 10 years to reach a break-even point against renting. In the first 5 years of a 30-year mortgage, roughly 70% to 80% of every payment goes entirely to unrecoverable interest, property taxes, homeowners insurance, and HOA fees—none of which builds home equity. Meanwhile, a renter who invests the down payment and monthly savings in broad-market index funds (such as the S&P 500, which has averaged ~8% to 10% annual historical returns) often accumulates significantly higher net worth if relocating within 5 to 7 years.`,
    },
    {
      q: 'What is the UK 60% Marginal Tax Trap and how do I bypass it?',
      a: `In the United Kingdom, individuals with an adjusted net income between £100,000 and £125,140 lose £1 of their £12,570 tax-free personal allowance for every £2 of income above £100,000. Combined with the 40% higher rate income tax and 2% National Insurance, every additional pound earned in this band is taxed at an effective 62% marginal rate. Furthermore, passing £100,000 immediately disqualifies parents from receiving 30 hours of government-funded free childcare. The legal and optimal strategy to bypass this trap is Salary Sacrifice: directing the excess income directly into a workplace pension or SIPP brings adjusted net income back to £100,000, saving 62% in tax while preserving childcare benefits.`,
    },
    {
      q: 'How does an S-Corporation election save money on taxes?',
      a: `When a self-employed business owner or sole proprietor earns over $75,000 to $80,000 in net profit, filing IRS Form 2553 to elect S-Corp tax status allows them to split income into a "reasonable W-2 salary" and "shareholder profit distributions". While the salary portion remains subject to the 15.3% self-employment tax, distributions are exempt from SE tax. On $120,000 in profit with a $65,000 reasonable salary, this strategy typically saves $5,000 to $8,500 annually in federal payroll taxes.`,
    },
    {
      q: 'How does the "Can I Afford This?" 72-Hour Rule & Life-Hours formula work?',
      a: `Before buying any non-essential item, convert its sticker price into real net working hours (Item Price ÷ Your Take-Home Hourly Wage). For example, a $1,200 smartphone on a $30/hr net wage demands 40 full hours of your life. Furthermore, if you invested that $1,200 in the S&P 500 at historical 8% compounding returns, it would grow to $5,590+ over 20 years. Enforcing a strict 72-hour cooling-off delay permanently prevents up to 85% of impulse shopping regret.`,
    },
    {
      q: 'What is the Trinity Study 4% Safe Withdrawal Rule for FIRE (Early Retirement)?',
      a: `The 4% Rule, established by the landmark Trinity Study, demonstrates that an investor who withdraws 4% of their portfolio in year one of retirement (and adjusts for inflation thereafter) has a 95%+ probability of never exhausting their wealth over a 30-year horizon. Your "FIRE Number" is simply your annual expenses multiplied by 25 (e.g., $50,000/yr × 25 = $1,250,000). Calcora dynamically models compounding monthly contributions and project your exact Freedom Age.`,
    },
    {
      q: 'How do I compare job offers in high-tax vs no-tax states (e.g., California vs Texas)?',
      a: `Nominal gross salaries are misleading. A $160,000 offer in San Francisco or NYC often leaves less disposable cash than a $130,000 offer in Austin, Texas or Miami, Florida once you account for California's 9.3%+ state income tax, NYC city tax, and local monthly rent differences ($3,600/mo vs $2,100/mo). Calcora's Job Offer Duel isolates true post-tax, post-housing disposable cash flow and 401(k) matching.`,
    },
  ];

  return (
    <section className="mt-12 pt-10 border-t border-zinc-900 text-zinc-300 text-xs space-y-10">
      
      {/* Editorial Authority Guide Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
            Comprehensive Methodology & Guide
          </span>
          <span className="text-[11px] text-zinc-400">IRS • HMRC • Federal Reserve Standards</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          The Mathematics Behind Calcora Financial Models
        </h2>
        <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
          Calcora eliminates algorithmic guesswork by pairing live mathematical formulas with current 2026 tax codes, inflation metrics, and investment opportunity costs.
        </p>
      </div>

      {/* 3 In-Depth Methodological Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Tax Equalizer Formula */}
        <article className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-3">
          <div className="w-8 h-8 rounded-full bg-[#ff9f0a]/20 flex items-center justify-center text-[#ff9f0a]">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            1099 vs W-2 Equalization Formula
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            Our equalizer balances the Net Disposable Income equation:
          </p>
          <div className="bg-zinc-900 p-2.5 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800">
            Net1099 = Gross - SETax(15.3%) - FedTax(QBI) - StateTax - Health - Opex
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Because employers pay 7.65% of FICA and provide tax-sheltered health plans, 1099 contractors must add an overhead factor of <strong>+35% to +45%</strong> to achieve identical living standards.
          </p>
          <div className="pt-2">
            <a
              href={ROUTES['1099-vs-w2'].path}
              onClick={(e) => handleLinkClick(e, ROUTES['1099-vs-w2'].path)}
              className="text-[11px] font-semibold text-[#ff9f0a] hover:underline inline-flex items-center gap-1"
            >
              Open 1099 vs W-2 Equalizer &rarr;
            </a>
          </div>
        </article>

        {/* Pillar 2: Debt Avalanche Mechanics */}
        <article className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            Debt Avalanche vs Snowball Mechanics
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            The mathematical rate of interest accumulation follows continuous compounding:
          </p>
          <div className="bg-zinc-900 p-2.5 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800">
            MonthlyInterest = Balance × (APR / 12)
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Targeting the highest APR first (e.g. 28.99% before 19.99%) minimizes total interest leakage. Minimum-only payments extend payoff past 18 years due to negative amortization damping.
          </p>
          <div className="pt-2">
            <a
              href={ROUTES['debt-matrix'].path}
              onClick={(e) => handleLinkClick(e, ROUTES['debt-matrix'].path)}
              className="text-[11px] font-semibold text-[#ff9f0a] hover:underline inline-flex items-center gap-1"
            >
              Launch Debt Payoff Matrix &rarr;
            </a>
          </div>
        </article>

        {/* Pillar 3: Housing Opportunity Cost */}
        <article className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            Rent vs Buy Capital Opportunity Cost
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            Homeownership costs are divided into recoverable equity and unrecoverable sunk costs:
          </p>
          <div className="bg-zinc-900 p-2.5 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800">
            SunkCost = Interest + PropertyTax + Insurance + HOA + Maintenance
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Calcora tests the down payment cash compounded in the S&P 500 (~8% annualized) against the net home equity after 6% selling fees, pinpointing the true break-even year.
          </p>
          <div className="pt-2">
            <a
              href={ROUTES['rent-vs-buy'].path}
              onClick={(e) => handleLinkClick(e, ROUTES['rent-vs-buy'].path)}
              className="text-[11px] font-semibold text-[#ff9f0a] hover:underline inline-flex items-center gap-1"
            >
              Run 2026 Rent vs Buy Model &rarr;
            </a>
          </div>
        </article>

      </div>

      {/* SEO Interactive FAQ Accordion (Indexed by Google) */}
      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#ff9f0a]" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Frequently Asked Financial Questions (FAQ)
          </h3>
        </div>

        <div className="divide-y divide-zinc-900">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-zinc-200 hover:text-[#ff9f0a] transition gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#ff9f0a] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
