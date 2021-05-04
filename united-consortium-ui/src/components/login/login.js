import React, { useState, useEffect } from 'react';
import './login.scss'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from '../../images/medium-icon.png';
import LoginService from '../../services/login/login-service';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';

const service = new LoginService()

function Login() {

    const [email, setEmail] = useState();
    const [disableEmail, setDisableEmail] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);

    const validateEmail = async (email) => {
        let response = await service.validateEmail(email);

        setValidEmail(response.validEmail);
        setFirstLogin(response.firstLogin);
        setLoaded(true);
        setDisableEmail(response.validEmail);
    }

    const setCredentials = () => {
        if (password === confirmPassword) {
            service.setCredentials(email, password);
        } else {
            setInvalidPassword(true);
        }

    }

    const authenticate = async () => {
        const result = await service.authenticate(email, password);
        setInvalidPassword(!result);
        window.location.href = '/expenses'
    }

    const clean = () =>{
        setValidEmail(false);
        setFirstLogin(false);
        setLoaded(false);
        setDisableEmail(false);
    }

    useEffect(() => {
        console.log('hereeee')
    }, [validEmail, firstLogin]);

    return (
        <div className='login-background'>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card className='my-card' style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                    <Card.Img variant="top" src={logo} width='50'/>
                    <div>
                        <Card.Body>
                            <Card.Title>
                                Bienvendio, por favor ingresa tu direccion de correo
                        </Card.Title>
                            <Card.Text>
                                <Form.Group controlId="">
                                    <Form.Control type="text" placeholder="email" onChange={event => setEmail(event.target.value)} disabled={disableEmail}/>
                                </Form.Group>
                                {
                                    !validEmail && loaded &&
                                    <div>
                                        <Alert variant='danger'>
                                            El correo indicano no pertenece a ningun consorcio ni administracion, por favor pongase en contacto con su administracion o contacte a Support.
                                    </Alert>
                                    </div>
                                }
                                {!validEmail &&
                                    <div>
                                        <Button className='update-button' onClick={() => validateEmail(email)}>
                                            Siguiente
                                        </Button>
                                    </div>
                                }
                                {validEmail && firstLogin &&
                                    <div>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Ingrese su nuevo password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" onChange={event => { setPassword(event.target.value) }} />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Confirme su nuevo password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" onChange={event => { setConfirmPassword(event.target.value) }} />
                                        </Form.Group>
                                        {
                                            invalidPassword &&
                                            <div>
                                                <Alert variant='warning'>
                                                    Las contraseñas no coinciden.
                                                </Alert>
                                            </div>
                                        }
                                        <Button className='update-button' onClick={setCredentials}>
                                            Confirmar
                                        </Button>
                                    </div>
                                }
                                {validEmail && !firstLogin &&
                                    <div>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" onChange={event => { setPassword(event.target.value) }} />
                                        </Form.Group>
                                        {
                                            invalidPassword &&
                                            <div>
                                                <Alert variant='danger'>
                                                    Password incorrecto
                                                </Alert>
                                            </div>
                                        }
                                        <Button className='update-button' onClick={() => authenticate()}>
                                            Login
                                        </Button>
                                        <Button variant="secondary" className='cancel-button' onClick={() => clean()}>
                                            Otro mail
                                        </Button>
                                    </div>
                                }
                            </Card.Text>
                        </Card.Body>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Login