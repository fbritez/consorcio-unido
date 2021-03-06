import { roundNumber } from './utils';

class ExpenseReceiptitem{

    constructor(title, description, amount, ticket, members=[]){
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.ticket = ticket;
        this.members = members
    }

    getCurrencyAmount(){
        return `$${roundNumber(this.amount)}` 
    }

    set_members(members){
        this.members = members
    }
    
}


export default ExpenseReceiptitem