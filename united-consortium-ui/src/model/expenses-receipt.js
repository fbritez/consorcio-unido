class ExpensesReceipt{

    constructor(consortium, items, month, year){
        this.consortium = consortium;
        this.expense_items = items;
        this.month = month;
        this.year = year;
    }

    getTotalAmount(){
        return this.expense_items.reduce((a, b) => a + b.amount, 0)
    }

    getCurrencyAndTotalAmount(){
        return `$${this.getTotalAmount()}`
    }
    
}

export default ExpensesReceipt;