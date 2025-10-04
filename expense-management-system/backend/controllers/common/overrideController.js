// controllers/common/overrideController.js
const Expense = require('../../models/Expense');

async function overrideExpenseStatus(req, res) {
  const { expenseId } = req.params;
  const { status, note } = req.body; // status: approved/rejected/cancelled
  const expense = await Expense.findById(expenseId);
  if (!expense) return res.status(404).json({ message: 'Not found' });
  expense.status = status;
  await expense.save();
  res.json({ expense, note });
}

module.exports = { overrideExpenseStatus };
