import React, { useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import authenticationHandler from '../login/authentication-handler';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import ClaimDetailsView from './claim-detail-view';
import AddClaimView from './add-claim-view';
import ClaimListView from './claim-list-view';
import { ClaimContext } from './claim-provider';
import { UserContext } from '../user-provider/user-provider';

const ClaimsGeneralView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { claim } = useContext(ClaimContext)
    const { user } = useContext(UserContext)

    return (
        <div className='background'>
            <Container>
                {consortium ?
                    <div style={{ marginLeft: '7%', marginRight: '7%' }}>
                        <Row style={{ marginTop: '1%' }} >
                            <Col sm={3}>
                                <h7>Mis Reclamos</h7>
                                <hr />
                                <ClaimListView/>
                            </Col>
                            <Col sm={6}>
                                <h5>Reclamos</h5>
                                <hr />
                                {
                                    claim ?
                                        <div className='scrollbar-dinamically'>
                                            <ClaimDetailsView/>
                                        </div>
                                        :
                                        <div>
                                            Selecciones un Reclamo
                                        </div>
                                }
                            </Col>
                            <Col sm={3}>
                                {consortium.isAdministrator(user) ?
                                    <React.Fragment />
                                    :
                                    <AddClaimView />
                                }
                            </Col>
                        </Row>
                    </div> :
                    <div className='text-center'>
                        <lable > Por favor seleccione un consorcio</lable>
                    </div>
                }
            </Container>
        </div >
    )
}

export default authenticationHandler(ClaimsGeneralView)
