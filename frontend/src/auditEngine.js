/**
 * JUSTCHECKIN AUDIT ENGINE
 * 
 * Core logic: takes a team's AI tool spending and outputs defensible recommendations.
 * No API calls. No React. Pure finance logic.
 * 
 * Input: { teamSize, useCase, tools: [...] }
 * Output: { perTool: [...], totalMonthlySavings, totalAnnualSavings, overallVerdict, redundancies }
 */

import { AI_PRICING, USE_CASES } from './pricingData.js'

export const TOOL_NAMES = {
  cursor: 'Cursor',
  githubCopilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  anthropicApiDirect: 'Anthropic API',
  openaiApiDirect: 'OpenAI API',
  gemini: 'Gemini (Google)',
  windsurf: 'Windsurf'
}

const TOOL_CATEGORIES = {
  coding: ['cursor', 'githubCopilot', 'windsurf'],
  writingContent: ['claude', 'chatgpt'],
  dataAnalysis: ['claude', 'chatgpt', 'gemini'],
  research: ['claude', 'chatgpt', 'gemini']
}

function getPlanPrice(toolKey, planName) {
  return AI_PRICING[toolKey]?.[planName] ?? null
}

function capitalizePlan(plan) {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}

/**
 * Detect if tools are redundant based on category overlap
 * Returns array of tool keys that should be flagged as redundant
 */
function detectRedundancies(tools, useCase) {
  const redundantTools = []

  const activeCodingTools = tools.filter(t => TOOL_CATEGORIES.coding.includes(t.toolKey))
  if (activeCodingTools.length > 1 && (useCase === 'coding' || useCase === 'mixed')) {
    activeCodingTools.sort((a, b) => a.monthlySpend - b.monthlySpend)
    for (let i = 1; i < activeCodingTools.length; i++) {
      redundantTools.push(activeCodingTools[i].toolKey)
    }
  }

  const activeWritingTools = tools.filter(t => TOOL_CATEGORIES.writingContent.includes(t.toolKey))
  if (activeWritingTools.length > 1 && (useCase === 'writing' || useCase === 'mixed')) {
    activeWritingTools.sort((a, b) => a.monthlySpend - b.monthlySpend)
    for (let i = 1; i < activeWritingTools.length; i++) {
      if (!redundantTools.includes(activeWritingTools[i].toolKey)) {
        redundantTools.push(activeWritingTools[i].toolKey)
      }
    }
  }

  return redundantTools
}

function auditTool(tool, teamSize, useCase, redundantTools, allTools) {
  const { toolKey, plan, seats, monthlySpend } = tool
  const toolName = TOOL_NAMES[toolKey]
  const currentPlanPrice = getPlanPrice(toolKey, plan)

  const result = {
    toolKey,
    toolName,
    currentPlan: capitalizePlan(plan),
    currentSpend: monthlySpend,
    recommendedPlan: capitalizePlan(plan),
    recommendedSpend: monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    flag: 'right-sized',
    reason: ''
  }

  if (redundantTools.includes(toolKey)) {
    result.flag = 'redundant'
    result.recommendedSpend = 0
    result.monthlySavings = monthlySpend
    result.annualSavings = monthlySpend * 12
    
    let redundancyExplanation = 'another tool in your stack'
    if (TOOL_CATEGORIES.coding.includes(toolKey) && useCase === 'coding') {
      const codingTools = allTools.filter(t => TOOL_CATEGORIES.coding.includes(t.toolKey))
      const keeper = codingTools.reduce((prev, curr) => prev.monthlySpend < curr.monthlySpend ? prev : curr)
      if (keeper.toolKey !== toolKey) {
        redundancyExplanation = `${TOOL_NAMES[keeper.toolKey]} (which you already have)`
      }
    } else if (TOOL_CATEGORIES.writingContent.includes(toolKey) && (useCase === 'writing' || useCase === 'mixed')) {
      const writingTools = allTools.filter(t => TOOL_CATEGORIES.writingContent.includes(t.toolKey))
      const keeper = writingTools.reduce((prev, curr) => prev.monthlySpend < curr.monthlySpend ? prev : curr)
      if (keeper.toolKey !== toolKey) {
        redundancyExplanation = `${TOOL_NAMES[keeper.toolKey]} (which you already have)`
      }
    }
    
    result.reason = `You have ${toolName} and ${redundancyExplanation}. For your ${useCase} use case, they have overlapping capabilities. Dropping this redundant tool saves $${monthlySpend}/mo.`
    return result
  }

  const expensiveTiers = ['business', 'enterprise', 'team']
  if (seats <= 3 && expensiveTiers.includes(plan)) {
    const cheaperPlan = ['pro', 'individual', 'hobby'].find(p => getPlanPrice(toolKey, p) !== null)
    if (cheaperPlan) {
      const cheaperPlanPrice = getPlanPrice(toolKey, cheaperPlan)
      const savings = (currentPlanPrice - cheaperPlanPrice) * seats
      if (savings > 0) {
        result.flag = 'overpaying'
        result.recommendedPlan = capitalizePlan(cheaperPlan)
        result.recommendedSpend = cheaperPlanPrice * seats
        result.monthlySavings = savings
        result.annualSavings = savings * 12
        result.reason = `Team of ${seats} on ${capitalizePlan(plan)} at $${currentPlanPrice}/seat. ${capitalizePlan(cheaperPlan)} at $${cheaperPlanPrice}/seat has identical features for small teams. Switching saves $${savings}/mo.`
        return result
      }
    }
  }

  if (seats > teamSize * 1.2) {
    const excessSeats = seats - teamSize
    const pricePerSeat = currentPlanPrice
    const savings = excessSeats * pricePerSeat
    result.flag = 'overpaying'
    result.recommendedSpend = currentPlanPrice * teamSize
    result.monthlySavings = savings
    result.annualSavings = savings * 12
    result.reason = `You have ${seats} seats but only ${teamSize} team members. Reducing seats to match team size saves $${savings}/mo.`
    return result
  }

  if (plan === 'enterprise' && seats < 10) {
    const teamPlan = getPlanPrice(toolKey, 'team')
    if (teamPlan !== null && teamPlan < currentPlanPrice) {
      const savings = (currentPlanPrice - teamPlan) * seats
      result.flag = 'overpaying'
      result.recommendedPlan = 'Team'
      result.recommendedSpend = teamPlan * seats
      result.monthlySavings = savings
      result.annualSavings = savings * 12
      result.reason = `Enterprise tier is for SSO/compliance needs. For ${seats} people without enterprise requirements, Team tier is functionally identical. Switch saves $${savings}/mo.`
      return result
    }
  }

  if ((toolKey === 'anthropicApiDirect' || toolKey === 'openaiApiDirect') && monthlySpend > 100) {
    if (useCase === 'writing' || useCase === 'research') {
      const subscriptionCost = toolKey === 'anthropicApiDirect' ? 20 : 20
      if (subscriptionCost < monthlySpend) {
        result.flag = 'overpaying'
        const recommendedToolKey = toolKey === 'anthropicApiDirect' ? 'claude' : 'chatgpt'
        const recommendedPlan = 'pro'
        result.recommendedPlan = capitalizePlan(recommendedPlan)
        result.recommendedSpend = subscriptionCost
        result.monthlySavings = monthlySpend - subscriptionCost
        result.annualSavings = (monthlySpend - subscriptionCost) * 12
        result.reason = `For ${useCase} work, a subscription ($${subscriptionCost}/mo) is cheaper than your API billing ($${monthlySpend}/mo). Switch to the Pro tier for unlimited access at lower cost.`
        return result
      }
    }
  }

  const expectedSpend = currentPlanPrice * seats
  const overage = monthlySpend - expectedSpend
  if (overage > expectedSpend * 0.1) {
    result.reason = `Your stated spend ($${monthlySpend}) exceeds standard pricing ($${expectedSpend} = ${seats} seats × $${currentPlanPrice}). Check for unused add-ons or confirm your billing includes other features.`
    return result
  }

  const optimalPlans = ['pro', 'individual', 'hobby', 'free']
  if (optimalPlans.includes(plan) && seats <= teamSize * 1.05 && overage <= 0) {
    result.flag = 'optimal'
    result.reason = `You're on the right plan for your team size and use case. No changes needed — keep as is.`
    return result
  }

  result.reason = `No optimization opportunity detected for this tool at your current team size.`
  return result
}

/**
 * Main entry point: run the full audit
 * 
 * @param {Object} input
 *   - teamSize: number (1-500)
 *   - useCase: string ('coding' | 'writing' | 'data' | 'research' | 'mixed')
 *   - tools: Array of { toolKey, plan, seats, monthlySpend }
 * @returns {Object} audit result
 */
export function runAudit(input) {
  const { teamSize, useCase, tools } = input

  if (!teamSize || teamSize < 1) {
    throw new Error('Team size must be at least 1')
  }
  if (!USE_CASES.includes(useCase)) {
    throw new Error(`Invalid use case. Must be one of: ${USE_CASES.join(', ')}`)
  }
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error('At least one tool must be selected')
  }

  const redundancies = detectRedundancies(tools, useCase)
  const perTool = tools.map(tool => auditTool(tool, teamSize, useCase, redundancies, tools))

  const totalMonthlySavings = perTool.reduce((sum, t) => sum + (t.monthlySavings || 0), 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  let overallVerdict = 'optimal'
  if (totalMonthlySavings > 500) {
    overallVerdict = 'high-savings'
  } else if (totalMonthlySavings > 100) {
    overallVerdict = 'medium-savings'
  } else if (totalMonthlySavings > 0) {
    overallVerdict = 'low-savings'
  }

  return {
    perTool,
    totalMonthlySavings,
    totalAnnualSavings,
    overallVerdict,
    redundancies
  }
}
