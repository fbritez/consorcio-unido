import { roundNumber } from './utils';

class MemberExpensesReceipt{

    constructor(member, expensesItems, paid, paid_amount){
        this.member = member
        this.expenses_items = expensesItems
        this.paid = paid
        this.paid_amount = paid_amount ? paid_amount : 0
    }

    getExpenses(){
        return this.expenses_items
    }

    getTotalAmount(){
        return roundNumber(this.expenses_items.reduce((a, b) => a + b.amount, 0));
    }

    setPaidAmount(amount){
        this.paid_amount = amount
    }

    difference(){
        return roundNumber(this.getTotalAmount() - this.paid_amount)
    }

    getCurrencyAndTotalAmount() {
        return `$${this.getTotalAmount()}`;
    }

    isFor(user){
        return this.member.user_email === user.email || this.member.secondary_email === user.email
    }
}



export default MemberExpensesReceipt