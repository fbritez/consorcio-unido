import React, { useContext } from 'react';
import './expenses-receipt-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ImageService from '../../../services/image-service/image-service'
import ExpenseItemView from '../expense-item/expense-item'
import { Card, Accordion, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UpdateItemButton, RemoveItemButton } from '../../common/buttons';


const downloadTicket = file_id => {
    const service = new ImageService();
    service.downloadImage(file_id)
}

export class ExpensesReceiptView extends React.Component {

    constructor(props) {
        super(props);
        this.service = new ExpensesReceiptService();
        this.consortium = null
        this.state = {
            expenses: [],
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
            const isAdmin =  this.service.isAdministrator(this.user);
            this.setState({ isAdministrator: isAdmin });
        }
    }

    async getExpenses() {
        const consortium = this.props.consortium
        if (consortium) {
            const exp = await this.service.getExpensesFor(this.props.consortium);
            this.setState({ expenses: exp });
        }
    }

    update = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpenses = this.state.expenses;
        const idx = updatedExpenses[0].expense_items.findIndex(i => i === item.oldItem)
        const element = updatedExpenses[0].expense_items[idx] = expensesItem
        return { expenses: updatedExpenses, file: item.newItem.updatedFile }
    }

    remove = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpenses = this.state.expenses;
        updatedExpenses[0].expense_items.pop(expensesItem);
        return { expenses: updatedExpenses, file: item.newItem.updatedFile }
    }

    add = (item) => {
        const expensesItem = this.service.createItemModel(item.newItem.item);
        const updatedExpenses = this.state.expenses;
        updatedExpenses[0].expense_items.push(expensesItem);
        return { expenses: updatedExpenses, file: item.newItem.updatedFile }
    }


    renderOneLineDescription(description, value) {
        return (
            <div className='content'>
                <div className='left'>{description}</div>
                <div className='right'>{value}</div>
            </div>
        )
    }

    renderDetails() {
        return (
            <div>
                <div className='text-center'>
                    <p>{`Gastos correspondientes al mes de ${this.state.expenses[0].month} ${this.state.expenses[0].year}`}</p>
                </div>
                <div>
                    <div>
                        {
                            <Accordion defaultActiveKey="0">
                                {this.state.expenses[0].expense_items?.map(item => {
                                    let eventKey = this.state.expenses[0].expense_items.indexOf(item) + 1;
                                    return (
                                        <div className='contenedore-item'>
                                            <Card>
                                                <Card.Header>
                                                    <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
                                                        {this.renderOneLineDescription(item.title, item.getCurrencyAmount())}
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={eventKey}>
                                                    <Card.Body >
                                                        {
                                                            this.state.isAdministrator &&
                                                            <div className='right'>
                                                                <UpdateItemButton onClick={() => this.setItemAction(item, this.update, 'Modificar')} />
                                                                <RemoveItemButton onClick={() => this.setItemAction(item, this.remove, 'Eliminar')} />
                                                            </div>
                                                        }
                                                        <div className='card-details'>
                                                            {item.title}
                                                            <p>{`Descripcion: ${item.description}`}</p>
                                                            {item.ticket &&
                                                                <div>
                                                                    <Button className='option-button' onClick={() => downloadTicket(item.ticket)}>
                                                                        Descargar Comprobante
                                                                </Button>
                                                                </div>}
                                                            <hr />
                                                            <div className='amount-detail'>
                                                                {this.renderOneLineDescription('Costo', item.getCurrencyAmount())}
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </div>)
                                })}
                            </Accordion>
                        }
                    </div>
                    <div>
                        <Card className='total' border="success" body>
                            {this.renderOneLineDescription('Total a pagar', this.state.expenses[0].getCurrencyAndTotalAmount())}
                        </Card>
                    </div>
                </div>
            </div>)
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
        const { expenses, file } = action(item)
        const resutl = await this.service.save(expenses[0], file)
        this.setState({ expenses: expenses })
    }

    showExpensesCRUD(value) {
        this.setState({ showExpenseCRUD: value })
    }

    closeExpense() {

    }

    render() {
        return (
            <div className='expenses-receipt'>
                <Container>
                    <Row>
                        <Col sm={8}>
                            {this.state.expenses.length > 0 ?
                                this.renderDetails()
                                :
                                <div className='text-center'>
                                    <lable > Este consorcio no tiene expensas disponibles</lable>
                                </div>

                            }
                        </Col>
                        <Col sm={4}>{
                            this.state.expenses.length > 0 &&
                            <div>
                                <div>
                                    <p>{' '}</p>
                                </div>
                                <div>
                                    {
                                        this.state.isAdministrator &&
                                        <div>
                                            <Button className='add-local-button' onClick={() => this.setItemAction(null, this.add, 'Agregar')}> Agregar gasto </Button>
                                            <Button className='add-button' onClick={this.closeExpenses}> Generar Liquidación </Button>
                                        </div>
                                    }
                                    {this.state.showExpenseCRUD && <ExpenseItemView item={this.state.selectedItem}
                                        handleAction={(item) => this.runAction(item, this.state.selectedAction)}
                                        actionDescription={this.state.selectedDescription}
                                        show={this.state.showExpenseCRUD}
                                        showExpensesCRUD={(bool) => this.showExpensesCRUD(bool)} />}
                                </div>
                                <div style={{marginTop: '3%'}}>
                                    <ListGroup>
                                        {this.state.expenses?.map(item => {
                                            return (
                                                <ListGroup.Item>{`${item.month} - ${item.year}`}</ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </div>
                            </div>
                        }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}