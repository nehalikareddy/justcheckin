// frontend/src/pricingData.js

/**
 * COMPREHENSIVE AI TOOL & API SUBSCRIPTION PRICING REFERENCE
 * Values represent standard monthly retail rates in USD ($).
 * For API tiers, values represent estimated average monthly spend baselines per seat.
 */
export const AI_PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 100 // Enterprise custom baseline
  },
  githubCopilot: {
    individual: 10,
    business: 19,
    enterprise: 39
  },
  claude: {
    free: 0,
    pro: 20,
    max: 50,     // Claude Max tier baseline
    team: 30,
    enterprise: 95,
    apiDirect: 45 // Estimated developer monthly API spend token baseline
  },
  chatgpt: {
    plus: 20,
    team: 25,
    enterprise: 60,
    apiDirect: 40 // Estimated developer monthly API spend token baseline
  },
  anthropicApiDirect: {
    apiDirect: 45 // Standalone Anthropic API usage baseline per dev
  },
  openaiApiDirect: {
    apiDirect: 40 // Standalone OpenAI API usage baseline per dev
  },
  gemini: {
    pro: 20,
    ultra: 30,   // Google One AI Premium baseline
    api: 35      // Google AI Studio/Vertex API spend baseline
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 30
  }
};

// Valid options for the primary use case dropdown
export const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];