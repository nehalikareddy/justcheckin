const mongoose = require('mongoose');

const ToolResultSchema = new mongoose.Schema({
  toolKey: String,
  toolName: String,
  currentPlan: String,
  currentSpend: Number,
  recommendedPlan: String,
  recommendedSpend: Number,
  monthlySavings: Number,
  annualSavings: Number,
  flag: String,
  reason: String,
  alternativeTool: {
    name: String,
    reason: String
  },
  creditsOpportunity: {
    program: String,
    reason: String
  }
});

const AuditSchema = new mongoose.Schema({
  publicUrlId: { type: String, required: true, unique: true, index: true },
  // Public data (shown on shareable page)
  totalMonthlySavings: Number,
  totalAnnualSavings: Number,
  overallVerdict: String,
  perTool: [ToolResultSchema],
  useCase: String,
  teamSize: Number,
  summary: String,
  // Private data (stripped from public URL)
  email: String,
  company: String,
  role: String,
  // Metadata
  createdAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Audit', AuditSchema);
