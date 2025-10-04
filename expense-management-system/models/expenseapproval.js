// models/ExpenseApproval.js
const mongoose = require('mongoose');

const ExpenseApprovalSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sequence: { type: Number, default: 0 }, // order in multi-step
  decision: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  comments: { type: String },
  decidedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseApproval', ExpenseApprovalSchema);
