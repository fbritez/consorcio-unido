import React, { useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import authenticationHandler from '../login/authentication-handler';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificationView from './notification-view';
import ExpensesReceiptList from '../expenses-receipt/expenses-receipt-list/expenses-receipt-list';
import AddClaimView from '../claims/add-claim-view';
import ClaimListView from '../claims/claim-list-view';
import { claims, expenses } from '../main/routes';
import { UserContext } from '../user-provider/user-provider';
import { PathContext } from '../main/path-provider';

const NotificationGeneralView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const [ updated, setUpdated ] = useState(false);
    const { setPath } = useContext(PathContext);

    return (
        <div className='background'>
            <Container>
                <div style={{ marginLeft: '7%', marginRight: '7%' }}>
                    <Row style={{ marginTop: '1%' }} >
                        <Col sm={3}>{
                            <div>
                                <ExpensesReceiptList action={() => setPath(expenses())}/>
                            </div>
                        }
                        </Col>
                        <Col sm={6}>
                            <h5>Novedades</h5>
                            <hr />
                            {consortium ?
                                <div className='scrollbar-dinamically'>
                                    <NotificationView setUpdated={setUpdated}/>
                                </div>
                                :
                                <div className='text-center'>
                                    <lable > Por favor seleccione un consorcio</lable>
                                </div>
                        }
                        </Col>
                        <Col sm={3}>{
                            consortium && 
                            <div>
                                {consortium?.isAdministrator(user) ?
                                    <React.Fragment />
                                    :
                                    <AddClaimView />
                                }
                                <div style={{marginBottom: '1%'}}>Reclamos Pendientes</div>
                                <hr />
                                <ClaimListView
                                    sideEffect={() => setPath(claims())} 
                                    filterFuction={(claim) => claim.state != 'Close'}
                                />
                            </div>
                        }
                        </Col>
                    </Row>
                </div>
            </Container>
        </div >
    )
}

export default authenticationHandler(NotificationGeneralView)
