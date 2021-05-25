class ExpensesReceipt{

    constructor(consortium_id, items, month, year, isOpen){
        this.consortium_id = consortium_id;
        this.expense_items = items;
        this.month = month;
        this.year = year;
        this.is_open = isOpen;
    }

    getTotalAmount(){
        return this.expense_items.reduce((a, b) => a + b.amount, 0);
    }

    getCurrencyAndTotalAmount(){
        return `$${this.getTotalAmount()}`;
    }

    isOpen(){
        return this.is_open;
    }

    close(){
        this.is_open = false;
    }

}

export default ExpensesReceipt;