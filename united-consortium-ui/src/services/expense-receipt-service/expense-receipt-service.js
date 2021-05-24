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

    getExpensesFor = async consortium => {
        const espensesData = await axios.get(`${SERVICE_URL}/expenses?consortium_identifier=${consortium.id}`);
        return espensesData.data.expenses.map(data => this.createModel(data));
    }

    save = async (expensesReceipt, imageFile) => {
        try {
            await axios.post(`${SERVICE_URL}/newExpenses`, { updatedExpensesReceipt: expensesReceipt });
            this.imageService.save(imageFile)
        } catch (error) {
            console.log(error)
        }
    }

    createItemModel = data => new ExpenseReceiptitem(data.title, data.description, data.amount, data.ticket)


    createModel = data => {
        const items = data.expense_items.map(data => this.createItemModel(data));
        return new ExpensesReceipt(data.consortium_id, items, data.month, data.year)
    }

    isAdministrator = user => this.consortiumService.isAdministrator(user);
}

export default ExpensesReceiptService;