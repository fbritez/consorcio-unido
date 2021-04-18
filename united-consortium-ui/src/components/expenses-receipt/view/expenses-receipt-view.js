import React from 'react';
import './expenses-receipt-view.scss';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import ExpenseItemView from '../expense-item/expense-item'
import { Card, Accordion, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';

export class ExpensesReceiptView extends React.Component {

    constructor(props) {
        super(props);
        this.service = new ExpensesReceiptService();
        this.state = {
            expenses: [],
        }
    };

    async componentWillReceiveProps() {
        debugger
        const consortium = this.props.consortium ? this.props.consortium : ''
        const exp = await this.service.getExpensesFor(consortium);
        this.setState({ expenses: exp });
    }

    async _componentDidMount() {
        debugger
        const consortium = this.props.consortium ? this.props.consortium : ''
        const exp = await this.service.getExpensesFor(consortium);
        this.setState({ expenses: exp });
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
                                {this.state.expenses[0].expensesItems?.map(item => {
                                    let eventKey = this.state.expenses[0].expensesItems.indexOf(item) + 1;
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

    updateExpense(item){
        const updatedExpenses = this.state.expenses;
        updatedExpenses.push(item);
        this.setState({expenses: updatedExpenses})
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
                            <ExpenseItemView handleItem={(item) => this.updateExpense(item)}/>
                        }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}