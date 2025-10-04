// models/Receipt.js
const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  filename: { type: String },
  originalName: { type: String },
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  ocrText: { type: String },
  parsed: { type: mongoose.Schema.Types.Mixed } // e.g., {amount, date, vendor}
}, { timestamps: true });

module.exports = mongoose.model('Receipt', ReceiptSchema);
