import React, { useState, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { BasicAddItemButton, DownloadButton, FileUploaderButton } from '../common/buttons';
import FileSelectedItem from '../utils/file-selected-ite';
import { downloadTicket } from '../utils/download-files';
import claimService from '../../services/claims-service/claims-service';
import imageService from '../../services/image-service/image-service';
import { ClaimContext } from './claim-provider';
import { FaBuilding, FaUserAlt } from "react-icons/fa";
import { Button, Row } from 'react-bootstrap';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import ErrorHandler from '../common/handlers/error-handler';
import StateBadge from './state-badge-view';


const ClaimDetailsView = () => {

    const { claim, setClaim } = useContext(ClaimContext);
    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [selectedFile, setSelectedFile] = useState();
    const [wrongTransaction, setWrongTransaction] = useState(false);
    const [message, setMessage] = useState(undefined);

    const save = () => {
        const owner = detectUser()
        claim.state = !isClose() ? consortium.isAdministrator(user) ? 'Pending Owner' : 'Pending Admin' : claim.state
        const newMessage = { message: message, filename: selectedFile?.name, owner: owner }

        claim.messages = claim.messages.reverse()
        claim.messages.push(newMessage)
        claim.messages = claim.messages.reverse()
        claimService.save(claim).then(
            () => {
                imageService.save(selectedFile).then(
                    () => {
                        setMessage('')
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

    const close = async () => {
        claim.state = 'Close';
        setClaim(claim);
        const newMessage = { message: 'RECLAMO CERRADO', filename: selectedFile?.name, owner: detectUser() }
        claim.messages = claim.messages.reverse()
        claim.messages.push(newMessage)
        claim.messages = claim.messages.reverse()
        claimService.save(claim).then(
            () => {
                setMessage('')
                setSelectedFile(undefined)
                setClaim({})
                setClaim(claim)
            },
            () => {
                setWrongTransaction(true);
            },
        )
    }

    const isClose = () => claim?.state == 'Close'

    const detectUser = () => consortium.isAdministrator(user) ? user.email : consortium.getMember(user).member_name

    const detectAdminIcon = owner => consortium.isAdministrator({ email: owner }) ? <FaBuilding /> : <FaUserAlt />

    const detectOwnerDescription = owner => consortium.isAdministrator({ email: owner }) ? 'Administración' : claim.owner

    return (
        <div className='claim' style={{ marginBottom: '1%' }}>
            <ErrorHandler errors={errorDescriptions} />
            <Card>
                <Card.Body style={{ marginLeft: '5%', marginRight: '5%' }}>
                    <Card.Subtitle style={{ fontSize: 'xx-small' }} className="mb-2 text-muted">
                        {claim?.identifier}
                        {
                            !isClose() && 
                            <div className='right'>
                                <Button
                                    variant="light"
                                    style={{ fontSize: 'xx-small' }}
                                    onClick={close}>
                                    Cancelar
                                </Button>
                            </div>
                        }
                    </Card.Subtitle>
                    <Card.Subtitle style={{ marginTop: '1%', fontSize: 'small' }} className="mb-2 text-muted">
                        {'Unidad Funcional: '}
                        <strong>{claim.owner}</strong>
                    </Card.Subtitle>
                    <div>
                        <div className='left'>{claim?.title}</div>
                        <div className='right'><StateBadge state={claim?.state} /></div>
                    </div>
                    <Card.Text style={{ marginTop: '7%', fontSize: 'small' }}>
                        <React.Fragment>
                            <textarea
                                data-testid='message'
                                style={{ fontSize: 'smaller' }}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                value={message}
                                placeholder={''}
                                disabled={isClose()}
                                onChange={event => setMessage(event.target.value)}
                            />
                            <div style={{ marginTop: '1%' }}>
                                <BasicAddItemButton
                                    style={{ fontSize: 'x-small' }}
                                    description={'Agregar'}
                                    disabled={!message}
                                    onClick={() => save()}
                                />
                                <FileUploaderButton style={{ fontSize: 'x-small' }} disabled={isClose()} handleFile={onFileChange} />
                                <FileSelectedItem selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                            </div>
                        </React.Fragment>
                    </Card.Text>
                    <Card.Text style={{ fontSize: 'small' }}>
                        <strong>Actividad</strong>
                        <hr />
                        {
                            claim?.messages?.map(message => {
                                return (
                                    <div>
                                        <Row>
                                            <div className='left'>
                                                {detectAdminIcon(message.owner)}
                                                {'  '}
                                                {detectOwnerDescription(message.owner)}
                                            </div>
                                            <div className='right'>{message.date}</div>
                                        </Row>
                                        <text style={{ whiteSpace: 'pre-line' }}>{message.message}</text>
                                        <div className='right'>
                                            {message.filename && <DownloadButton onClick={() => downloadTicket(message.filename)} />}
                                        </div>
                                        <hr />
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