import React from 'react';
import { 
  Briefcase, 
  CreditCard, 
  Home, 
  Landmark, 
  Lightbulb, 
  ShoppingBag, 
  Flame, 
  Swords 
} from 'lucide-react';
import { CalculatorType, Country } from '../types';
import { SupportedLanguage, getTranslation } from '../utils/i18n';
import { ROUTES } from '../utils/routes';

interface TabsProps {
  activeTab: CalculatorType;
  onTabChange: (tab: CalculatorType, path: string) => void;
  country: Country;
  language: SupportedLanguage;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, country, language }) => {
  const tabs = [
    {
      id: '1099-vs-w2' as CalculatorType,
      path: ROUTES['1099-vs-w2'].path,
      label: getTranslation(language, 'tab1099'),
      icon: Briefcase,
      badge: 'Equalizer',
      description: 'Tax, perks & parity',
    },
    {
      id: 'debt-matrix' as CalculatorType,
      path: ROUTES['debt-matrix'].path,
      label: getTranslation(language, 'tabDebt'),
      icon: CreditCard,
      badge: 'Save $$$',
      description: 'Avalanche vs Snowball',
    },
    {
      id: 'rent-vs-buy' as CalculatorType,
      path: ROUTES['rent-vs-buy'].path,
      label: getTranslation(language, 'tabRent'),
      icon: Home,
      badge: 'Break-Even',
      description: 'S&P 500 opportunity cost',
    },
    {
      id: 'can-i-afford-it' as CalculatorType,
      path: ROUTES['can-i-afford-it'].path,
      label: getTranslation(language, 'tabAfford'),
      icon: ShoppingBag,
      badge: 'Viral 🔥',
      description: 'Life hours & 72h rule',
    },
    {
      id: 'fire-calculator' as CalculatorType,
      path: ROUTES['fire-calculator'].path,
      label: getTranslation(language, 'tabFire'),
      icon: Flame,
      badge: 'Freedom 🎯',
      description: '4% rule & target age',
    },
    {
      id: 'job-duel' as CalculatorType,
      path: ROUTES['job-duel'].path,
      label: getTranslation(language, 'tabDuel'),
      icon: Swords,
      badge: 'Duel ⚔️',
      description: 'Austin vs SF vs London',
    },
    {
      id: 'uk-tax' as CalculatorType,
      path: ROUTES['uk-tax'].path,
      label: getTranslation(language, 'tabTax'),
      icon: Landmark,
      badge: country === 'UK' ? '60% Trap' : 'Optimized',
      description: 'Tax & pension shielding',
    },
    {
      id: 'suggestions' as CalculatorType,
      path: ROUTES['suggestions'].path,
      label: getTranslation(language, 'tabSuggestions'),
      icon: Lightbulb,
      badge: 'Interactive',
      description: 'Smart insights & request box',
    },
  ];

  return (
    <nav aria-label="Financial Calculators Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1">
      <div role="tablist" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 bg-zinc-950/80 p-2 rounded-3xl border border-zinc-900 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <a
              key={tab.id}
              href={tab.path}
              role="tab"
              aria-selected={isActive}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  onTabChange(tab.id, tab.path);
                }
              }}
              className={`relative flex flex-col items-start p-3 rounded-2xl transition-all text-left no-underline select-none ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xl border border-zinc-700/80 ring-1 ring-[#ff9f0a]/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#ff9f0a] text-black shadow-md shadow-[#ff9f0a]/20' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800/80'
                }`}>
                  {tab.badge}
                </span>
              </div>
              <span className="text-xs font-bold tracking-tight mb-0.5 truncate w-full">
                {tab.label}
              </span>
              <span className="text-[10px] text-zinc-400 line-clamp-1">
                {tab.description}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
