export default class Expenses {
    constructor() {
        this.expenses = [];
    }

    submitExpense(expense) {
        this.expenses.push(expense);
        return 'Expense submitted successfully';
    }

    getExpenses() {
        return this.expenses;
    }

    trackExpense(expenseId) {
        return this.expenses.find(expense => expense.id === expenseId) || 'Expense not found';
    }
}