import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { Button } from 'react-bootstrap';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';
import './payment-status.scss';
import { getStatus } from './utils';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentMemberView = props => {

    const [amount, setAmount] = useState(props.memberReceipt?.paid_amount);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);

    const handleChange = amount => {
        setAmount(amount)
        props.setAmountChange(amount)
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
                    {getStatus(props.memberReceipt)}
                </Col>
                <Col sm={2}>
                    <div style={{ float: 'right', fontSize: 'smaller' }}>{`$ ${props.memberReceipt?.getTotalAmount()}`}</div>
                </Col>
                <Col sm={3}>
                    <div style={{ fontSize: 'smaller' }}>
                        <input
                            style={{ width: "75%" }}
                            type="number"
                            onBlur={(event) => handleChange(parseFloat(event.target.value))}
                            value={amount}
                            onChange={event => setAmount(event.target.value)}

                        />
                    </div>
                </Col>
                <Col sm={1}>
                    <div style={{ fontSize: 'smaller' }}>
                        {`$${props.memberReceipt?.difference()}`}
                    </div>
                </Col>
                <Col sm={3}>
                    <div>
                        {props.memberReceipt?.difference() === 0 ?
                            <Button className='pay-button' style={{ float: 'right', fontSize: 'xx-small' }} onClick={() => handleChange(0)}>Cancelar Pago</Button> :
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
    const [ amountChange, setAmountChange ] = useState(true)

    debugger
    return (
        <div>
            <Row className="justify-content-md-center" style={{ fontSize: 'xx-small' }}>
                <Col sm={1}>Unidad</Col>
                <Col sm={2}><div style={{ float: 'right' }}>Estado</div></Col>
                <Col sm={2}><div style={{ float: 'center' }}>A pagar</div></Col>
                <Col sm={2}>Monto</Col>
                <Col sm={2}>Saldo pendiente</Col>
                <Col sm={3}></Col>
            </Row>
            <hr />

            {
                expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView setAmountChange={setAmountChange} memberReceipt={memberReceipt} />
                })
            }
            <Row className="justify-content-md-center">
                <Col sm={1}>Totales</Col>
                <Col sm={2}></Col>
                <Col sm={2}>
                    <div style={{ float: 'right', fontSize: 'smaller', fontWeight: 'bold' }}>
                        {`$ ${expensesReceipt.getTotalAmount()}`}
                    </div>
                </Col>
                <Col sm={3}>
                </Col>
                <Col sm={1}>
                    <div style={{ fontSize: 'smaller' , fontWeight: 'bold'}}>
                    {`$${expensesReceipt.totalDifference()}`}
                    </div>
                </Col>
                <Col sm={3}>
                </Col>
            </Row>
        </div>
    )
}

export default PaymentStatusView