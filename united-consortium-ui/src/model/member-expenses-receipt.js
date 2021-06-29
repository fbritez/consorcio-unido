import { roundNumber } from './utils';

class MemberExpensesReceipt{

    constructor(member, expensesItems, paid, paid_amount, filename){
        this.member = member
        this.expenses_items = expensesItems
        this.paid = paid
        this.paid_amount = paid_amount ? paid_amount : 0
        this.filename = filename
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

    pay(){
        this.setPaidAmount(this.getTotalAmount())
    }

    setTicket(filename) {
        this.filename = filename
    }
}



export default MemberExpensesReceipt