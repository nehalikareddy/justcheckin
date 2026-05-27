# TESTS.md - Testing & Verification Documentation

This document lists the testing checklists, manual QA verification flows, and automated unit tests designed to ensure the operational stability of **JustCheckin**.

---

## 1. Automated Unit Testing Suite

We use **Vitest** to run automated unit tests on our core deterministic calculation engine.

### A. Test File Location
* **Path:** [auditEngine.test.js](file:///c:/Users/MY%20PC/OneDrive/Documents/justcheckin/frontend/src/auditEngine.test.js)
* **Target Module:** [auditEngine.js](file:///c:/Users/MY%20PC/OneDrive/Documents/justcheckin/frontend/src/auditEngine.js)

### B. List of Test Cases (6 Cases on the Audit Engine)
1. **Optimal Stack (`src/auditEngine.test.js` L5-22):** Checks that a single tool configured correctly matches the team size and results in $0 savings and an `optimal` verdict.
2. **Redundancy Overlaps (`src/auditEngine.test.js` L25-49):** Verifies that adding both Cursor Pro and GitHub Copilot Business flags Copilot as overpaying (recommending Individual tier, saving $18) and Cursor as redundant (saving $40), resulting in $58 total monthly savings.
3. **Small Team Tier Overkill (`src/auditEngine.test.js` L52-70):** Verifies that a small team of 2 on Cursor Business ($40/seat) is advised to switch to Pro ($20/seat), resulting in $40 savings.
4. **Seat Count Mismatch (`src/auditEngine.test.js` L73-91):** Asserts that when a team of 5 purchases 8 seats of Cursor Pro ($20/seat), the engine recommends reducing to 5 seats, saving $60.
5. **Enterprise Tier Overkill (`src/auditEngine.test.js` L94-113):** Verifies that a team of 6 on Claude Enterprise ($95/seat) is advised to downgrade to Claude Team ($30/seat), saving $390/mo.
6. **API Arbitrage (`src/auditEngine.test.js` L116-133):** Confirms that when a writing-focused startup spends $150/mo on Anthropic API, the engine recommends switching to a Claude Pro subscription ($20/mo), saving $130.

### C. Coverage Targets
* **Calculations Module (`auditEngine.js`):** **100% Statement Coverage**, **100% Branch Coverage**.
* **Global Frontend Code:** ~85% Coverage.

### D. Automated Run Instructions
Run the following commands to execute the unit test suite:
```bash
# Navigate to the frontend directory
cd frontend

# Run the test suite once (CI mode)
npm test

# Run tests in watch mode (Development mode)
npx vitest
```

---

## 2. Automated API Endpoint Verification (Backend)

Express routes are validated using HTTP assertions. Below are standard payload testing commands:

### A. Run Audit Save Test
```bash
curl -X POST http://localhost:5000/api/save-audit \
  -H "Content-Type: application/json" \
  -d '{"auditResult":{"totalMonthlySavings":150,"totalAnnualSavings":1800,"overallVerdict":"medium-savings","perTool":[]},"teamSize":5,"useCase":"coding"}'
```
* **Expected Result:** HTTP 200, returning `{"publicUrlId": "xxxxxx"}`.

### B. Run API Summary Test
```bash
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"auditData":{"totalMonthlySavings":150},"publicUrlId":"xxxxxx"}'
```
* **Expected Result:** HTTP 200, returning a text summary matching prompt rules.

### C. Run Lead Capture Test
```bash
curl -X POST http://localhost:5000/api/capture-lead \
  -H "Content-Type: application/json" \
  -d '{"email":"test@startup.com","company":"Acme","role":"Founder","teamSize":5,"totalSavings":150,"publicUrlId":"xxxxxx"}'
```
* **Expected Result:** HTTP 200, success message and database record update.

---

## 3. Manual Frontend QA Verification Checklist

### A. Entry Flow (Landing Page)
1. Navigate to `/`. Verify hero styling, fonts, and click "Audit My Stack in 60s".
2. Confirm route transitions to `/` rendering the input form (`SpendForm.jsx`) with smooth scroll.

### B. Form Validation
1. Try to submit without adding any tools. Verify client-side validation displays an error.
2. Enter team size `0` or negative. Verify that values are bound or clamped to valid integers.
3. Add multiple tools, edit seat numbers, and refresh the page. Confirm parameters persist on reload (`localStorage`).

### C. Lead Capture & Sharing Flow
1. Run audit and check the loading indicator in the "AI Auditor Summary" box while `/api/generate-summary` completes.
2. Verify summary paragraph renders correctly.
3. Submit the lead capture form with a valid email.
4. Verify the success state appears showing a unique public report link: `http://localhost:5173/report/xxxxxx`.
5. Open a separate private browsing window, visit the report page, and check that no private PII (email, company, role) is rendered or sent in network payloads.

---

## 4. Boundary & Error Condition Testing

| Scenario Tested | Expected System Behavior | Actual Result |
|-----------------|--------------------------|---------------|
| **Anthropic API Offline** | Fallback to Google Gemini API triggers immediately. | Passed ✅ |
| **Gemini API Offline** | Static local text template fallback triggers in server.js. | Passed ✅ |
| **Resend API Failure** | Log error server-side, complete lead capture success on client to prevent blocking UX. | Passed ✅ |
| **Database Offline** | Logs Mongo error, but server runs without crashing. | Passed ✅ |
| **Rate Limit Exceeded** | 21st request in 15 mins gets blocked with HTTP 429: "Too many requests." | Passed ✅ |
| **URL Injection** | Visited `/report/invalid-id` returns a clean, styled "Oops! Something went wrong" view. | Passed ✅ |
| **Responsive Viewports** | SavingsHero text size drops on mobile; grid systems stack in a single column. | Passed ✅ |
