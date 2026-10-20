import React, { useState, useMemo } from 'react';
import { Landmark, AlertTriangle, ShieldCheck, TrendingUp, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { UKTaxInput, calculateUKTax } from '../../utils/ukTaxCalculations';

export const UKOptimizer: React.FC = () => {
  const [input, setInput] = useState<UKTaxInput>({
    grossSalary: 110000,
    pensionContributionPercent: 5,
    studentLoanPlan: 'plan2',
    isContractorOutsideIR35: true,
    dayRate: 600,
    workingDaysPerYear: 220,
    annualBusinessExpenses: 4500,
  });

  const breakdown = useMemo(() => {
    return calculateUKTax(input);
  }, [input]);

  const loadSalary = (amt: number) => {
    setInput(prev => ({ ...prev, grossSalary: amt }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 p-5 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              UK HMRC 2025/2026 Engine
            </span>
            <span className="text-xs text-gray-400">PAYE, NI & 60% Marginal Tax Trap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            UK Smart Tax & 60% Trap Navigator
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-1">
            Calculate exact take-home pay, student loan deductions, and avoid the infamous £100k–£125k marginal tax trap using pension salary sacrifice.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Quick Presets:</span>
          <button
            onClick={() => loadSalary(55000)}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
          >
            £55k (Higher Rate)
          </button>
          <button
            onClick={() => loadSalary(110000)}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 border border-amber-700/50 transition"
          >
            £110k (60% Tax Trap)
          </button>
          <button
            onClick={() => loadSalary(150000)}
            className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
          >
            £150k (Additional)
          </button>
        </div>
      </div>

      {/* 60% TAX TRAP WARNING BANNER IF TRIGGERED */}
      {breakdown.isTrappedIn60PercentTax && (
        <div className="bg-gradient-to-r from-amber-950/70 via-rose-950/40 to-gray-900 border-2 border-amber-500/60 p-4 sm:p-5 rounded-2xl shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ⚠️ Critical: You Are Caught in the UK 60% Marginal Tax Trap!
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            Because your adjusted income is between <strong>£100,000 and £125,140</strong>, HMRC removes £1 of your personal tax-free allowance for every £2 you earn. Combined with 40% income tax and 2% National Insurance, your true marginal tax rate is <span className="text-rose-400 font-bold font-mono">62%</span>!
          </p>
          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-300">
              💡 <strong>Salary Sacrifice Solution:</strong> Increase your pension contribution by{' '}
              <span className="text-emerald-400 font-bold">
                £{(breakdown.adjustedGross - 100000).toLocaleString()}
              </span>{' '}
              to pull your income back to £100,000. You save 62% in tax AND protect government 30h free childcare eligibility!
            </span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            UK Salary & Deductions
          </h3>

          {/* Gross Salary Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-300 font-semibold">Gross Annual Salary</label>
              <span className="text-base font-bold text-amber-400 font-mono">
                £{input.grossSalary.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={250000}
              step={2500}
              value={input.grossSalary}
              onChange={e => setInput({ ...input, grossSalary: Number(e.target.value) })}
              className="w-full accent-amber-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>£25k</span>
              <span>£100k (Trap)</span>
              <span>£250k+</span>
            </div>
          </div>

          {/* Pension Salary Sacrifice Slider */}
          <div className="pt-2 border-t border-gray-800">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-300 font-semibold">Workplace Pension (Salary Sacrifice %)</label>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {input.pensionContributionPercent}% (£{breakdown.pensionDeduction.toLocaleString()}/yr)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={input.pensionContributionPercent}
              onChange={e => setInput({ ...input, pensionContributionPercent: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Deducted pre-tax to bypass income tax and employee National Insurance.
            </p>
          </div>

          {/* Student Loan Selector */}
          <div>
            <label className="text-xs text-gray-300 block mb-1">Student Loan Repayment Plan</label>
            <select
              value={input.studentLoanPlan}
              onChange={e => setInput({ ...input, studentLoanPlan: e.target.value as any })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="none">No Student Loan (0%)</option>
              <option value="plan1">Plan 1 (9% over £24,990)</option>
              <option value="plan2">Plan 2 (9% over £27,295 - Post 2012)</option>
              <option value="plan4">Plan 4 (Scotland - 9% over £31,395)</option>
              <option value="plan5">Plan 5 (Post 2023 - 9% over £25,000)</option>
              <option value="postgrad">Postgraduate Loan (6% over £21,000)</option>
            </select>
          </div>

          {/* Outside IR35 Contractor Toggle */}
          <div className="pt-3 border-t border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-200">Compare with Outside IR35 Contractor</label>
              <input
                type="checkbox"
                checked={input.isContractorOutsideIR35}
                onChange={e => setInput({ ...input, isContractorOutsideIR35: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {input.isContractorOutsideIR35 && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Contract Day Rate (£)</label>
                  <input
                    type="number"
                    value={input.dayRate}
                    onChange={e => setInput({ ...input, dayRate: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Working Days / Year</label>
                  <input
                    type="number"
                    value={input.workingDaysPerYear}
                    onChange={e => setInput({ ...input, workingDaysPerYear: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Take-Home Breakdown & Contractor Comparison */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* PAYE TAKE HOME SUMMARY */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-gray-900 border-2 border-emerald-500/40 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                Net Annual Take-Home
              </span>
              <span className="text-xs text-gray-300 font-mono">
                Marginal Rate: {breakdown.marginalTaxRate}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <span className="text-xs text-gray-400 block">Monthly in Your Bank Account</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  £{breakdown.netMonthlyTakeHome.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400">/mo</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Annual Net Pay</span>
                <div className="text-2xl font-bold text-emerald-300 font-mono">
                  £{breakdown.netAnnualTakeHome.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400">/yr</span>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-800 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">Income Tax:</span>
                <span className="font-mono text-rose-400 font-bold">-£{breakdown.incomeTax.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">National Insurance:</span>
                <span className="font-mono text-rose-400 font-bold">-£{breakdown.nationalInsurance.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Student Loan:</span>
                <span className="font-mono text-rose-400 font-bold">-£{breakdown.studentLoanDeduction.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Pension In Pot:</span>
                <span className="font-mono text-emerald-400 font-bold">+£{breakdown.pensionDeduction.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* OUTSIDE IR35 CONTRACTOR COMPARISON */}
          {input.isContractorOutsideIR35 && (
            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Outside IR35 Contractor Model (£{input.dayRate}/day)
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Total Turnover: £{breakdown.contractorGrossRevenue?.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/60">
                  <span className="text-gray-400 block mb-1">Contractor Net Take-Home (Dividends):</span>
                  <span className="text-xl font-bold text-white font-mono">
                    £{breakdown.contractorNetTakeHome?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    (~£{Math.round((breakdown.contractorNetTakeHome || 0) / 12).toLocaleString()}/month)
                  </span>
                </div>

                <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/60">
                  <span className="text-gray-400 block mb-1">Net Advantage vs PAYE:</span>
                  <span className={`text-xl font-bold font-mono ${
                    (breakdown.contractorAdvantage || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {(breakdown.contractorAdvantage || 0) >= 0 ? '+' : ''}£{(breakdown.contractorAdvantage || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Extra cash kept per year via Ltd Company
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
