import ExpenseReceipt from "../expenses-receipt";

const consortium_id = 'consortium_id';
const items = [{amount: 1}, {amount:1}]
const month = 'month';
const year =  'year';

describe( 'Expense receipt item tests', () => {
    const expense = new ExpenseReceipt(consortium_id, items, month, year)

    it('Expense receipt get total amount ', async () => {
        const totalAmount =  expense.getTotalAmount()
        expect(totalAmount).toEqual(2)
    })

    it('Expense receipt get currency and total amount description ', async () => {
        const totalAmountAndCurrencyDescription = expense.getCurrencyAndTotalAmount();
        expect(totalAmountAndCurrencyDescription).toEqual('$2');
    })
})