import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt';
import ExpenseReceiptitem from '../../model/expense-receipt-item';
import ConsortiumService from '../consortium/consortium-service';
import SERVICE_URL from '../utils/constants'

class ExpensesReceiptService {

    constructor(){
        this.consortiumService = new ConsortiumService()
    }
    getExpensesFor = async (consortium) => {
        const espensesData =  await axios.get(`${SERVICE_URL}/expenses?consortium_name=${consortium.name}`);
        return espensesData.data.expenses.map( data => this.createModel(data));
    }

    save = async (expensesReceipt) => {
        try {
            const result = await axios.post(`${SERVICE_URL}/newExpenses`, {updatedExpensesReceipt: expensesReceipt});
        } catch (error) {
            debugger
            console.log(error)
        }
    }

    createItemModel = (data) => new ExpenseReceiptitem(data.title, data.description, data.amount)
    

    createModel = (data) => {
        const consortium = this.consortiumService.createModel(data.consortium);
        const items = data.expense_items.map(data => this.createItemModel(data));
        return new ExpensesReceipt( consortium , items, data.month, data.year)
    }
}

export default ExpensesReceiptService;