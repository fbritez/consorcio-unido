import React from 'react';
import './expenses-receipt-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseDetails from '../expense-details/expense-details';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import AddExpensesReceipt from './add-expenses-receipt';


export class ExpensesReceiptView extends React.Component {

    constructor(props) {
        super(props);
        this.service = new ExpensesReceiptService();
        this.consortium = null
        this.state = {
            expenses: [],
            currentExpense: null,
            selectedItem: null,
            selectedAction: null,
            selectedDescription: {},
            showExpenseCRUD: false,
            isAdministrator: false
        }
        this.user = props.user
    };

    async componentDidMount() {
        await this.getExpenses()
    }

    async componentDidUpdate(prev) {
        if (prev.consortium !== this.props.consortium) {
            await this.getExpenses()
            const isAdmin = await this.service.isAdministrator(this.user);
            this.setState({ isAdministrator: isAdmin });
        }
    }

    async getExpenses() {
        const consortium = this.props.consortium
        if (consortium) {
            const expenses = await this.service.getExpensesFor(this.props.consortium);
            const openExpenses = expenses.filter(expense => expense.isOpen());
            this.setState({ expenses: expenses, currentExpense: openExpenses[0] });
        }
    }

    update = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        const idx = updatedExpense.expense_items.findIndex(i => i === item.oldItem)
        const element = updatedExpense.expense_items[idx] = expensesItem
        return { currentExpense: updatedExpense, file: item.newItem.updatedFile }
    }

    remove = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        updatedExpense.expense_items.pop(expensesItem);
        return { currentExpense: updatedExpense, file: item.newItem.updatedFile }
    }

    add = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpense = this.state.currentExpense;
        updatedExpense.expense_items.push(expensesItem);
        return { currentExpense: updatedExpense, file: item.newItem.updatedFile }
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
        debugger
        this.setState({ currentExpense: expensesReceipt })
    }

    renderCurrentExpense() {
        return (
            <Container>
                <Row>
                    <Col sm={8}>
                        {this.state.expenses.length > 0 ?
                            <ExpenseDetails
                                expensesReceipt={this.state.currentExpense}
                                userAdministrator={this.state.isAdministrator}
                                updateAction={(item) => this.setItemAction(item, this.update, 'Modificar')}
                                removeAction={(item) => this.setItemAction(item, this.remove, 'Eliminar')}
                            />
                            :
                            <div className='text-center'>
                                <lable> Este consorcio no tiene expensas disponibles</lable>
                            </div>
                        }
                    </Col>
                    <Col sm={4}>{

                        <div>
                            <div>
                                <p>{' '}</p>
                            </div>
                            <div>
                                {this.state.isAdministrator &&
                                    <div>
                                        <Button
                                            className='add-local-button'
                                            disabled={!this.state.currentExpense?.isOpen}
                                            onClick={() => this.setItemAction(null, this.add, 'Agregar')}>
                                            Agregar gasto
                                        </Button>
                                        <Button
                                            className='add-button'
                                            disabled={!this.state.currentExpense?.isOpen}
                                            onClick={() => this.closeExpenses()}>
                                            Generar Liquidación
                                        </Button>
                                    </div>}
                                {this.state.showExpenseCRUD && <ExpenseItemView item={this.state.selectedItem}
                                    handleAction={(item) => this.runAction(item, this.state.selectedAction)}
                                    actionDescription={this.state.selectedDescription}
                                    show={this.state.showExpenseCRUD}
                                    showExpensesCRUD={(bool) => this.showExpensesCRUD(bool)} />}
                            </div>
                            <ExpensesReceiptList consortium={this.props.consortium} />
                        </div>
                    }
                    </Col>
                </Row>
            </Container>
        )
    }

    render() {
        return (
            <div className='expenses-receipt'>
                {this.state.currentExpense ?
                    this.renderCurrentExpense() :
                    <AddExpensesReceipt 
                        consortium={this.props.consortium} 
                        setCurrentExpeses={(exp) => this.setCurrentExpenses(exp)}
                    />
                }
            </div>
        )
    }
}