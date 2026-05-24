import React from 'react';
import SavingsHero from './SavingsHero';
import ToolResult from './ToolResult';
import EmailGate from './EmailGate';

export default function AuditResults({ auditResult, teamSize, auditData, onBackToForm, publicUrlId }) {
  const { perTool, totalMonthlySavings, totalAnnualSavings } = auditResult;
  const isHighSavings = totalMonthlySavings > 500;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 relative z-10">
      
      {/* Back button and title */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60">
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Adjust Stack configuration
        </button>
        <span className="text-xs text-zinc-500 font-medium">
          Audited for {teamSize} seat{teamSize > 1 ? 's' : ''}
        </span>
      </div>

      {/* Savings Summary Banner */}
      <SavingsHero
        monthlySavings={totalMonthlySavings}
        annualSavings={totalAnnualSavings}
      />

      {/* Credex CTA (substantial savings) */}
      {isHighSavings && (
        <div className="relative overflow-hidden p-6 bg-zinc-900/40 border border-zinc-700/40 rounded-2xl glass-card text-center space-y-4">
          <div className="absolute inset-0 bg-white/[0.02] blur-xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              You're leaving ${totalMonthlySavings}/mo on the table
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Credex sells the exact AI tools you need at up to 40% off retail. Book a free 15-minute consultation to optimize your team's spend and consolidate billing.
            </p>
            <div className="pt-2">
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
              >
                Talk to Credex →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tool results grid/list */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
          Detailed Analysis by Tool
        </h3>
        <div className="space-y-4">
          {perTool.map((toolResult) => (
            <ToolResult key={toolResult.toolKey} result={toolResult} />
          ))}
        </div>
      </div>

      {/* Email Gate lead capture container */}
      <div className="pt-8 border-t border-zinc-800/60">
        <EmailGate
          totalSavings={totalMonthlySavings}
          teamSize={teamSize}
          auditData={auditData}
          publicUrlId={publicUrlId}
        />
      </div>

    </div>
  );
}
