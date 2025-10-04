// models/ApprovalRule.js
const mongoose = require('mongoose');

const ApprovalRuleSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  sequenceApprovers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ordered approvers
  percentageRule: { type: Number }, // e.g., 60 for 60%
  specificApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // e.g., CFO
  hybrid: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ApprovalRule', ApprovalRuleSchema);
