import React, { useState, useEffect } from 'react';
import { Country, CalculatorType } from './types';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { TaxEqualizer } from './components/TaxEqualizer/TaxEqualizer';
import { DebtMatrix } from './components/DebtMatrix/DebtMatrix';
import { RentVsBuy } from './components/RentVsBuy/RentVsBuy';
import { CanIAffordIt } from './components/ImpulseChecker/CanIAffordIt';
import { FIRECalculator } from './components/FIRE/FIRECalculator';
import { JobDuel } from './components/JobDuel/JobDuel';
import { UKOptimizer } from './components/UKOptimizer/UKOptimizer';
import { SuggestionHub } from './components/SuggestionBox/SuggestionHub';
import { MonetizationCard } from './components/MonetizationCard';
import { SEOContentHub } from './components/SEO/SEOContentHub';
import { Footer } from './components/Footer';
import { PrintReportModal } from './components/PrintReportModal';
import { AppleCalculatorWidget } from './components/AppleCalculatorWidget';
import { CountrySearchModal } from './components/CountrySearchModal';
import { LanguageModal } from './components/LanguageModal';
import { getCountryInfo } from './utils/countries';
import { SupportedLanguage, COUNTRY_DEFAULT_LANGUAGE } from './utils/i18n';

export function App() {
  const [country, setCountry] = useState<Country>('US');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<CalculatorType>('1099-vs-w2');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAppleCalcOpen, setIsAppleCalcOpen] = useState<boolean>(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Sync initial tab with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as CalculatorType;
    const validTabs: CalculatorType[] = [
      '1099-vs-w2', 
      'debt-matrix', 
      'rent-vs-buy', 
      'can-i-afford-it', 
      'fire-calculator', 
      'job-duel', 
      'uk-tax', 
      'suggestions'
    ];
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Dynamic SEO Title & Meta Description updating based on Tab and Country
  useEffect(() => {
    const countryInfo = getCountryInfo(country);
    let title = 'Calcora — Financial Decision Engine';
    let desc = 'Advanced financial calculators for 1099 vs W2, Debt Avalanche, Rent vs Buy, and FIRE Retirement.';

    switch (activeTab) {
      case '1099-vs-w2':
        title = `1099 vs W-2 Equalizer & Self-Employment Tax Calculator (${countryInfo.name}) | Calcora`;
        desc = `Calculate exact 1099 contractor equivalent hourly rate to match a W-2 salary after self-employment tax (15.3%), QBI deduction, and missing health insurance.`;
        break;
      case 'debt-matrix':
        title = `Credit Card Debt Payoff Calculator — Avalanche vs Snowball (${countryInfo.symbol}) | Calcora`;
        desc = `Compare Debt Avalanche, Debt Snowball, and Consolidation Loans. See exact debt-free dates, interest saved, and visual amortization curves.`;
        break;
      case 'rent-vs-buy':
        title = `2026 Rent vs Buy Calculator & S&P 500 Opportunity Cost (${countryInfo.name}) | Calcora`;
        desc = `Does buying build more wealth than renting? Compare mortgage interest, HOA, and property taxes against compounding down payments in index funds.`;
        break;
      case 'can-i-afford-it':
        title = `Can I Afford This? Impulse Buy & Life-Hours Traded Calculator (${countryInfo.symbol}) | Calcora`;
        desc = `See how many hours of your life an impulse purchase actually costs, calculate S&P 500 compound growth opportunity cost, and apply the viral 72-Hour Rule.`;
        break;
      case 'fire-calculator':
        title = `FIRE Calculator — Financial Independence & Early Retirement Age (${countryInfo.name}) | Calcora`;
        desc = `Calculate your exact FIRE Freedom Number using the Trinity Study 4% Safe Withdrawal Rule, Coast FIRE, Lean FIRE, and compounding investment runway.`;
        break;
      case 'job-duel':
        title = `Job Offer Duel — Side-by-Side Salary & Cost of Living Comparison (${countryInfo.symbol}) | Calcora`;
        desc = `Compare two competing tech or remote job offers side-by-side. Factor in state income taxes, local rent, 401(k) matching, and real monthly disposable cash.`;
        break;
      case 'uk-tax':
        title = `UK 60% Marginal Tax Trap & Salary Sacrifice Calculator 2025/2026 | Calcora`;
        desc = `Navigate the HMRC £100k–£125k personal allowance taper. Calculate pension salary sacrifice savings and 30-hour free childcare protection.`;
        break;
      case 'suggestions':
        title = `Smart Financial Insights & Feature Request Roadmap | Calcora`;
        desc = `Actionable tax optimization hacks, S-Corp shielding tips, and community feature requests for Calcora.`;
        break;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }

    // Update window hash for clean URL sharing
    if (window.location.hash !== `#${activeTab}`) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab, country]);

  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
    
    // Auto-detect and adapt language based on the chosen country
    const autoLang = COUNTRY_DEFAULT_LANGUAGE[newCountry.toUpperCase()];
    if (autoLang) {
      setLanguage(autoLang);
    }

    if (newCountry === 'UK' && activeTab === '1099-vs-w2') {
      setActiveTab('uk-tax');
    } else if (newCountry === 'US' && activeTab === 'uk-tax') {
      setActiveTab('1099-vs-w2');
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-[#ff9f0a]/30 selection:text-[#ff9f0a]">
      
      {/* Header with All Countries Dropdown, Language Picker & Apple Quick Calc */}
      <Header
        country={country}
        onCountryChange={handleCountryChange}
        onOpenReport={() => setIsReportOpen(true)}
        onToggleAppleCalc={() => setIsAppleCalcOpen(!isAppleCalcOpen)}
        isAppleCalcOpen={isAppleCalcOpen}
        onOpenCountryModal={() => setIsCountryModalOpen(true)}
        language={language}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Tabs with Hash Routing & Internationalization */}
      <Tabs
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          window.location.hash = `#${tab}`;
        }}
        country={country}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Active Calculator Component */}
        {activeTab === '1099-vs-w2' && <TaxEqualizer country={country} language={language} />}
        {activeTab === 'debt-matrix' && <DebtMatrix country={country} />}
        {activeTab === 'rent-vs-buy' && <RentVsBuy country={country} />}
        {activeTab === 'can-i-afford-it' && <CanIAffordIt country={country} />}
        {activeTab === 'fire-calculator' && <FIRECalculator country={country} />}
        {activeTab === 'job-duel' && <JobDuel country={country} />}
        {activeTab === 'uk-tax' && <UKOptimizer />}
        {activeTab === 'suggestions' && (
          <SuggestionHub
            country={country}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        )}

        {/* High-Converting Affiliate & Monetization Callout */}
        <div className="pt-2">
          <MonetizationCard activeTab={activeTab === 'suggestions' ? '1099-vs-w2' : activeTab} country={country} />
        </div>

        {/* Search Engine Optimization (SEO) Content & Rich FAQ Accordion */}
        <SEOContentHub country={country} activeTab={activeTab} />

      </main>

      {/* Footer */}
      <Footer />

      {/* Printable Report Modal */}
      <PrintReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        activeTab={activeTab}
        country={country}
      />

      {/* Interactive Apple Calculator Keypad Overlay */}
      <AppleCalculatorWidget
        isOpen={isAppleCalcOpen}
        onClose={() => setIsAppleCalcOpen(false)}
      />

      {/* All-Countries Global Search Modal (195+ Countries) */}
      <CountrySearchModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountryCode={country}
        onSelectCountry={c => handleCountryChange(c.code)}
      />

      {/* Global Languages Modal (15+ Major Languages) */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={language}
        onSelectLanguage={setLanguage}
      />

    </div>
  );
}

export default App;
