import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { BasicAddItemButton } from '../../common/buttons';

const MemberDetailsView = props => {

    const [updatedMember, setUpdatedMembers] = useState();

    useEffect(async () => {
        setUpdatedMembers(props.member)
    }, [props.member]);

    const handleChange = (values) => {
        const newMember = {
            ...updatedMember,
            ...values
        }
        setUpdatedMembers(newMember)
    }

    const raiseMemberUpdated = () => {
        props.handleMemberChange(updatedMember)
        setUpdatedMembers(undefined)
    }

    return (
        <div>
            {
                updatedMember &&
                <Modal show={updatedMember} onHide={() => {}}>
                    <Modal.Header closeButton onClick={() => setUpdatedMembers(undefined)}>
                        <Modal.Title data-testid='title'>{`${updatedMember.member_name} - ${updatedMember.user_email}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div style={{marginBottom: '3%'}}>
                            <text style={{ fontSize: 'smaller' }}> Este email tambien tendra acceso al sistema.</text>
                            <input
                                data-testid='secondary_email'
                                style={{ fontSize: 'smaller' }}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                value={updatedMember.secondary_email}
                                placeholder={'Mail Secundario'}
                                onChange={event => handleChange({ 'secondary_email': event.target.value })}
                            />
                            </div>
                            <textarea
                                data-testid='notes'
                                style={{ fontSize: 'smaller' }}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                value={updatedMember.notes}
                                placeholder={'Notas'}
                                onChange={event => handleChange({ 'notes': event.target.value })}
                            />
                            <hr/>
                            <BasicAddItemButton 
                                style={{ fontSize: 'xx-small' }}
                                description={'Guardar'}
                                onClick={raiseMemberUpdated}
                            />
                        </div>
                    </Modal.Body>
                </Modal>

            }
        </div>
    )
}



export default MemberDetailsView