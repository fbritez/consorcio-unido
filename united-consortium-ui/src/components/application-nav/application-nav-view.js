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
import ConsortiumDropdown from '../consortium/consortium-dropdown';

const service = consortiumService;

const AppliactionNavView = () => {

    const history = useHistory();
    const [selected, setSelected ] = useState();
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

    const handleClick = route => {
        setSelected(route);
        push(route);
    }

    const detectClassName = description => selected === description ? 'selected' : ''

    return (
        <div>{
            user &&
            <div>
                <div className="basic-navbar-nav">
                    <Navbar >
                        <Navbar.Collapse style={{ marginLeft: '7%', marginRight: '7%' }}>
                            <Nav className="mr-auto">
                                <img src={logo} alt="drawing" width="50" className="icon" onClick={() => push('notifications')} />
                                <div className="vl" />
                                <ConsortiumDropdown/>
                                <div className="vl" />
                                {isAdministrator ?
                                    <Nav.Link className={detectClassName('consortiums')} data-testid='consortiums' onClick={() => handleClick('consortiums')}>{'Administrar'}</Nav.Link> : ''}
                            </Nav>
                            <Navbar.Text className='right'>{user.email}</Navbar.Text>
                            <Navbar.Brand href="#home">
                                <NavDropdown className='user-icon' title={<BsPeopleCircle className='user-icon' />}>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => logout()}>Sign out</NavDropdown.Item>
                                </NavDropdown>
                            </Navbar.Brand>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className="secondary-navbar-nav">
                    <Navbar className="secondary-navbar-nav" >
                        <Navbar.Collapse style={{ marginLeft: '7%', marginRight: '7%' }}>
                            <Nav className="mr-auto">
                                <div className="vl" />
                                <Nav.Link className={detectClassName('notifications')} data-testid='notification' onClick={() => handleClick('notifications')}> {'Novedades'}</Nav.Link>
                                <Nav.Link className={detectClassName('expenses')} data-testid='expenses' onClick={() => handleClick('expenses')}> {'Expensas'}</Nav.Link>
                                <Nav.Link className={detectClassName('claims')} data-testid='expenses' onClick={() => handleClick('claims')}> {'Reclamos'}</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        }
        </div>
    )


}

export default AppliactionNavView