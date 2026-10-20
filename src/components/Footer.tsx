import React from 'react';
import { ShieldCheck, Heart, Lock } from 'lucide-react';
import { ROUTES } from '../utils/routes';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0 && onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const calculatorLinks = [
    { name: '1099 vs W-2 Equalizer', path: ROUTES['1099-vs-w2'].path },
    { name: 'Debt Avalanche vs Snowball', path: ROUTES['debt-matrix'].path },
    { name: '2026 Rent vs Buy Break-Even', path: ROUTES['rent-vs-buy'].path },
    { name: 'Can I Afford This? Impulse Checker', path: ROUTES['can-i-afford-it'].path },
    { name: 'FIRE Retirement Freedom (4% Rule)', path: ROUTES['fire-calculator'].path },
    { name: 'Side-by-Side Job Offer Duel', path: ROUTES['job-duel'].path },
    { name: 'UK 60% Marginal Tax & Salary Sacrifice', path: ROUTES['uk-tax'].path },
    { name: 'Community Insights & Roadmap', path: ROUTES['suggestions'].path },
  ];

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 mt-16 pt-10 pb-8 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Tier: Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-zinc-900">
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-zinc-200 block text-xs">100% Private & In-Browser</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Zero financial data is sent to any server. All calculations, tax brackets, and debt simulations run locally in your browser.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-zinc-200 block text-xs">IRS & HMRC 2025/2026 Grounded</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Built with current US Federal FICA thresholds ($176,100), standard deductions, and UK HMRC personal allowance taper rules.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-zinc-200 block text-xs">Unbiased Math Over Ads</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                No paywalls, no mandatory email captures, and no gated answers. True mathematical models built for real decisions.
              </p>
            </div>
          </div>

        </div>

        {/* SEO Keywords / Category Index - Real Crawlable Internal Links */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
            Dedicated High-Intent Financial Calculators
          </span>
          <nav aria-label="Footer Calculator Directory" className="flex flex-wrap gap-2 text-[11px]">
            {calculatorLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className="bg-zinc-900/90 text-zinc-300 hover:text-[#ff9f0a] hover:border-[#ff9f0a]/50 px-3 py-1.5 rounded-xl border border-zinc-800 transition duration-150 no-underline"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} <strong>Calcora</strong>. All mathematical algorithms client-side and open.
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-zinc-300 transition text-inherit no-underline">Home</a>
            <a href="/calculators/1099-vs-w2" className="hover:text-zinc-300 transition text-inherit no-underline">1099 Equalizer</a>
            <a href="/calculators/fire-retirement" className="hover:text-zinc-300 transition text-inherit no-underline">FIRE Calculator</a>
            <a href="/suggestions" className="hover:text-zinc-300 transition text-inherit no-underline">Roadmap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
