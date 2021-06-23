import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { Button } from 'react-bootstrap';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentMemberView = props => {

    const [memberReceipt, setMemberReceipt] = useState();
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);

    const handleChange = () => {
        props.memberReceipt.setPaid();
        expensesReceipt.updateMemberReceipt(props.memberReceipt);
        expensesReceiptService.save(expensesReceipt).then(() => { setMemberReceipt(memberReceipt); setExpensesReceipt(expensesReceipt) }, () => { })
    }

    debugger
    return (
        <div stlye={{ flex: 'center' }}>
            <Row>
                <Col sm={2}>
                    <Badge variant="dark">{props.memberReceipt?.member.member_name}</Badge>
                </Col>
                <Col sm={4}>
                    <div style={{ fontSize: 'smaller' }}>
                        {props.memberReceipt?.paid ?
                            <Button style={{ fontSize: 'smaller' }} onClick={handleChange}>Cancelar Pago</Button> :
                            <Button style={{ fontSize: 'smaller' }} onClick={handleChange}>Pagar</Button>}
                    </div>
                </Col>
                <Col sm={3}>
                    <div>
                        {props.memberReceipt?.paid ? <Badge variant="success">Pago</Badge> : <Badge variant="danger">Inpago</Badge>}
                    </div>
                </Col>
                <Col sm={3}>
                    <div className='right'>{`$ ${props.memberReceipt?.getTotalAmount()}`}</div>
                </Col>
            </Row>
            <hr />
        </div>
    )
}


const PaymentStatusView = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    const [ r, setR] = useState(false)

    useEffect(async () => {
        setR(!r)
    }, [expensesReceipt]);


    return (
        <div>
            {
                expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView memberReceipt={memberReceipt} />
                })
            }
        </div>
    )
}

export default PaymentStatusView