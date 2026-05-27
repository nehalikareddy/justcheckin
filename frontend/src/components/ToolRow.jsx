import { AI_PRICING } from '../pricingData';
import { TOOL_NAMES } from '../auditEngine';

export default function ToolRow({ toolKey, toolData, onChange, onRemove }) {
  const plans = AI_PRICING[toolKey] ? Object.keys(AI_PRICING[toolKey]) : [];
  const displayName = TOOL_NAMES[toolKey] || toolKey;

  const handlePlanChange = (e) => {
    const nextPlan = e.target.value;
    const planPrice = AI_PRICING[toolKey][nextPlan] || 0;
    const nextSpend = toolData.isCustomSpend ? toolData.monthlySpend : planPrice * (toolData.seats || 1);
    onChange({ ...toolData, plan: nextPlan, monthlySpend: nextSpend });
  };

  const handleSeatsChange = (e) => {
    const val = e.target.value;
    const nextSeats = val === '' ? '' : Math.max(1, parseInt(val, 10) || 1);
    const planPrice = AI_PRICING[toolKey][toolData.plan] || 0;
    const nextSpend = toolData.isCustomSpend ? toolData.monthlySpend : planPrice * (nextSeats || 1);
    onChange({ ...toolData, seats: nextSeats, monthlySpend: nextSpend });
  };

  const handleSpendChange = (e) => {
    const val = e.target.value;
    const nextSpend = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    onChange({ ...toolData, monthlySpend: nextSpend, isCustomSpend: val !== '' });
  };

  const resetSpendToAuto = () => {
    const planPrice = AI_PRICING[toolKey][toolData.plan] || 0;
    onChange({ ...toolData, monthlySpend: planPrice * (toolData.seats || 1), isCustomSpend: false });
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const unitPrice = AI_PRICING[toolKey]?.[toolData.plan] ?? 0;

  return (
    <div className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-sea-dark/25 transition-colors border-b border-sea-medium/15 last:border-b-0">
      
      {/* Tool Name + Plan */}
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-sea-cream leading-tight truncate">
          {displayName}
        </span>
        <select
          value={toolData.plan}
          onChange={handlePlanChange}
          className="bg-transparent border-0 p-0 mt-0.5 text-xs text-sea-light/80 font-medium focus:ring-0 focus:outline-none cursor-pointer hover:text-sea-cream transition-colors font-sans"
        >
          {plans.map((p) => (
            <option key={p} value={p} className="bg-sea-darkest text-sea-cream text-xs">
              {capitalize(p)} · ${AI_PRICING[toolKey][p]}/mo
            </option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-sea-light hidden sm:block">Seats</span>
        <div className="flex items-center gap-0.5 bg-sea-darkest border border-sea-medium/30 rounded-lg px-1 h-8">
          <button
            type="button"
            onClick={() => handleSeatsChange({ target: { value: Math.max(1, (toolData.seats || 1) - 1) } })}
            className="w-6 h-6 flex items-center justify-center rounded text-sea-light hover:text-sea-cream hover:bg-sea-dark transition-colors text-sm font-bold cursor-pointer select-none"
          >−</button>
          <span className="w-7 text-center text-sm font-mono font-semibold text-sea-cream select-none">{toolData.seats}</span>
          <button
            type="button"
            onClick={() => handleSeatsChange({ target: { value: (toolData.seats || 1) + 1 } })}
            className="w-6 h-6 flex items-center justify-center rounded text-sea-light hover:text-sea-cream hover:bg-sea-dark transition-colors text-sm font-bold cursor-pointer select-none"
          >+</button>
        </div>
      </div>

      {/* Spend */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-sea-darkest border border-sea-medium/30 rounded-lg px-2 h-8 gap-1">
          <span className="text-xs font-mono text-sea-light/70">$</span>
          <input
            type="number"
            min="0"
            step="any"
            value={toolData.monthlySpend}
            onChange={handleSpendChange}
            placeholder={`${unitPrice * (toolData.seats || 1)}`}
            className="w-14 bg-transparent border-0 p-0 text-sm font-mono text-sea-cream focus:ring-0 focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        {toolData.isCustomSpend && (
          <button
            type="button"
            onClick={resetSpendToAuto}
            className="text-[10px] text-sea-light hover:text-sea-cream font-mono uppercase cursor-pointer"
            title="Reset to auto"
          >Auto</button>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-sea-medium hover:text-red-400 transition-all rounded-lg cursor-pointer opacity-0 group-hover:opacity-100"
        title="Remove"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

    </div>
  );
}
