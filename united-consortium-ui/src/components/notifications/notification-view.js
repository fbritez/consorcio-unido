import React, { useState, useContext, useEffect } from 'react';
import notificationService from '../../services/notification-service/notification-service';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificationListView from './notification-list';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import './notification-view.scss';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import { FileUploaderButton } from '../common/buttons';
import ImageService from '../../services/image-service/image-service';
import ErrorHandler from '../common/handlers/error-handler';

const fileService = new ImageService();

const NotificationView = () => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [message, setMessage] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState();
    const [isAdministrator, setIsAdministrator] = useState();
    const { user } = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState()
    const [wrongTransaction, setWrongTransaction] = useState(false);

    useEffect(async () => {
        const result = await consortiumService.isAdministrator(user);
        setIsAdministrator(result);
    }, [consortium]);

    const save = () => {
        notificationService.save(consortium, message, selectedFile?.name).then(
            () => {
                fileService.save(selectedFile).then(
                    () => {
                        setMessage('')
                        setSelectedFile(undefined)
                        setShouldRefresh(!shouldRefresh)
                    },
                    () => {
                        setWrongTransaction(true);
                    },
                )
            }, () => { setWrongTransaction(true); })
    }

    const onFileChange = fileUploaded => {
        const name = generateName(fileUploaded.name)
        const file = { filename: fileUploaded, name: name }
        setSelectedFile(file)
    }

    const generateName = (filename) => {
        return `${new Date().getTime()}/${filename}`
    }

    const errorDescriptions = [{
        value: wrongTransaction,
        description: 'La operacion no pudo ser completada. Por favor vuelva a intentarlo'
    }]

    return (
        <div>
            <h5>Novedades</h5>
            <hr />
            <ErrorHandler errors={errorDescriptions} />
            {
                isAdministrator &&
                <div style={{ marginBottom: '10%' }}>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Cuales son las novedades de hoy?"
                                onChange={event => setMessage(event.target.value)}
                                value={message} />
                        </Form.Group>
                        <Button
                            className='publish-button'
                            onClick={() => save()}
                            disabled={!message}>
                            Publicar
                        </Button>
                        <FileUploaderButton handleFile={onFileChange} className='publish-button' />
                        <div className='right' style={{ fontSize: 'xx-small', textAlign: 'center' }}>
                            {selectedFile?.name}
                        </div>
                    </Form>
                </div>
            }
            <NotificationListView shouldRefresh={shouldRefresh} />
        </div>
    )
}

export default NotificationView