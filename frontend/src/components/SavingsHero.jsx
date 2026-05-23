import React from 'react';

export default function SavingsHero({ monthlySavings, annualSavings }) {
  const isOptimal = monthlySavings < 100;
  const isHighSavings = monthlySavings > 500;

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(monthlySavings);

  const formattedAnnual = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(annualSavings);

  return (
    <div className="relative overflow-hidden p-8 md:p-12 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-center glass-card space-y-4">
      {/* Glow highlight behind savings */}
      {monthlySavings >= 100 && (
        <div className="ambient-glow-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110" />
      )}

      <div className="relative z-10 space-y-2">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Estimated Savings Opportunity
        </h3>

        {isOptimal ? (
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-extrabold text-zinc-300">
              {formattedMonthly} <span className="text-lg font-medium text-zinc-500">/mo</span>
            </div>
            <p className="text-emerald-400 font-medium tracking-wide">
              🎉 Your AI stack looks well-optimized.
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              You are running an efficient setup with minimal redundant software tiers. Excellent work keeping overhead low!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-5xl md:text-7xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              {formattedMonthly}
              <span className="text-xl md:text-2xl font-semibold text-zinc-500 ml-1">/month</span>
            </div>
            <div className="text-sm md:text-base text-zinc-400 font-medium">
              Save up to <span className="text-emerald-300 font-bold">{formattedAnnual}</span> per year
            </div>
            <p className="text-zinc-400 font-semibold tracking-wide pt-1">
              {isHighSavings 
                ? '⚠️ Critical optimization potential detected!'
                : '💡 Moderate savings opportunity found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
