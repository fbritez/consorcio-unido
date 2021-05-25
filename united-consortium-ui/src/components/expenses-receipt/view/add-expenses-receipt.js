import React, { useState } from 'react';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { AddItemButton } from '../../common/buttons';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import './expenses-receipt-view.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const service = new ExpensesReceiptService();

const months = ['Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septimbre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

const ErrorHandler = props => {
    debugger
    return (
        <div>
            {props.errors.map(errorAndDescription => {
                return (
                    <div>
                        {errorAndDescription.value &&
                            <Alert variant='danger'>
                                {errorAndDescription.description}
                            </Alert>}
                    </div>)
            })}
        </div>)
}

const LocalDropdown = props => {
    return (
        <Dropdown>
            <Dropdown.Toggle className='my-dropdown' id="dropdown-basic">
                {props.description}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {props.elements.map(item => <Dropdown.Item
                    onClick={() => props.onClick(item)}>
                    {item}
                </Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const AddExpensesReceipt = props => {

    const defaultMonthDescription = 'Elegir mes';
    const defaultYearDescription = 'Elegir Año';

    const [monthDescription, setMonthDescription] = useState(defaultMonthDescription);
    const [yearDescription, setYearDescription] = useState(defaultYearDescription);
    const [wrongTransacion, setWrongTransaction] = useState(false);
    const [invalidMonth, setInvalidMonth] = useState(false);
    const [invalidYear, setInvalidYear] = useState(false);

    const validateData = () => {
        const m = monthDescription == defaultMonthDescription
        const y = yearDescription == defaultYearDescription
        setInvalidMonth(m)
        setInvalidYear(y);
        return (!m && !y)
    }

    const generateExpensesRecepit = async () => {
        debugger
        if (validateData()) {
            await service.createExpenseReceipt(props.consortium, monthDescription, yearDescription)
                .then(
                    (exp) => { props.setCurrentExpeses(exp) },
                    () => { setWrongTransaction(true) })
        }

    }

    const errorDescriptions = [{
        value: wrongTransacion,
        description: 'La Liquidación no pudo ser generada. Por favor contactese con el administrador'
    }, {
        value: invalidMonth,
        description: 'El mes seleccionado no es valido'
    }, {
        value: invalidYear,
        description: 'El año seleccionado no es valido'
    }]

    return (
        <Container>
            <Row>
                <Col sm={8}>
                    <h3>
                        Iniciar Expensas
                    </h3>
                    <hr />
                    <div>
                        Eliga mes y año para la nueva liquidación de expensas.
                    </div>
                    <div style={{ marginTop: '3%' }}>
                        <Row>
                            <Col sm={6}>
                                <LocalDropdown
                                    elements={months}
                                    description={monthDescription}
                                    onClick={setMonthDescription}
                                />
                            </Col>
                            <Col sm={6}>
                                <LocalDropdown
                                    elements={range(2021, 2030)}
                                    description={yearDescription}
                                    onClick={setYearDescription}
                                />
                            </Col>
                        </Row>
                    </div>
                    <hr />
                    <div style={{ fontSize: '10px' }}>
                        Tenga en cuenta que una vez creada Liquidación de Expensas no podra eliminarla.
                        </div>
                    <ErrorHandler errors={errorDescriptions} />
                    <div>
                        <AddItemButton description={'Generar'} onClick={generateExpensesRecepit} />
                    </div>
                </Col>
                <Col sm={4}>
                    <ExpensesReceiptList consortium={props.consortium} />
                </Col>
            </Row>
        </Container>
    )
}

export default AddExpensesReceipt