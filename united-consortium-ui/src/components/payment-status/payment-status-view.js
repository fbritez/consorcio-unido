import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { Button } from 'react-bootstrap';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';
import './payment-status.scss';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentMemberView = props => {

    const [re, setRe] = useState(0);
    const [amount , setAmount] = useState(props.memberReceipt?.paid_amount);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);

    const handleChange = amount => {
        setRe(re + 1);
        setAmount(amount)
        props.memberReceipt.setPaidAmount(amount);
        expensesReceipt.updateMemberReceipt(props.memberReceipt);
        expensesReceiptService.save(expensesReceipt).then(() => {
            setExpensesReceipt(expensesReceipt)
        }, () => { })
    }

    return (
        <div>
            <Row className="justify-content-md-center">
                <Col sm={1}>
                    <Badge variant="dark">{props.memberReceipt?.member.member_name}</Badge>
                </Col>
                <Col sm={2}>
                    <div style={{float: 'right'}}>
                        {props.memberReceipt?.difference() === 0?
                            <Badge variant="success">Pago</Badge> :
                            <Badge variant="danger">Impago</Badge>}
                    </div>
                </Col>
                <Col sm={2}>
                    <div style={{float: 'right'}}>{`$ ${props.memberReceipt?.getTotalAmount()}`}</div>
                </Col>
                <Col sm={3}>
                    <div>
                        <input 
                            style={{width:"75%"}}
                            type="number"
                            onBlur={(event) => handleChange(parseFloat(event.target.value))}
                            value={amount}
                            onChange={event => setAmount(event.target.value)}

                        />
                    </div>
                </Col>
                <Col sm={1}>
                    <div>
                        {`$${props.memberReceipt?.difference()}`}
                    </div>
                </Col>
                <Col sm={3}>
                    <div>
                        {props.memberReceipt?.difference() === 0?
                            <Button className='pay-button' style={{ float: 'right',fontSize: 'xx-small' }} onClick={() => handleChange(0)}>Cancelar Pago</Button> :
                            <Button className='pay-button' style={{ float: 'right', fontSize: 'xx-small' }} onClick={() => handleChange(props.memberReceipt?.getTotalAmount())}>Pago Total</Button>}
                    </div>
                </Col>
            </Row>
            <hr />
        </div>
    )
}


const PaymentStatusView = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);

    return (
        <div>
            <Row className="justify-content-md-center" style={{fontSize:'xx-small'}}>
                <Col sm={1}>Unidad</Col>
                <Col sm={2}><div style={{float: 'right'}}>Estado</div></Col>
                <Col sm={2}><div style={{float: 'center'}}>A pagar</div></Col>
                <Col sm={2}>Monto</Col>
                <Col sm={2}>Saldo pendiente</Col>
                <Col sm={3}></Col>
            </Row>
            <hr/>

                {
                    expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                        return <PaymentMemberView memberReceipt={memberReceipt} />
                    })
                }

        </div>
    )
}

export default PaymentStatusView