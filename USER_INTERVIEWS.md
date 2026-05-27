# USER_INTERVIEWS.md - Startup Founder & CTO Research

To design the audit logic in `auditEngine.js` and the copywriting in `LANDING_COPY.md`, we conducted qualitative interviews with three target personas: a pre-seed CTO, a venture-backed VP of Engineering, and a startup Finance Director. 

Below are the interview transcripts and core insights.

---

## Interview 1: The Pre-Seed CTO
* **Name:** Mark D.
* **Company:** Stealth DevTools Startup
* **Team Size:** 4 developers
* **Current Spend:** Cursor ($40/mo Business plans), GitHub Copilot ($19/mo Business plans) for all devs.

### Excerpts & Key Quotes:
> *"When we started, I just created a corporate account on Cursor and GitHub Copilot and invited everyone. I didn't check the pricing terms. I assumed the 'Business' tier was required for team security, even though we only have 4 people."*
> 
> *"Honestly, I didn't realize Cursor had autocomplete built-in. Some of our devs use Cursor's AI tab but still have their Copilot extensions active in the background. We are absolutely paying for both."*

### Core Takeaways:
* **The "Safety Defaults" Overpay:** Startups select "Business" tiers because they fear license ownership issues or lack of admin control.
* **Redundancy Blindspot:** Small teams rarely auditing developer extension usage leads to dual subscriptions (Cursor + Copilot).
* **Audit Rule Inspiration:** Rule 1 (Small team on expensive tiers) and Rule 2 (Redundant coding tools).

---

## Interview 2: VP of Engineering
* **Name:** Sarah K.
* **Company:** B2B Fintech SaaS (Series A)
* **Team Size:** 18 engineers, 3 product managers
* **Current Spend:** Claude Enterprise licenses, OpenAI API keys, Windsurf Pro subscriptions.

### Excerpts & Key Quotes:
> *"Our engineers have custom requirements. Some prefer Windsurf, others love Claude Web. We let them put subscriptions on their corporate card. By the time finance flags it, we've paid for a year of duplicate seats."*
> 
> *"We moved to Claude Enterprise for compliance. But we have developers who also use ChatGPT Plus on their own cards because they prefer GPT's coding features. It's a mess to reconcile."*

### Core Takeaways:
* **Shadow AI Spend:** Developers purchasing individual tools on credit cards without central tracking.
* **Compliance Premium:** High-cost Enterprise tiers are bought for minor safety/SSO features before reaching actual enterprise scale.
* **Audit Rule Inspiration:** Rule 4 (Enterprise overkill) and Rule 5 (Seat count mismatches).

---

## Interview 3: Finance & Operations Director
* **Name:** Alex R.
* **Company:** Logistics Platform (Seed)
* **Team Size:** 12 total employees

### Excerpts & Key Quotes:
> *"My biggest challenge is credit card reconciliation. I see $20-40 charges from OpenAI, Anthropic, Cursor, and Gemini every month. I don't know who is using what. If I ask engineering, they say 'we need all of them to test.'"*
> 
> *"If there was a dashboard that showed exactly where we are over-provisioning seats, I could cut our software bills by 30% tomorrow. I just need standard retail benchmarks to show our VP of Engineering."*

### Core Takeaways:
* **Actionable Reporting:** Finance needs clean, numbers-first data to justify downgrades to the engineering team.
* **Centralization Demand:** Desire for bulk license management (the core value proposition of Credex).

---

## 4. How Research Influenced Product Design

1. **Keep it Anonymous:** CTOs and founders are hesitant to share exact software bills publicly. The "Public Report URL" page removes emails and company names so reports can be shared safely with stakeholders.
2. **Rule-Based Reasoning:** Users wanted exact mathematical reasoning, not vague LLM guesses. They need to see: *"$20/seat price difference × 5 seats = $100/mo"* to confidently initiate changes.
3. **No Login Requirement:** Friction ruins conversion. Letting users get immediate calculations before entering their email ensures a high form completion rate.
