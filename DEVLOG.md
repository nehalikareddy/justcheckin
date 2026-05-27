# DEVLOG.md - Development Logs & Daily Progress Tracker

This document records the daily logs, decisions, learning points, and blockers encountered during the development of **JustCheckin**.

---

## Day 1 — 2026-05-20
**Hours worked:** 4
**What I did:** Scaffolded full project structure. Created frontend (React + Vite) and backend (Express). Implemented pricingData.js with all 8 required AI tools and their tier pricing sourced from official pages. Built server.js with rate limiting, initial API structure, and Resend client. Created all 12 required markdown placeholder files.
**What I learned:** Express 5 error handling has breaking changes from v4 — error handling middleware signature needs careful configuration.
**Blockers / what I'm stuck on:** Deciding between a generic LLM evaluation and a deterministic calculation engine. Decided on deterministic thresholds for defensibility.
**Plan for tomorrow:** Study for college exams (Day Off).

---

## Day 2 — 2026-05-21
**Hours worked:** 0
**What I did:** No coding progress today. Took a day off to prepare for and write college semester exams.
**What I learned:** Balancing production-grade coding with academic timelines requires strict task management.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Build the core cost logic in auditEngine.js.

---

## Day 3 — 2026-05-22
**Hours worked:** 5
**What I did:** Built the core deterministic SaaS cost audit engine in `auditEngine.js`. Implemented plan fit, seat count checks, redundant tool overlaps (e.g. Cursor + GitHub Copilot), and API Direct billing arbitrage rules. All calculations cite explicit numbers.
**What I learned:** Redundancy overlaps are best resolved by sorting tools by cost and flagging the most expensive overlaps for consolidation.
**Blockers / what I'm stuck on:** Handling custom seat counts when the team size changes dynamically in the UI.
**Plan for tomorrow:** Build the frontend configuration form and results dashboard.

---

## Day 4 — 2026-05-23
**Hours worked:** 6
**What I did:** Built the React components (`SpendForm.jsx`, `AuditResults.jsx`, `Hero.jsx`, `EmailGate.jsx`). Integrated Tailwind CSS v4. Configured automatic `localStorage` synchronization for all form fields to ensure state persistence on reload.
**What I learned:** LocalStorage syncing works best when throttled/debounced or tied directly to React state hooks.
**Blockers / what I'm stuck on:** Rendering a clean form layout that fits 8 tools on smaller screens without vertical congestion.
**Plan for tomorrow:** Build MongoDB database storage and shareable public URLs.

---

## Day 5 — 2026-05-24
**Hours worked:** 5
**What I did:** Implemented MongoDB Audit schema using Mongoose. Created `/api/save-audit` and `GET /api/audit/:publicUrlId` endpoints. Integrated React Router for shareable public URLs (`/report/:id`). Configured Open Graph and Twitter Card metadata tags.
**What I learned:** Mongoose projection excludes must be explicitly defined to prevent private information like emails from bleeding into public API responses.
**Blockers / what I'm stuck on:** Rendering dynamic metadata for single page applications on platforms that do not parse JavaScript before previewing OG tags.
**Plan for tomorrow:** Implement AI summary generation and transaction emails.

---

## Day 6 — 2026-05-25
**Hours worked:** 5
**What I did:** Connected Google Gemini API for personalized paragraph generation with robust static templates as local failovers. Styled `SavingsHero.jsx` and added custom color-coded borders to results cards. Created transactional email layouts in Resend.
**What I learned:** Citing exact figures in the system instructions is necessary to keep the summary numbers-first and prevent generic LLM filler.
**Blockers / what I'm stuck on:** Sandbox limitations on Resend where emails could only be sent to verified owner addresses.
**Plan for tomorrow:** Styling polish and contrast accessibility overhaul.

---

## Day 7 — 2026-05-26
**Hours worked:** 5
**What I did:** Performed a global layout mask cleanup. Brightened Slate Blue and Cream text highlights in `index.css` to fix text legibility. Changed tool cards and buttons to high-contrast premium styles. Ran Vite build compilation cleanly.
**What I learned:** Radial layout transparency masks can inadvertently darken entire nested grids, severely lowering Lighthouse accessibility ratings.
**Blockers / what I'm stuck on:** Amber card color contrast limitations under dark background schemas.
**Plan for tomorrow:** Final pre-submission checks, unit testing setup, and documentation compilation.