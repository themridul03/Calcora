import React, { useState } from 'react';
import { 
  Lightbulb, 
  Send, 
  ThumbsUp, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  MessageSquare,
  Flame
} from 'lucide-react';
import { Country, CalculatorType } from '../../types';
import { getCountryInfo } from '../../utils/countries';

interface SuggestionHubProps {
  country: Country;
  onNavigateTab: (tab: CalculatorType) => void;
}

interface CommunityIdea {
  id: string;
  title: string;
  category: string;
  votes: number;
  hasVoted: boolean;
  status: 'In Development' | 'Planned' | 'Under Review' | 'Live Now 🚀';
}

export const SuggestionHub: React.FC<SuggestionHubProps> = ({ country, onNavigateTab }) => {
  const countryInfo = getCountryInfo(country);
  const currencySymbol = countryInfo.symbol;

  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackCategory, setFeedbackCategory] = useState<string>('New Calculator Idea');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [communityIdeas, setCommunityIdeas] = useState<CommunityIdea[]>([
    {
      id: '1',
      title: 'Car Lease vs Finance vs Cash (2026 High Interest Rate Edition)',
      category: 'Auto Finance',
      votes: 342,
      hasVoted: false,
      status: 'In Development',
    },
    {
      id: '2',
      title: 'Crypto Tax Loss Harvesting & FIFO vs LIFO Optimization',
      category: 'Crypto & Assets',
      votes: 289,
      hasVoted: false,
      status: 'Planned',
    },
    {
      id: '3',
      title: 'FIRE (Financial Independence, Retire Early) Coast & Lean Target Engine',
      category: 'Retirement',
      votes: 524,
      hasVoted: true,
      status: 'Live Now 🚀',
    },
    {
      id: '4',
      title: 'Startup Stock Options (ISO vs NSO vs RSU) Alternative Minimum Tax (AMT) Modeler',
      category: 'Tech Compensation',
      votes: 215,
      hasVoted: false,
      status: 'Under Review',
    },
    {
      id: '5',
      title: 'Student Loan SAVE / IDR vs Direct Payoff Paycheck Modeler',
      category: 'US Student Debt',
      votes: 198,
      hasVoted: false,
      status: 'Planned',
    },
  ]);

  const toggleVote = (id: string) => {
    setCommunityIdeas(
      communityIdeas.map(idea => {
        if (idea.id === id) {
          return {
            ...idea,
            votes: idea.hasVoted ? idea.votes - 1 : idea.votes + 1,
            hasVoted: !idea.hasVoted,
          };
        }
        return idea;
      })
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // Add to community list
    const newIdea: CommunityIdea = {
      id: String(Date.now()),
      title: feedbackText.trim(),
      category: feedbackCategory,
      votes: 1,
      hasVoted: true,
      status: 'Under Review',
    };

    setCommunityIdeas([newIdea, ...communityIdeas]);
    setFeedbackText('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-5 rounded-3xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#ff9f0a] bg-[#ff9f0a]/10 px-2.5 py-0.5 rounded-full border border-[#ff9f0a]/20">
              Calcora Intelligence & Feedback
            </span>
            <span className="text-xs text-zinc-400">Localized for {countryInfo.name} {countryInfo.flag}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Smart Financial Suggestions & Feature Request Box
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Real-time actionable tax hacks, debt freedom levers, and an open roadmap where you request and upvote new calculation engines.
          </p>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Smart Proactive Actionable Financial Suggestions */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#ff9f0a]" />
            Actionable Financial Insights for {countryInfo.name}
          </h3>

          <div className="space-y-3">
            
            {/* Suggestion 1: S-Corp / Ltd Company */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  Tax Optimization
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Save {currencySymbol}4,500 – {currencySymbol}9,000/yr
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {country === 'US' ? 'Form an S-Corporation Election' : country === 'UK' ? 'Operate via Ltd Company Outside IR35' : 'Incorporate for Pass-Through Distribution Shielding'}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                If your annual self-employment or contractor profit exceeds {currencySymbol}75,000, paying yourself a market salary and taking remainder profits as distributions shelters income from mandatory self-employment tax.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('1099-vs-w2')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Test in 1099 Equalizer →
                </button>
              </div>
            </div>

            {/* Suggestion 2: Debt Avalanche */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  High-APR Credit Relief
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Cut 8–15 Years of Payments
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Consolidate 24%+ APR Balances into Fixed 9%–11%
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Paying standard 2% minimums on multiple credit cards is mathematically engineered to keep you paying interest for 18+ years. Switching to an Avalanche strategy saves thousands immediately.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('debt-matrix')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Simulate Debt Matrix →
                </button>
              </div>
            </div>

            {/* Suggestion 3: S&P 500 Down Payment Opportunity */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  2026 Capital Allocation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Opportunity Cost Check
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Don't Buy if Relocating Within 5–7 Years
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                In a 6.5%+ mortgage climate, 70% of monthly payments in Years 1–5 are unrecoverable interest and property tax. Renting while compounding down payment capital in index funds outperforms premature home buying.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('rent-vs-buy')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Inspect Break-Even Year →
                </button>
              </div>
            </div>

            {/* Suggestion 4: Can I Afford This? Impulse Checker */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  Behavioral Wealth Shield
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Viral Tool Live 🔥
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                "Can I Afford This?" — Trade Life Hours, Not Just Money
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Before purchasing that luxury gadget or vehicle, see the exact hours of your finite life you must trade for it and the 20-year S&P 500 compounding opportunity cost.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('can-i-afford-it')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Launch Impulse Buy Checker →
                </button>
              </div>
            </div>

            {/* Suggestion 5: FIRE Retirement Freedom */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  Early Retirement
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Trinity 4% Rule 🎯
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                FIRE Calculator — Pinpoint Your Freedom Age & Coast Milestones
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Calculate your exact Freedom Number, Lean FIRE baseline, and Fat FIRE threshold. See your retirement runway shorten with every 5% boost in savings rate.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('fire-calculator')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Calculate Freedom Age →
                </button>
              </div>
            </div>

            {/* Suggestion 6: Job Offer Duel */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#ff9f0a]/50 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ff9f0a] uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  Career Arbitrage
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Head-to-Head ⚔️
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Side-by-Side Job Offer Duel (Austin vs SF vs London)
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Pit two job offers against each other. Deduct real state tax brackets, high-cost city rents, and 401(k) matches to uncover the true cash champion.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateTab('job-duel')}
                  className="text-xs font-semibold text-[#ff9f0a] hover:text-[#ffb340] flex items-center gap-1"
                >
                  Fight Job Offers →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: User Suggestion Box & Community Voting */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Submit Idea Card */}
          <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#ff9f0a]" />
              Suggest a Calculator or Improvement
            </h3>
            <p className="text-xs text-zinc-400">
              Have a specific financial equation, local tax dilemma, or tool you want added to Calcora? Tell us below:
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 block mb-1">Category</label>
                <select
                  value={feedbackCategory}
                  onChange={e => setFeedbackCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff9f0a]"
                >
                  <option value="New Calculator Idea">New Calculator Idea</option>
                  <option value="Country Tax Rule Addition">Country Tax Rule Addition</option>
                  <option value="UI & Apple Theme Tweak">UI & Apple Theme Tweak</option>
                  <option value="Export & Report Feature">Export & Report Feature</option>
                  <option value="Other Suggestion">Other Suggestion</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-zinc-400 block mb-1">Your Idea / Feedback</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="e.g. Please add an Electric Vehicle (EV) Tax Credit vs Gas Savings calculator for US/UK..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff9f0a] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-full bg-[#ff9f0a] hover:bg-[#ffb340] text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#ff9f0a]/20 active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                Submit to Calcora Roadmap
              </button>

              {isSubmitted && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Idea added to the community board below!</span>
                </div>
              )}
            </form>
          </div>

          {/* Community Upvote Board */}
          <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Community Upvote Roadmap
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Live Votes</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {communityIdeas.map(idea => (
                <div
                  key={idea.id}
                  className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                        {idea.category}
                      </span>
                      <span className="text-[9px] text-[#ff9f0a] font-medium">
                        {idea.status}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white block line-clamp-2">
                      {idea.title}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleVote(idea.id)}
                    className={`flex flex-col items-center justify-center min-w-[50px] p-2 rounded-xl transition border ${
                      idea.hasVoted
                        ? 'bg-[#ff9f0a]/20 border-[#ff9f0a]/50 text-[#ff9f0a]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${idea.hasVoted ? 'fill-current' : ''}`} />
                    <span className="text-xs font-bold font-mono mt-0.5">{idea.votes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
