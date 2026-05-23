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

---
(Note: May 21, 2026 was skipped with no progress due to university lab exam.)
---

# Day 2: May 22, 2026
**Time spent:** ~2 hours

### Done:
- Built `auditEngine.js` with 7 audit rules:
  - Small team on expensive tier
  - Redundant coding tools (Cursor + Copilot overlap)
  - API direct vs subscription arbitrage
  - Enterprise overkill for teams <10
  - Seat vs team size mismatch
  - Spend sanity check
  - Optimal state detection
- All recommendations cite actual numbers (e.g., "Team of 5 on Business ($40/seat) → Pro ($20/seat) = $100/mo savings")
- Redundancy detection for overlapping tool categories

### Decisions & Lessons:
- Went with rule-based logic for clarity and defensibility
- Every reason string includes specific numbers and reasoning

### Blockers:
- Deciding between rule-based vs AI scoring → went with rule-based for defensibility and clarity.

### Next Step:
- Build frontend UI: spend input form and results display

---

# Day 3: May 22, 2026
**Time spent:** ~5 hours

### Done:
- Built the complete React frontend (Hero, SpendForm, AuditResults).
- Added Tailwind CSS v4 and styled with a dark theme.
- Wired up localStorage to save form state automatically.
- Integrated the UI with `auditEngine.js` to show real-time savings.
- Built EmailGate and ShareButton for lead capture and virality.

### Decisions & Lessons:
- Kept the form layout as a clean single-column list instead of cards to handle many tools better.
- Tailwind v4 setup is slightly different but much cleaner with just `@import "tailwindcss"`.

### Blockers:
- Getting the layout right for 8+ tools without overflowing the screen required some CSS grid adjustments, but it's fixed now.

### Next Step:
- Build the shareable results page with React Router, Open Graph tags, and MongoDB backend schema connections.