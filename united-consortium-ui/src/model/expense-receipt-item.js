

class ExpenseReceiptitem{

    constructor(title, description, amount){
        this.title = title;
        this.description = description;
        this.amount = amount;
    }

    getCurrencyAmount(){
        return `$${this.amount}` 
    }
}


export default ExpenseReceiptitem