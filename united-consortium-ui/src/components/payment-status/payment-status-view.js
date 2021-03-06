import React, { useContext, useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Badge } from 'react-bootstrap';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { Button } from 'react-bootstrap';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';
import './payment-status.scss';
import { getStatus } from './utils';
import { DownloadButton, FileUploaderButton } from '../common/buttons';
import { downloadTicket } from '../utils/download-files';
import { image } from 'react-dom-factories';
import imageService from '../../services/image-service/image-service';

const expensesReceiptService = new ExpensesReceiptService();

const PaymentButton = props => {
    return (<Button
        className='button'
        disabled={props.disabled}
        style={{ float: 'right', fontSize: 'xx-small' }}
        onClick={props.action}>
        {props.description}
    </Button>)
}

const PaymentMemberView = props => {

    const [amount, setAmount] = useState();
    const [rerender, setRerender] = useState(false);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);

    useEffect(async () => {
        setAmount(props.memberReceipt?.paid_amount)
    }, [expensesReceipt]);

    const save = (memberReceipt, file) => {
        expensesReceipt.updateMemberReceipt(memberReceipt);
        expensesReceiptService.save(expensesReceipt, file).then(() => {
            setExpensesReceipt(expensesReceipt)
        }, () => { })
    }

    const handleChange = amount => {
        setAmount(amount)
        props.setAmountChange(amount)
        props.memberReceipt.setPaidAmount(amount);
        save(props.memberReceipt)
    }

    const onFileChange = async (file) => {
        setRerender(!rerender)
        props.memberReceipt.setTicket(file.name);
        save(props.memberReceipt, file)
    }

    const cleanFile = () => {
        setRerender(!rerender)
        props.memberReceipt.setTicket(undefined);
        save(props.memberReceipt)
    }

    useEffect(async () => {
        setAmount(props.memberReceipt.paid_amount)
    }, [props.amountChange]);

    const memberPaymentButton = (description, value) => {
        return <PaymentButton description={description} action={() => handleChange(value)} disabled={expensesReceipt.paymentProcessed()} />
    }


    return (
        <div className='payment-content'>
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
                <Col sm={2}>
                    <div style={{ float: 'right', fontSize: 'smaller' }}>
                        <input
                            style={{ width: "75%", float: 'right' }}
                            type="number"
                            disabled={expensesReceipt.paymentProcessed()}
                            onBlur={(event) => handleChange(parseFloat(event.target.value))}
                            value={amount}
                            onChange={event => setAmount(event.target.value)}
                        />
                    </div>
                </Col>
                <Col sm={1}>
                    <div style={{ float: 'right', fontSize: 'smaller' }}>
                        {`$${props.memberReceipt?.difference()}`}
                    </div>
                </Col>
                <Col sm={2}>
                    <div>
                        <FileUploaderButton className='option-button' style={{ fontSize: 'xx-small', float:'right'}} disabled={expensesReceipt.paymentProcessed()} handleFile={onFileChange} />
                        {props.memberReceipt.filename ?
                            <React.Fragment>
                                <DownloadButton style={{ fontSize: 'xx-small', float:'right'}} onClick={() => downloadTicket()} />
                                <Button style={{ fontSize: 'xx-small', float:'right'}} disabled={expensesReceipt.paymentProcessed()} className='option-button' onClick={cleanFile}>X</Button>
                            </React.Fragment> : <React.Fragment />
                        }
                    </div>
                </Col>
                <Col sm={2}>
                    <div>
                        {props.memberReceipt?.difference() === 0 ?
                            memberPaymentButton('Cancelar Pago', 0) :
                            memberPaymentButton('Pago Total', props.memberReceipt?.getTotalAmount())}
                    </div>
                </Col>
            </Row>
            <hr />
        </div>
    )
}


const PaymentStatusView = () => {

    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const [amountChange, setAmountChange] = useState(true)

    const update = receipt => {
        expensesReceiptService.save(receipt).then(() => {
            setAmountChange(!amountChange)
            setExpensesReceipt(receipt)
        }, () => { })
    }
    const payAll = () => {
        expensesReceipt.payAll();
        update(expensesReceipt);
    }

    const cancelAllPayments = () => {
        expensesReceipt.cancelAllPayments();
        update(expensesReceipt);
    }

    return (
        <div style={{ marginLeft: '0.5%', marginRight: '0.5%' }}>
            <Row className="justify-content-md-center" style={{ fontSize: 'xx-small' }}>
                <Col sm={1}>Unidad</Col>
                <Col sm={2}><div style={{ float: 'right' }}>Estado</div></Col>
                <Col sm={2}><div style={{ float: 'right' }}>A pagar</div></Col>
                <Col sm={2}><div style={{ float: 'right' }}>Monto</div></Col>
                <Col sm={1}>Saldo pendiente</Col>
                <Col sm={1}></Col>
                <Col sm={3}>
                    <div>
                        {expensesReceipt?.totalDifference() === 0 ?
                            <PaymentButton description={'Cancelar Todos'} action={cancelAllPayments} disabled={expensesReceipt.paymentProcessed()} /> :
                            <PaymentButton description={'Pagar Todos'} action={payAll} disabled={expensesReceipt.paymentProcessed()} />
                        }
                    </div>
                </Col>

            </Row>
            <hr />
            {
                expensesReceipt.member_expenses_receipt_details.map(memberReceipt => {
                    return <PaymentMemberView amountChange={amountChange} setAmountChange={setAmountChange} memberReceipt={memberReceipt} />
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
                <Col sm={2}>
                </Col>
                <Col sm={1}>
                    <div style={{ float: 'right', fontSize: 'smaller', fontWeight: 'bold' }}>
                        {`$${expensesReceipt.totalDifference()}`}
                    </div>
                </Col>
                <Col sm={4}>
                </Col>
            </Row>
        </div>
    )
}

export default PaymentStatusView