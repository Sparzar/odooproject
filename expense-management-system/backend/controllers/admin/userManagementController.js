// controllers/admin/userManagementController.js
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Company = require('../../models/Company');

/**
 * Create employee or manager under the admin's company
 */
async function createUser(req, res) {
  const { name, email, password, role = 'employee', managerId, isManagerApprover = false } = req.body;
  const company = req.user.company;
  if (!company) return res.status(400).json({ message: 'Admin has no company' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });

  const passwordHash = await bcrypt.hash(password || 'changeme', 10);
  const u = new User({
    name, email, passwordHash, role, company: company._id, manager: managerId, isManagerApprover
  });
  await u.save();
  res.json({ user: u });
}

async function listUsers(req, res) {
  const companyId = req.user.company._id;
  const users = await User.find({ company: companyId }).select('-passwordHash');
  res.json({ users });
}

async function updateUserRole(req, res) {
  const { userId } = req.params;
  const { role, managerId, isManagerApprover } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role || user.role;
  if (managerId !== undefined) user.manager = managerId;
  if (isManagerApprover !== undefined) user.isManagerApprover = isManagerApprover;
  await user.save();
  res.json({ user });
}

module.exports = { createUser, listUsers, updateUserRole };
