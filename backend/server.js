require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Audit = require('./models/Audit');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/justcheckin';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.warn('Backend running without database persistence.');
  });

// Rate limiting: prevent spam on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max requests per IP per window
  message: { error: "Too many requests. Please try again later." }
});
app.use('/api/', apiLimiter);

const https = require('https');

function callGeminiAPI(apiKey, promptContent) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: promptContent }] }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7
      }
    });

    if (typeof fetch === 'function') {
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })
      .then(res => {
        if (!res.ok) return res.text().then(t => reject(new Error(t)));
        return res.json();
      })
      .then(resolve)
      .catch(reject);
    } else {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`Status: ${res.statusCode}, Body: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    }
  });
}

app.post('/api/generate-summary', async (req, res) => {
  const { auditData, publicUrlId } = req.body;
  
  const promptContent = `
You are a blunt, numbers-first financial advisor for startups.

Given this AI tool audit result, write a 90-110 word summary paragraph.
Rules:
- Start with the single biggest finding
- Cite 2 specific dollar amounts from the data
- End with one concrete next step
- Do NOT use bullet points — flowing paragraph only
- Do NOT be sycophantic ("Great job!" etc)

Audit data:
${JSON.stringify(auditData, null, 2)}
  `.trim();

  let summaryText = "";
  let methodUsed = "";

  try {
    // 1. Attempt Gemini API (Primary)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.startsWith('dummy') && geminiKey !== 'your_gemini_api_key_here') {
      try {
        console.log("Attempting Gemini API call for summary...");
        const data = await callGeminiAPI(geminiKey, promptContent);
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
          summaryText = data.candidates[0].content.parts[0].text.trim();
          methodUsed = "Gemini";
        } else {
          throw new Error('Invalid response structure from Gemini API');
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, using static template fallback:", geminiError.message);
      }
    }

    // 2. Static Template Fallback (Primary Fallback)
    if (!summaryText) {
      console.log("Using static template fallback for summary.");
      const savings = auditData?.totalMonthlySavings || 0;
      summaryText = savings > 0
        ? `Your audit identified $${savings}/month in potential savings across your AI tool stack. The largest opportunity is switching over-provisioned team plans to individual tiers — a common pattern for teams under 10. Redundant tools are also costing you more than necessary. Start by cancelling the lowest-value subscription and reallocating that budget to the tools your team uses daily.`
        : `Your AI tool spend looks well-optimized for your team size and use case. You're on appropriately sized plans with no obvious redundancies. Keep an eye on seat counts as your team grows — the transition from individual to team tiers can catch you off guard if you add headcount quickly.`;
      methodUsed = "Local Template";
    }

    console.log(`Summary generated successfully using ${methodUsed}`);
  } catch (error) {
    console.error("General error in generate-summary endpoint:", error);
    summaryText = "Your AI tool spend audit is complete. View details below to optimize your setup.";
  }

  // Persist the summary in the database if publicUrlId is provided
  if (publicUrlId && summaryText) {
    try {
      await Audit.findOneAndUpdate({ publicUrlId }, { summary: summaryText });
    } catch (dbErr) {
      console.error("Failed to save summary to database:", dbErr);
    }
  }

  res.json({ summary: summaryText });
});

// NEW endpoint: Save audit + return publicUrlId
app.post('/api/save-audit', async (req, res) => {
  const { auditResult, teamSize, useCase } = req.body;
  try {
    const publicUrlId = crypto.randomBytes(4).toString('hex'); // e.g. "a3f2c1d8"
    await Audit.create({
      publicUrlId,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      overallVerdict: auditResult.overallVerdict,
      perTool: auditResult.perTool,
      useCase,
      teamSize
    });
    res.json({ publicUrlId });
  } catch (error) {
    console.error('Save audit error:', error);
    res.status(500).json({ error: 'Failed to save audit' });
  }
});

// NEW endpoint: Fetch public audit (strips email/company/role)
app.get('/api/audit/:publicUrlId', async (req, res) => {
  try {
    const audit = await Audit.findOne(
      { publicUrlId: req.params.publicUrlId },
      { email: 0, company: 0, role: 0 } // exclude private fields
    );
    if (!audit) return res.status(404).json({ error: 'Audit not found' });
    res.json(audit);
  } catch (error) {
    console.error('Fetch audit error:', error);
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
});

// Lead capture and email notifications
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummykey');

app.post('/api/capture-lead', async (req, res) => {
  const { email, company, role, teamSize, totalSavings, publicUrlId } = req.body;

  try {
    // 1. Save to Database (MongoDB logic)
    let audit = await Audit.findOne({ publicUrlId });
    if (!audit) {
      // Graceful fallback if MongoDB failed to save or is offline
      audit = await Audit.create({
        publicUrlId,
        totalMonthlySavings: totalSavings,
        totalAnnualSavings: totalSavings * 12,
        overallVerdict: "AI Spend Audit",
        perTool: [],
        email,
        company,
        role,
        teamSize,
        emailSent: true
      });
    } else {
      audit.email = email;
      audit.company = company;
      audit.role = role;
      audit.emailSent = true;
      await audit.save();
    }

    // Send confirmation email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    await resend.emails.send({
      from: 'JustCheckin <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Results 🔍',
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc;">
  <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <h1 style="font-size: 24px; color: #0f172a; margin-top: 0; font-weight: 800; tracking: tight;">Your AI Spend Audit is ready 🔍</h1>
    <p style="font-size: 16px; color: #475569; line-height: 1.6;">Thanks for auditing your stack with JustCheckin. Here's a summary of what we identified:</p>
    
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #166534; margin: 0; letter-spacing: 0.05em;">Potential Monthly Savings</p>
      <p style="font-size: 36px; font-weight: 900; margin: 8px 0 4px; color: #15803d;">
        $${totalSavings}/mo
      </p>
      <p style="font-size: 14px; color: #166534; margin: 0; font-weight: 600;">$${totalSavings * 12}/year total value</p>
    </div>
    
    <p style="text-align: center; margin: 32px 0 24px;">
      <a href="${frontendUrl}/report/${publicUrlId}" 
        style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 700; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(15,23,42,0.1);">
        View Detailed Audit Report
      </a>
    </p>
    
    ${totalSavings > 500 ? `
    <div style="background-color: #fffbeb; border: 1px solid #fef08a; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #eab308;">
      <strong style="color: #854d0e; font-size: 15px; display: block; margin-bottom: 4px;">📞 Substantial Savings Opportunity</strong> 
      <span style="color: #713f12; font-size: 14px; line-height: 1.5; display: block;">
        Because your savings exceed $500/month, you qualify for the Credex scale optimization program. Credex provides the exact same developer tools at up to 40% off retail pricing. A startup spend expert will reach out to you within 2 business days.
      </span>
    </div>
    ` : ''}
    
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 24px;" />
    
    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
      JustCheckin · A free tool by Credex · <a href="https://credex.rocks" style="color: #64748b; text-decoration: underline;">credex.rocks</a>
    </p>
  </div>
</body>
</html>
`
    });

    res.status(200).json({ success: true, message: "Lead captured and email sent." });
  } catch (error) {
    console.error("Lead Capture Error:", error);
    res.status(500).json({ error: "Failed to process lead." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`JustCheckin Backend active on port ${PORT}`);
});