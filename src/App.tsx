import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
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
import { AdSenseBanner } from './components/AdSenseBanner';
import { StickyBottomAd } from './components/StickyBottomAd';
import { SEOContentHub } from './components/SEO/SEOContentHub';
import { Footer } from './components/Footer';
import { PrintReportModal } from './components/PrintReportModal';
import { AppleCalculatorWidget } from './components/AppleCalculatorWidget';
import { CountrySearchModal } from './components/CountrySearchModal';
import { LanguageModal } from './components/LanguageModal';
import { getCountryInfo } from './utils/countries';
import { SupportedLanguage, COUNTRY_DEFAULT_LANGUAGE } from './utils/i18n';
import { 
  ROUTES, 
  BASE_URL, 
  getCalculatorFromPathname, 
  LEGACY_HASH_MAP 
} from './utils/routes';

export function App() {
  const [country, setCountry] = useState<Country>('US');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<CalculatorType>('1099-vs-w2');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAppleCalcOpen, setIsAppleCalcOpen] = useState<boolean>(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Navigate to a route using HTML5 History API
  const navigateToRoute = useCallback((tabId: CalculatorType, explicitPath?: string) => {
    setActiveTab(tabId);
    const targetPath = explicitPath || ROUTES[tabId]?.path || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, []);

  // Handle Initial Route Load, Legacy Hash Redirects & Browser History (Popstate)
  useEffect(() => {
    // 1. Check for legacy hash fragments and redirect to canonical clean URLs
    const currentHash = window.location.hash;
    if (currentHash && LEGACY_HASH_MAP[currentHash]) {
      const canonicalPath = LEGACY_HASH_MAP[currentHash];
      const matchedCalc = getCalculatorFromPathname(canonicalPath);
      if (matchedCalc) {
        setActiveTab(matchedCalc);
      }
      window.history.replaceState(null, '', canonicalPath);
      return;
    }

    // 2. Check current pathname on direct load or refresh
    const calcFromPath = getCalculatorFromPathname(window.location.pathname);
    if (calcFromPath) {
      setActiveTab(calcFromPath);
    }

    // 3. Listen for browser Back/Forward navigation
    const handlePopState = () => {
      const poppedCalc = getCalculatorFromPathname(window.location.pathname);
      if (poppedCalc) {
        setActiveTab(poppedCalc);
      } else if (window.location.pathname === '/') {
        setActiveTab('1099-vs-w2');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Title, Meta Description, Canonical Link, and Open Graph tags
  useEffect(() => {
    const countryInfo = getCountryInfo(country);
    const routeConfig = ROUTES[activeTab];

    if (routeConfig) {
      const dynamicTitle = routeConfig.metaTitle(countryInfo.name, countryInfo.symbol);
      const dynamicDesc = routeConfig.metaDescription;
      const canonicalUrl = `${BASE_URL}${window.location.pathname === '/' ? '' : routeConfig.path}`;

      // Update Document Title
      document.title = dynamicTitle;

      // Update Meta Description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', dynamicDesc);
      }

      // Update Canonical Link
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute('href', canonicalUrl);
      } else {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        canonicalEl.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalEl);
      }

      // Update Open Graph & Twitter URL tags
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', dynamicTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', dynamicDesc);

      const twUrl = document.querySelector('meta[name="twitter:url"]');
      if (twUrl) twUrl.setAttribute('content', canonicalUrl);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', dynamicTitle);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', dynamicDesc);
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
      navigateToRoute('uk-tax', ROUTES['uk-tax'].path);
    } else if (newCountry === 'US' && activeTab === 'uk-tax') {
      navigateToRoute('1099-vs-w2', ROUTES['1099-vs-w2'].path);
    }
  };

  const currentRoute = ROUTES[activeTab] || ROUTES['1099-vs-w2'];
  const countryInfo = getCountryInfo(country);

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
        onNavigateHome={() => navigateToRoute('1099-vs-w2', '/')}
      />

      {/* Crawlable Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onTabChange={(tab, path) => navigateToRoute(tab, path)}
        country={country}
        language={language}
      />

      {/* Top High-Impact Leaderboard Ad Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2">
        <AdSenseBanner label="Sponsored Top Partner • Google AdSense" format="horizontal" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 pb-20">
        
        {/* Semantic SEO Page Heading & Breadcrumb Header */}
        <section aria-label="Page Header" className="bg-zinc-950/90 border border-zinc-900 rounded-3xl p-5 sm:p-6 space-y-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <a 
              href="/" 
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  navigateToRoute('1099-vs-w2', '/');
                }
              }} 
              className="hover:text-[#ff9f0a] flex items-center gap-1 transition text-inherit no-underline"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-400">Calculators</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[#ff9f0a] font-medium">{currentRoute.breadcrumbName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {currentRoute.heading}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                {currentRoute.subheading}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                {countryInfo.flag} {countryInfo.name} ({countryInfo.symbol} {countryInfo.currency})
              </span>
            </div>
          </div>
        </section>

        {/* Active Calculator Component */}
        <div id="calculator-workbench">
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
              onNavigateTab={tab => navigateToRoute(tab, ROUTES[tab]?.path)}
            />
          )}
        </div>

        {/* Google AdSense Sponsored Mid-Content Ad Slot */}
        <AdSenseBanner label="Sponsored Financial Toolkit • Google AdSense" format="auto" />

        {/* High-Converting Affiliate & Monetization Callout */}
        <div className="pt-1">
          <MonetizationCard activeTab={activeTab === 'suggestions' ? '1099-vs-w2' : activeTab} country={country} />
        </div>

        {/* In-Article Pre-FAQ Ad Slot */}
        <AdSenseBanner label="Sponsored Market Insights • Google AdSense" format="horizontal" />

        {/* Search Engine Optimization (SEO) Content & Rich FAQ Accordion with Crawlable Links */}
        <SEOContentHub 
          country={country} 
          activeTab={activeTab} 
          onNavigate={path => {
            const calc = getCalculatorFromPathname(path);
            if (calc) navigateToRoute(calc, path);
          }}
        />

      </main>

      {/* Crawlable Footer */}
      <Footer onNavigate={path => {
        const calc = getCalculatorFromPathname(path);
        if (calc) navigateToRoute(calc, path);
      }} />

      {/* Sticky Bottom Floating Anchor Ad (Mobile & Desktop Viewports) */}
      <StickyBottomAd />

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
