import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';

const service = new ExpensesReceiptService();

const ExpensesReceiptList = props => {

    const [ expenses, setExpenses ] = useState()

    useEffect(async () => {
        if (props.consortium){
            const exp = await service.getExpensesFor(props.consortium);
            setExpenses(exp)
        }
    }, [props.consortium]);

    return (
        <div style={{ marginTop: '3%' }}>
            <ListGroup>
                {expenses?.map(item => {
                    return (
                        <ListGroup.Item>{`${item.month} - ${item.year}`}</ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div>
    )
}

export default ExpensesReceiptList