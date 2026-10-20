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

interface TabsProps {
  activeTab: CalculatorType;
  onTabChange: (tab: CalculatorType) => void;
  country: Country;
  language: SupportedLanguage;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, country, language }) => {
  const tabs = [
    {
      id: '1099-vs-w2' as CalculatorType,
      label: getTranslation(language, 'tab1099'),
      icon: Briefcase,
      badge: 'Equalizer',
      description: 'Tax, perks & parity',
    },
    {
      id: 'debt-matrix' as CalculatorType,
      label: getTranslation(language, 'tabDebt'),
      icon: CreditCard,
      badge: 'Save $$$',
      description: 'Avalanche vs Snowball',
    },
    {
      id: 'rent-vs-buy' as CalculatorType,
      label: getTranslation(language, 'tabRent'),
      icon: Home,
      badge: 'Break-Even',
      description: 'S&P 500 opportunity cost',
    },
    {
      id: 'can-i-afford-it' as CalculatorType,
      label: getTranslation(language, 'tabAfford'),
      icon: ShoppingBag,
      badge: 'Viral 🔥',
      description: 'Life hours & 72h rule',
    },
    {
      id: 'fire-calculator' as CalculatorType,
      label: getTranslation(language, 'tabFire'),
      icon: Flame,
      badge: 'Freedom 🎯',
      description: '4% rule & target age',
    },
    {
      id: 'job-duel' as CalculatorType,
      label: getTranslation(language, 'tabDuel'),
      icon: Swords,
      badge: 'Duel ⚔️',
      description: 'Austin vs SF vs London',
    },
    {
      id: 'uk-tax' as CalculatorType,
      label: getTranslation(language, 'tabTax'),
      icon: Landmark,
      badge: country === 'UK' ? '60% Trap' : 'Optimized',
      description: 'Tax & pension shielding',
    },
    {
      id: 'suggestions' as CalculatorType,
      label: getTranslation(language, 'tabSuggestions'),
      icon: Lightbulb,
      badge: 'Interactive',
      description: 'Smart insights & request box',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 bg-zinc-950/80 p-2 rounded-3xl border border-zinc-900 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-start p-3 rounded-2xl transition-all text-left ${
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
            </button>
          );
        })}
      </div>
    </div>
  );
};
