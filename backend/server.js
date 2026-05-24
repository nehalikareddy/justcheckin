require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Audit = require('./models/Audit');
const { Anthropic } = require('@anthropic-ai/sdk');
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

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-anthropic-key' });

app.post('/api/generate-summary', async (req, res) => {
  const { auditData } = req.body;
  
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      system: "You are a financial auditor for a startup. Write a ~100-word personalized summary paragraph based on the provided AI tool audit data. Be direct and actionable.",
      messages: [{ role: "user", content: JSON.stringify(auditData) }]
    });
    res.json({ summary: msg.content[0].text });
  } catch (error) {
    console.error("Anthropic API Error:", error);
    // Graceful fallback as required by the assignment
    res.json({ 
      summary: "Based on your audit, there are clear opportunities to optimize your AI stack. We recommend reviewing unused seats and transitioning to individual tiers where team collaboration tools are unnecessary." 
    });
  }
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
    await resend.emails.send({
      from: 'JustCheckin <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Results 🔍',
      html: `<p>Thanks for using JustCheckin! You have a potential savings of $${totalSavings}/mo.</p>
             <p>Access your full report here: http://localhost:5173/report/${publicUrlId}</p>
             ${totalSavings > 500 ? '<p>Since your savings are substantial, Credex will be in touch to help you capture them.</p>' : ''}`
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