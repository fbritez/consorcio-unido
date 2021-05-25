import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { ExpensesReceiptDetailView } from './expenses-receipt-details-view';
import { UserContext } from '../../user-provider/user-provider';
import AddExpensesReceipt from './add-expenses-receipt';

import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';

const service = new ExpensesReceiptService();

const ExpensesReceiptView = props => {

    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [currentExpense, setCurrentExpense] = useState();
    const [isAdministrator, setIsAdministrator] = useState();

    useEffect(async () => {
        const expenses = await service.getExpensesFor(consortium);
        const openExpenses = expenses.filter(expense => expense.isOpen());
        if (openExpenses.length > 0){
            setCurrentExpense(openExpenses[0]);
            const result = await service.isAdministrator(user);
            setIsAdministrator(result)
        }else{
            setCurrentExpense(undefined);
        }
    }, [consortium]);
    
    return (
        <div>{
            currentExpense ?
                <ExpensesReceiptDetailView expensesReceipt={currentExpense} isAdministrator={isAdministrator} /> :
                <AddExpensesReceipt
                    consortium={consortium}
                    setCurrentExpeses={(exp) => setCurrentExpense(exp)}
                />
            }
        </div>
    )
}

export default ExpensesReceiptView;