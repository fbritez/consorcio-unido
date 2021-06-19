import React, { useContext, useState, useEffect } from 'react';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import paymentsService from '../../services/payment-service/payment-service';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { Button } from 'react-bootstrap';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentMemberView = props => {
    
    const handleChange = () => {}

    return (
        <div>
            <Badge variant="dark">{props.member.member_name}</Badge>
            Saldo Anterior
            <div className='right'>Pendiente</div>
            <input
                type="number"
                className='right'
                id="formGroupExampleInput"
                onChange={event => handleChange({ 'address': event.target.value })}
            />
            <hr />
        </div>
    )
}


const PaymentStatusView = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);
    const { paymentStatuses, setPaymentStatus } = useState([]);

    useEffect(async () => {
        //const result = await paymentsService.getPaymentStatus(expensesReceipt)
        //setPaymentStatus(result);

    }, [expensesReceipt]);

    return (
        <div>
            {
                consortium.members.map(m => {
                   return <PaymentMemberView member={m}/>
                })
            }
        </div>
    )
}

export default PaymentStatusView