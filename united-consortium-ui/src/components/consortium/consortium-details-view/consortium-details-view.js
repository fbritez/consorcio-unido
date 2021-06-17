import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import consortiumService from '../../../services/consortium-service/consortium-service';
import ConsortiumMembersTable from '../consortium-members-table/consortium-members-table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert';
import { UserContext } from '../../user-provider/user-provider';
import './consortium-details.scss';
import SettingService from '../../../services/setting-service/setting-service';

const service = consortiumService;
const settingService = new SettingService();

const BasicConsortiumDetails = props => {

    const { consortium } = useContext(ConsortiumContext);

    const name = () => consortium ? consortium.name : ''

    const address = () => consortium ? consortium.address : ''

    return (
        <div style={{fontSize: 'smaller'}}>
            <label htmlFor="formGroupExampleInput" style={{ marginTop: '1%' }}>Nombre / Identificardor del consorcio</label>
            <input
                data-testid='consortium-name'
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                value={name()}
                onChange={event => props.handleChange({ 'name': event.target.value })}
            />

            <label htmlFor="formGroupExampleInput" style={{ marginTop: '1%' }}>Dirección</label>
            <input
                data-testid='consortium-address'
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
            <ConsortiumMembersTable setMembers={props.setUpdatedMembers} shouldRefresh={props.shouldRefresh} />
            <hr />
        </div>
    )
}

const AdvancedConsortiumDetails = props => {
    const { consortium, setConsortium } = useContext(ConsortiumContext);

    const disableConsortium = () => {
        consortium.setAsDisabled();
        service.update(consortium).then(() => {
            props.setUpdated(!props.updated);
            setConsortium(undefined);
        }, () => {
            props.setAction({ action: 'danger', description: 'Los datos no se han guardado correctamente' })
        })
    }

    const memberValue = () => props.settings?.memberValues ? props.settings.memberValues : ' ';

    return (
        <div>
            <label htmlFor="formGroupExampleInput" style={{ marginTop: '1%', fontSize: 'small' }}>
                Set cantidad de miembros por tabla
            </label>
            <input
                type="number"
                className="form-control"
                id="formGroupExampleInput"
                value={memberValue()}
                onChange={event => props.handleSettingChange({ 'memberValues': event.target.value })}
            />

            {
                consortium.id && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <hr />
                    <Card className='delete-consortium-card'
                        style={{ width: '60rem', marginTop: '10px', textAlign: 'center' }}>
                        <div>
                            <Card.Body>
                                <Card.Text>
                                    <p><strong>{`Eliminar ${consortium.name}`}</strong></p>
                                    <p>Tenga que cuenta que una vez eliminado no podra revertir esta acción.</p>
                                    <div style={{ marginTop: '1%', marginBotton: '2%' }}>
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
            }
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
    const [consortiumSettings, setConsortiumSettings] = useState();
    const [shouldRefresh, setShouldRefresh] = useState();

    useEffect(async () => {
        setActionDescription(undefined);
        const result = await settingService.getConsortiumSettings(consortium);
        setConsortiumSettings(result);
    }, [consortium]);

    const handleChange = (values) => {
        const updatedItem = {
            ...consortium,
            ...values
        }
        setConsortium(service.createModel(updatedItem))
    }

    const handleSettingChange = (values) => {
        const updatedItem = {
            ...consortiumSettings,
            ...values
        }
        setConsortiumSettings(updatedItem)
    }

    const handleSubmit = async () => {
        consortium.addAdministrator(user.email);
        consortium.setMembers(updatedMembers);
        await service.update(consortium).then(
            () => {
                setConsortium(consortium);
                setValid(false)
                props.setUpdated(!props.updated)
                setActionDescription({ action: 'success', description: 'Los datos an sido guardados con exito' })
            },
            () => { setActionDescription({ action: 'danger', description: 'Los datos no se han guardado correctamente' }) });
        await settingService.update(consortiumSettings).then(
            () => {
                setValid(false)
                setShouldRefresh(!shouldRefresh)
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
                        <BasicConsortiumDetails
                            handleChange={handleChange}
                            setUpdatedMembers={setUpdatedMembers}
                            shouldRefresh={shouldRefresh} />
                    </Tab>
                    <Tab eventKey="advanced" title="Avanzados">
                        <AdvancedConsortiumDetails
                            settings={consortiumSettings}
                            setUpdated={props.setUpdated}
                            updated={props.updated}
                            setAction={setActionDescription}
                            handleSettingChange={handleSettingChange} />
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