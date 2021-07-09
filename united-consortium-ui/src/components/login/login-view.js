import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../user-provider/user-provider';
import './login.scss'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from '../../images/medium-icon.png';
import loginService from '../../services/login-service/login-service';
import Alert from 'react-bootstrap/Alert';
import userService from '../../services/user-service/user-service';
import { PathContext } from '../main/path-provider';
import { notifications } from '../main/routes';

const service = loginService;

function Login() {

    const [email, setEmail] = useState();
    const [disableEmail, setDisableEmail] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const { setUser } = useContext(UserContext);
    const { setPath } = useContext(PathContext);

    const validateEmail = async (email) => {
        let response = await service.validateEmail(email);
        setValidEmail(response.validEmail);
        setFirstLogin(response.firstLogin);
        setLoaded(true);
        setDisableEmail(response.validEmail);
    }

    const setCredentials = () => {
        if (password === confirmPassword) {
            service.setCredentials(email, password).then(() => {redirectToMain(email)});
        } else {
            setInvalidPassword(true);
        }
    }

    const redirectToMain = async (email) => {
        const loggedUser = await userService.getUser(email);
        setUser(loggedUser);
        setPath(notifications());
    }

    const authenticate = async () => {
        const result = await service.authenticate(email, password);
        setInvalidPassword(!result);
        return result
    }

    const processAuthentication = async () => {
        const isAuthenticated = await authenticate();
        isAuthenticated && redirectToMain(email);
    }

    const clean = () => {
        setValidEmail(false);
        setFirstLogin(false);
        setLoaded(false);
        setDisableEmail(false);
    }

    useEffect(() => {
    }, [validEmail, firstLogin]);

    return (
        <div className='login-background'>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card className='my-card' style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                    <Card.Img variant="top" src={logo} className='imagen-login' />
                    <div>
                        <Card.Body>
                            <Card.Title>
                                Bienvenido, por favor ingresa tu direccion de correo
                        </Card.Title>
                            <Card.Text>
                                <Form.Group controlId="">
                                    <Form.Control data-testid='email' type="text" placeholder="email" onChange={event => setEmail(event.target.value)} disabled={disableEmail} />
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
                                        <Button data-testid='siguiente' className='update-button' style={{ marginBottom: '3%' }} onClick={() => validateEmail(email)}>
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
                                                    Las contraseñas ingresadas no coinciden.
                                                </Alert>
                                            </div>
                                        }
                                        <Button className='update-button' style={{ marginBottom: '3%' }} onClick={setCredentials}>
                                            Confirmar
                                        </Button>
                                    </div>
                                }
                                {validEmail && !firstLogin &&
                                    <div>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control data-testid='password' type="password" placeholder="Password" onChange={event => { setPassword(event.target.value) }} />
                                        </Form.Group>
                                        {
                                            invalidPassword &&
                                            <div>
                                                <Alert variant='danger'>
                                                    Password incorrecto
                                                </Alert>
                                            </div>
                                        }
                                        <Button  data-testid='login' className='update-button' style={{ marginBottom: '3%' }} onClick={() => processAuthentication()}>
                                            Login
                                        </Button>
                                        <Button variant="secondary" className='cancel-button' style={{ marginBottom: '3%' }} onClick={() => clean()}>
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