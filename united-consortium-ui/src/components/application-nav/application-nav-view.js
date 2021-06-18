import React, { useState, useContext, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './application-nav-view.scss'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'
import logo from '../../images/medium-icon.png';
import { BsPeopleCircle } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';

const service = consortiumService;

const AppliactionNavView = () => {

    const history = useHistory();
    const { user, setUser } = useContext(UserContext);
    const [isAdministrator, setIsAdministrator] = useState();

    const push = (path) => {
        history.push(path)
    }

    useEffect(async () => {
        if (user) {
            const result = await service.isAdministrator(user);
            setIsAdministrator(result);
        }
    });

    const logout = () => {
        setUser(undefined)
        push('login')
    }

    return (
        <div>{
            user &&
            <Navbar>
                <Navbar.Collapse id="basic-navbar-nav" style={{ marginLeft: '7%', marginRight: '7%' }}>
                    <Nav className="mr-auto">
                        <img src={logo} alt="drawing" width="50" className="icon" onClick={() => push('notifications')} />
                        <div className="vl" />
                        <Nav.Link data-testid='expenses' onClick={() => push('expenses')}> {'Expensas'}</Nav.Link>
                        {isAdministrator ? 
                            <Nav.Link data-testid='consortiums' onClick={() => push('consortiums')}>{'Consorcios'}</Nav.Link> : ''}
                    </Nav>
                    <Navbar.Text className='right'>{user.email}</Navbar.Text>
                    <Navbar.Brand href="#home" className='right'>
                        <NavDropdown title={<BsPeopleCircle className='user-icon' />}>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => logout()}>Sign out</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Brand>
                </Navbar.Collapse>
            </Navbar>
        }
        </div>
    )


}

export default AppliactionNavView