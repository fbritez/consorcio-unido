import React from 'react'
import LoginService from '../../../services/login-service/login-service';
import { render, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LoginView from '../login-view';

const email = 'some@email.com';
const userMock = email;
const setUserMock = jest.fn();

const mockService = {
    validateEmail: jest.fn()
};

jest.mock( '../../../services/login-service/login-service', () => jest.fn())


test('loads and displays greeting', async () => {
    /*
    jest.spyOn(React, 'useContext')
        .mockImplementation(() => ({user: userMock, setUser: setUserMock}));

    const result = {validEmail: true, firstLogin: true};
    mockService.validateEmail.mockReturnValueOnce(result);
    LoginService.mockImplementation(() => (mockService));

    const component = render(<LoginView />);
    
    const input = component.getByLabelText('cost-input')
    
    fireEvent.change(input, { target: { value: email } })
    fireEvent.click(screen.getByText('Siguiente'));

    expect(screen.getByText('Ingrese su nuevo password')).toBeInTheDocument()
    //expect(screen.getByText(name)).toBeInTheDocument()
    //expect(screen.getByText(address).toBeInTheDocument()
    */
})