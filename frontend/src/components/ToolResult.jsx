const STATUS_CONFIGS = {
  redundant: {
    borderColor: 'border-red-950/45 hover:border-red-950/70',
    bgColor: 'bg-red-950/5',
    badgeColor: 'bg-red-950/30 text-red-200 border-red-900/20',
    indicatorColor: 'bg-red-800/70',
    label: 'Redundant Stack Overlap'
  },
  overpaying: {
    borderColor: 'border-amber-950/45 hover:border-amber-950/70',
    bgColor: 'bg-amber-950/5',
    badgeColor: 'bg-amber-950/30 text-amber-200 border-amber-900/20',
    indicatorColor: 'bg-amber-700/70',
    label: 'Actionable Savings'
  },
  optimal: {
    borderColor: 'border-sea-medium/30 hover:border-sea-medium/55',
    bgColor: 'bg-sea-dark/20',
    badgeColor: 'bg-sea-dark text-sea-cream border-sea-medium/30',
    indicatorColor: 'bg-sea-light',
    label: 'Fully Optimized'
  },
  'right-sized': {
    borderColor: 'border-sea-medium/20 hover:border-sea-medium/40',
    bgColor: 'bg-sea-dark/10',
    badgeColor: 'bg-sea-dark/80 text-sea-light border-sea-medium/20',
    indicatorColor: 'bg-sea-medium',
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
    reason,
    alternativeTool,
    creditsOpportunity
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
          <h4 className="text-lg font-bold text-sea-cream tracking-tight">{toolName}</h4>
          <span className="text-xs text-sea-light">· {currentPlan} Plan</span>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider border rounded-md ${config.badgeColor}`}>
          {config.label}
        </div>

      </div>

      {/* Financial Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-sea-medium/15">
        
        {/* Current State */}
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-sea-light mb-1">
            Current Spend
          </span>
          <span className="text-base font-semibold text-sea-cream">
            {formatCurrency(currentSpend)}<span className="text-xs font-normal text-sea-light/80">/mo</span>
          </span>
        </div>

        {/* Recommended State */}
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-sea-light mb-1">
            Recommended Target
          </span>
          {flag === 'redundant' ? (
            <span className="text-base font-semibold text-red-300 line-through">
              {recommendedPlan} (Drop Tool)
            </span>
          ) : (
            <span className="text-base font-semibold text-sea-cream">
              {recommendedPlan} <span className="text-xs font-normal text-sea-light/80">({formatCurrency(recommendedSpend)}/mo)</span>
            </span>
          )}
        </div>

        {/* Savings */}
        <div className="col-span-2 md:col-span-1">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-sea-light mb-1">
            Potential Savings
          </span>
          {monthlySavings > 0 ? (
            <span className="text-base font-bold text-sea-light">
              +{formatCurrency(monthlySavings)}<span className="text-xs font-normal text-sea-light/80">/mo</span>
              <span className="block text-[10px] text-sea-light font-normal">
                ({formatCurrency(annualSavings)}/yr)
              </span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-sea-light/70">
              $0 (Optimized)
            </span>
          )}
        </div>

      </div>

      {/* Audit Reasoning Text */}
      <div className="mt-4 text-sm text-sea-light leading-relaxed bg-sea-darkest/45 border border-sea-medium/15 p-3.5 rounded-lg">
        <span className="font-mono text-[9px] text-sea-light/85 block uppercase tracking-wider mb-1">Analysis:</span>
        {reason || 'No optimization recommendations applicable.'}
      </div>

      {/* Alternative Tool suggestion */}
      {alternativeTool && (
        <div className="mt-3 p-3 bg-sea-dark/30 border border-sea-medium/25 rounded-lg flex items-start gap-2.5">
          <span className="text-sm leading-none flex-shrink-0">🔄</span>
          <div className="text-xs leading-relaxed text-sea-light">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-sea-cream/80 font-bold mb-0.5">Alternative Tool Recommendation:</span>
            Switch to <strong className="text-sea-cream">{alternativeTool.name}</strong>: {alternativeTool.reason}
          </div>
        </div>
      )}

      {/* Credits Opportunity card */}
      {creditsOpportunity && (
        <div className="mt-3 p-3 bg-cyan-950/10 border border-cyan-850/30 rounded-lg flex items-start gap-2.5">
          <span className="text-sm leading-none flex-shrink-0">🎁</span>
          <div className="text-xs leading-relaxed text-cyan-200">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-cyan-300 font-bold mb-0.5">Free API Credits Opportunity:</span>
            {creditsOpportunity.reason} <strong className="text-cyan-100">Program:</strong> {creditsOpportunity.program}
          </div>
        </div>
      )}

    </div>
  );
}
