import React, { useState, useContext } from 'react';
import ConsortiumsListView from '../consortiums-list-view/consortiums-list-view';
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
    const [ updated, setUpdated ] = useState(false);
    const { user, setUser } = useContext(UserContext);


    const setConsortiums = (c) =>{
        setConsortium(undefined)
        setConsortium(c)
    }
 
    return (
        <div className='background'>
            <Container>
                <div style={{ marginLeft: '7%', marginRight: '7%' }}>
                    <Row style={{ marginTop: '1%' }}>
                        <Col sm={3}>{
                            <div>
                                <ConsortiumsListView setConsortium={setConsortiums} user={user} add={true} updated={updated}/>
                            </div>
                        }
                        </Col>
                        <Col sm={7}>{
                            consortium ?
                                <div>
                                    <ConsortiumDetails setUpdated={setUpdated} updated={updated}/>
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

export default authenticationHandler(ConsortiumsGeneralView)
