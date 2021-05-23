import React, { useState, useContext, useEffect } from 'react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import ConsortiumMembersTable from '../consortium-members-table/consortium-members-table';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

const service = new ConsortiumService();

const ConsortiumDetails = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [ updatedMembers, setUpdatedMembers ] = useState()
    const [valid, setValid] = useState(false)

    const handleChange = (values) => {
        const updatedItem = {
            ...consortium,
            ...values
        }
        setConsortium(updatedItem)
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

    const handleSubmit = (event) => {
        consortium.setMembers(updatedMembers);
        service.update(consortium);
        setConsortium(consortium);
        setValid(false)
    }



    const name = () => consortium? consortium.name : ''

    const address = () => consortium? consortium.address : ''

    return (
        //<Form noValidate validated={valid} onSubmit={handleSubmit}>
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
            <ConsortiumMembersTable setMembers={setUpdatedMembers}/>
            <hr />
            <Button className="add-button" onClick={handleSubmit}>
                Guardar
            </Button>
        </div>
    )
}

export default ConsortiumDetails