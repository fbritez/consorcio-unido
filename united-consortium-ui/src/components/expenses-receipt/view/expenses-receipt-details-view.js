import React, { useContext, useState, useCallback } from 'react';
import './expenses-receipt-details-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseDetails from '../expense-details/expense-details';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { ExpensesReceiptContext } from '../expenses-receipt-provider/expenses-receipt-provider';
import Alert from 'react-bootstrap/Alert';

const service = new ExpensesReceiptService();

const ExpensesReceiptStatus = () => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);

    return (
        <div>
            {!expensesReceipt?.isOpen() &&
                <Alert variant='primary'>
                    <div style={{ textAlign: 'center' }}>Liquidacion Cerrada.</div>
                </Alert>
            }
        </div>

    )
}
const ExpensesReceiptDetailView = (props) => {

    const { consortium } = useContext(ConsortiumContext);
    const { expensesReceipt, setExpensesReceipt } = useContext(ExpensesReceiptContext);
    const [transactionStatus, setTransaciontStatus] = useState(false);
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
        service.save(expensesReceipt)
        setExpensesReceipt(expensesReceipt)
    }

    return (
        <div className='expenses-receipt'>
            <div>
                <div className='text-center'>
                    <p>{`Gastos correspondientes al mes de ${expensesReceipt?.month} ${expensesReceipt?.year}`}</p>
                </div>
                <hr />
                <div>
                    {isAdministrator &&
                        <div>
                            <ExpensesReceiptStatus />
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
                <ExpenseDetails
                    expensesReceipt={expensesReceipt}
                    userAdministrator={isAdministrator}
                    updateAction={(item) => setItemAction(item, update, 'Modificar')}
                    removeAction={(item) => setItemAction(item, remove, 'Eliminar')}
                />
            </div>
        </div>
    )
}


export default ExpensesReceiptDetailView