class Expense {
    constructor(amount, description, date, status = 'pending') {
        this.amount = amount;
        this.description = description;
        this.date = new Date(date);
        this.status = status;
    }

    approve() {
        this.status = 'approved';
    }

    reject() {
        this.status = 'rejected';
    }
}

export default Expense;