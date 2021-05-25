import React, { useEffect, useState, useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';

const service = new ExpensesReceiptService();

const ExpensesReceiptList = props => {

    const [ expenses, setExpenses ] = useState();
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);

    useEffect(async () => {
        if (consortium){
            const exp = await service.getExpensesFor(consortium);
            setExpenses(exp)
        }
    }, [consortium, expensesReceipt]);

    return (
        <div style={{ marginTop: '3%' }}>
            <ListGroup>
                {expenses?.map(item => {
                    return (
                        <ListGroup.Item 
                            action 
                            onClick={() => {debugger; setExpensesReceipt(item)}}>
                                {`${item.year} - ${item.month}`}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div>
    )
}

export default ExpensesReceiptList