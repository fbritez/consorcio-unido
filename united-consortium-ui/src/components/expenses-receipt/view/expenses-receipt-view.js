import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { ExpensesReceiptDetailView, MemberExpensesReceiptDetailView } from './expenses-receipt-details-view';
import { UserContext } from '../../user-provider/user-provider';
import AddExpensesReceipt from './add-expenses-receipt';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';
import NoneExpensesReceipt from './none-expenses-receipt-view';

const service = new ExpensesReceiptService();

const ExpensesReceiptView = props => {

    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const [isAdministrator, setIsAdministrator] = useState();

    useEffect(async () => {

        if (consortium) {
            const isAdmin = consortium.isAdministrator(user);
            setIsAdministrator(isAdmin)
            var expenses = await service.getExpensesAccordingUser(consortium, user);
            if (isAdmin) {
                expenses = expenses.filter(expense => expense.isOpen());
            }
            if (!expensesReceipt) {
                if (expenses.length > 0) {
                    setExpensesReceipt(expenses[0]);
                } else {
                    setExpensesReceipt(undefined);
                }
            }
        }
    }, [consortium]);

    return (
        <div>{
            expensesReceipt ?
                isAdministrator ?
                    <ExpensesReceiptDetailView expensesReceipt={expensesReceipt} isAdministrator={isAdministrator} /> :
                    <MemberExpensesReceiptDetailView />
                :
                isAdministrator ?
                    <AddExpensesReceipt
                        consortium={consortium}
                        setCurrentExpeses={(exp) => setExpensesReceipt(exp)}
                        validate={true}
                    /> :
                    <NoneExpensesReceipt />
        }
        </div>
    )
}

export default ExpensesReceiptView;