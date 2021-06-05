import React, { useState, useContext } from 'react';
import NotificationService from '../../services/notification-service/notification-service';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificationListView from './notification-list';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import './notification-view.scss';

const service = new NotificationService();

const NotificationView = props => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [ message, setMessage ] = useState('');
    const [ shouldRefresh, setShouldRefresh ] = useState();

    const save = () => {
        service.save(consortium, message)
        setMessage('')
        setShouldRefresh(!shouldRefresh)
    }
    
    return (
        <div>
            <h3>Novedades</h3>
            <hr />
            <div style={{marginBottom: '3%'}}>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                            as="textarea"
                            rows={3}
                            onChange={event => setMessage(event.target.value)} 
                            value={message}/>
                    </Form.Group>
                    <Button
                        className='publish-button'
                        onClick={() => save()}>
                        Publicar
                    </Button>
                </Form>
            </div>
            <NotificationListView shouldRefresh={shouldRefresh}/>
        </div>
    )
}

export default NotificationView