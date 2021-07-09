import React, { useEffect, useState, useContext } from 'react';
import { Badge } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';

const service = new ExpensesReceiptService();

const ExpensesReceiptList = props => {

    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState();
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);
    const [isAdministrator, setIsAdministrator] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(async () => {
        if (consortium) {
            const exp = await service.getExpensesAccordingUser(consortium, user);
            setExpenses(exp);
            setIsAdministrator(consortium.isAdministrator(user));
            setRefresh(!refresh);
        }
    }, [consortium, expensesReceipt]);

    const getStatusDescription = item => item.isOpen()? <Badge variant="success">Abierta</Badge> : <div/>
    
    const runAction = item => {
        setExpensesReceipt(item)
        if(props.action){
            props.action(item)
        }
    }
    
    return (
        <div className='scrollbar-dinamically'>
              <div>
                Mis Expensas
                <hr/>
            </div>
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
            <div style={{ marginTop: '3%', fontSize: 'small' }}>
                <ListGroup>
                    {expenses?.map(item => {
                        return (
                            <ListGroup.Item
                                action
                                onClick={() => runAction(item)}
                                as='div'>
                                    <div>
                                     {`${item.year} - ${item.month} `}
                                     {getStatusDescription(item)}
                                    </div> 
                                    
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
        </div>
    )
}

export default ExpensesReceiptList