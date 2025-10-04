// models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String },
  currency: { type: String, required: true }, // default currency
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
