import axios from 'axios';
import ExpensesReceipt from '../../model/expenses-receipt';
import ExpenseReceiptitem from '../../model/expense-receipt-item';
import imageService from '../image-service/image-service';
import SERVICE_URL from '../utils/constants';
import MemberExpensesReceipt from '../../model/member-expenses-receipt';

class ExpensesReceiptService {

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
            debugger
            imageService.save(imageFile)
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
        const items = data.expenses_items.map(itemData => this.createItemModel(itemData));
        return new MemberExpensesReceipt(data.member, items, data.paid, data.paid_amount, data.filename);
    }

    createModel = data => {
        const items = data.expense_items.map(itemData => this.createItemModel(itemData));
        const member_receipts = data.member_expenses_receipt_details.map(memberData => this.createMemberReceipts(memberData));
        return new ExpensesReceipt(data.consortium_id, items, data.month, data.year, data.is_open, data.identifier, member_receipts, data.payment_processed)
    }

    isAdministrator = user => this.consortiumService.isAdministrator(user);

    createExpenseReceipt = async (consortium, month, year, items) => {
        const exp = this.createModel({ consortium_id: consortium.id, month: month, year: year, is_open: true, expense_items: items, member_expenses_receipt_details:[], payment_processed: false})
        return await this.save(exp)
    }
}

export default ExpensesReceiptService;