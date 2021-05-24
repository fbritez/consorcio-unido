import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import ConsortiumMembersTable from '../consortium-members-table/consortium-members-table';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { UserContext } from '../../user-provider/user-provider';

const service = new ConsortiumService();

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
        await service.update(consortium).then(
            () => {
                setConsortium(consortium);
                setValid(false)
                props.setUpdated(true)
                setActionDescription({action: 'success', description: 'Los datos an sido guardados con exito'})
            },
            () => { setActionDescription({action: 'danger', description: 'Los datos no se han guardado correctamente'}) });

    }

    const name = () => consortium ? consortium.name : ''

    const address = () => consortium ? consortium.address : ''

    return (
        //<Form noValidate validated={valid} onSubmit={handleSubmit}>
        <div>
            <div>
                {
                    actionDescription ? 
                        <Alert variant={actionDescription.action}>
                            {actionDescription.description}
                        </Alert>: ''
                }
            </div>
            <div>
                <label htmlFor="formGroupExampleInput">Nombre / Identificardor del consorcio</label>
                <input
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    value={name()}
                    onChange={event => handleChange({ 'name': event.target.value })}
                />

                <label htmlFor="formGroupExampleInput">Dirección</label>
                <input
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    value={address()}
                    onChange={event => handleChange({ 'address': event.target.value })}
                />
                <hr />
                <div style={{marginBottom: '2%'}}>
                    Miembros
                </div>
                <ConsortiumMembersTable setMembers={setUpdatedMembers} />
                <hr />
                <Button className="add-button" onClick={handleSubmit}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}

export default ConsortiumDetails