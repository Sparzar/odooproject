// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // employee -> manager
  isManagerApprover: { type: Boolean, default: false } // if manager acts as approver
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
