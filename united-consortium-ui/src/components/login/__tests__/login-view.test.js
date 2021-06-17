import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import Login from '../login-view';
import loginService from '../../../services/login-service/login-service';
import { UserContextProvider } from '../../user-provider/user-provider';

jest.mock('../../../services/login-service/login-service', () => ({
    authenticate: jest.fn(),
    getUser: jest.fn(),
    validateEmail: jest.fn(),
}));

const email = "test@email.com";

describe('login', () => {
    it('login successful', async () => {
        loginService.validateEmail.mockImplementationOnce((e) => ({validEmail: email, firstLogin: false}))

        const { getByTestId } = render(
            <UserContextProvider>
                <Login />
            </UserContextProvider>);

        const emailInput = getByTestId('email');
        const sigButton = getByTestId('siguiente');

        expect(emailInput).toBeInTheDocument();
        expect(sigButton).toBeInTheDocument()

        userEvent.type(emailInput, email);
        await sigButton.click();

        expect(loginService.validateEmail).toBeCalledWith(email)

    })
})