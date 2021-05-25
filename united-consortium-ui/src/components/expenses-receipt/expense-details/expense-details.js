import React, { useContext } from 'react';
import { Card, Accordion, Button } from 'react-bootstrap';
import { UpdateItemButton, RemoveItemButton } from '../../common/buttons';
import ImageService from '../../../services/image-service/image-service'

const downloadTicket = file_id => {
    const service = new ImageService();
    service.downloadImage(file_id)
}

const renderOneLineDescription = (description, value) => {
    return (
        <div className='content'>
            <div className='left'>{description}</div>
            <div className='right'>{value}</div>
        </div>
    )
}
const ExpenseDetails = props => {


    return (
        props.expensesReceipt &&
        <div>
            <div className='text-center'>
                <p>{`Gastos correspondientes al mes de ${props.expensesReceipt.month} ${props.expensesReceipt.year}`}</p>
            </div>
            <div>
                <div>

                    {<Accordion defaultActiveKey="0">
                        {props.expensesReceipt.expense_items?.map(item => {
                            let eventKey = props.expensesReceipt.expense_items.indexOf(item) + 1;
                            return (
                                <div className='contenedore-item'>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
                                                {renderOneLineDescription(item.title, item.getCurrencyAmount())}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={eventKey}>
                                            <Card.Body >
                                                {
                                                    props.userAdministrator &&
                                                    <div className='right'>
                                                        <UpdateItemButton onClick={() => props.updateAction(item)} />
                                                        <RemoveItemButton onClick={() => props.removeAction(item)} />
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
                                                        {renderOneLineDescription('Costo', item.getCurrencyAmount())}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </div>)
                        })}
                    </Accordion>}
                </div>
                <div>
                    <Card className='total' border="success" body>
                        {renderOneLineDescription('Total a pagar', props.expensesReceipt.getCurrencyAndTotalAmount())}
                    </Card>
                </div>
            </div>
        </div>)
}


export default ExpenseDetails