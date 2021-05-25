import React, { useContext } from 'react';
import ConsortiumsListView from '../../consortium/consortiums-list-view/consortiums-list-view';
import { ConsortiumContextProvider, ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import ExpensesReceiptView from '../view/expenses-receipt-view';
import ExpensesReceiptList from '../expenses-receipt-list/expenses-receipt-list';
import AppliactionNavView from '../../application-nav/application-nav-view';
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
            <AppliactionNavView />
            <Container>
                <div>
                    <Row style={{ marginTop: '1%' }}>
                        <Col sm={3}>{
                            <div>
                                <ConsortiumsListView setConsortium={(selectecConsortium) => setConsortium(selectecConsortium)} user={user} />
                            </div>
                        }
                        </Col>
                        <Col sm={6}>{
                            consortium ?
                                <div>
                                    <ExpensesReceiptView/>
                                </div>
                                :
                                <div className='text-center'>
                                    <lable > Por favor seleccione un consorcio</lable>
                                </div>
                        }
                        </Col>
                        <Col>
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
        <ConsortiumContextProvider>
            <ExpensesReceiptContextProvider>
                <ExpensesReceiptGeneralView />
            </ExpensesReceiptContextProvider>
        </ConsortiumContextProvider>
    )
}


export default authenticationHandler(ExpensesReceiptMainView)