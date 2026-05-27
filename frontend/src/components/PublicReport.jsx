import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SavingsHero from './SavingsHero';
import ToolResult from './ToolResult';

export default function PublicReport() {
  const { publicUrlId } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(true), 0);
    fetch(`/api/audit/${publicUrlId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Audit report not found');
        }
        return res.json();
      })
      .then((data) => {
        setAudit(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching audit:', err);
        setErrorMsg('We could not retrieve this audit. It may not exist or has expired.');
        setLoading(false);
      });
  }, [publicUrlId]);

  useEffect(() => {
    if (audit && audit.totalMonthlySavings !== undefined) {
      document.title = `AI Spend Audit — Save $${audit.totalMonthlySavings}/mo | JustCheckin`;
    } else {
      document.title = 'AI Spend Audit | JustCheckin';
    }
  }, [audit]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-sea-darkest text-sea-cream bg-grid-pattern selection:bg-sea-medium/40 selection:text-sea-cream">
      
      {/* Background Gradient Line at the very top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-sea-medium/30 to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-sea-medium/20 bg-sea-darkest/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 select-none group">
            <div className="w-8 h-8 rounded-lg bg-sea-dark border border-sea-medium/30 flex items-center justify-center group-hover:border-sea-light/50 transition-colors">
              <svg className="w-4 h-4 text-sea-light group-hover:text-sea-cream transition-colors" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight group-hover:text-sea-light transition-colors">
              JustCheckin
            </span>
            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-sea-dark border border-sea-medium/20 rounded text-sea-light tracking-wider">
              Audit
            </span>
          </Link>

          {/* Right Header Navigation */}
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-xs text-sea-light hover:text-sea-cream transition-colors">
              Home
            </Link>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-sea-dark border border-sea-medium/40 hover:border-sea-light hover:text-sea-cream rounded-md text-sea-light transition-all font-medium"
            >
              Talk to Credex
            </a>
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 relative">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-sea-medium/30 border-t-sea-light rounded-full animate-spin" />
            <p className="text-sm text-sea-light font-mono">Loading audit report...</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="text-center py-20 space-y-6">
            <div className="mx-auto w-12 h-12 bg-red-950/20 border border-red-500/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-sea-cream">Oops! Something went wrong</h3>
              <p className="text-sm text-sea-light max-w-md mx-auto">{errorMsg}</p>
            </div>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-2.5 font-semibold text-sea-darkest bg-sea-cream hover:bg-white rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(13,27,42,0.4)]"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}

        {!loading && !errorMsg && audit && (
          <div className="space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="flex justify-between items-center pb-4 border-b border-sea-medium/20">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-extrabold text-sea-cream tracking-tight">AI Stack Spend Audit</h2>
                <p className="text-xs text-sea-light/60 font-mono">Public Report ID: {audit.publicUrlId}</p>
              </div>
              <span className="text-xs text-sea-light font-medium bg-sea-dark px-3 py-1 border border-sea-medium/30 rounded-full">
                Audited for {audit.teamSize} seat{audit.teamSize > 1 ? 's' : ''}
              </span>
            </div>

            {/* Savings summary */}
            <SavingsHero
              monthlySavings={audit.totalMonthlySavings}
              annualSavings={audit.totalAnnualSavings}
            />

            {/* AI Summary Card */}
            {audit.summary && (
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
                  <p className="text-sm md:text-base text-sea-cream leading-relaxed font-sans italic selection:bg-sea-medium/35 selection:text-sea-cream">
                    "{audit.summary}"
                  </p>
                </div>
              </div>
            )}

            {/* Credex Program Callout if substantial savings */}
            {audit.totalMonthlySavings > 500 && (
              <div className="relative overflow-hidden p-6 bg-sea-dark/45 border border-sea-medium/20 rounded-2xl glass-card text-center space-y-4">
                <div className="absolute inset-0 bg-sea-light/[0.01] blur-xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-sea-cream">
                    Unlock up to {formatCurrency(audit.totalMonthlySavings)}/mo savings
                  </h3>
                  <p className="text-sm text-sea-light leading-relaxed">
                    Credex helps teams scale down expensive subscriptions and save up to 40% off retail prices on primary developer/designer software licenses.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://credex.rocks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sea-darkest bg-sea-cream hover:bg-white rounded-xl text-sm transition-all duration-200 hover:scale-102 active:scale-98 shadow-[0_4px_12px_rgba(13,27,42,0.4)]"
                    >
                      Learn More on Credex →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tool Results list */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-sea-light/60 mb-1">
                Detailed Analysis by Tool
              </h3>
              <div className="space-y-4">
                {audit.perTool && audit.perTool.length > 0 ? (
                  audit.perTool.map((toolResult) => (
                    <ToolResult key={toolResult.toolKey || toolResult._id} result={toolResult} />
                  ))
                ) : (
                  <div className="p-8 border border-sea-medium/20 bg-sea-dark/10 text-center text-sm text-sea-light/60 rounded-xl">
                    No individual tools were configured for this audit.
                  </div>
                )}
              </div>
            </div>

            {/* Run Audit CTA at the bottom */}
            <div className="pt-12 text-center border-t border-sea-medium/20 space-y-4">
              <h4 className="text-base font-bold text-sea-cream">Want to run your own custom stack check?</h4>
              <p className="text-sm text-sea-light max-w-md mx-auto">
                JustCheckin scans your AI tool spend to discover seat overlaps, tier arbitrage opportunities, and optimal plans.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sea-darkest bg-sea-cream hover:bg-white rounded-xl text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(13,27,42,0.4)] hover:scale-102 active:scale-98"
                >
                  Run a Free Audit in 60s
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-sea-medium/25 py-8 bg-sea-darkest/60 backdrop-blur-sm mt-12">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sea-light font-medium">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} JustCheckin.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="hover:text-sea-cream transition-colors">
              Credex Savings Program
            </a>
            <a href="https://github.com/copilot" target="_blank" rel="noopener noreferrer" className="hover:text-sea-cream transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
