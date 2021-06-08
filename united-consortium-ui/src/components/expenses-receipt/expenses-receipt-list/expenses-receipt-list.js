import React, { useEffect, useState, useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';
import './expenses-receipt.scss';

const service = new ExpensesReceiptService();

const ExpensesReceiptList = () => {

    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState();
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);
    const [isAdministrator, setIsAdministrator] = useState(false);

    useEffect(async () => {
        if (consortium) {
            const exp = await service.getExpensesAccordingUser(consortium, user);
            setExpenses(exp);
            setIsAdministrator(consortium.isAdministrator(user));
        }

    }, [consortium, expensesReceipt]);

    const getStatusDescription = item => item.isOpen()? ' - Abierta' : ''

    return (
        <div>
            {isAdministrator ?
                <ListGroup>
                    <ListGroup.Item
                        action
                        onClick={() => setExpensesReceipt(undefined)}>
                        Nueva Expensa
                    </ListGroup.Item>
                </ListGroup>
                : <div />
            }
            <div style={{ marginTop: '3%' }}>
                <ListGroup>
                    {expenses?.map(item => {
                        return (
                            <ListGroup.Item
                                action
                                onClick={() => setExpensesReceipt(item)}>
                                    {`${item.year} - ${item.month} ${getStatusDescription(item)}`}    
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
        </div>
    )
}

export default ExpensesReceiptList