import { roundNumber } from './utils';

class ExpensesReceipt{

    constructor(consortium_id, items, month, year, isOpen, identifier, members_receipts){
        this.consortium_id = consortium_id;
        this.expense_items = items;
        this.month = month;
        this.year = year;
        this.is_open = isOpen;
        this.identifier = identifier;
        this.members_receipts = members_receipts;
    }

    getTotalAmount(){
        return roundNumber(this.expense_items.reduce((a, b) => a + b.amount, 0));
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