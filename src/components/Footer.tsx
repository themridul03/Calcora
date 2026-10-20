import React from 'react';
import { ShieldCheck, Heart, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950 mt-16 pt-10 pb-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Tier: Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-gray-800">
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-200 block text-xs">100% Private & In-Browser</span>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Zero financial data is sent to any server. All calculations, tax brackets, and debt simulations run locally in your browser.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-200 block text-xs">IRS & HMRC 2025/2026 Grounded</span>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Built with current US Federal FICA thresholds ($176,100), standard deductions, and UK HMRC personal allowance taper rules.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-200 block text-xs">Unbiased Math Over Ads</span>
              <p className="text-gray-400 text-[11px] mt-0.5">
                No paywalls, no mandatory email captures, and no gated answers. True mathematical models built for real decisions.
              </p>
            </div>
          </div>

        </div>

        {/* SEO Keywords / Category Index */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
            Popular High-Intent Financial Models
          </span>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">1099 vs W2 Calculator</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">Self-Employment Tax Rate</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">Debt Avalanche vs Snowball</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">Rent vs Buy Break-Even 2026</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">S&P 500 Opportunity Cost</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">UK 60% Marginal Tax Trap</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">Pension Salary Sacrifice Savings</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">Outside IR35 Day Rate Calculator</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-900 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} <strong>Calcora</strong>. All mathematical algorithms open & client-side.
          </div>
          <div className="flex items-center gap-4">
            <span>Methodology</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Affiliate Disclosure</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
