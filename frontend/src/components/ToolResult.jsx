import React from 'react';

const STATUS_CONFIGS = {
  redundant: {
    borderColor: 'border-red-500/30 hover:border-red-500/50',
    bgColor: 'bg-red-500/5',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    indicatorColor: 'bg-red-500',
    label: 'Redundant Stack Overlap'
  },
  overpaying: {
    borderColor: 'border-amber-500/30 hover:border-amber-500/50',
    bgColor: 'bg-amber-500/5',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    indicatorColor: 'bg-amber-500',
    label: 'Actionable Savings'
  },
  optimal: {
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/50',
    bgColor: 'bg-emerald-500/5',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indicatorColor: 'bg-emerald-500',
    label: 'Fully Optimized'
  },
  'right-sized': {
    borderColor: 'border-zinc-800 hover:border-zinc-700',
    bgColor: 'bg-zinc-900/30',
    badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
    indicatorColor: 'bg-zinc-500',
    label: 'Optimized'
  }
};

export default function ToolResult({ result }) {
  const {
    toolName,
    currentPlan,
    currentSpend,
    recommendedPlan,
    recommendedSpend,
    monthlySavings,
    annualSavings,
    flag,
    reason
  } = result;

  const config = STATUS_CONFIGS[flag] || STATUS_CONFIGS['right-sized'];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={`relative p-6 border rounded-xl transition-all duration-300 ${config.borderColor} ${config.bgColor}`}>
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        
        {/* Title and Plan */}
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${config.indicatorColor} flex-shrink-0`} />
          <h4 className="text-lg font-bold text-white tracking-tight">{toolName}</h4>
          <span className="text-xs text-zinc-500">· {currentPlan} Plan</span>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider border rounded-md ${config.badgeColor}`}>
          {config.label}
        </div>

      </div>

      {/* Financial Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-zinc-800/40">
        
        {/* Current State */}
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
            Current Spend
          </span>
          <span className="text-base font-semibold text-zinc-300">
            {formatCurrency(currentSpend)}<span className="text-xs font-normal text-zinc-500">/mo</span>
          </span>
        </div>

        {/* Recommended State */}
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
            Recommended Target
          </span>
          {flag === 'redundant' ? (
            <span className="text-base font-semibold text-red-400 line-through">
              {recommendedPlan} (Drop Tool)
            </span>
          ) : (
            <span className="text-base font-semibold text-zinc-300">
              {recommendedPlan} <span className="text-xs font-normal text-zinc-500">({formatCurrency(recommendedSpend)}/mo)</span>
            </span>
          )}
        </div>

        {/* Savings */}
        <div className="col-span-2 md:col-span-1">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
            Potential Savings
          </span>
          {monthlySavings > 0 ? (
            <span className="text-base font-bold text-emerald-400">
              +{formatCurrency(monthlySavings)}<span className="text-xs font-normal text-zinc-500">/mo</span>
              <span className="block text-[10px] text-zinc-500 font-normal">
                ({formatCurrency(annualSavings)}/yr)
              </span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-zinc-500">
              $0 (Optimized)
            </span>
          )}
        </div>

      </div>

      {/* Audit Reasoning Text */}
      <div className="mt-4 text-sm text-zinc-400 leading-relaxed bg-zinc-950/40 border border-zinc-800/30 p-3.5 rounded-lg">
        <span className="font-mono text-[9px] text-zinc-500 block uppercase tracking-wider mb-1">Analysis:</span>
        {reason || 'No optimization recommendations applicable.'}
      </div>

    </div>
  );
}
