import { useState } from 'react';
import ShareButton from './ShareButton';

export default function EmailGate({ totalSavings, teamSize, auditData, publicUrlId }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [localPublicUrlId] = useState('');
  const [emailSkipped, setEmailSkipped] = useState(false);

  // Determine CTA text based on savings thresholds
  let ctaText = 'Email me my audit report';
  if (totalSavings > 500) {
    ctaText = 'Get my full report + talk to Credex';
  } else if (totalSavings < 100) {
    ctaText = 'Notify me when this changes';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    // If publicUrlId is empty/falsy AND localPublicUrlId is also empty, do NOT generate a random fallback.
    // Instead, skip publicUrlId in the payload (send it as undefined/null).
    const activeUrlId = publicUrlId || localPublicUrlId || null;

    const payload = {
      email,
      company: company || undefined,
      role: role || undefined,
      teamSize,
      totalSavings,
      publicUrlId: activeUrlId || undefined,
      auditData
    };

    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('API server responded with error');
      }

      const data = await response.json();
      if (data && data.emailSent === false) {
        setEmailSkipped(true);
      }
      setSubmitted(true);
    } catch {
      setErrorMsg('Could not send email. The server may be offline or email is not configured. Your audit results are still available on this page.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const showShareable = !!(publicUrlId || localPublicUrlId);
    const reportLink = showShareable ? `${window.location.origin}/report/${publicUrlId || localPublicUrlId}` : '';
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-sea-dark border border-sea-medium/30 rounded-2xl text-center glass-card space-y-6 animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-sea-darkest border border-sea-medium/45 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-sea-light" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-sea-cream">
            {emailSkipped ? 'Lead captured! Email sending is not configured on this server.' : 'Check your inbox!'}
          </h3>
          {!emailSkipped && (
            <p className="text-sm text-sea-light">
              We've sent a summary to <span className="text-sea-cream font-semibold">{email}</span>.
            </p>
          )}
        </div>
        {showShareable ? (
          <>
            <div className="p-4 bg-sea-darkest/90 border border-sea-medium/25 rounded-xl space-y-2">
              <span className="block text-[10px] uppercase font-bold text-sea-light/70 tracking-wider">Public Shareable Report URL</span>
              <a
                href={reportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-sea-light hover:text-sea-cream font-medium break-all underline"
              >
                {reportLink}
              </a>
            </div>
            <div className="flex justify-center pt-2">
              <ShareButton publicUrlId={publicUrlId || localPublicUrlId} />
            </div>
          </>
        ) : (
          <p className="text-sm text-sea-light bg-sea-darkest/90 border border-sea-medium/25 rounded-xl p-4">
            Your audit results were captured but a shareable report link is not available (database may be offline).
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-sea-dark/35 border border-sea-medium/20 rounded-2xl glass-card space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg md:text-xl font-bold text-sea-cream tracking-tight">Save these results</h3>
        <p className="text-xs text-sea-light/80">Get your report link and stay updated on software pricing optimizations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-sea-light/75 mb-1 tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3.5 py-2.5 bg-sea-darkest border border-sea-medium/40 rounded-lg text-sm text-sea-cream focus:outline-none focus:border-sea-light transition-colors"
          />
        </div>

        {/* Info Grid (Company + Role) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-sea-light/75 mb-1 tracking-wider">
              Company Name <span className="text-sea-light/45">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full px-3.5 py-2.5 bg-sea-darkest border border-sea-medium/40 rounded-lg text-sm text-sea-cream focus:outline-none focus:border-sea-light transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-sea-light/75 mb-1 tracking-wider">
              Your Role <span className="text-sea-light/45">(optional)</span>
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. CTO"
              className="w-full px-3.5 py-2.5 bg-sea-darkest border border-sea-medium/40 rounded-lg text-sm text-sea-cream focus:outline-none focus:border-sea-light transition-colors"
            />
          </div>
        </div>

        {errorMsg && <p className="text-xs text-red-400 text-center">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-sea-cream hover:bg-white text-sea-darkest font-semibold rounded-lg text-sm transition-all shadow-[0_4px_12px_rgba(13,27,42,0.4)] disabled:opacity-50"
        >
          {loading ? 'Processing...' : ctaText}
        </button>
      </form>
    </div>
  );
}
