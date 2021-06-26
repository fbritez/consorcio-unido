import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import './payment-status.scss';
import { getStatus } from './utils';

const PaymentMemberView = props => {

    return (
        <div>
            <Row className="justify-content-md-center">
                <Col sm={3}>
                    <Badge variant="dark">{props.memberReceipt?.member.member_name}</Badge>
                </Col>
                <Col sm={3}>
                    {getStatus(props.memberReceipt)}
                </Col>
                <Col sm={3}>
                    <div style={{ float: 'right' }}>{`$ ${props.memberReceipt?.getTotalAmount()}`}</div>
                </Col>
                <Col sm={3}>
                    <div>
                        {`$${props.memberReceipt?.difference()}`}
                    </div>
                </Col>
            </Row>
            <hr />
        </div>
    )
}


const MemberPaymentStatusView = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);

    return (
        <div>
            <Row className="justify-content-md-center" style={{ fontSize: 'xx-small' }}>
                <Col sm={3}>Unidad</Col>
                <Col sm={3}><div style={{ float: 'right' }}>Estado</div></Col>
                <Col sm={3}><div style={{ float: 'center' }}>A pagar</div></Col>
                <Col sm={3}>Saldo pendiente</Col>

            </Row>
            <hr />

            {
                expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView memberReceipt={memberReceipt} />
                })
            }

        </div>
    )
}

export default MemberPaymentStatusView