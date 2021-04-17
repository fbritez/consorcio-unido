import React from 'react';
import ExpensesReceiptService from '../../services/expense-receipt-service/expense-receipt-service';
import { Card , Accordion, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export class ExpensesReceiptView extends React.Component{
    
    constructor(props){
        super(props);
        this.service = new ExpensesReceiptService();
        this.state = {
            expenses : []
        }
    };

    async componentWillReceiveProps(){
        debugger
        const consortium = this.props.consortium ? this.props.consortium : ''
        const exp = await this.service.getExpensesFor(consortium);
        this.setState({expenses : exp });
    }

    async _componentDidMount(){
        debugger
        const consortium = this.props.consortium ? this.props.consortium : ''
        const exp = await this.service.getExpensesFor(consortium);
        this.setState({expenses : exp });
    }

    renderR(){

        debugger
        return (
        <div>
            <p> { `Gastos correspondientes al mes de ${this.state.expenses[0].month} ${this.state.expenses[0].year}`}</p>
            <div className='contenedor-secuencias'>
                <div>
                    {
                        <Accordion defaultActiveKey="0">
                            {this.state.expenses[0].expensesItems?.map(item => {
                                let eventKey = this.state.expenses[0].expensesItems.indexOf(item) +1;
                                return (
                                <div className='contenedore-item'>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
                                                {item.title}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={eventKey} onClick={() => {}}>
                                            <Card.Body>
                                                {item.title}
                                                <p>{`Descripcion: ${item.description}`}</p>
                                                <p>{`Costo: ${item.amount}`}</p>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </div>)
                        })}
                        </Accordion>
                    }
                </div>
                <div>
                    {`Total a pagar ${this.state.expenses[0].getTotalAmount()}`}
                </div>
            </div>
        </div>)
    }

    render(){ 
        debugger
        return(
            <div> { this.state.expenses.length > 0 ?
                this.renderR()
                :
                <div>
                    Por favor seleccione un consorcio
                </div>
            }
            </div>
        )}
}