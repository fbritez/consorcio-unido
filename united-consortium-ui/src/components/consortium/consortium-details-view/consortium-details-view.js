import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import ConsortiumMembersTable from '../consortium-members-table/consortium-members-table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert';
import { UserContext } from '../../user-provider/user-provider';
import './consortium-details.scss';

const service = new ConsortiumService();

const BasicConsortiumDetails = props => {

    const { consortium } = useContext(ConsortiumContext);

    const name = () => consortium ? consortium.name : ''

    const address = () => consortium ? consortium.address : ''

    return (
        <div>
            <label htmlFor="formGroupExampleInput" style={{ marginTop: '1%' }}>Nombre / Identificardor del consorcio</label>
            <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                value={name()}
                onChange={event => props.handleChange({ 'name': event.target.value })}
            />

            <label htmlFor="formGroupExampleInput" style={{ marginTop: '1%' }}>Dirección</label>
            <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                value={address()}
                onChange={event => props.handleChange({ 'address': event.target.value })}
            />
            <hr />
            <div style={{ marginBottom: '2%' }}>
                Unidades Funcionales
            </div>
            <ConsortiumMembersTable setMembers={props.setUpdatedMembers} />
            <hr />
        </div>
    )
}

const AdvancedConsortiumDetails = props => {
    const { consortium, setConsortium } = useContext(ConsortiumContext);

    const disableConsortium = () => {
        consortium.setAsDisabled();
        service.update(consortium);
        props.setUpdated(true);
        setConsortium(undefined);
    }

    return (
        <div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card className='delete-consortium-card' 
                        style={{ width: '60rem', marginTop: '10px', textAlign: 'center' }}>
                    <div>
                        <Card.Body>
                            <Card.Text>
                                <p><strong>{`Eliminar ${consortium.name}`}</strong></p>
                                <p>Tenga que cuenta que una vez eliminado no podra revertir esta acción.</p>
                                <div style={{marginTop: '1%', marginBotton: '2%'}}>
                                    <Button
                                        className='remove-button'
                                        onClick={() => disableConsortium()}>
                                            Eliminar
                                    </Button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </div>
                </Card>
            </div>
            <hr />
        </div>
    )
}

const ConsortiumDetails = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const [updatedMembers, setUpdatedMembers] = useState()
    const [valid, setValid] = useState(false)
    const [actionDescription, setActionDescription] = useState();

    useEffect(() => {
        setActionDescription(undefined);
    }, [consortium]);

    const handleChange = (values) => {
        const updatedItem = {
            ...consortium,
            ...values
        }
        setConsortium(service.createModel(updatedItem))
    }

    const _handleSubmit = (event) => {
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            setValid(true)
            event.preventDefault();
            event.stopPropagation();
        } else {
            service.update(consortium);
            setConsortium(consortium);
            setValid(false)
        }
    }

    const handleSubmit = async (event) => {
        consortium.addAdministrator(user.email);
        consortium.setMembers(updatedMembers);
        await service.update(consortium).then(
            () => {
                setConsortium(consortium);
                setValid(false)
                props.setUpdated(true)
                setActionDescription({ action: 'success', description: 'Los datos an sido guardados con exito' })
            },
            () => { setActionDescription({ action: 'danger', description: 'Los datos no se han guardado correctamente' }) });

    }

    return (
        <div>
            <div>
                {
                    actionDescription ?
                        <Alert variant={actionDescription.action}>
                            {actionDescription.description}
                        </Alert> : ''
                }
            </div>
            <div>
                <Tabs defaultActiveKey="basics">
                    <Tab eventKey="basics" title="Basicos">
                        <BasicConsortiumDetails handleChange={handleChange} setUpdatedMembers={setUpdatedMembers} />
                    </Tab>
                    <Tab eventKey="advanced" title="Avanzados">
                        <AdvancedConsortiumDetails setUpdated={props.setUpdated} />
                    </Tab>
                </Tabs>
                <Button className="add-button" onClick={handleSubmit}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}

export default ConsortiumDetails