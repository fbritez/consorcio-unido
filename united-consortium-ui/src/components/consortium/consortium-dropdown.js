import React, { useState, useContext, useEffect } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import { ConsortiumContext } from './consortium-provider/consortium-provider';
import './consortium-dropdown.scss';

const service = consortiumService;

const C_onsortiumDropdown = props => {

    const [consortiums, setConsortiums] = useState();
    const { consortium, setConsortium } = useContext(ConsortiumContext)
    const { user } = useContext(UserContext);

    useEffect(async () => {
        service.getConsortiums(user).then((c) => { setConsortiums(c) });
    }, [props.updated, user, consortium]);

    return (
        <Dropdown className='consortium-dropdown'>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {consortium?.name ? consortium.name : 'Consorcio'}
            </Dropdown.Toggle>

            <Dropdown.Menu className='consortium-menu'>
                {
                    consortiums?.map(consortium => {
                        return (
                            <Dropdown.Item onClick={() => setConsortium(consortium)}>
                                <div style={{ fontSize: 'small', fontWeight: 'bold' }}>{consortium.name}</div>
                                <div style={{ fontSize: 'small' }}>{consortium.address}</div>
                            </Dropdown.Item>)
                    })
                }
            </Dropdown.Menu>
        </Dropdown>)
}

const ConsortiumDropdown = props => {

    const [consortiums, setConsortiums] = useState();
    const { consortium, setConsortium } = useContext(ConsortiumContext)
    const { user } = useContext(UserContext);

    useEffect(async () => {
        service.getConsortiums(user).then((c) => { setConsortiums(c) });
    }, [props.updated, user, consortium]);

    return (
        <NavDropdown title={consortium?.name ? consortium.name : 'Consorcio'} className='consortium-dropdown'>
            {
                consortiums?.map(consortium => {
                    return (
                        <NavDropdown.Item onClick={() => setConsortium(consortium)}>
                            <div style={{ fontSize: 'small', fontWeight: 'bold' }}>{consortium.name}</div>
                            <div style={{ fontSize: 'small' }}>{consortium.address}</div>
                        </NavDropdown.Item>)
                })
            }
        </NavDropdown>
    )
}

export default ConsortiumDropdown