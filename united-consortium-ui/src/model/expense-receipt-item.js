

class ExpenseReceiptitem{

    constructor(title, description, amount, ticket){
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.ticket = ticket;
    }

    getCurrencyAmount(){
        return `$${this.amount}` 
    }
    
}


export default ExpenseReceiptitem