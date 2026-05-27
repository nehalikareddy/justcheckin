# JustCheckin - AI Tool Spend Auditor for Startups

JustCheckin is an interactive web platform designed to help startup teams identify cost inefficiencies, redundant developer seats, and tier overpayments across their AI subscription stacks. It acts as a side-project marketing lead-generation tool for **Credex**.

**Deployed URL:** [https://justcheckin.vercel.app](https://justcheckin.vercel.app)

---

## 📸 Screenshots

Here is a visual overview of the interactive dashboard:

![Interactive Configuration Dashboard](file:///C:/Users/MY%20PC/.gemini/antigravity-ide/brain/f72c23e3-00e5-461a-967b-a962c2fc0289/media__1779858864115.png)

![Audit Results Page](file:///C:/Users/MY%20PC/.gemini/antigravity-ide/brain/f72c23e3-00e5-461a-967b-a962c2fc0289/media__1779858883518.png)

![Detailed Tool Breakdown Analysis](file:///C:/Users/MY%20PC/.gemini/antigravity-ide/brain/f72c23e3-00e5-461a-967b-a962c2fc0289/media__1779859141752.png)

---

## 🚀 Key Features

* **Deterministic Audit Engine:** Instantly evaluates stack spending against strict operational finance rules (detecting redundant Cursor + Copilot packages, small team tier bloat, seat mismatches, etc.).
* **AI-Generated Summary:** Generates a blunt, numbers-first startup audit summary using the **Anthropic Claude API**, with a robust Google Gemini API and local rule-based fallback.
* **Database Persistence:** Saves audits automatically in MongoDB, generating secure public sharing URLs that strip private customer information.
* **Lead Capture & Email Notifications:** Integrates with the **Resend API** to capture business leads and send HTML summary reports directly to user inboxes.
* **Premium Dark Aesthetic:** Styled with modern CSS and Tailwind CSS v4, featuring glassmorphism, responsive grids, and ambient color-coded glows based on savings tiers.

---

## 📁 Repository Structure

```
justcheckin/
├── backend/                  # Express.js REST API Server
│   ├── models/               # Mongoose schemas (Audit.js)
│   ├── server.js             # Main server logic and API routes
│   └── .env                  # Environment configuration
├── frontend/                 # Vite + React Client App
│   ├── src/
│   │   ├── components/       # UI Components (Hero, SpendForm, AuditResults, etc.)
│   │   ├── auditEngine.js    # Cost calculation module
│   │   ├── pricingData.js    # Hardcoded vendor pricing indexes
│   │   └── main.jsx          # React app entry point
│   ├── index.html            # Main HTML wrapper (with Open Graph tags)
│   └── vite.config.js        # Vite compilation options
├── ARCHITECTURE.md           # System schemas and Mermaid flow diagrams
├── ECONOMICS.md              # Unit economics and monetization estimates
├── GTM.md                    # Go-To-Market and acquisition strategy
├── METRICS.md                # Key Performance Indicators (KPIs) and growth loops
├── PRICING_DATA.md           # Verified pricing rates and official vendor URLs
├── PROMPTS.md                # Gemini AI prompt engineering details
├── REFLECTION.md             # Engineering trade-offs and retrospective
├── TESTS.md                  # Manual and automated testing checklist
├── USER_INTERVIEWS.md        # Qualitative user research transcripts
└── .github/
    └── workflows/
        └── ci.yml            # CI Quality Check
```

---

## 🧠 Decisions & Design Trade-offs

Here are the 5 major design and architectural trade-offs made during the development of JustCheckin:

### 1. Deterministic Audit Engine vs. LLM-Based Calculation
* **Trade-off:** We built a rule-based engine in pure JavaScript (`auditEngine.js`) rather than sending user inputs to an LLM to generate recommendations.
* **Rationale:** While an LLM could handle unexpected or unstructured inputs, it suffers from hallucinations and latency. Cost auditing demands exact calculations and reproducible logic. Using a deterministic rule-based engine ensures that the calculations are 100% accurate, defensible, and run instantly on the client side with zero API latency.

### 2. Static Pricing Data vs. Dynamic Web Scraping API
* **Decision:** Hardcoded tool pricing in `pricingData.js` rather than making API calls to scrape pricing pages in real time.
* **Rationale:** Hardcoding means we must manually update pricing if vendors adjust rates. However, vendor pricing pages (like Cursor or Claude) are protected by Cloudflare and change layout frequently, making scrapers highly brittle. Static pricing guarantees extreme reliability, fast loading times, and consistency.

### 3. Client-Side Calculations vs. Server-Side Execution
* **Decision:** Run calculations on the client side, then send results to the backend to be persisted.
* **Rationale:** Running calculations on the client allows the UI to update in real time as the user edits fields (dynamic estimated spend meter). The backend only needs to act as a database wrapper and integration hub (for Claude/Gemini/Resend), keeping backend resource consumption minimal and highly scalable.

### 4. SPA + Express Backend vs. Unified Next.js Framework
* **Decision:** Separation of a Vite React SPA and a separate Node/Express server.
* **Rationale:** Next.js provides excellent SSR but adds complexity to hosting and environment configurations on early stage developer servers. A decoupled structure allows us to deploy the frontend to Vercel/Netlify for global CDN performance, and the Express backend to Render/Fly.io independently, reducing deployment failures.

### 5. Multi-Layer AI Fallback vs. Single API Reliance
* **Decision:** Built a tiered fallback pipeline (Anthropic API $\rightarrow$ Google Gemini $\rightarrow$ Local JavaScript template).
* **Rationale:** Relying solely on one AI API key introduces a single point of failure (rate limits, key expiration, sandbox restrictions). Incorporating a multi-tiered fallback ensures the application maintains its premium feel and returns a valid cost summary under any network condition.

---

## 🔧 Environment Configuration

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/justcheckin?appName=Cluster0
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key
RESEND_API_KEY=re_your_resend_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## 💻 Local Setup & Execution

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server will launch on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will launch on `http://localhost:5173`. Open this URL in your web browser to access the app.

---

## 🛡️ License

Built as a proprietary marketing utility for **Credex**. All rights reserved.
