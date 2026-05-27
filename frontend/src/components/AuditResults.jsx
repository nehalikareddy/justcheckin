import { useState, useEffect } from 'react';
import SavingsHero from './SavingsHero';
import ToolResult from './ToolResult';
import EmailGate from './EmailGate';

export default function AuditResults({ auditResult, teamSize, auditData, onBackToForm, publicUrlId }) {
  const { perTool, totalMonthlySavings, totalAnnualSavings } = auditResult;
  const isHighSavings = totalMonthlySavings > 500;

  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditData: auditResult, publicUrlId })
    })
    .then(r => {
      if (!r.ok) throw new Error('API server returned error');
      return r.json();
    })
    .then(data => {
      setSummary(data.summary);
      setSummaryLoading(false);
    })
    .catch((err) => {
      console.error("Failed to generate AI summary:", err);
      const savings = totalMonthlySavings || 0;
      const fallbackText = savings > 0
        ? `Your audit identified $${savings}/month in potential savings across your AI tool stack. The largest opportunity is switching over-provisioned team plans to individual tiers — a common pattern for teams under 10. Redundant tools are also costing you more than necessary. Start by cancelling the lowest-value subscription and reallocating that budget to the tools your team uses daily.`
        : `Your AI tool spend looks well-optimized for your team size and use case. You're on appropriately sized plans with no obvious redundancies. Keep an eye on seat counts as your team grows — the transition from individual to team tiers can catch you guard if you add headcount quickly.`;
      setSummary(fallbackText);
      setSummaryLoading(false);
    });
  }, [auditResult, publicUrlId, totalMonthlySavings]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 relative z-10">
      
      {/* Back button and title */}
      <div className="flex justify-between items-center pb-4 border-b border-sea-medium/20">
        <button
          onClick={onBackToForm}
          className="inline-flex items-center gap-2 text-sm text-sea-light hover:text-sea-cream transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Adjust Stack configuration
        </button>
        <span className="text-xs text-sea-light/70 font-medium">
          Audited for {teamSize} seat{teamSize > 1 ? 's' : ''}
        </span>
      </div>

      {/* Savings Summary Banner */}
      <SavingsHero
        monthlySavings={totalMonthlySavings}
        annualSavings={totalAnnualSavings}
      />

      {/* AI Summary Card */}
      <div className="relative overflow-hidden p-6 bg-sea-dark/35 border border-sea-medium/20 rounded-2xl glass-card animate-fade-in space-y-3">
        <div className="absolute top-0 left-0 w-32 h-32 bg-sea-medium/5 blur-2xl rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-sea-light" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15.125 8.192 14.313 9 9.219l.813 5.094 5.096.813-5.096.813z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929l-.707.707-.707-.707.707-.707.707.707zM17.657 16.243l-.707.707-.707-.707.707-.707.707.707zM6.343 6.343l-.707.707-.707-.707.707-.707.707.707z" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-widest text-sea-light font-bold">
              AI Auditor Summary
            </span>
          </div>
 
          {summaryLoading ? (
            <div className="space-y-2.5 animate-pulse py-2">
              <div className="h-3 bg-sea-medium/25 rounded w-full"></div>
              <div className="h-3 bg-sea-medium/25 rounded w-[95%]"></div>
              <div className="h-3 bg-sea-medium/25 rounded w-[88%]"></div>
            </div>
          ) : (
            <p className="text-sm md:text-base text-sea-cream leading-relaxed font-sans italic selection:bg-sea-medium/35 selection:text-sea-cream">
              "{summary}"
            </p>
          )}
        </div>
      </div>

      {/* Credex CTA (substantial savings) */}
      {isHighSavings && (
        <div className="relative overflow-hidden p-6 bg-sea-dark/45 border border-sea-medium/20 rounded-2xl glass-card text-center space-y-4">
          <div className="absolute inset-0 bg-sea-light/[0.01] blur-xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl md:text-2xl font-extrabold text-sea-cream">
              You're leaving ${totalMonthlySavings}/mo on the table
            </h3>
            <p className="text-sm text-sea-light leading-relaxed">
              Credex sells the exact AI tools you need at up to 40% off retail. Book a free 15-minute consultation to optimize your team's spend and consolidate billing.
            </p>
            <div className="pt-2">
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 font-bold text-sea-darkest bg-sea-cream hover:bg-white rounded-xl text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(13,27,42,0.4)] hover:scale-102 active:scale-98"
              >
                Talk to Credex →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tool results grid/list */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-sea-light/60 mb-1">
          Detailed Analysis by Tool
        </h3>
        <div className="space-y-4">
          {perTool.map((toolResult) => (
            <ToolResult key={toolResult.toolKey} result={toolResult} />
          ))}
        </div>
      </div>

      {/* Email Gate lead capture container */}
      <div className="pt-8 border-t border-sea-medium/20">
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
