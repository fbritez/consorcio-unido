import { roundNumber } from './utils';

class MemberExpensesReceipt{

    constructor(member, expensesItems, paid, paid_amount){
        this.member = member
        this.expenses_items = expensesItems
        this.paid = paid
        this.paid_amount = paid_amount
    }

    getTotalAmount(){
        return roundNumber(this.expenses_items.reduce((a, b) => a + b.amount, 0));
    }

    setPaidAmount(amount){
        this.paid_amount = amount
    }

    difference(){
        return this.getTotalAmount() - this.paid_amount
    }
}



export default MemberExpensesReceipt