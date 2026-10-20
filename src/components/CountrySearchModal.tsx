import React, { useState, useMemo } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { CountryInfo } from '../types';
import { COUNTRIES } from '../utils/countries';

interface CountrySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryCode: string;
  onSelectCountry: (country: CountryInfo) => void;
}

export const CountrySearchModal: React.FC<CountrySearchModalProps> = ({
  isOpen,
  onClose,
  selectedCountryCode,
  onSelectCountry,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return COUNTRIES;
    const term = searchTerm.toLowerCase().trim();
    return COUNTRIES.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        c.currency.toLowerCase().includes(term) ||
        c.symbol.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Header - Apple Spotlight Style */}
        <div className="p-4 sm:p-5 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-2.5 focus-within:border-[#ff9f0a] transition">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by country, currency (USD, EUR, GBP), or symbol..."
              className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-zinc-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-zinc-500 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Counter */}
        <div className="px-6 py-2 bg-zinc-900/40 border-b border-zinc-900 flex justify-between text-[11px] text-zinc-400 font-mono">
          <span>{filteredCountries.length} Global Countries & Territories</span>
          <span>Click to set active currency & benchmarks</span>
        </div>

        {/* Scrollable Country Grid / List */}
        <div className="p-4 overflow-y-auto space-y-1.5 flex-1">
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCountries.map(c => {
                const isSelected = c.code === selectedCountryCode;
                return (
                  <div
                    key={c.code}
                    onClick={() => {
                      onSelectCountry(c);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition border text-left ${
                      isSelected
                        ? 'bg-[#ff9f0a]/15 border-[#ff9f0a] text-white shadow-md'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{c.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            ({c.code})
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block truncate font-mono">
                          {c.currency} • {c.symbol}
                        </span>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#ff9f0a] flex items-center justify-center text-black shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500 font-mono shrink-0">
                        {c.symbol}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No country found matching "{searchTerm}". Try another search!
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-900 bg-zinc-950 text-center text-[10px] text-zinc-500">
          All 195+ sovereign countries & territories supported • Auto-calibrated currency symbols & financial benchmarks
        </div>

      </div>
    </div>
  );
};
