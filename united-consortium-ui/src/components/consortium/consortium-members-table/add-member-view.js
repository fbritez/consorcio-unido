import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
                            type="text"
                            className="form-control"
                            placeholder="Identificador"
                            value={member?.member_name}
                            onChange={event => handleChange({ 'member_name': event.target.value })}
                        />
                    </Col>
                    <Col sm={5}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Correo de contacto"
                            value={member?.user_email}
                            onChange={event => handleChange({ 'user_email': event.target.value })}
                        />
                    </Col>
                    <Col sm>
                        <Button className='add-button' onClick={addMember}>+</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default AddMemberView