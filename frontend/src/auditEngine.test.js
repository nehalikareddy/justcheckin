import { describe, test, expect } from 'vitest';
import { runAudit } from './auditEngine';

describe('Deterministic Audit Engine Tests', () => {
  // Test Case 1: An optimal stack with no redundancies
  test('Optimal Stack: Single tool sized correctly', () => {
    const input = {
      teamSize: 3,
      useCase: 'coding',
      tools: [
        {
          toolKey: 'cursor',
          plan: 'pro',
          seats: 3,
          monthlySpend: 60
        }
      ]
    };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.perTool[0].flag).toBe('optimal');
    expect(result.overallVerdict).toBe('optimal');
  });

  // Test Case 2: Overlapping coding tools (Cursor + GitHub Copilot redundancy)
  test('Redundancy: Cursor + GitHub Copilot overlap', () => {
    const input = {
      teamSize: 2,
      useCase: 'coding',
      tools: [
        {
          toolKey: 'cursor',
          plan: 'pro',
          seats: 2,
          monthlySpend: 40
        },
        {
          toolKey: 'githubCopilot',
          plan: 'business',
          seats: 2,
          monthlySpend: 38
        }
      ]
    };
    const result = runAudit(input);
    // Cursor ($40) is flagged as redundant (saves 40) and GitHub Copilot Business ($38) is flagged as overpaying (saves 18)
    expect(result.totalMonthlySavings).toBe(58);
    const copilotResult = result.perTool.find(t => t.toolKey === 'githubCopilot');
    expect(copilotResult.flag).toBe('overpaying');
  });

  // Test Case 3: Small team on expensive team/business plans (SSO/Admin overkill)
  test('Overpaying: Small team on Business tier', () => {
    const input = {
      teamSize: 2,
      useCase: 'coding',
      tools: [
        {
          toolKey: 'cursor',
          plan: 'business',
          seats: 2,
          monthlySpend: 80
        }
      ]
    };
    const result = runAudit(input);
    // Cursor Business is $40/seat. Recommended is Cursor Pro at $20/seat. Savings = (40 - 20) * 2 = $40
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.perTool[0].flag).toBe('overpaying');
    expect(result.perTool[0].recommendedPlan).toBe('Pro');
  });

  // Test Case 4: Seat mismatch (more seats purchased than total team size)
  test('Overpaying: Seat count exceeds team size', () => {
    const input = {
      teamSize: 5,
      useCase: 'coding',
      tools: [
        {
          toolKey: 'cursor',
          plan: 'pro',
          seats: 8,
          monthlySpend: 160
        }
      ]
    };
    const result = runAudit(input);
    // 3 extra seats on Pro ($20/seat) = $60 savings
    expect(result.totalMonthlySavings).toBe(60);
    expect(result.perTool[0].flag).toBe('overpaying');
    expect(result.perTool[0].recommendedSpend).toBe(100); // 5 seats * $20
  });

  // Test Case 5: Enterprise tier overkill for team under 10
  test('Overpaying: Enterprise overkill for small team', () => {
    const input = {
      teamSize: 6,
      useCase: 'writing',
      tools: [
        {
          toolKey: 'claude',
          plan: 'enterprise',
          seats: 6,
          // Claude enterprise is custom, baseline pricingData uses $95
          monthlySpend: 570
        }
      ]
    };
    const result = runAudit(input);
    // Recommends Claude Team ($30/seat) instead of Enterprise ($95/seat). Savings = (95 - 30) * 6 = $390
    expect(result.totalMonthlySavings).toBe(390);
    expect(result.perTool[0].flag).toBe('overpaying');
    expect(result.perTool[0].recommendedPlan).toBe('Team');
  });

  // Test Case 6: API Direct vs Pro subscription arbitrage
  test('API Arbitrage: High API spend on writing task', () => {
    const input = {
      teamSize: 1,
      useCase: 'writing',
      tools: [
        {
          toolKey: 'anthropicApiDirect',
          plan: 'apiDirect',
          seats: 1,
          monthlySpend: 150
        }
      ]
    };
    const result = runAudit(input);
    // Recommends switching to Claude Pro ($20/mo subscription). Savings = 150 - 20 = $130
    expect(result.totalMonthlySavings).toBe(130);
    expect(result.perTool[0].flag).toBe('overpaying');
    expect(result.perTool[0].recommendedPlan).toBe('Pro');
  });
});
