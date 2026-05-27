import { useState } from 'react';

export default function ShareButton({ publicUrlId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/report/${publicUrlId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer ${
        copied
          ? 'bg-sea-dark border-sea-medium text-sea-cream'
          : 'bg-sea-dark border-sea-medium/35 text-sea-light hover:border-sea-light/50 hover:bg-sea-dark/80 hover:text-sea-cream'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 mr-2 text-sea-cream" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2 text-sea-light/80" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share Report Link
        </>
      )}
    </button>
  );
}
