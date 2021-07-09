import React, { useContext, useState, useEffect } from 'react';
import './expenses-receipt-details-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseDetails from '../expense-details/expense-details';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import AddExpensesReceipt from './add-expenses-receipt';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import PaymentStatusView from '../../payment-status/payment-status-view';
import MemberPaymentStatusView from '../../payment-status/member-payment-status-view'

const service = new ExpensesReceiptService();

const ExpensesReceiptClosedStatus = () => {

    const [showExpensesCRUD, setShowExpensesCRUD] = useState(false);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const { consortium } = useContext(ConsortiumContext);

    const handleClose = () => { }

    const handleReceipt = expensesReceipt => {
        setExpensesReceipt(expensesReceipt)
        setShowExpensesCRUD(false)
    }

    return (
        <div>
            <Row>
                <Col sm={2}>
                </Col>
                <Col sm={8}>
                    <Alert variant='primary'>
                        <div style={{ textAlign: 'center' }}>Liquidacion Cerrada.</div>
                    </Alert>
                </Col>
                <Col sm={2}>
                    <Button
                        style={{ fontSize: 'x-small', marginTop: '4%' }}
                        className='add-local-button'
                        onClick={() => setShowExpensesCRUD(true)}>
                        Copiar Expensa
                    </Button>
                    {showExpensesCRUD &&
                        <Modal show={showExpensesCRUD} onHide={handleClose}>
                            <Modal.Header closeButton onClick={() => setShowExpensesCRUD(false)}>
                                <Modal.Title>{`Copiar Expensa de ${expensesReceipt.month} de ${expensesReceipt.year}`}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <AddExpensesReceipt
                                        consortium={consortium}
                                        setCurrentExpeses={(exp) => handleReceipt(exp)}
                                        items={expensesReceipt.expense_items}
                                        headers={'  '}
                                        validate={false}
                                    />
                                </div>
                            </Modal.Body>
                        </Modal>
                    }
                </Col>
            </Row>
        </div>

    )
}

const ExpensesReceiptDetailHeader = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    return (
        <div>
            <div className='text-center'>
                <p>{`Gastos correspondientes al mes de ${expensesReceipt?.month} ${expensesReceipt?.year}`}</p>
            </div>
            <hr />
        </div>
    )
}
const ExpensesReceiptDetailView = (props) => {

    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const [transactionStatus, setTransacionStatus] = useState(false);
    const [showExpensesCRUD, setShowExpensesCRUD] = useState(false);
    const [crudData, setCrudData] = useState({ selectedItem: null, selectedAction: null, selectedDescription: {} })
    const [isAdministrator, setIsAdministrator] = useState(props.isAdministrator);

    const user = props.user;

    const update = item => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        const idx = updatedExpense.expense_items.findIndex(i => i === item.oldItem)
        const element = updatedExpense.expense_items[idx] = expensesItem
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    const remove = item => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        updatedExpense.expense_items.pop(expensesItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    const add = item => {
        const expensesItem = service.createItemModel(item.newItem.item);
        const updatedExpense = expensesReceipt;
        updatedExpense.expense_items.push(expensesItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    const setItemAction = async (item, action, description) => {

        const r = {
            selectedItem: item,
            selectedAction: action,
            selectedDescription: description,
            setShowExpensesCRUD: true
        }
        setCrudData(r)
        setShowExpensesCRUD(true)
    }

    const runAction = async (item, action) => {
        const { expense, file } = action(item)
        const resutl = await service.save(expense, file)
        setExpensesReceipt(expense)
    }

    const closeExpenses = () => {
        expensesReceipt.close()
        service.generateReceipt(expensesReceipt).then(() => {
            setExpensesReceipt(undefined)
            setTransacionStatus(true)
        }, () => { setTransacionStatus(false) })
    }
    return (
        <div className='expenses-receipt'>
            <div>
                <ExpensesReceiptDetailHeader />
                <div>
                    {isAdministrator &&
                        <div>
                            {!expensesReceipt?.isOpen() ?
                                <ExpensesReceiptClosedStatus /> :
                                <div>
                                    <Button
                                        className='add-local-button'
                                        disabled={!expensesReceipt?.isOpen()}
                                        onClick={() => setItemAction(null, add, 'Agregar')}>
                                        Agregar gasto
                                    </Button>
                                    <Button
                                        className='generate-button'
                                        disabled={!expensesReceipt?.isOpen()}
                                        onClick={() => closeExpenses()}>
                                        Generar Liquidación
                                    </Button>
                                </div>
                            }
                            <hr />
                        </div>
                    }
                    {showExpensesCRUD &&
                        <ExpenseItemView
                            crudData={crudData}
                            item={crudData.selectedItem}
                            handleAction={(item) => runAction(item, crudData.selectedAction)}
                            actionDescription={crudData.selectedDescription}
                            show={showExpensesCRUD}
                            showExpensesCRUD={(bool) => setShowExpensesCRUD(bool)} />
                    }
                </div>
                <Tabs defaultActiveKey="expenses" id="uncontrolled-tab-example">
                    <Tab eventKey="expenses" title="Gastos">
                        <div style={{ marginTop: '3%' }}>
                            <ExpenseDetails
                                expensesReceipt={expensesReceipt}
                                userAdministrator={isAdministrator}
                                updateAction={(item) => setItemAction(item, update, 'Modificar')}
                                removeAction={(item) => setItemAction(item, remove, 'Eliminar')}
                            />
                        </div>
                    </Tab>
                    {
                        !expensesReceipt.isOpen() &&
                        <Tab eventKey="memberStatus" title="Pagos">
                            <div style={{ marginTop: '3%' }}>
                                <PaymentStatusView expensesReceipt={expensesReceipt}/>
                            </div>
                        </Tab>
                    }
                </Tabs>
            </div>
        </div>
    )
}

const MemberDetailHeader = () => {
    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const member = consortium.getMember(user);

    return (
        <div>
            {
                member && <div style={{ fontSize: 'smaller', marginBottom: '2%' }}>
                    <text>{'Unidad funcional: '}</text>
                    <strong>{member.member_name}</strong>
                    <br />
                    <text>{'Consorcio: '}</text>
                    <strong>{consortium.name}</strong>
                </div>
            }

        </div>
    )
}


const MemberExpensesReceiptDetailView = () => {

    const { user } = useContext(UserContext);
    const { expensesReceipt } = useContext(ExpensesReceiptContext);
    const [ particularExpenses, setParticularExpenses ] = useState();

    useEffect(async () => {
        debugger
        const expenses = expensesReceipt.getMemberReceiptFor(user)
        setParticularExpenses(expenses)
    }, [expensesReceipt]);

    return (
        <div>
            <ExpensesReceiptDetailHeader />
            <MemberDetailHeader />
            <Tabs defaultActiveKey="myReceipt" id="uncontrolled-tab-example">
                <Tab eventKey="myReceipt" title="Mi resumen">
                    <div style={{ marginTop: '3%' }}>
                        <p>Gastos particulares pertenecientes a usted</p>
                        <ExpenseDetails
                            expensesReceipt={particularExpenses}
                            userAdministrator={false}
                        />
                    </div>
                </Tab>
                <Tab eventKey="generalReceipt" title="General">
                    <div style={{ marginTop: '3%' }}>
                        <p>Gastos generales de todo el consorcio</p>
                        <ExpenseDetails
                            expensesReceipt={expensesReceipt}
                            userAdministrator={false}
                        />
                    </div>
                </Tab>
                <Tab eventKey="expenseDetails" title="Pagos">
                    <div style={{ marginTop: '3%' }}>
                        <p>Detalle de Pagos por Unidad funcional</p>
                        <MemberPaymentStatusView expensesReceipt={expensesReceipt}/>
                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}

export {
    ExpensesReceiptDetailView,
    MemberExpensesReceiptDetailView
}