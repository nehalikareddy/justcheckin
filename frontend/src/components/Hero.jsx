// Real tools the product audits
const TOOLS = [
  { name: 'Cursor',         abbr: 'CUR' },
  { name: 'GitHub Copilot', abbr: 'GH'  },
  { name: 'Claude',         abbr: 'CLU' },
  { name: 'ChatGPT',        abbr: 'GPT' },
  { name: 'Anthropic API',  abbr: 'ANT' },
  { name: 'OpenAI API',     abbr: 'OAI' },
  { name: 'Gemini',         abbr: 'GEM' },
  { name: 'Windsurf',       abbr: 'WND' },
];

// ── Floating "Example Report" card ───────────────────────────────────────────
function SampleCard() {
  return (
    <div className="animate-float pointer-events-none select-none w-full max-w-[460px]">
      <div
        className="glass-card rounded-2xl p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
        style={{ border: '1px solid rgba(65,90,119,0.38)' }}
      >
        {/* Header */}
        <div className="mb-4">
          <p className="text-[10px] text-sea-medium uppercase tracking-widest font-semibold">Example Report</p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-[15px] font-bold text-sea-cream">Acme Labs · 18 devs</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wide">Done</span>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="rounded-xl bg-sea-darkest/70 border border-sea-medium/15 px-4 py-3 mb-3">
          <p className="text-[10px] text-sea-light/50 uppercase tracking-widest mb-1">Est. Monthly Savings</p>
          <p className="text-[36px] font-black text-sea-cream leading-none">$4,820</p>
          <p className="text-[11px] text-sea-light/40 mt-1">↓ 38% of current spend</p>
        </div>

        {/* Tool rows */}
        {[
          { tool: 'GitHub Copilot', issue: 'Unused seats ×7',      saving: '$196/mo' },
          { tool: 'OpenAI API',     issue: 'Switch to mini model',  saving: '$1,340/mo' },
          { tool: 'Windsurf',       issue: 'Downgrade plan',        saving: '$620/mo' },
        ].map(({ tool, issue, saving }) => (
          <div key={tool} className="flex items-center justify-between py-2 border-b border-sea-medium/10 last:border-0">
            <div>
              <p className="text-[13px] font-semibold text-sea-cream">{tool}</p>
              <p className="text-[10px] text-sea-light/45">{issue}</p>
            </div>
            <span className="text-[13px] font-bold text-emerald-400">{saving}</span>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-sea-medium/10 flex items-center justify-between">
          <span className="text-[9px] text-sea-light/30">justcheckin.com</span>
          <span className="text-[9px] text-sea-medium/50">Free · No signup</span>
        </div>
      </div>
    </div>
  );
}

// ── Hero — fills viewport, full bleed, responsive ──────────────────────────────
export default function Hero({ onStartAudit }) {
  return (
    <div
      className="relative w-full flex flex-col h-auto md:h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] md:min-h-0 overflow-y-auto md:overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-sea-medium/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[500px] h-[500px] rounded-full bg-sea-light/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50" />

      {/* ── Main two-column body ── */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center px-6 md:px-10 xl:px-20 py-8 md:py-0 gap-10 xl:gap-20 min-h-0">

        {/* LEFT */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sea-dark border border-sea-medium/30 rounded-full font-mono text-[10px] uppercase tracking-wider text-sea-light animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-sea-light animate-pulse" />
            <span>Overpaying is dead</span>
            <span className="text-sea-medium/50">·</span>
            <span className="normal-case font-sans text-sea-light/80">justcheckin.com/audit</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-sea-cream leading-[1.12] animate-fade-in-up delay-100">
            The finance auditing system<br />
            for startup teams<br />
            and leaders
          </h1>

          {/* Subheadline */}
          <p className="text-base xl:text-lg text-sea-light max-w-md leading-relaxed animate-fade-in-up delay-200">
            Purpose-built for auditing, rightsizing, and scaling developer tool stacks.
            Designed for the AI era.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up delay-300">
            <button
              onClick={onStartAudit}
              className="group inline-flex items-center justify-center px-7 py-3.5 font-bold text-sea-darkest bg-sea-cream hover:bg-white active:scale-95 rounded-xl transition-all text-sm shadow-[0_4px_16px_rgba(13,27,42,0.5)] hover:shadow-[0_6px_24px_rgba(141,169,224,0.2)] cursor-pointer"
            >
              Audit My AI Spend
              <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 pt-1 border-t border-sea-medium/15 animate-fade-in-up delay-400">
            {['Free', 'No signup required', 'Get your report instantly'].map(text => (
              <div key={text} className="inline-flex items-center gap-1.5 text-[12px] text-sea-light">
                <span className="text-emerald-400 font-bold">✓</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — sample card */}
        <div className="flex-shrink-0 flex items-center justify-center animate-fade-in-up delay-200 md:-translate-x-8 lg:-translate-x-16 xl:-translate-x-28">
          <SampleCard />
        </div>
      </div>

      {/* ── Tool marquee — pinned to bottom ── */}
      <div className="relative z-10 border-t border-sea-medium/15 bg-sea-darkest/40 backdrop-blur-sm px-6 md:px-10 xl:px-20 py-3.5 flex items-center gap-6 flex-shrink-0 mt-auto">
        <p className="text-[9px] uppercase tracking-widest text-sea-medium/50 font-semibold whitespace-nowrap flex-shrink-0">
          Audits tools like
        </p>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee">
            {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map(({ name, abbr }, idx) => (
              <div
                key={`${name}-${idx}`}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 mr-2.5 rounded-lg bg-sea-dark/70 border border-sea-medium/15 text-sea-light text-[10px] font-medium whitespace-nowrap"
              >
                <span className="w-4 h-4 rounded bg-sea-medium/20 flex items-center justify-center text-[7px] font-black text-sea-light tracking-wider">
                  {abbr.slice(0, 2)}
                </span>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
