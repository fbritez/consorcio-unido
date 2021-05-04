import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './application-nav-view.scss'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'
import logo from '../../images/medium-icon.png';
import { BsPeopleCircle } from 'react-icons/bs';

const AppliactionNavView = (props) => {
    return (
        <Navbar className='navbar'>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <img src={logo} alt="drawing" width="50" classNAme="icon" />
                    <div className="vl" />
                    <Nav.Link href="#expenses"> {'Expensas'} </Nav.Link>
                    <Nav.Link href="#consorcios">{'Consorcios'}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Brand href="#home" className='right'>
                <NavDropdown title={<BsPeopleCircle className='user-icon' />}>
                    <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>
                    <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#sign-out">Sign out</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Brand>
        </Navbar>
    )


}

export default AppliactionNavView