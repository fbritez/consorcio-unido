import React, { useState, useContext } from 'react';
import ConsortiumsView from '../../consortium/consortiums-view';
import { ExpensesReceiptView } from '../view/expenses-receipt-view';
import AppliactionNavView from '../../application-nav/application-nav-view';
import './expenses-receipt-main-view.scss';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { UserContext } from '../../user-provider/user-provider';
import authenticationHandler from '../../login/authentication-handler';

const ExpensesReceiptMainView = (props) => {

    const [consortium, setConsortium] = useState(undefined);

    const { user, setUser } = useContext(UserContext);

    return (
        <div className='expenses-receipt'>
            <AppliactionNavView />
            <Container>
                <div>
                    <Row style={{ marginTop: '1%' }}>
                        <Col sm={3}>{
                            <div>
                                <ConsortiumsView setConsortium={(selectecConsortium) => setConsortium(selectecConsortium)} />
                            </div>
                        }
                        </Col>
                        <Col sm={9}>{
                            consortium ?
                                <div>
                                    <ExpensesReceiptView consortium={consortium} />
                                </div>
                                :
                                <div className='text-center'>
                                    <lable > Por favor seleccione un consorcio</lable>
                                </div>
                            }
                        </Col>
                    </Row>
                </div>
            </Container>
        </div >
    )
}

export default authenticationHandler(ExpensesReceiptMainView)