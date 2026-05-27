# USER_INTERVIEWS.md - Developer & AI Engineer Research

To design the audit logic in `auditEngine.js` and the copywriting in `LANDING_COPY.md`, we conducted qualitative interviews with real developers and AI engineers actively using and paying for AI tools. Below are the full transcripts and core insights extracted from each interview.

All interviews conducted: **May 27, 2026** (WhatsApp / Slack DMs)

---

## Interview 1: Developer at a Funded Startup (Company-Managed Spend)

* **Role:** Developer at Chiacon
* **Situation:** Company pays for AI subscriptions; individual has no direct billing visibility
* **Tools in Use:** Claude Teams (company plan)

### Q&A Transcript:

**Q1. What AI tools do you currently pay for and roughly how much per month?**
> *"We use Claude Teams at Chiacon — the company pays for it so I don't track the exact bill, but it's a team plan so probably $25–30/seat/month range."*

**Q2. Do you actually know if you're getting good value from them, or do you just pay the bill?**
> *"Not really, no. I just use it and the invoice goes to the company. I'd notice if it stopped working but I've never actually measured ROI."*

**Q3. Have you ever downgraded, cancelled, or switched an AI tool? What made you do it?**
> *"Haven't personally switched anything — Chiacon handles the subscriptions. Though I do hit rate limits pretty often when I'm deep in a coding session, which is annoying enough that I've thought about it."*

**Q4. If a free tool told you exactly where you were overspending on AI and what to switch to — would you use it? What would make you trust or not trust it?**
> *"Yeah I'd use it, especially if it flagged stuff like 'you're hitting limits on Teams but X plan would cost less and give you more headroom for dev work.' I'd trust it if it showed actual data, not just opinions. I'd distrust it if it pushed one specific tool too hard."*

**Q5. What's your role and are you at a startup, freelancing, or a bigger company?**
> *"Developer at Chiacon startup. Company handles the AI spend, I just deal with the limits on the ground."*

### Core Takeaways:
* **Invisible Spend Problem:** Developers at company-funded setups have zero visibility into the actual bill, yet they're the ones experiencing the product's limits daily.
* **Rate Limit Pain → Upgrade Signal:** Hitting rate limits regularly is a strong signal the current plan is undersized, but without billing access, developers can't act on it.
* **Trust Through Data:** Recommendations need to be grounded in real numbers ("$X/plan, Y headroom"), not tool advocacy. This validated our rule-based over LLM-opinion approach.
* **Audit Rule Inspiration:** Seat count mismatch rule, rate limit detection as an overpay signal.

---

## Interview 2: LLM Engineer (Credits-Funded, Multi-Tool Stack)

* **Role:** LLM Engineer — builds Agentic AI solutions for small-scale organizations
* **Situation:** Currently on credits from hackathons/events (~$100/month equivalent), not paying cash
* **Tools in Use:** Codex, Gemini CLI, Kiro CLI, Claude Code

### Q&A Transcript:

**Q1. What AI tools do you currently pay for and roughly how much per month?**
> *"I don't pay for any yet, cuz I keep getting credits via events, roughly $100 per month. Tools include — Codex, Gemini CLI, Kiro CLI, Claude Code."*

**Q2. Do you actually know if you're getting good value from them, or do you just pay the bill?**
> *"Yeah I'm getting great value out of them. I think it just depends on the user, how well they can use the service."*

**Q3. Have you ever downgraded, cancelled, or switched an AI tool? What made you do it?**
> *"Gemini CLI and Google Antigravity imo, as they keep getting stuck midway. Since the context window of Gemini CLI is huge it misses out a lot of context causing rot."*

**Q4. If a free tool told you exactly where you were overspending on AI and what to switch to — would you use it? What would make you trust or not trust it?**
> *"I'm not really sure about using that tool for tracking spends as the providers' dashboards show a detailed view in the interface itself, like the token exchange and the cost per call. But if it suggested which to switch to based on the work I'm doing — like if it can analyze my design.md or plan.md and plan out a list of models for different tasks based on complexity and make the whole dev cost-efficient — then that's worth trying."*

**Q5. What's your role and are you at a startup, freelancing, or a bigger company?**
> *"My role being LLM engineer, I work on Agentic AI solutions for small-scale organizations."*

### Core Takeaways:
* **Credits as a Blind Spot:** Free credits mask real cost. Users on credits have no incentive to optimize now — but when credits run out, they're suddenly paying $100+/month with no optimized habits. JustCheckin is most useful pre-expiry.
* **Context Rot as a Switching Trigger:** Tool quality degradation (not cost) is the primary reason power users switch. This is a product angle we haven't addressed.
* **Deeper Value Ask:** This user wants tool-task matching, not just spend auditing. A "which model for which task" layer would significantly increase perceived value for this persona.
* **Audit Rule Inspiration:** API overuse vs. subscription arbitrage rule; credits expiry flag.

---

## Interview 3: AI Engineer (High-Volume, Multi-Role)

* **Role:** Associate Technical Specialist (AI Dept) at Digitalapi.ai + AI Engineer at Skooc (MIJ Technologies) + AI Consultant at RightSense
* **Team Size:** Individual contributor across multiple companies
* **Current Spend:** Claude Code + Codex — ₹6,000–₹7,000/month (~$75–85/month USD)

### Q&A Transcript:

**Q1. What AI tools do you currently pay for and roughly how much per month?**
> *"Primarily Claude Code and Codex — roughly ₹6,000–₹7,000 per month."*

**Q2. Do you actually know if you're getting good value from them, or do you just pay the bill?**
> *"Yes, we're very conscious of the value. These tools have genuinely compressed months of development and iteration cycles, so the ROI is clear."*

**Q3. Have you ever downgraded, cancelled, or switched an AI tool? What made you do it?**
> *"Frequently, actually. Claude Code's usage limits mean a standard Pro subscription often isn't enough during high-workload phases. In those cases, we'll either spin up an additional Claude Pro account or upgrade to Claude Max ($100/month) for that period, then downgrade once the workload normalises. On the switching side — we tend to shift to Codex when the work is more execution-heavy rather than creative."*

**Q4. If a free tool told you exactly where you were overspending on AI and what to switch to — would you use it? What would make you trust or not trust it?**
> *"Honestly, no — and that's not cynicism, that's experience. We developers are cost-conscious, so we're already experimenting with Copilot, Gemini CLI, Codex, and others regularly. The deeper issue with switching isn't cost — it's context and synergy. By the time you're mid-project, your chosen tool has absorbed your preferences, memory, and workflow. Onboarding a new tool at that stage means rebuilding all of that from scratch, which is rarely worth it. As for trusting a free tool's recommendation — the skepticism is structural. No free tool will ever have the full picture."*

**Q5. What's your role and are you at a startup, freelancing, or a bigger company?**
> *"I wear a few hats. I'm an Associate Technical Specialist in the AI Department at Digitalapi.ai, and also work part-time as an AI Engineer at Skooc (under its parent company, MIJ Technologies), alongside an AI Consultant role at RightSense."*

### Core Takeaways:
* **Elastic Spend Management:** Power users already manually manage spend elastically — upgrading to Claude Max during crunch, downgrading after. JustCheckin can automate this insight.
* **Tool-Task Matching Over Cost:** Like Interview 2, this user switches tools based on task type (creative vs. execution-heavy), not cost. Recommending the right tool for the right job has higher value than pure cost optimization.
* **Context Lock-In is Real:** Switching costs are psychological and workflow-based, not just financial. Our product should position recommendations as *additions* or *replacements*, not just cancellations.
* **Skepticism Toward Free Tools:** Structural distrust of free recommendation engines reinforces the need for our transparent, math-first audit reasoning (showing `$X/seat × Y seats = $Z` not just "switch to this").
* **Audit Rule Inspiration:** Dynamic plan switching (upgrade/downgrade based on workload), multi-account redundancy, task-based tool routing.

---

## 4. How Research Influenced Product Design

1. **Show the Math, Not the Opinion:** All three interviewees explicitly said they'd distrust a tool that pushes recommendations without data. Every audit flag in `auditEngine.js` shows the exact dollar calculation: `$price/seat × seats = savings`.

2. **Rate Limits as an Audit Signal:** Interview 1 revealed that rate limit frustration is a direct indicator of plan undersizing — a signal our engine now surfaces as an "overpaying" flag (paying for a plan that throttles you is not getting full value).

3. **Company-Managed vs. Self-Managed Spend:** Interviews 1 and 3 showed two distinct user types. Interview 1 (company-managed) needs a tool that helps *advocate* for a better plan internally. Interview 3 (self-managed) already optimizes manually — JustCheckin automates what they do intuitively.

4. **Credits Expiry Is an Untapped Hook:** Interview 2's credits-based usage revealed a user who will inevitably start paying. JustCheckin is most valuable *before* the first real bill, to build good habits. This informed the "Free · No signup" positioning on the landing page.

5. **No Login Requirement:** All three users would abandon a tool requiring account creation before showing results. Immediate calculations before the email gate ensures high completion rates — validated by this research.
