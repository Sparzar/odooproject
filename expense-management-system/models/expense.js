// models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  amount: { type: Number, required: true }, // original amount in provided currency
  currency: { type: String, required: true },
  amountInCompanyCurrency: { type: Number }, // filled by currency converter
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending','approved','rejected','cancelled'], default: 'pending' },
  approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseApproval' }],
  receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }]
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
