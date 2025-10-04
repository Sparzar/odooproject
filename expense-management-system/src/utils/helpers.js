export const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

export const validateExpenseData = (data) => {
    const { amount, description, date } = data;
    if (!amount || !description || !date) {
        return false;
    }
    return true;
};

export const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
};