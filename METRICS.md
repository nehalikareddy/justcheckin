# METRICS.md - Success Metrics & Growth KPIs

This document details the Key Performance Indicators (KPIs) and growth loops tracked to measure the optimization value and lead-generation efficiency of **JustCheckin** for **Credex**.

---

## 1. North Star Metric & Justification
Our **North Star Metric** is: **Total Monthly SaaS Savings Identified for Qualified Leads ($/month)**.

* **Why:** This metric represents the intersection of customer value and business value. For the startup user, identifying savings represents direct financial relief. For Credex, this metric measures the high-intent pipeline we create; startups with substantial identified savings are prime candidates for our bulk licensing resale program. If we increase the total savings identified, it proves we are reaching the right audience (scaling startups with high tooling overhead) rather than students or hobbyists with $0 optimization potential.

---

## 2. 3 Core Input Metrics
To drive the North Star Metric, we monitor 3 primary input metrics:
1. **Traffic-to-Console Conversion Rate (%):** The percentage of landing page visitors who click the CTA and complete the stack configuration form. A higher rate indicates clear messaging and low form friction.
2. **Lead Capture Opt-In Rate (%):** The percentage of users who complete the audit and provide their email to unlock their public report. Target is **35%**.
3. **High-Savings Qualified Lead Volume (Count):** The number of weekly audits identifying >$500/mo in savings, representing high-intent sales opportunities.

---

## 3. Instrumentation Priority (Events to Track First)
To optimize the funnel, we instrument event tracking in our analytics layer (e.g. Mixpanel/Segment) with the following priority:
* **Priority 1 (Critical Funnel Events):**
  * `audit_submitted`: Triggered when a user clicks "Generate Audit Report".
  * `lead_captured`: Triggered when a user submits the email form.
  * `report_shared`: Triggered when the "Copy Link" or "Copy for Slack" button is clicked.
* **Priority 2 (Console Interaction Events):**
  * `tool_added`/`tool_removed`: Tracks which tools (Cursor, Copilot, etc.) are selected most frequently.
  * `seats_modified`: Tracks if users adjust seat counts from default team size.

---

## 4. Pivot Trigger Number
We define our **Pivot Trigger Number** as: **Less than 5% Qualified Lead Conversion after 1,000 unique audits run.**

* **The Pivot:** If less than 5% of completed audits identify >$500/mo in savings, it indicates that either our target audience is too small/pre-revenue or manual tool tracking is too simplistic. If we hit this trigger, we will pivot JustCheckin from a manual calculator into an **automated Plaid-connected audit scanner**, allowing startups to securely link their corporate cards to pull exact historical charges automatically, capturing hidden shadow IT spend that users forget to type manually.
