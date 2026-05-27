import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults';
import PublicReport from './components/PublicReport';
import { runAudit } from './auditEngine';

function HomeView() {
  const [view, setView] = useState('landing');
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('justcheckin_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tools)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved form data from localStorage:', e);
    }
    return {
      teamSize: '',
      useCase: 'coding',
      tools: []
    };
  });
  const [auditResult, setAuditResult] = useState(null);
  const [publicUrlId, setPublicUrlId] = useState('');

  // Save to localStorage on change only when on the form view
  useEffect(() => {
    if (view === 'form') {
      try {
        localStorage.setItem('justcheckin_form', JSON.stringify(formData));
      } catch (e) {
        console.warn('Failed to save form data to localStorage:', e);
      }
    }
  }, [formData, view]);

  const handleRunAudit = async () => {
    try {
      const result = runAudit(formData);
      setAuditResult(result);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear localStorage so next session starts fresh
      try {
        localStorage.removeItem('justcheckin_form');
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }

      // Save audit to DB in the background immediately
      const response = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditResult: result,
          teamSize: Number(formData.teamSize),
          useCase: formData.useCase
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPublicUrlId(data.publicUrlId);
      } else {
        // Fallback random ID if database save failed
        const generatedId = Math.random().toString(36).substring(2, 10);
        setPublicUrlId(generatedId);
      }
    } catch (err) {
      console.error('Failed to run/save audit:', err);
      // Fallback random ID if network error occurred
      const generatedId = Math.random().toString(36).substring(2, 10);
      setPublicUrlId(generatedId);
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
    <div className="min-h-screen relative flex flex-col bg-sea-darkest text-sea-cream bg-grid-pattern selection:bg-sea-medium/40 selection:text-sea-cream">
      
      {/* Background Gradient Line at the very top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-sea-medium/30 to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-sea-medium/20 bg-sea-darkest/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-sea-dark border border-sea-medium/30 flex items-center justify-center p-1 group-hover:border-sea-light/50 transition-colors flex-shrink-0">
              <img src="/logo.png" className="w-full h-full object-contain" alt="J Logo" />
            </div>
            <span className="font-bold text-white tracking-tight group-hover:text-sea-light transition-colors">
              JustCheckin
            </span>
            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-sea-dark border border-sea-medium/20 rounded text-sea-light tracking-wider">
              Audit
            </span>
          </div>

          {/* Right Header Navigation */}
          <nav className="flex items-center gap-4">
            {view !== 'landing' && (
              <button
                onClick={() => setView('landing')}
                className="text-xs text-sea-light hover:text-sea-cream transition-colors"
              >
                Home
              </button>
            )}
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
      <main className={`flex-1 w-full relative ${
        view === 'landing'
          ? 'max-w-full p-0'
          : 'max-w-[1600px] mx-auto pt-2 pb-6 px-4 md:px-6'
      }`}>
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
            publicUrlId={publicUrlId}
          />
        )}
      </main>

      {/* Footer — hidden on landing page */}
      {view !== 'landing' && (
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
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/report/:publicUrlId" element={<PublicReport />} />
      </Routes>
    </BrowserRouter>
  );
}
