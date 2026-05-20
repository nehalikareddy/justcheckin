/**
 * GLOBAL AI TOOL SUBSCRIPTION PRICING REFERENCE
 * All values are hardcoded in USD ($) and reflect standard monthly retail rates.
 * Business/Team tiers are calculated "per seat, per month".
 */
export const AI_PRICING = {
  cursor: {
    pro: 20,       // $20 / individual / month
    business: 40   // $40 / user / month (Teams)
  },
  githubCopilot: {
    individual: 10, // $10 / individual / month
    business: 19,   // $19 / user / month
    enterprise: 39  // $39 / user / month
  },
  claude: {
    pro: 20,       // $20 / individual / month
    team: 30       // $30 / user / month
  },
  chatgpt: {
    plus: 20,      // $20 / individual / month
    team: 25       // $25 / user / month
  },
  gemini: {
    pro: 20        // $20 / individual / month
  }
};