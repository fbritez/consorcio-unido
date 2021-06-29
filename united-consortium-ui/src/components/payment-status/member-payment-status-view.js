import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import './payment-status.scss';
import { getStatus } from './utils';
import { UserContext } from '../user-provider/user-provider';

const PaymentMemberView = props => {

    const { user } = useContext(UserContext);

    const detectSelected = () => {
        const email = props.memberReceipt.member.user_email
        const second_email = props.memberReceipt.member.secondary_email
        return  email === user.email || second_email === user.email? {backgroundColor: '#E3DECA'} : {}
    }
    return (
        <div style={ detectSelected() }>
            <Row className="justify-content-md-center">
                <Col sm={2}>
                    <Badge variant="dark">{props.memberReceipt?.member.member_name}</Badge>
                </Col>
                <Col sm={3}>
                    {getStatus(props.memberReceipt)}
                </Col>
                <Col sm={3}>
                    <div style={{float: 'right',fontSize: 'small'}}>{`$ ${props.memberReceipt?.getTotalAmount()}`}</div>
                </Col>
                <Col sm={3}>
                    <div style={{float: 'right',fontSize: 'small'}}>
                        {`$${props.memberReceipt?.difference()}`}
                    </div>
                </Col>
            </Row>
        </div>
    )
}


const MemberPaymentStatusView = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);

    return (
        <div>
            <Row className="justify-content-md-center" style={{ fontSize: 'xx-small' }}>
                <Col sm={2}>Unidad</Col>
                <Col sm={3}><div style={{ float: 'right'}}>Estado</div></Col>
                <Col sm={3}><div style={{ float: 'right'}}>A pagar</div></Col>
                <Col sm={3}><div style={{ float: 'right'}}>Saldo pendiente</div></Col>

            </Row>
            <hr />

            {
                expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView memberReceipt={memberReceipt} />
                })
            }
            <hr/>
              <Row className="justify-content-md-center">
                <Col sm={2}>Totales</Col>
                <Col sm={3}></Col>
                <Col sm={3}>
                    <div style={{float: 'right', fontWeight: 'bold'}}>
                        {`$ ${expensesReceipt.getTotalAmount()}`}
                    </div>
                </Col>
                <Col sm={3}>
                    <div style={{float: 'right', fontWeight: 'bold'}}>
                    {`$${expensesReceipt.totalDifference()}`}
                    </div>
                </Col>
            </Row>

        </div>
    )
}

export default MemberPaymentStatusView