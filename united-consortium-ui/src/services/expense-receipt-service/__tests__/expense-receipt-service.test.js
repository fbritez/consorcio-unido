import ExpensesReceipt from "../../../model/expenses-receipt";
import axios from 'axios';
import ExpensesReceiptService from "../expense-receipt-service";
import SERVICE_URL from "../../utils/constants";

const mockConsortiumID = 1
const mockMonthDescription = 'month description'
const mockYear = 'year'
const expensesReceipt = new ExpensesReceipt(mockConsortiumID, [], mockMonthDescription, mockYear)
const expecetedParameter = { updatedExpensesReceipt: expensesReceipt }
const mockImage = { filename: 'file name', name: 'description name' }
const expensesData = { data: { expenses: [{ consortium_id: mockConsortiumID, month: mockMonthDescription, year: mockYear, expense_items: [] }] } }

jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn()
}));

describe('expenses receipt service tests', () => {

    const service = new ExpensesReceiptService();

    it('expenses service get all expenses receipts', async () => {
        axios.get.mockReturnValueOnce(expensesData)
        const result = await service.getExpensesFor({ id: mockConsortiumID });
        expect(result).toEqual([new ExpensesReceipt(mockConsortiumID, [], mockMonthDescription, mockYear)])
    });

    it('expenses service save expenses', async () => {
        await service.save(expensesReceipt, mockImage);
        expect(axios.post).toHaveBeenNthCalledWith(1, `${SERVICE_URL}/newExpenses`, expecetedParameter)
        //expect(axios.post).toHaveBeenNthCalledWith(2, `${SERVICE_URL}/storeTicket`, FormDataMock)
    })
})