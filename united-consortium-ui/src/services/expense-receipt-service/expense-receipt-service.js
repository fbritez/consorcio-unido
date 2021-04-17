import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt'
import ConsortiumService from '../consortium/consortium-service';
const SERVICE_URL = 'http://localhost:5000';

class ExpensesReceiptService {

    constructor(){
        this.consortiumService = new ConsortiumService()
    }
    getExpensesFor = async (consortium) => {
        const espensesData =  await axios.get(`${SERVICE_URL}/expenses?consortium_name=${consortium.name}`);
        return espensesData.data.expenses.map( data => this.createModel(data));
    }

    createModel = (data) => {
        const consortium = this.consortiumService.createModel(data.consortium);
        const items = data.expense_items
        return new ExpensesReceipt( consortium , items, data.month, data.year)
    }
}

export default ExpensesReceiptService;