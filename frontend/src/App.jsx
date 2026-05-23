import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults';
import { runAudit } from './auditEngine';

export default function App() {
  const [view, setView] = useState('landing');
  const [formData, setFormData] = useState({
    teamSize: '',
    useCase: 'coding',
    tools: []
  });
  const [auditResult, setAuditResult] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('justcheckin_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure tools array exists in parsed content
        if (parsed && Array.isArray(parsed.tools)) {
          setFormData(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved form data from localStorage:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('justcheckin_form', JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to save form data to localStorage:', e);
    }
  }, [formData]);

  const handleRunAudit = () => {
    try {
      const result = runAudit(formData);
      setAuditResult(result);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to run audit:', err);
    }
  };

  const handleBackToForm = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAudit = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-zinc-950 text-zinc-100 bg-grid-pattern selection:bg-emerald-500/20 selection:text-emerald-200">
      
      {/* Background Gradient Line at the very top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
              JustCheckin
            </span>
            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 tracking-wider">
              Audit
            </span>
          </div>

          {/* Right Header Navigation */}
          <nav className="flex items-center gap-4">
            {view !== 'landing' && (
              <button
                onClick={() => setView('landing')}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Home
              </button>
            )}
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 hover:text-white rounded-md text-zinc-400 transition-all font-medium"
            >
              Talk to Credex
            </a>
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto pt-2 pb-6 relative">
        {view === 'landing' && (
          <Hero onStartAudit={handleStartAudit} />
        )}

        {view === 'form' && (
          <SpendForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleRunAudit}
          />
        )}

        {view === 'results' && auditResult && (
          <AuditResults
            auditResult={auditResult}
            teamSize={formData.teamSize}
            auditData={formData}
            onBackToForm={handleBackToForm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 py-8 bg-zinc-950/60 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} JustCheckin.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              Credex Savings Program
            </a>
            <a href="https://github.com/copilot" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
