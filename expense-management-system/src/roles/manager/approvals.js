export class Approvals {
    constructor() {
        this.pendingExpenses = [];
    }

    addPendingExpense(expense) {
        this.pendingExpenses.push(expense);
    }

    approveExpense(expenseId) {
        const index = this.pendingExpenses.findIndex(exp => exp.id === expenseId);
        if (index !== -1) {
            const approvedExpense = this.pendingExpenses.splice(index, 1)[0];
            approvedExpense.status = 'approved';
            return approvedExpense;
        }
        return null;
    }

    rejectExpense(expenseId) {
        const index = this.pendingExpenses.findIndex(exp => exp.id === expenseId);
        if (index !== -1) {
            const rejectedExpense = this.pendingExpenses.splice(index, 1)[0];
            rejectedExpense.status = 'rejected';
            return rejectedExpense;
        }
        return null;
    }

    getPendingExpenses() {
        return this.pendingExpenses;
    }
}