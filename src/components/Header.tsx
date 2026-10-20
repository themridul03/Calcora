import React from 'react';
import { Calculator, Printer, ChevronDown, Search, Globe } from 'lucide-react';
import { Country } from '../types';
import { COUNTRIES } from '../utils/countries';
import { SupportedLanguage, LANGUAGES } from '../utils/i18n';

interface HeaderProps {
  country: Country;
  onCountryChange: (country: Country) => void;
  onOpenReport: () => void;
  onToggleAppleCalc: () => void;
  isAppleCalcOpen: boolean;
  onOpenCountryModal: () => void;
  language: SupportedLanguage;
  onOpenLanguageModal: () => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  country,
  onCountryChange,
  onOpenReport,
  onToggleAppleCalc,
  isAppleCalcOpen,
  onOpenCountryModal,
  language,
  onOpenLanguageModal,
  onNavigateHome,
}) => {
  const currentCountry = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
  const currentLangInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo - Apple Styled */}
        <a 
          href="/" 
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0 && onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          className="flex items-center space-x-3 text-inherit no-underline hover:opacity-90 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#ff9f0a] flex items-center justify-center shadow-lg shadow-[#ff9f0a]/20">
            <Calculator className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Calcora
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30">
                 Pro Suite
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Global Financial Decision & Comparison Engine
            </p>
          </div>
        </a>

        {/* Global Market Switcher, Language & Apple Quick Calc Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* SEARCHABLE COUNTRY SELECTOR PILL */}
          <button
            onClick={onOpenCountryModal}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full px-3.5 py-1.5 transition text-xs text-white"
            title="Search all 195+ countries"
          >
            <span className="text-base">{currentCountry.flag}</span>
            <span className="font-semibold max-w-[100px] sm:max-w-[140px] truncate">{currentCountry.name}</span>
            <span className="font-mono text-zinc-400 text-[11px]">({currentCountry.symbol})</span>
            <Search className="w-3 h-3 text-zinc-400 ml-0.5" />
          </button>

          {/* LANGUAGE SELECTOR PILL */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full px-3 py-1.5 transition text-xs text-white font-medium"
            title="Select Language / भाषा चुनें"
          >
            <Globe className="w-3.5 h-3.5 text-[#ff9f0a]" />
            <span className="font-semibold">{currentLangInfo.nativeName}</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">({currentLangInfo.code})</span>
          </button>

          {/* APPLE QUICK CALC BUTTON */}
          <button
            onClick={onToggleAppleCalc}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              isAppleCalcOpen
                ? 'bg-[#ff9f0a] text-black shadow-lg shadow-[#ff9f0a]/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
            }`}
            title="Toggle authentic Apple Calculator"
          >
            <span className="text-xs"></span>
            <span className="hidden sm:inline">Quick Calc</span>
          </button>

          {/* Print/Export Report */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
            title="Export Clean Report"
          >
            <Printer className="w-3.5 h-3.5 text-[#ff9f0a]" />
            <span className="hidden md:inline">Report</span>
          </button>

        </div>

      </div>
    </header>
  );
};
