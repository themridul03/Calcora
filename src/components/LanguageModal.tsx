import React, { useState, useMemo } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { LANGUAGES, LanguageInfo, SupportedLanguage } from '../utils/i18n';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLanguages = useMemo(() => {
    if (!searchTerm.trim()) return LANGUAGES;
    const term = searchTerm.toLowerCase().trim();
    return LANGUAGES.filter(
      l =>
        l.name.toLowerCase().includes(term) ||
        l.nativeName.toLowerCase().includes(term) ||
        l.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Header - Apple Style */}
        <div className="p-4 sm:p-5 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-2.5 focus-within:border-[#ff9f0a] transition">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search language (English, Hindi, Español, Français, Deutsch, etc.)..."
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

        {/* Info Strip */}
        <div className="px-6 py-2 bg-zinc-900/40 border-b border-zinc-900 flex justify-between text-[11px] text-zinc-400 font-mono">
          <span>{filteredLanguages.length} Available World Languages</span>
          <span>Instant real-time translation</span>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto space-y-1.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLanguages.map(l => {
              const isSelected = l.code === selectedLanguage;
              return (
                <div
                  key={l.code}
                  onClick={() => {
                    onSelectLanguage(l.code);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition border text-left ${
                    isSelected
                      ? 'bg-[#ff9f0a]/15 border-[#ff9f0a] text-white shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{l.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {l.nativeName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          ({l.name})
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">
                        {l.code}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#ff9f0a] flex items-center justify-center text-black shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-900 bg-zinc-950 text-center text-[10px] text-zinc-500">
          💡 Tip: Selecting a country auto-suggests its native language, or you can freely choose any language here.
        </div>

      </div>
    </div>
  );
};
