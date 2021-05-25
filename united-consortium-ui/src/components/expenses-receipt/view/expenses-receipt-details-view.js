import React from 'react';
import './expenses-receipt-details-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseDetails from '../expense-details/expense-details';



export class ExpensesReceiptDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.service = new ExpensesReceiptService();
        this.consortium = null
        this.state = {
            currentExpense: props.expensesReceipt,
            selectedItem: null,
            selectedAction: null,
            selectedDescription: {},
            showExpenseCRUD: false,
        }
        this.user = props.user;
        this.isAdministrator = props.isAdministrator;
    };

    async componentDidMount() {
       
    }

    async componentDidUpdate(prev) {
        if (prev.consortium !== this.props.consortium) {
            await this.getExpenses()
            const isAdmin = await this.service.isAdministrator(this.user);
            this.setState({ isAdministrator: isAdmin });
        }
    }

    update = (item) => {
        debugger
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        const idx = updatedExpense.expense_items.findIndex(i => i === item.oldItem)
        const element = updatedExpense.expense_items[idx] = expensesItem
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    remove = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        updatedExpense.expense_items.pop(expensesItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    add = (item) => {
        debugger
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        updatedExpense.expense_items.push(expensesItem);
        return { expense: updatedExpense, file: item.newItem.updatedFile }
    }

    setItemAction = async (item, action, description) => {
        this.setState({
            selectedItem: item,
            selectedAction: action,
            selectedDescription: description,
            showExpenseCRUD: true
        })
    }

    runAction = async (item, action) => {
        const { expense, file } = action(item)
        const resutl = await this.service.save(expense, file)
        this.setState({ currentExpense: expense })
    }

    showExpensesCRUD(value) {
        this.setState({ showExpenseCRUD: value })
    }

    closeExpenses() {
        this.state.currentExpense.close()
        this.service.save(this.state.currentExpense)
    }

    setCurrentExpenses(expensesReceipt) {
        this.setState({ currentExpense: expensesReceipt })
    }

    renderCurrentExpense() {
        return (
            <div>
                <div className='text-center'>
                    <p>{`Gastos correspondientes al mes de ${this.state.currentExpense.month} ${this.state.currentExpense.year}`}</p>
                </div>
                <hr />
                <div>
                    {this.isAdministrator &&
                        <div>
                            <Button
                                className='add-local-button'
                                disabled={!this.state.currentExpense?.isOpen}
                                onClick={() => this.setItemAction(null, this.add, 'Agregar')}>
                                Agregar gasto
                            </Button>
                            <Button
                                className='generate-button'
                                disabled={!this.state.currentExpense?.isOpen}
                                onClick={() => this.closeExpenses()}>
                                Generar Liquidación
                            </Button>
                        </div>
                    }
                    {this.state.showExpenseCRUD && <ExpenseItemView item={this.state.selectedItem}
                        handleAction={(item) => this.runAction(item, this.state.selectedAction)}
                        actionDescription={this.state.selectedDescription}
                        show={this.state.showExpenseCRUD}
                        showExpensesCRUD={(bool) => this.showExpensesCRUD(bool)} />
                    }
                </div>
                <hr />
                <ExpenseDetails
                    expensesReceipt={this.state.currentExpense}
                    userAdministrator={this.isAdministrator}
                    updateAction={(item) => this.setItemAction(item, this.update, 'Modificar')}
                    removeAction={(item) => this.setItemAction(item, this.remove, 'Eliminar')}
                />
            </div>
        )
    }

    render() {
        return (
            <div className='expenses-receipt'>
                {
                    this.renderCurrentExpense()

                }
            </div>
        )
    }
}