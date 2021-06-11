import React, { useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { UserContext } from '../user-provider/user-provider';
import authenticationHandler from '../login/authentication-handler';
import ConsortiumsListView from '../consortium/consortiums-list-view/consortiums-list-view';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificationView from './notification-view';

const NotificationGeneralView = () => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [ updated, setUpdated ] = useState(false);
    const { user } = useContext(UserContext);

    const setConsortiums = c =>{
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
                                    <NotificationView setUpdated={setUpdated}/>
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


export default authenticationHandler(NotificationGeneralView)
