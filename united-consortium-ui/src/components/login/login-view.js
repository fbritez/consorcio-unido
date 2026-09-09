import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import { UserContext } from '../user-provider/user-provider';
import { Card, Form, Button, Alert } from '../common/mui-components';
import logo from '../../images/medium-icon.png';
import loginService from '../../services/login-service/login-service';
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
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, background: 'linear-gradient(135deg, #1B2945 0%, #2C4068 55%, #5278C5 100%)' }}>
                <Card sx={{ width: '100%', maxWidth: 430, textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                    <Box component="img" src={logo} alt="Consorcio Unido" sx={{ width: 112, height: 82, objectFit: 'contain', mx: 'auto', mt: 1 }} />
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
                                        <Button data-testid='siguiente' sx={{ mb: 1 }} onClick={() => validateEmail(email)}>
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
                                        <Button sx={{ mb: 1 }} onClick={setCredentials}>
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
                                        <Button data-testid='login' sx={{ mb: 1 }} onClick={() => processAuthentication()}>
                                            Login
                                        </Button>
                                        <Button variant="secondary" sx={{ mb: 1 }} onClick={() => clean()}>
                                            Otro mail
                                        </Button>
                                    </div>
                                }
                            </Card.Text>
                        </Card.Body>
                </Card>
        </Box>
    );
}

export default Login