// controllers/admin/approvalRulesController.js
const ApprovalRule = require('../../models/ApprovalRule');

async function createApprovalRule(req, res) {
  const { name, sequenceApprovers = [], percentageRule, specificApprover, hybrid } = req.body;
  const company = req.user.company;
  const rule = new ApprovalRule({
    company: company._id,
    name,
    sequenceApprovers,
    percentageRule,
    specificApprover,
    hybrid
  });
  await rule.save();
  res.json({ rule });
}

async function listRules(req, res) {
  const rules = await ApprovalRule.find({ company: req.user.company._id }).populate('sequenceApprovers specificApprover', 'name email role');
  res.json({ rules });
}

module.exports = { createApprovalRule, listRules };
