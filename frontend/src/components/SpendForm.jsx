import { useState } from 'react';
import { AI_PRICING, USE_CASES } from '../pricingData';
import { TOOL_NAMES } from '../auditEngine';
import ToolRow from './ToolRow';

const DEFAULT_PLANS = {
  cursor: 'pro',
  githubCopilot: 'business',
  claude: 'pro',
  chatgpt: 'team',
  anthropicApiDirect: 'apiDirect',
  openaiApiDirect: 'apiDirect',
  gemini: 'pro',
  windsurf: 'pro'
};

const LOGO_MAP = {
  cursor: (
    <svg className="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5.5 3l13 9.5-6.5 1.5 5 7-2 1.5-5.5-7-4 3V3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  githubCopilot: (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a5 5 0 0 0-5 5v4a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
      <path d="M17 11.5a5 5 0 0 1-10 0" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="14" width="20" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  claude: (
    <svg className="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chatgpt: (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  anthropicApiDirect: (
    <svg className="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  openaiApiDirect: (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  gemini: (
    <svg className="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  windsurf: (
    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export default function SpendForm({ formData, setFormData, onSubmit }) {
  const [errors, setErrors] = useState({});

  const handleTeamSizeChange = (e) => {
    const val = e.target.value;
    const nextSize = val === '' ? '' : Math.max(1, parseInt(val, 10) || 1);

    // Sync non-custom seats across tools if team size changes
    const updatedTools = formData.tools.map((t) => {
      if (!t.isCustomSeats && (t.seats === formData.teamSize || t.seats === '')) {
        const planPrice = AI_PRICING[t.toolKey][t.plan] || 0;
        return {
          ...t,
          seats: nextSize,
          monthlySpend: t.isCustomSpend ? t.monthlySpend : planPrice * (nextSize || 1)
        };
      }
      return t;
    });

    setFormData({
      ...formData,
      teamSize: nextSize,
      tools: updatedTools
    });

    if (errors.teamSize) {
      setErrors((prev) => ({ ...prev, teamSize: null }));
    }
  };

  const handleUseCaseChange = (e) => {
    setFormData({
      ...formData,
      useCase: e.target.value
    });
  };

  const toggleTool = (toolKey) => {
    const isSelected = formData.tools.some((t) => t.toolKey === toolKey);
    let nextTools;

    if (isSelected) {
      nextTools = formData.tools.filter((t) => t.toolKey !== toolKey);
    } else {
      const plan = DEFAULT_PLANS[toolKey];
      const seats = formData.teamSize || 1;
      const planPrice = AI_PRICING[toolKey][plan] || 0;
      nextTools = [
        ...formData.tools,
        {
          toolKey,
          plan,
          seats,
          monthlySpend: planPrice * seats,
          isCustomSpend: false,
          isCustomSeats: false
        }
      ];
    }

    setFormData({
      ...formData,
      tools: nextTools
    });

    if (errors.tools) {
      setErrors((prev) => ({ ...prev, tools: null }));
    }
  };

  const handleToolRowChange = (toolKey, updatedToolData) => {
    const nextTools = formData.tools.map((t) => {
      if (t.toolKey === toolKey) {
        const isCustomSeats = updatedToolData.seats !== formData.teamSize;
        return {
          ...updatedToolData,
          isCustomSeats
        };
      }
      return t;
    });

    setFormData({
      ...formData,
      tools: nextTools
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.teamSize) {
      newErrors.teamSize = 'Team size is required';
    } else if (formData.teamSize < 1 || formData.teamSize > 500) {
      newErrors.teamSize = 'Team size must be between 1 and 500';
    }

    if (formData.tools.length === 0) {
      newErrors.tools = 'Please select at least one AI tool from your stack';
    }

    formData.tools.forEach((t) => {
      if (!t.seats || t.seats < 1) {
        newErrors[`seats_${t.toolKey}`] = 'Seats must be at least 1';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };
  const getPreAuditFlags = () => {
    const flags = [];
    const toolKeys = formData.tools.map(t => t.toolKey);
    const hasCursor = toolKeys.includes('cursor');
    const hasCopilot = toolKeys.includes('githubCopilot');
    const hasWindsurf = toolKeys.includes('windsurf');
    
    // Check overlaps
    if (hasCursor && hasCopilot) {
      flags.push({
        type: 'overlap',
        severity: 'danger',
        message: 'GitHub Copilot is highly redundant alongside Cursor\'s built-in autocompletion.'
      });
    }
    if (hasCursor && hasWindsurf) {
      flags.push({
        type: 'overlap',
        severity: 'danger',
        message: 'Cursor & Windsurf are competing AI editors. Keep only one to optimize spend.'
      });
    }
    if (hasCopilot && hasWindsurf) {
      flags.push({
        type: 'overlap',
        severity: 'danger',
        message: 'GitHub Copilot has overlapping autocomplete logic with Windsurf editor.'
      });
    }
    
    const hasClaude = toolKeys.includes('claude');
    const hasChatGPT = toolKeys.includes('chatgpt');
    if (hasClaude && hasChatGPT) {
      flags.push({
        type: 'overlap',
        severity: 'warning',
        message: 'Running both Claude & ChatGPT Plus leads to duplicate writing/research licenses.'
      });
    }

    // Check seats mismatch
    if (formData.teamSize !== '') {
      formData.tools.forEach(t => {
        if (t.seats > formData.teamSize) {
          flags.push({
            type: 'seats',
            severity: 'warning',
            message: `${TOOL_NAMES[t.toolKey] || t.toolKey}: Extra seats (${t.seats}) exceed team size (${formData.teamSize}).`
          });
        }
      });
    }

    // Check tier overkill
    if (formData.teamSize !== '' && formData.teamSize <= 3) {
      const overkillTools = formData.tools.filter(t => ['business', 'enterprise', 'team'].includes(t.plan));
      if (overkillTools.length > 0) {
        flags.push({
          type: 'tier',
          severity: 'warning',
          message: 'Tier Overkill: Small teams (≤3) rarely need expensive corporate accounts.'
        });
      }
    }

    if (flags.length === 0 && toolKeys.length > 0) {
      flags.push({
        type: 'optimal',
        severity: 'success',
        message: 'Stack parameters look clean. Run audit report to check pricing arbitrage.'
      });
    }

    return flags;
  };

  const totalCost = formData.tools.reduce((acc, t) => acc + (parseFloat(t.monthlySpend) || 0), 0);
  const selectedCount = formData.tools.length;  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[1600px] mx-auto px-4 md:px-6 pt-2 pb-6 space-y-6 relative z-10">
      
      {/* Subtle ambient glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-sea-medium/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-12 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-sea-light/[0.015] blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sea-medium/20 pb-4 mb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sea-dark border border-sea-medium/30 text-sea-light text-[9px] font-mono uppercase tracking-wider mb-1">
            Interactive Stack Console
          </div>
          <h2 className="text-xl font-bold text-sea-cream tracking-tight">Configure Your AI Developer Stack</h2>
        </div>
        <p className="text-xs text-sea-light max-w-md md:text-right leading-relaxed">
          Configure your team parameters and software tiers below. The dashboard computes live metrics and potential optimizations on the fly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: Configuration & Selection */}
        <div className="lg:col-span-3 space-y-5">
          {/* Team Setup */}
          <div className="space-y-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sea-cream/90 font-bold">
              01. Team Setup
            </label>
            <div className="space-y-4 bg-sea-dark/35 border border-sea-medium/20 p-4 rounded-xl glass-card">
              {/* Team Size */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-sea-light mb-1.5">
                  Team Size (1-500)
                </label>
                <div className={`flex items-center bg-sea-darkest border rounded-xl px-2 py-1 focus-within:border-sea-light/50 focus-within:shadow-[0_0_12px_rgba(119,141,169,0.05)] transition-all ${
                  errors.teamSize ? 'border-red-500/60' : 'border-sea-medium/35'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = Math.max(1, (parseInt(formData.teamSize, 10) || 1) - 1);
                      handleTeamSizeChange({ target: { value: nextVal } });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-sea-dark border border-sea-medium/30 text-sea-light hover:text-sea-cream hover:border-sea-medium active:scale-95 transition-all text-xs font-semibold select-none cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.teamSize}
                    onChange={handleTeamSizeChange}
                    placeholder="e.g. 10"
                    className="flex-1 bg-transparent border-0 px-2 text-center text-xs font-semibold text-sea-cream focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = Math.min(500, (parseInt(formData.teamSize, 10) || 0) + 1);
                      handleTeamSizeChange({ target: { value: nextVal } });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-sea-dark border border-sea-medium/30 text-sea-light hover:text-sea-cream hover:border-sea-medium active:scale-95 transition-all text-xs font-semibold select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {errors.teamSize && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.teamSize}
                  </p>
                )}
              </div>

              {/* Use Case */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-sea-light mb-1.5">
                  AI Use Case
                </label>
                <div className="relative">
                  <select
                    value={formData.useCase}
                    onChange={handleUseCaseChange}
                    className="w-full px-3 py-2 pr-8 bg-sea-darkest border border-sea-medium/35 rounded-xl text-sea-cream focus:outline-none focus:border-sea-light/50 focus:shadow-[0_0_12px_rgba(119,141,169,0.05)] transition-all appearance-none cursor-pointer text-xs font-semibold"
                  >
                    {USE_CASES.map((uc) => (
                      <option key={uc} value={uc} className="bg-sea-darkest text-sea-cream text-xs">
                        {uc.charAt(0).toUpperCase() + uc.slice(1)} Focused
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-sea-light/70">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Select Tools */}
          <div className="space-y-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sea-cream/90 font-bold">
              02. Select Tools
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.keys(TOOL_NAMES).map((toolKey) => {
                const isSelected = formData.tools.some((t) => t.toolKey === toolKey);
                return (
                  <button
                    key={toolKey}
                    type="button"
                    onClick={() => toggleTool(toolKey)}
                    className={`flex items-center gap-2 p-2 border rounded-xl transition-all duration-200 select-none cursor-pointer text-left w-full ${
                      isSelected
                        ? 'bg-sea-dark border-sea-light text-sea-cream shadow-[0_4px_12px_rgba(13,27,42,0.4)] scale-[1.01]'
                        : 'bg-sea-dark/30 border-sea-medium/40 text-sea-cream/85 hover:border-sea-medium hover:text-sea-cream hover:scale-[1.005] active:scale-[0.99]'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors flex-shrink-0 ${
                      isSelected ? 'bg-sea-darkest border-sea-medium/35' : 'bg-sea-dark border-sea-medium/20'
                    }`}>
                      {LOGO_MAP[toolKey]}
                    </div>
                    <span className="text-[10px] font-semibold leading-none truncate flex-1 ml-1 font-sans">
                      {TOOL_NAMES[toolKey]}
                    </span>
                    
                    <div className="flex-shrink-0">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sea-light animate-pulse' : 'bg-transparent'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.tools && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {errors.tools}
              </p>
            )}
          </div>
        </div>

        {/* COLUMN 2: Tool Configuration Rows */}
        <div className="lg:col-span-5 lg:border-l lg:border-r lg:border-sea-medium/20 lg:px-6 space-y-4 flex flex-col justify-start">
          <div className="space-y-4 flex-1 flex flex-col">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-sea-cream/90 font-bold">
              03. Active Stack Details
            </label>
            
            {formData.tools.length > 0 ? (
              <div className="space-y-2 flex-1 flex flex-col">
                {/* Column headers */}
                <div className="flex items-center gap-4 px-4 pb-2 text-[10px] font-mono uppercase tracking-widest text-sea-light/75">
                  <span className="flex-1">Tool & Tier</span>
                  <span className="w-[100px] text-center">Seats</span>
                  <span className="w-[110px] text-right">Stated Spend</span>
                  <span className="w-[28px]"></span>
                </div>
                {/* Rows */}
                <div className="bg-sea-darkest/60 border border-sea-medium/25 rounded-2xl divide-y divide-sea-medium/15 overflow-hidden">
                  {formData.tools.map((tool) => (
                    <div key={tool.toolKey} className="transition-all duration-200 hover:bg-sea-dark/20">
                      <ToolRow
                        toolKey={tool.toolKey}
                        toolData={tool}
                        onChange={(updatedData) => handleToolRowChange(tool.toolKey, updatedData)}
                        onRemove={() => toggleTool(tool.toolKey)}
                      />
                      {errors[`seats_${tool.toolKey}`] && (
                        <p className="pb-2 text-[10px] text-red-400 px-4 flex items-center gap-1 font-semibold">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                          {errors[`seats_${tool.toolKey}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-sea-medium/25 rounded-2xl bg-sea-dark/5 text-center p-6 space-y-3 my-auto">
                <div className="w-12 h-12 rounded-xl bg-sea-dark border border-sea-medium/30 flex items-center justify-center text-sea-light">
                  <svg className="w-6 h-6 text-sea-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sea-cream">No active tools configured</h4>
                  <p className="text-xs text-sea-light max-w-xs mx-auto mt-1 leading-relaxed">
                    Select AI developer tools on the left panel to customize seats, plans, and monthly costs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Cost Summary & Quick Insights */}
        <div className="lg:col-span-4 space-y-5">
          <label className="block font-mono text-[10px] uppercase tracking-wider text-sea-cream/90 font-bold">
            04. Live Analytics
          </label>
          
          <div className="bg-sea-darkest/65 border border-sea-medium/20 p-5 rounded-2xl glass-card space-y-5 flex flex-col justify-between h-[calc(100%-25px)]">
            <div className="space-y-5">
              {/* Spend Meter */}
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-sea-light mb-1">Live Estimated Spend</span>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-sea-cream tracking-tight">
                  ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}<span className="text-base font-normal text-sea-light font-sans ml-0.5">/mo</span>
                </div>
                <span className="block text-[11px] text-sea-light/80 mt-1 font-medium">
                  Annualized Run Rate: ${ (totalCost * 12).toLocaleString('en-US', { maximumFractionDigits: 0 }) }/yr
                </span>
              </div>

              {/* Live Scanner (Studio Panel) */}
              <div className="border-t border-sea-medium/20 pt-4 space-y-3">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-sea-light font-bold">Live Stack Scanner</span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {getPreAuditFlags().map((flag, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2.5 ${
                      flag.severity === 'danger' ? 'bg-red-500/5 border-red-500/20 text-red-300' :
                      flag.severity === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300' :
                      'bg-sea-dark/50 border border-sea-medium/40 text-sea-light'
                    }`}>
                      <span className="text-sm leading-none flex-shrink-0">
                        {flag.severity === 'danger' ? '🔴' : flag.severity === 'warning' ? '🟡' : '🟢'}
                      </span>
                      <span>{flag.message}</span>
                    </div>
                  ))}
                  {selectedCount === 0 && (
                    <p className="text-xs text-sea-light/75 italic font-medium">Select tools to initiate live stack scanning.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="border-t border-sea-medium/20 pt-4 mt-auto">
              <button
                type="submit"
                className="w-full py-3.5 font-bold text-sea-darkest bg-sea-cream hover:bg-white border border-sea-cream/25 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_15px_rgba(141,169,224,0.15)] active:scale-[0.98] text-sm cursor-pointer"
              >
                Generate Audit Report →
              </button>
            </div>
          </div>
        </div>

      </div>

    </form>
  );
}
