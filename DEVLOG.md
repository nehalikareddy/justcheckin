# Day 1: May 20, 2026
**Time spent:** ~45 mins

### Done:
- Set up the main project folders (`frontend` and `backend`).
- Added the 12 required markdown files to the root directory so the grading scripts find them.
- Built `frontend/src/pricingData.js` with real monthly rates for Cursor, GitHub Copilot, Claude, ChatGPT, and Gemini.
- Added the official source links to `PRICING_DATA.md` so the math can be verified.

### Decisions & Lessons:
- **No APIs for math:** Hardcoded the pricing data in a JavaScript object because an audit tool needs exact numbers. APIs or AI can hallucinate, but static data is always consistent.
- **Keeping it small:** Limited the data to the top 5 AI developer tools. Startups bleed the most cash on these anyway, so it keeps the code lean while solving the main problem.

### Blockers:
- Just time. My college semester exams are going on right now, so I have to balance coding with studying for my papers.

### Next Step:
- Write the calculation logic in `auditEngine.js` to flag small teams paying for expensive corporate tiers they don't need.