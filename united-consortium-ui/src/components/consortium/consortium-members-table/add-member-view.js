import React, { useState } from 'react';
import { Button, Form, Col, Row } from '../../common/mui-components';

const emptyMember = () => ({ member_name: '', user_email: '' })

const AddMemberView = (props) => {

    const [member, setMember] = useState(emptyMember());

    const handleChange = (newValue) => {
        const updatedMember = {
            ...member,
            ...newValue
        }
        setMember(updatedMember)
    }

    const addMember = () => {
        props.setMember(member)
        setMember(emptyMember())
    }

    return (
        <div style={{marginBottom: '2%'}}>
            <Form>
                <Row>
                    <Col sm={5}>
                        <input
                            data-testid='member_name_input'
                            type="text"
                            placeholder="Identificador de la unidad"
                            value={member?.member_name}
                            onChange={event => handleChange({ 'member_name': event.target.value })}
                        />
                    </Col>
                    <Col sm={5}>
                        <input
                            data-testid='user_email_input'
                            type="text"
                            placeholder="Correo de contacto"
                            value={member?.user_email}
                            onChange={event => handleChange({ 'user_email': event.target.value })}
                        />
                    </Col>
                    <Col sm>
                        <Button data-testid='button' className='add-button' onClick={addMember}>+</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default AddMemberView