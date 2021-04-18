class ExpensesReceipt{

    constructor(consortium, items, month, year){
        this.consortium = consortium;
        this.expensesItems = items;
        this.month = month;
        this.year = year;
    }

    getTotalAmount(){
        return this.expensesItems.reduce((a, b) => a + b.amount, 0)
    }

    getCurrencyAndTotalAmount(){
        return `$${this.getTotalAmount()}`
    }
}

export default ExpensesReceipt;