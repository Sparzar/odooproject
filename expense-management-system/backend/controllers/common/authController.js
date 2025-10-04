// controllers/common/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Company = require('../../models/Company');

// Signup: on first signup create company and admin
async function signup(req, res) {
  const { name, email, password, companyName, country, currency } = req.body;
  if (!email || !password || !companyName) return res.status(400).json({ message: 'Missing fields' });

  // If a company with same name exists, attach to it? For simplicity we create new company.
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists' });

  const company = new Company({
    name: companyName,
    country: country || 'Unknown',
    currency: currency || 'USD'
  });
  await company.save();

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    passwordHash,
    role: 'admin',
    company: company._id
  });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('company');
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, role: user.role, company: user.company } });
}

module.exports = { signup, login };
