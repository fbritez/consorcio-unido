class ExpensesReceipt{

    constructor(consortium_id, items, month, year){
        this.consortium_id = consortium_id;
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