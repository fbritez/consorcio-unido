import ExpenseReceiptitem from "../expense-receipt-item";

const title = 'title';
const description = 'description';
const amount = 1000;
const ticket =  '1234567890';

describe( 'Expense receipt item tests', () => {
    const expense = new ExpenseReceiptitem(title, description, amount, ticket);

    it('Expense receipt item get currency amount ', async () => {
        const currencyAmountDescription =  expense.getCurrencyAmount()
        expect(currencyAmountDescription).toEqual('$1000')
    })
})