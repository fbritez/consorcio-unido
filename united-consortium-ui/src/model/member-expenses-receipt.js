import { roundNumber } from './utils';

class MemberExpensesReceipt{

    constructor(member, expensesItems, paid){
        this.member = member
        this.expenses_items = expensesItems
        this.paid = paid
    }

    getTotalAmount(){
        return roundNumber(this.expenses_items.reduce((a, b) => a + b.amount, 0));
    }

    setPaid(){
        this.paid = true
    }
}



export default MemberExpensesReceipt