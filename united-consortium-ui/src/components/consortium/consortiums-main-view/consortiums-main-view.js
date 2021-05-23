import React, { useState, useContext } from 'react';
import ConsortiumsListView from '../consortiums-list-view/consortiums-list-view';
import AppliactionNavView from '../../application-nav/application-nav-view';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { UserContext } from '../../user-provider/user-provider';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import authenticationHandler from '../../login/authentication-handler';
import ConsortiumDetails from '../consortium-details-view/consortium-details-view';
import { ConsortiumContextProvider } from '../consortium-provider/consortium-provider';

const ConsortiumsGeneralView = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [ currentCons, setCurrentCons ] = useState(consortium);
    const { user, setUser } = useContext(UserContext);

    const setConsortiums = (c) =>{
        setConsortium(undefined)
        setConsortium(c)
        setCurrentCons(c)
    }
 
    return (
        <div className='consortium-main-view'>
            <AppliactionNavView />
            <Container>
                <div>
                    <Row style={{ marginTop: '1%' }}>
                        <Col sm={3}>{
                            <div>
                                <ConsortiumsListView setConsortium={setConsortiums} user={user} add={true} />
                            </div>
                        }
                        </Col>
                        <Col sm={7}>{
                            consortium ?
                                <div>
                                    <ConsortiumDetails/>
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

const ConsortiumsMainView = (props) => {
    return (
        <ConsortiumContextProvider>
            <ConsortiumsGeneralView />
        </ConsortiumContextProvider>
    )
}

export default authenticationHandler(ConsortiumsMainView)
