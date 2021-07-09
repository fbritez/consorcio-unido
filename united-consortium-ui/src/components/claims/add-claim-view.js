import React, { useState, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { BasicAddItemButton, FileUploaderButton } from '../common/buttons';
import claimService from '../../services/claims-service/claims-service';
import imageService from '../../services/image-service/image-service';
import FileSelectedItem from '../utils/file-selected-ite';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import ErrorHandler from '../common/handlers/error-handler';
import { UserContext } from '../user-provider/user-provider';
import { ClaimContext } from './claim-provider';


const AddClaimView = () => {

    const { consortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const { setClaim } = useContext(ClaimContext);
    const [selectedFile, setSelectedFile] = useState();
    const [message, setMessage] = useState({ title: '', desciption: '' });
    const [wrongTransaction, setWrongTransaction] = useState(false);

    const handleChange = (newValue) => {
        const updatedMessage = {
            ...message,
            ...newValue
        }
        setMessage(updatedMessage)
    }

    const save = () => {
        const claim = {
            consortium_id: consortium.id,
            owner: consortium.getMember(user).member_name,
            title: message.title,
            messages: [{ owner: consortium.getMember(user).member_name, message: message.message, filename: selectedFile?.name }]
        };
        claimService.save(claim).then(
            () => {
                imageService.save(selectedFile).then(
                    () => {
                        setMessage({title: '', message: ''})
                        setSelectedFile(undefined)
                        setClaim(claim)
                    },
                    () => {
                        setWrongTransaction(true);
                    },
                )
            }, () => { setWrongTransaction(true); })
    }

    const onFileChange = fileUploaded => {
        handleChange({ filename: fileUploaded.name })
        setSelectedFile(fileUploaded)
    }

    const errorDescriptions = [{
        value: wrongTransaction,
        description: 'La operacion no pudo ser completada. Por favor vuelva a intentarlo'
    }]

    return (
        <div>
            <h7>Nuevo Reclamo</h7>
            <hr />
            <ErrorHandler errors={errorDescriptions} />
            <Card>
                <Card.Body>
                    <Card.Text>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control
                                    data_testid='title'
                                    as="input"
                                    placeholder="Titulo"
                                    onChange={event => handleChange({ 'title': event.target.value })}
                                    value={message.title} />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control
                                    data_testid='description'
                                    as="textarea"
                                    rows={3}
                                    placeholder="Describa su problema"
                                    onChange={event => handleChange({ 'message': event.target.value })}
                                    value={message.message} />
                            </Form.Group>
                            <BasicAddItemButton
                                style={{ fontSize: 'x-small' }}
                                description={'Crear'}
                                onClick={() => save()} />
                            <FileUploaderButton style={{ fontSize: 'x-small' }} handleFile={onFileChange} />
                            <FileSelectedItem selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div >
    )
}

export default AddClaimView