// controllers/employee/expenseController.js
const Expense = require('../../models/Expense');
const ExpenseApproval = require('../../models/ExpenseApproval');
const ApprovalRule = require('../../models/ApprovalRule');
const { convertAmount } = require('../../utils/currencyConverter');
const { notifyUser } = require('../../utils/notification');
const User = require('../../models/User');

async function submitExpense(req, res) {
  const { amount, currency, category, description, date } = req.body;
  const employee = req.user;
  const company = employee.company;

  const amountInCompanyCurrency = await convertAmount(amount, currency, company.currency);

  const expense = new Expense({
    employee: employee._id,
    company: company._id,
    amount,
    currency,
    amountInCompanyCurrency,
    category,
    description,
    date: date || Date.now()
  });

  // Determine approval flow: simplest — manager first if exists and is approver, else find company rules (one could expand)
  const approvals = [];
  // Step 1: manager approver if manager set and isManagerApprover true
  if (employee.manager) {
    const manager = await User.findById(employee.manager);
    if (manager && manager.isManagerApprover) {
      const ea = new ExpenseApproval({ expense: expense._id, approver: manager._id, sequence: 1 });
      await ea.save();
      approvals.push(ea._id);
      await notifyUser(manager._id, `Expense awaiting your approval from ${employee.name}`);
    }
  }

  // Additional: if company has an approval rule with sequenceApprovers, append them
  const rules = await ApprovalRule.find({ company: company._id, active: true });
  if (rules && rules.length) {
    // Use the first rule for demo
    const rule = rules[0];
    let seq = approvals.length + 1;
    for (const approverId of rule.sequenceApprovers) {
      const ea = new ExpenseApproval({ expense: expense._id, approver: approverId, sequence: seq++ });
      await ea.save();
      approvals.push(ea._id);
      await notifyUser(approverId, `Expense awaiting your approval from ${employee.name}`);
    }
  }

  expense.approvals = approvals;
  await expense.save();

  res.json({ expense });
}

async function getMyExpenses(req, res) {
  const expenses = await Expense.find({ employee: req.user._id }).populate('approvals').sort({ createdAt: -1 });
  res.json({ expenses });
}

module.exports = { submitExpense, getMyExpenses };
