import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt';
import ExpenseReceiptitem from '../../model/expense-receipt-item';
import consortiumService from '../consortium-service/consortium-service';
import imageService from '../image-service/image-service';
import SERVICE_URL from '../utils/constants';
import MemberExpensesReceipt from '../../model/member-expenses-receipt';

class ExpensesReceiptService {

    constructor() {
        this.imageService = imageService;
    }

    getExpensesAccordingUser = async (consortium, user) => {
        const params = `consortium_identifier=${consortium.id}&user_identifier=${user.email}`
        const espensesData = await axios.get(`${SERVICE_URL}/expenses?${params}`);
        debugger
        return espensesData.data.expenses.map(data => this.createModel(data));
    }

    getExpensesReceipt = async expensesReceipt => {
        const espensesData = await axios.get(`${SERVICE_URL}/expensesID?expensesID=${expensesReceipt.identifier}`);
        debugger
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

    generateReceipt = async expensesReceipt => {
        try {
            await axios.post(`${SERVICE_URL}/generateReceipt`, { updatedExpensesReceipt: expensesReceipt });
            return expensesReceipt
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }

    createItemModel = data => new ExpenseReceiptitem(data.title, data.description, data.amount, data.ticket, data.members)

    createMemberReceipts = data => {
        debugger
        const items = data.expenses_items.map(itemData => this.createItemModel(itemData));
        return new MemberExpensesReceipt(data.member, items);
    }

    createModel = data => {
        const items = data.expense_items.map(itemData => this.createItemModel(itemData));
        const member_receipts = data.member_expenses_receipt_details.map(memberData => this.createMemberReceipts(memberData));
        const r =  new ExpensesReceipt(data.consortium_id, items, data.month, data.year, data.is_open, data.identifier, member_receipts)
        debugger
        return r
    }

    isAdministrator = user => this.consortiumService.isAdministrator(user);

    createExpenseReceipt = async (consortium, month, year, items) => {
        const exp = this.createModel({ consortium_id: consortium.id, month: month, year: year, is_open: true, expense_items: items })
        return await this.save(exp)
    }
}

export default ExpensesReceiptService;