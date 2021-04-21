import React from 'react';
import './expenses-receipt-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Card, Accordion, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs'




export class ExpensesReceiptView extends React.Component {

    constructor(props) {
        super(props);
        this.service = new ExpensesReceiptService();

        this.state = {
            expenses: [],
            selectedItem: null,
            selectedAction: null,
            selectedDescription: {},
            showExpenseCRUD: false
        }
    };

    async componentWillReceiveProps() {
        debugger
        const consortium = this.props.consortium
        if (consortium){
            const exp = await this.service.getExpensesFor(consortium);
            this.setState({ expenses: exp });
        } 
        
    }

    async componentDidMount() {
        const consortium = this.props.consortium
        if (consortium){
            const exp = await this.service.getExpensesFor(consortium);
            this.setState({ expenses: exp });
        } 
    }

    update = (item) => {
        const expensesItem = this.service.createItemModel(item);
        const updatedExpenses = this.state.expenses;
        updatedExpenses[0].expense_items.fiter(item => item.equal(expensesItem));
        return updatedExpenses
    }

    remove = (item) => {
        const expensesItem = this.service.createItemModel(item);
        const updatedExpenses = this.state.expenses;
        updatedExpenses[0].expense_items.pop(expensesItem);
        return updatedExpenses
    }

    add = (item) => {
        const expensesItem = this.service.createItemModel(item);
        const updatedExpenses = this.state.expenses;
        updatedExpenses[0].expense_items.push(expensesItem);
        return updatedExpenses
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
                <p> {`Gastos correspondientes al mes de ${this.state.expenses[0].month} ${this.state.expenses[0].year}`}</p>
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
                                                        <div className='right'>
                                                            <Button className='option-button' onClick={() => this.setItemAction(item, this.update, 'Modificar')}><BsPencil /></Button>
                                                            <Button className='option-button' onClick={() => this.setItemAction(item, this.remove, 'Eliminar')}><BsFillTrashFill /></Button>
                                                        </div>
                                                        <div className='card-details'>
                                                            {item.title}
                                                            <p>{`Descripcion: ${item.description}`}</p>
                                                            <div> Descargar Comprobante</div>
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
        this.setState({ selectedItem: item, 
                        selectedAction: action, 
                        selectedDescription: description, 
                        showExpenseCRUD: true })
    }

    runAction = async (item, action) => {
        const updatedExpenses = action(item)
        const resutl = await this.service.save(updatedExpenses[0])
        this.setState({ expenses: updatedExpenses })
    }

    showExpensesCRUD(value) {
        this.setState({ showExpenseCRUD: value })
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
                                'Por favor seleccione un consorcio'
                            }
                        </Col>
                        <Col sm={4}>{
                            this.state.expenses.length > 0 &&
                            <div>
                                <div>
                                    <p>{' '}</p>
                                </div>
                                <div>
                                    <Button className='add-local-button' onClick={() => this.setItemAction(null, this.add, 'Agregar')}> Agregar gasto </Button>
                                    {this.state.showExpenseCRUD &&  <ExpenseItemView item={this.state.selectedItem}
                                        handleAction={(item) => this.runAction(item, this.state.selectedAction)}
                                        actionDescription = {this.state.selectedDescription} 
                                        show={this.state.showExpenseCRUD} 
                                        showExpensesCRUD={(bool) => this.showExpensesCRUD(bool)} />}
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