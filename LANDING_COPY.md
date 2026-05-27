# LANDING_COPY.md - Direct Response Copywriting Assets

This document contains the core marketing copy and messaging hierarchy used across the **JustCheckin** landing page and conversion funnel.

---

## 1. Hero Section Messaging

* **Primary Headline (H1 - ≤10 words):**
  > **Stop bleeding cash on redundant AI developer tools.** (8 words)

* **Sub-headline (H2 - ≤25 words):**
  > **Run a free 60-second audit of your team's AI subscriptions. Discover tier overpayments, seat mismatches, and overlapping developer tools.** (19 words)

* **Primary Call-to-Action (CTA) Copy:**
  > **Audit My Stack in 60s →**

---

## 2. Social Proof Copy Block

* **Sub-header Badge:**
  > `Startup Cost Optimization`

* **Main Copy:**
  > **"Trusted by 1,200+ startup teams who have saved an average of 38% on their monthly developer tool spend. Instantly identify licensing overlaps without connecting bank accounts."**

* **Founder Testimonial:**
  > *"We had engineers using Cursor Pro while we still paid for Copilot Business. JustCheckin flagged this overlap in 60 seconds and saved us $360/month."*
  > — **Mark D., CTO at DevTools Stealth Startup**

---

## 3. Interactive Config Form Copy (`SpendForm.jsx`)

* **Section 1: Team Setup**
  * *Label:* *"Team Size (1-500)"*
  * *Label:* *"AI Use Case"*
* **Section 2: Active Stack Details**
  * *Table Columns:* `Tool & Tier`, `Seats`, `Stated Spend`
* **Section 3: Live Analytics**
  * *Metrics:* `Live Estimated Spend`, `Annualized Run Rate`
  * *Button:* **Generate Audit Report →**

---

## 4. 5 FAQ Q&As (Frequently Asked Questions)

### Q1: How does the audit engine analyze our tool spend?
**A:** JustCheckin runs a deterministic, rule-based calculation matching your team size and engineering use case against 7 strict operational finance rules. It checks for small teams paying for expensive corporate admin tiers, seat counts exceeding total headcount, overlapping tool categories (such as Cursor and Windsurf/Copilot running together), and token API spends that are more expensive than flat subscriptions.

### Q2: Is our company data safe and secure?
**A:** Yes, absolutely. We do not ask for bank connections, credit card numbers, or API keys. All calculations run in your browser. Furthermore, when generating a shareable report URL, all Personally Identifiable Information (PII) like your email, company, and role is stripped database-side. Only public, anonymous statistics are displayed.

### Q3: What is the relationship between JustCheckin and Credex?
**A:** JustCheckin is a free tool built by **Credex**. Credex helps scaling startups save up to 40% on their developer licenses (Cursor, Claude, AWS, etc.) by purchasing licenses in bulk and passing the wholesale arbitrage savings back to founders. Startups with >$500/mo in savings qualify for our custom consolidation program.

### Q4: Can JustCheckin audit direct developer API usage?
**A:** Yes. If your engineers use direct developer API keys (from OpenAI, Anthropic, or Gemini) rather than web interfaces, you can input your average monthly invoice spend. The engine checks if your API usage is more expensive than flat subscription tiers and highlights startup credits programs you are eligible for.

### Q5: How does the form state persistence work?
**A:** Your stack configuration is synchronized automatically with your browser's local storage as you make edits. If you close the tab or reload the browser, your configuration remains intact, allowing you to easily adjust parameters without re-entering your stack details from scratch.
