import React, { useState } from 'react';
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

  const totalCost = formData.tools.reduce((acc, t) => acc + (parseFloat(t.monthlySpend) || 0), 0);
  const selectedCount = formData.tools.length;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto px-4 pt-2 pb-6 space-y-6 relative z-10">
      
      {/* Subtle ambient glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-12 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-emerald-400/[0.02] blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-1.5 border-b border-zinc-900 pb-4 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
          Step 1: Scope & Spend
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Configure Your Stack</h2>
          <span className="hidden sm:inline text-zinc-800">|</span>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
            Set up your team details, select your tools, and refine your stack spend in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-5">
          {/* Team Setup */}
          <div className="space-y-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              01. Team Setup
            </label>
            <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl glass-card">
              {/* Team Size */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500 mb-1.5">
                  Team Size (1-500)
                </label>
                <div className={`flex items-center bg-zinc-950/80 border rounded-xl px-2 py-1 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_15px_rgba(52,211,153,0.1)] transition-all ${
                  errors.teamSize ? 'border-red-500/60' : 'border-zinc-800'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = Math.max(1, (parseInt(formData.teamSize, 10) || 1) - 1);
                      handleTeamSizeChange({ target: { value: nextVal } });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all text-xs font-semibold select-none cursor-pointer"
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
                    className="flex-1 bg-transparent border-0 px-2 text-center text-xs font-semibold text-zinc-200 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = Math.min(500, (parseInt(formData.teamSize, 10) || 0) + 1);
                      handleTeamSizeChange({ target: { value: nextVal } });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-95 transition-all text-xs font-semibold select-none cursor-pointer"
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
                <label className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500 mb-1.5">
                  AI Use Case
                </label>
                <div className="relative">
                  <select
                    value={formData.useCase}
                    onChange={handleUseCaseChange}
                    className="w-full px-3 py-2 pr-8 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(52,211,153,0.1)] transition-all appearance-none cursor-pointer text-xs font-semibold"
                  >
                    {USE_CASES.map((uc) => (
                      <option key={uc} value={uc} className="bg-zinc-950 text-zinc-250 text-xs">
                        {uc.charAt(0).toUpperCase() + uc.slice(1)} Focused
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
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
            <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
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
                    className={`flex items-center gap-2.5 p-2.5 px-3 border rounded-xl transition-all duration-200 select-none cursor-pointer text-left w-full ${
                      isSelected
                        ? 'bg-zinc-900/90 border-emerald-500/50 text-white shadow-[0_0_12px_rgba(52,211,153,0.08)] scale-[1.01]'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200 hover:scale-[1.005] active:scale-[0.99]'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors flex-shrink-0 ${
                      isSelected ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'
                    }`}>
                      {LOGO_MAP[toolKey]}
                    </div>
                    <span className="text-[11px] font-semibold leading-none truncate flex-1">
                      {TOOL_NAMES[toolKey]}
                    </span>
                    
                    <div className="flex-shrink-0">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-transparent'}`} />
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

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 lg:border-l lg:border-zinc-900 lg:pl-8 space-y-4">
          <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            03. Stack Spend & Estimates
          </label>
          
          <div className="bg-zinc-950/60 border border-zinc-850 p-5 rounded-2xl glass-card space-y-5">
            {/* Live Cost Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div>
                <h3 className="text-xs font-semibold text-zinc-300 tracking-tight">
                  {selectedCount} {selectedCount === 1 ? 'Tool' : 'Tools'} Configured
                </h3>
              </div>
              <div className="text-right">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-500">Live Estimates</span>
                <div className="text-base font-mono font-bold text-emerald-400">
                  ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                </div>
              </div>
            </div>

            {/* Tool list */}
            {formData.tools.length > 0 ? (
              <div>
                {/* Column headers */}
                <div className="flex items-center gap-4 px-4 pb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                  <span className="flex-1">Tool</span>
                  <span className="w-[100px] text-center">Seats</span>
                  <span className="w-[100px] text-right">Spend</span>
                  <span className="w-[28px]"></span>
                </div>
                {/* Rows */}
                <div className="divide-y-0">
                  {formData.tools.map((tool) => (
                    <div key={tool.toolKey}>
                      <ToolRow
                        toolKey={tool.toolKey}
                        toolData={tool}
                        onChange={(updatedData) => handleToolRowChange(tool.toolKey, updatedData)}
                        onRemove={() => toggleTool(tool.toolKey)}
                      />
                      {errors[`seats_${tool.toolKey}`] && (
                        <p className="mt-0.5 text-xs text-red-400 px-4 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                          {errors[`seats_${tool.toolKey}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10 text-center">
                <svg className="w-6 h-6 text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-sm text-zinc-500">
                  Select tools on the left to get started
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 font-bold text-zinc-950 bg-emerald-400 rounded-xl transition-all duration-300 hover:bg-emerald-300 hover:scale-102 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-98 text-sm cursor-pointer"
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
