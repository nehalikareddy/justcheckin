require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { Anthropic } = require('@anthropic-ai/sdk');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting: prevent spam on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max requests per IP per window
  message: { error: "Too many requests. Please try again later." }
});
app.use('/api/', apiLimiter);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

// Lead capture and email notifications
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/capture-lead', async (req, res) => {
  const { email, company, role, teamSize, totalSavings, publicUrlId } = req.body;

  try {
    // 1. Save to Database (MongoDB logic goes here)
    // await Lead.create({ email, company, role, teamSize, totalSavings, publicUrlId });

    // Send confirmation e
    await resend.emails.send({
      from: 'JustCheckin <onboarding@resend.dev>',
      to: email,
      subject: 'Your AI Spend Audit Results 🔍',
      html: `<p>Thanks for using JustCheckin! You have a potential savings of $${totalSavings}/mo.</p>
             <p>Access your full report here: justcheckin.com/report/${publicUrlId}</p>
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