import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt';
import ExpenseReceiptitem from '../../model/expense-receipt-item';
import ConsortiumService from '../consortium-service/consortium-service';
import ImageService from '../image-service/image-service';
import SERVICE_URL from '../utils/constants';

class ExpensesReceiptService {

    constructor() {
        this.consortiumService = new ConsortiumService();
        this.imageService = new ImageService();
    }

    getExpensesAccordingUser = async (consortium, user) => {
        const params = `consortium_identifier=${consortium.id}&user_identifier=${user.email}`
        const espensesData = await axios.get(`${SERVICE_URL}/expenses?${params}`);
        return espensesData.data.expenses.map(data => this.createModel(data));
    }

    getExpensesReceipt = async expensesReceipt => {
        const espensesData = await axios.get(`${SERVICE_URL}/expensesID?expensesID=${expensesReceipt.identifier}`);
        return this.createModel(espensesData.data);
     }

    save = async (expensesReceipt, imageFile) => {
        try {
            const result = await axios.post(`${SERVICE_URL}/newExpenses`, { updatedExpensesReceipt: expensesReceipt });
            this.imageService.save(imageFile)
            return expensesReceipt
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }

    createItemModel = data => new ExpenseReceiptitem(data.title, data.description, data.amount, data.ticket, data.members)


    createModel = data => {
        const items = data.expense_items.map(data => this.createItemModel(data));
        return new ExpensesReceipt(data.consortium_id, items, data.month, data.year, data.is_open, data.identifier)
    }

    isAdministrator = user => this.consortiumService.isAdministrator(user);

    createExpenseReceipt = async (consortium, month, year, items) => {
        const exp = this.createModel({ consortium_id: consortium.id, month: month, year: year, is_open: true, expense_items: items })
        return await this.save(exp)
    }
}

export default ExpensesReceiptService;