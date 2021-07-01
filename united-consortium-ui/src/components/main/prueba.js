import React, { useContext, useState } from 'react';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import ExpensesReceiptView from '../expenses-receipt/view/expenses-receipt-view';
import ExpensesReceiptList from '../expenses-receipt/expenses-receipt-list/expenses-receipt-list';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { UserContext } from '../user-provider/user-provider';
import NotificationView from '../notifications/notification-view';
import { ExpensesReceiptContextProvider } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';


const PrePrueba = props => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [updated, setUpdated] = useState(false);
    const { user } = useContext(UserContext);

    return (
        <div >
            <Container>
                <div >
                    <Row style={{ marginTop: '1%' }} className="justify-content-md-center">
                        <Col sm={4}>
                            <Card style={{  height: '95vh' }}>
                                <CardContent>
                                    {consortium ? 
                                        <div className='scrollbar-dinamically'>
                                            <NotificationView setUpdated={setUpdated} />
                                        </div> : <div />}
                                </CardContent>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card style={{  height: '95vh' }}>
                                <CardContent style={{ fontSize: 'smaller'}}>
                                <Row style={{ marginTop: '1%' }} className="justify-content-md-center">
                                <Col sm={10}>
                                        {
                                            consortium ?
                                                <div className='scrollbar-dinamically'>
                                                    <ExpensesReceiptView />
                                                </div>
                                                :
                                                <div className='text-center'>
                                                    <h5>Expensas</h5>
                                                    <hr />
                                                    <lable > Por favor seleccione un consorcio</lable>
                                                </div>
                                        }
                                    </Col>
                                    <Col sm={2}>
                                        <ExpensesReceiptList consortium={consortium} />
                                    </Col>
                                </Row>       
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div >
    )
}


const Prueba = (props) => {
    return (
        <ExpensesReceiptContextProvider>
            <PrePrueba />
        </ExpensesReceiptContextProvider>
    )
}


export default Prueba