import React, { useContext } from 'react';
import ConsortiumsListView from '../../consortium/consortiums-list-view/consortiums-list-view';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import ExpensesReceiptView from '../view/expenses-receipt-view';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import './expenses-receipt-main-view.scss';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { UserContext } from '../../user-provider/user-provider';
import authenticationHandler from '../../login/authentication-handler';
import { ExpensesReceiptContextProvider } from '../expenses-receipt-provider/expenses-receipt-provider';

const ExpensesReceiptGeneralView = props => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);

    const { user } = useContext(UserContext);

    return (
        <div className='expenses-receipt'>
            <Container>
                <div style={{ marginLeft: '7%', marginRight: '7%'}}>
                    <Row style={{ marginTop: '1%' }} className="justify-content-md-center">
                        <Col sm={2}>{
                            <div>
                                <ConsortiumsListView setConsortium={(selectecConsortium) => setConsortium(selectecConsortium)} user={user} />
                            </div>
                        }
                        </Col>
                        <Col sm={8}>{
                            consortium ?
                                <div className='scrollbar-dinamically'>
                                    <ExpensesReceiptView/>
                                </div>
                                :
                                <div className='text-center'>
                                    <h5>Expensas</h5>
                                    <hr/>
                                    <lable > Por favor seleccione un consorcio</lable>
                                </div>
                        }
                        </Col>
                        <Col sm={2}>
                            <ExpensesReceiptList consortium={consortium}  />
                        </Col>
                    </Row>
                </div>
            </Container>
        </div >
    )
}

const ExpensesReceiptMainView = (props) => {
    return (
            <ExpensesReceiptContextProvider>
                <ExpensesReceiptGeneralView />
            </ExpensesReceiptContextProvider>
    )
}


export default authenticationHandler(ExpensesReceiptMainView)