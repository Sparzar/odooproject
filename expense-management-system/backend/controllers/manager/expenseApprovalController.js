// controllers/manager/expenseApprovalController.js
const Expense = require('../../models/Expense');
const ExpenseApproval = require('../../models/ExpenseApproval');
const { notifyUser } = require('../../utils/notification');

/**
 * View pending approvals for this manager
 */
async function pendingForApproval(req, res) {
  const approvals = await ExpenseApproval.find({ approver: req.user._id, decision: 'pending' })
    .populate({ path: 'expense', populate: { path: 'employee', select: 'name email' } })
    .sort({ createdAt: -1 });
  res.json({ approvals });
}

/**
 * Approve or reject an approval
 */
async function decide(req, res) {
  const { approvalId } = req.params;
  const { decision, comments } = req.body; // decision: 'approved' or 'rejected'
  if (!['approved','rejected'].includes(decision)) return res.status(400).json({ message: 'Invalid decision' });

  const approval = await ExpenseApproval.findById(approvalId).populate('expense approver');
  if (!approval) return res.status(404).json({ message: 'Approval not found' });
  if (approval.approver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not approver' });

  approval.decision = decision;
  approval.comments = comments;
  approval.decidedAt = new Date();
  await approval.save();

  // If rejected: mark expense rejected
  const expense = await Expense.findById(approval.expense._id).populate('approvals');
  if (decision === 'rejected') {
    expense.status = 'rejected';
    await expense.save();
    await notifyUser(expense.employee, `Your expense has been rejected by ${req.user.name}`);
    return res.json({ approval, expense });
  }

  // If approved: check next approvals; if none pending -> mark approved
  const remaining = await ExpenseApproval.find({ expense: expense._id, decision: 'pending' }).sort({ sequence: 1 });
  if (!remaining.length) {
    expense.status = 'approved';
    await expense.save();
    await notifyUser(expense.employee, `Your expense has been fully approved`);
  } else {
    // notify next approver(s)
    for (const r of remaining) {
      await notifyUser(r.approver, `Expense is awaiting your approval`);
    }
  }

  res.json({ approval, expense });
}

module.exports = { pendingForApproval, decide };
