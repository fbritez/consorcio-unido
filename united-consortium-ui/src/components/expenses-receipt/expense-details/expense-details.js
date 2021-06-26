import React, { useContext } from 'react';
import { Card, Accordion, Button, Row, Col, Badge } from 'react-bootstrap';
import { UpdateItemButton, RemoveItemButton, DownloadButton } from '../../common/buttons';
import imageService from '../../../services/image-service/image-service'
import './expense-details.scss';

const downloadTicket = file_id => {
    imageService.downloadImage(file_id)
}

const renderOneLineDescription = (description, value) => {
    return (
        <div className='content'>
            <div className='left'>{description}</div>
            <div className='right'>{value}</div>
        </div>
    )
}
const MemberDetailsView = (props) => {
    return (
        <div>
            {props.item.members?.map(member => {
                return (<Badge variant="dark">{member.member_name}</Badge>)
            })}
        </div>
    )
}

const ExpenseDetails = props => {
    debugger
    return (
        <div>
            {props.expensesReceipt &&
                <div>
                    <div>
                        {<Accordion defaultActiveKey="0">
                            {props.expensesReceipt.getExpenses()?.map(item => {
                                let eventKey = props.expensesReceipt.getExpenses().indexOf(item) + 1;
                                return (
                                    <div className='contenedore-item' sytle={{fontSize: 'small' }}>
                                        <Card>
                                            <Card.Header className='expenses-card-header'>
                                                <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
                                                    {renderOneLineDescription(item.title, item.getCurrencyAmount())}
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={eventKey}>
                                                <Card.Body className='card-expenses-detail'>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div className='card-details'>
                                                                <text style={{whiteSpace: 'break-spaces'}}>
                                                                    {item.description}
                                                                </text>
                                                            </div>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <div>
                                                                {
                                                                    props.userAdministrator &&
                                                                    <div className='right'>
                                                                        <UpdateItemButton onClick={() => props.updateAction(item)} />
                                                                        <RemoveItemButton onClick={() => props.removeAction(item)} />
                                                                    </div>
                                                                } {item.ticket &&
                                                                    <div className='right'>
                                                                        <DownloadButton onClick={() => downloadTicket(item.ticket)} />
                                                                    </div>}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <MemberDetailsView item={item} />
                                                    <hr />
                                                    <div className='amount-detail'>
                                                        {renderOneLineDescription('Costo', item.getCurrencyAmount())}
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </div>)
                            })}
                        </Accordion>}
                    </div>
                    <div className='my-total'>
                        <Card className='total' border="success" body>
                            {renderOneLineDescription('Total a pagar', props.expensesReceipt.getCurrencyAndTotalAmount())}
                        </Card>
                    </div>
                </div>}
        </div>)
}


export default ExpenseDetails