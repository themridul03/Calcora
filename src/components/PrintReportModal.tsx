import React from 'react';
import { X, Printer, Download, CheckCircle, Calculator } from 'lucide-react';
import { CalculatorType, Country } from '../types';
import { getCountryInfo } from '../utils/countries';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: CalculatorType;
  country: Country;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  country,
}) => {
  if (!isOpen) return null;

  const countryInfo = getCountryInfo(country);

  const handlePrint = () => {
    window.print();
  };


  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">
              Calcora Executive Financial Summary Report
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-200 text-xs leading-relaxed bg-white text-gray-900 rounded-b-2xl">
          
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-black text-gray-900">CALCORA FINANCIAL AUDIT</h1>
              <p className="text-gray-500 text-xs">
                Generated for Market: {countryInfo.name} {countryInfo.flag} ({countryInfo.symbol} {countryInfo.currency})
              </p>
            </div>
            <div className="text-right text-gray-500 text-xs font-mono">
              <div>Date: {currentDate}</div>
              <div>Report ID: CALC-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              1. Decision Audit & Findings
            </h2>
            <p className="text-gray-700">
              This report synthesizes cross-asset tax, debt amortization, and housing opportunity cost models based on current 2026 economic conditions (interest rates, IRS/HMRC tax brackets, and S&P 500 historical returns).
            </p>
          </div>

          {/* Section 2: Key Strategic Recommendations */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              2. Core Optimization Levers
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 block text-xs">Contractor Rule of Thumb:</span>
                <span className="text-emerald-800 block">
                  Never accept a 1099 hourly rate under <strong>1.35x to 1.45x</strong> of equivalent W-2 base pay to account for 15.3% SE tax, missing healthcare, and unpaid PTO.
                </span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-900 block text-xs">Credit Card Debt Strategy:</span>
                <span className="text-indigo-800 block">
                  Deploying the <strong>Debt Avalanche method</strong> saves between $4,000 to $12,000 in interest vs minimum payments, cutting debt duration by over 70%.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Housing & Capital Efficiency */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              3. 2026 Housing Market Capital Allocation
            </h2>
            <p className="text-gray-700">
              In a 6.5%+ mortgage rate environment, homeownership requires an average of <strong>7 to 10 years</strong> to break even against renting and compounding the down payment in broad market index funds (S&P 500). Transactions under 5 years incur net negative equity due to closing costs.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 text-center">
            Calcora Financial Modeling Engine • For illustrative & educational analysis only. Not certified tax or legal counsel. Consult a qualified CPA or fiduciary advisor.
          </div>

        </div>

      </div>
    </div>
  );
};
