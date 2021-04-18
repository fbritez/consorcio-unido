import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './application-nav-view.scss'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav'

export class AppliactionNavView extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Navbar className='navbar'  expand="lg">
                <Navbar.Brand href="#home">
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#profile">Perfil</NavDropdown.Item>
                        <NavDropdown.Item href="#algo"></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#sign-out">Sign out</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#expenses"> {'Expensas'} </Nav.Link>
                        <Nav.Link href="#consorcios">{'Consorcios'}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}