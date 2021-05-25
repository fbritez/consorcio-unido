import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import ExpensesReceiptDetailView from './expenses-receipt-details-view';
import { UserContext } from '../../user-provider/user-provider';
import AddExpensesReceipt from './add-expenses-receipt';

import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';

const service = new ExpensesReceiptService();

const ExpensesReceiptView = props => {

    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const { expensesReceipt, setExpensesReceipt} = useContext(ExpensesReceiptContext);
    const [isAdministrator, setIsAdministrator] = useState();

    useEffect(async () => {
        
        const expenses = await service.getExpensesFor(consortium);
        const openExpenses = expenses.filter(expense => expense.isOpen());
        if (openExpenses.length > 0){
            setExpensesReceipt(openExpenses[0]);
        }else{
            setExpensesReceipt(undefined);
        }
        const result = await service.isAdministrator(user);
        setIsAdministrator(result)
    }, [consortium]);
    
    debugger
    return (
        <div>{
            expensesReceipt ?
                <ExpensesReceiptDetailView expensesReceipt={expensesReceipt} isAdministrator={isAdministrator} /> :
                <AddExpensesReceipt
                    consortium={consortium}
                    setCurrentExpeses={(exp) => setExpensesReceipt(exp)}
                />
            }
        </div>
    )
}

export default ExpensesReceiptView;