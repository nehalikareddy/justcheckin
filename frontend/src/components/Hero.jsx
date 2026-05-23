import React from 'react';

export default function Hero({ onStartAudit }) {
  return (
    <div className="relative w-full px-4 pt-12 md:pt-20 pb-28 text-left overflow-hidden">
      {/* Subtle ambient light glows */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-400/[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Left Column Text Content */}
        <div className="max-w-4xl space-y-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full font-mono text-[10px] uppercase tracking-wider text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Overpaying is dead</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 normal-case font-sans">
              justcheckin.com/audit 
              <svg className="w-2.5 h-2.5 text-zinc-500" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl">
            The finance auditing system <br className="hidden sm:inline" />
            for startup teams and leaders
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
            Purpose-built for auditing, rightsizing, and scaling developer tool stacks. <br className="hidden sm:inline" />
            Designed for the AI era.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={onStartAudit}
              className="group relative inline-flex items-center justify-center px-6 py-3 font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 active:scale-98 rounded-lg transition-all text-sm shadow-[0_4px_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_25px_rgba(52,211,153,0.35)]"
            >
              Audit My AI Spend
              <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
