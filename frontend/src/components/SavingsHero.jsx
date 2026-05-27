export default function SavingsHero({ monthlySavings, annualSavings }) {
  const isOptimal = monthlySavings === 0;
  const isHighSavings = monthlySavings > 500;

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(monthlySavings);

  const formattedAnnual = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(annualSavings);

  // Set card classes based on status
  let cardClass;
  let glowComponent;

  if (isOptimal) {
    cardClass = "bg-sea-dark/25 border-sea-medium/20 hover:border-sea-medium/35";
    glowComponent = <div className="ambient-glow-gray top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110" />;
  } else if (isHighSavings) {
    cardClass = "bg-sea-dark/45 border-sea-medium/30 hover:border-sea-medium/55";
    glowComponent = <div className="ambient-glow-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110" />;
  } else {
    cardClass = "bg-sea-dark/40 border-sea-medium/30 hover:border-sea-medium/50";
    glowComponent = <div className="ambient-glow-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110" />;
  }

  return (
    <div className={`relative overflow-hidden p-8 md:p-12 border rounded-2xl text-center glass-card space-y-4 ${cardClass}`}>
      {/* Glow highlight behind savings */}
      {glowComponent}

      <div className="relative z-10 space-y-2">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-sea-light font-bold">
          Estimated Savings Opportunity
        </h3>

        {isOptimal ? (
          <div className="space-y-3">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-sea-cream">
              {formattedMonthly} <span className="text-lg font-medium text-sea-light">/mo</span>
            </div>
            <p className="text-sea-cream font-semibold tracking-wide text-sm sm:text-base">
              🎉 Your AI stack is fully optimized!
            </p>
            <p className="text-xs text-sea-light max-w-md mx-auto leading-relaxed">
              Excellent job! You are running an efficient setup with no redundant software tiers or over-provisioned seats.
            </p>
          </div>
        ) : monthlySavings < 100 ? (
          <div className="space-y-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-sea-cream">
              {formattedMonthly} <span className="text-lg font-medium text-sea-light">/mo</span>
            </div>
            <p className="text-sea-cream font-semibold tracking-wide text-sm sm:text-base">
              👍 Honest Feedback: You're spending well!
            </p>
            <p className="text-xs text-sea-light max-w-md mx-auto leading-relaxed">
              Your potential monthly savings are under $100. This indicates your AI subscription stack is highly optimized and run very leanly. Minor tweaks can save a tiny bit, but your core parameters are outstanding!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-sea-cream">
              {formattedMonthly}
              <span className="text-base sm:text-lg md:text-2xl font-semibold text-sea-light ml-1">/month</span>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-sea-light font-medium">
              Save up to <span className="font-bold text-sea-cream">{formattedAnnual}</span> per year
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wide pt-1 text-sea-cream">
              {isHighSavings 
                ? '⚠️ Critical optimization potential detected!'
                : '💡 Moderate savings opportunity found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
