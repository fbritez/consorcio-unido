import React, { useState, useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { BasicAddItemButton, DownloadButton, FileUploaderButton } from '../common/buttons';
import FileSelectedItem from '../utils/file-selected-ite';
import { downloadTicket } from '../utils/download-files';
import claimService from '../../services/claims-service/claims-service';
import imageService from '../../services/image-service/image-service';
import { ClaimContext } from './claim-provider';
import { FaBuilding, FaUserAlt } from "react-icons/fa";
import { Row } from 'react-bootstrap';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import ErrorHandler from '../common/handlers/error-handler';


const ClaimDetailsView = () => {

    const { claim, setClaim } = useContext(ClaimContext);
    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [selectedFile, setSelectedFile] = useState();
    const [wrongTransaction, setWrongTransaction] = useState(false);
    const [message, setMessage] = useState('');

    const save = () => {
        const newMessage = { message: message, filename: selectedFile?.name, owner: detectUser() }
        claim.messages.push(newMessage)
        claimService.save(claim).then(
            () => {
                imageService.save(selectedFile).then(
                    () => {
                        setMessage()
                        setSelectedFile(undefined)
                        setClaim(claim)
                    },
                    () => {
                        setWrongTransaction(true);
                    },
                )
            }, () => { setWrongTransaction(true); })
    }

    const errorDescriptions = [{
        value: wrongTransaction,
        description: 'La operacion no pudo ser completada. Por favor vuelva a intentarlo'
    }]

    const onFileChange = fileUploaded => {
        setSelectedFile(fileUploaded)
    }

    const detectUser = () => consortium.isAdministrator(user) ? user.email : consortium.getMember(user).member_name

    const detectAdminIcon = owner => consortium.isAdministrator({ email: owner }) ? <FaBuilding /> : <FaUserAlt />

    const detectOwner = owner => consortium.isAdministrator({ email: owner }) ? 'Administracion' : claim.owner

    return (
        <div style={{ marginBottom: '1%' }}>
            <ErrorHandler errors={errorDescriptions} />
            <Card>
                <Card.Body style={{ marginLeft: '5%', marginRight: '5%'  }}>
                    <Card.Subtitle style={{ fontSize: 'xx-small' }} className="mb-2 text-muted">
                        {claim?.identifier}
                    </Card.Subtitle>
                    {claim?.title}
                    <Card.Text style={{ fontSize: 'small' }}>
                        <React.Fragment>
                            <textarea
                                data-testid='message'
                                style={{ fontSize: 'smaller' }}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                value={message}
                                placeholder={''}
                                onChange={event => setMessage(event.target.value)}
                            />
                            <BasicAddItemButton
                                style={{ fontSize: 'xx-small' }}
                                description={'Agregar'}
                                onClick={() => save()}
                            />
                            <FileUploaderButton handleFile={onFileChange} />
                            <FileSelectedItem selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        </React.Fragment>
                    </Card.Text>
                    <Card.Text style={{ fontSize: 'small' }}>
                        <div>Actividad</div>
                        <hr />
                        {
                            claim?.messages.map(message => {
                                return (
                                    <div>
                                        <Row>
                                            {detectAdminIcon(message.owner)}
                                            {detectOwner(message.owner)}
                                        </Row>
                                        <text style={{ whiteSpace: 'pre-line' }}>{message.message}</text>
                                        <div className='right'>
                                            {message.filename && <DownloadButton onClick={() => downloadTicket(message.filename)} />}
                                        </div>
                                        <hr/>
                                    </div>
                                )
                            })
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        </div >
    )
}

export default ClaimDetailsView