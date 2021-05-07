import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt';
import ExpenseReceiptitem from '../../model/expense-receipt-item';
import ConsortiumService from '../consortium-service/consortium-service';
import SERVICE_URL from '../utils/constants'

class ExpensesReceiptService {

    constructor(){
        this.consortiumService = new ConsortiumService()
    }
    getExpensesFor = async (consortium) => {
        const espensesData =  await axios.get(`${SERVICE_URL}/expenses?consortium_identifier=${consortium.identifier}`);
        return espensesData.data.expenses.map( data => this.createModel(data));
    }

    save = async (expensesReceipt, imageFile) => {
        try {
            debugger
            let formData = new FormData();
            formData.append("file", imageFile.filename, imageFile.name)

            const result = await axios.post(`${SERVICE_URL}/newExpenses`, {updatedExpensesReceipt: expensesReceipt});
            result = await axios.post(`${SERVICE_URL}/storeTicket`, formData);
        } catch (error) {
            console.log(error)
        }
    }

    _save = async (expensesReceipt, imageFile) => {
        try {
            debugger
            let formData = new FormData();
            formData.append('updatedExpensesReceipt', expensesReceipt)
            formData.append("file", imageFile, imageFile.name)

            const result = await axios({
                method: "post",
                url: `${SERVICE_URL}/newExpenses`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })

        } catch (error) {
            console.log(error)
        }
    }

    createItemModel = (data) => new ExpenseReceiptitem(data.title, data.description, data.amount, data.ticket)
    

    createModel = (data) => {
        const items = data.expense_items.map(data => this.createItemModel(data));
        return new ExpensesReceipt( data.consortium_id , items, data.month, data.year)
    }
}

export default ExpensesReceiptService;