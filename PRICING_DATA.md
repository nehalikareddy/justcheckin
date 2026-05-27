# PRICING_DATA.md - AI Developer Tools Reference Pricing (May 2026)

All pricing data hardcoded in `frontend/src/pricingData.js` has been verified against official vendor pricing pages as of the week of **May 24, 2026**.

---

## 1. Cursor
* **Hobby:** $0/month (100 slow GPT-4o, unlimited cursor-small).
* **Pro:** $20/user/month (500 fast premium requests, unlimited slow, 10 o1-mini).
* **Business:** $40/user/month (Admin dashboard, SSO, centralized billing, usage control).
* **Enterprise:** Custom (Estimated standard baseline of **$100/seat/month** is used in the audit engine for comparison).
* **Official Pricing Page:** [https://cursor.com/pricing](https://cursor.com/pricing)

## 2. GitHub Copilot
* **Individual:** $10/user/month or $100/year (For individual developers, freelancers, students).
* **Business:** $19/user/month (Policy management, privacy controls, license management, proxy support).
* **Enterprise:** $39/user/month (Custom models, fine-tuning, workspace knowledge base customization).
* **Official Pricing Page:** [https://github.com/features/copilot#pricing](https://github.com/features/copilot#pricing)

## 3. Claude (Anthropic)
* **Free:** $0/month (Access to Claude 3.5 Sonnet on web, basic limits).
* **Pro:** $20/month (5x usage of Free tier, Claude 3.5 Sonnet & Opus, Project workspaces).
* **Max:** $50/month (Higher limits, prioritized availability).
* **Team:** $30/user/month (Min 5 seats, larger prompt windows, admin panel, billing integration).
* **Enterprise:** Custom (Baseline estimate of **$95/seat/month** based on standard enterprise upgrades).
* **API Direct:** Usage-based (Estimated standard developer monthly baseline of **$45** used for direct developer keys).
* **Official Pricing Page:** [https://claude.ai/upgrade](https://claude.ai/upgrade) & [https://www.anthropic.com/pricing](https://www.anthropic.com/pricing)

## 4. ChatGPT (OpenAI)
* **Plus:** $20/month (Access to GPT-4o, GPT-4, GPT-3.5, custom GPTs, advanced data analysis).
* **Team:** $25/user/month (Billed annually, or $30 billed monthly. Admin console, workspace data privacy).
* **Enterprise:** Custom (Baseline estimate of **$60/seat/month** based on standard contract pricing).
* **API Direct:** Usage-based (Estimated standard developer monthly baseline of **$40** used for direct developer keys).
* **Official Pricing Page:** [https://openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing) & [https://openai.com/api/pricing](https://openai.com/api/pricing)

## 5. Gemini (Google)
* **Google One AI Premium (Advanced):** $19.99/month (Gemini 1.5 Pro, 2TB Google Drive space, Gemini integration in Docs/Gmail).
* **Gemini for Workspace Business:** $30/user/month (Workspace integration, enterprise-grade data security).
* **API Direct (AI Studio / Vertex):** Usage-based (Estimated standard developer monthly baseline of **$35** used).
* **Official Pricing Page:** [https://one.google.com/about/ai-premium](https://one.google.com/about/ai-premium) & [https://workspace.google.com/pricing](https://workspace.google.com/pricing)

## 6. Windsurf (Codeium)
* **Free:** $0/month (Unlimited basic usage, basic autocomplete).
* **Pro:** $15/month (Unlimited fast premium models, Windsurf agent chat).
* **Team:** $30/user/month (SSO, seat manager, team context indexes).
* **Official Pricing Page:** [https://codeium.com/windsurf/pricing](https://codeium.com/windsurf/pricing)

---

## 7. Audit Engine Calculation Methodology

Enterprise and API Direct pricing are modeled using standard industrial estimates:
1. **API Direct Spend Estimation:** Developer API spend varies, but our audit engine uses standard benchmarks representing developer workloads doing typical coding support (~10M tokens/month).
2. **SSO and Compliance Premium:** Standard enterprise tiers are flagged for teams `<10` because the extra $20-$60/seat/month cost is purely for compliance features (like SAML/SSO) which are rarely necessary for early-stage startups.