class Manager {
    constructor(name) {
        this.name = name;
        this.teamExpenses = [];
    }

    addExpense(expense) {
        this.teamExpenses.push(expense);
    }

    approveExpense(expenseId) {
        const expense = this.teamExpenses.find(exp => exp.id === expenseId);
        if (expense) {
            expense.status = 'approved';
        }
    }

    rejectExpense(expenseId) {
        const expense = this.teamExpenses.find(exp => exp.id === expenseId);
        if (expense) {
            expense.status = 'rejected';
        }
    }

    getPendingExpenses() {
        return this.teamExpenses.filter(exp => exp.status === 'pending');
    }
}

export default Manager;