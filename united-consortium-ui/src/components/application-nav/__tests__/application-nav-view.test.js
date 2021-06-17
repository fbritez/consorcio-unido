import React from 'react';
import { render } from '@testing-library/react';
import consortiumService from '../../../services/consortium-service/consortium-service';
import '@testing-library/jest-dom/extend-expect'
import AppliactionNavView from '../application-nav-view';
import { UserContext } from '../../user-provider/user-provider';

jest.mock('../../../services/consortium-service/consortium-service', () => ({
    isAdministrator: jest.fn()
}))

test('application nav var', async () => {

    consortiumService.isAdministrator.mockReturnValue(true);

    const { getByTestId } = render(
        <UserContext.Provider value={{ 
            user: 'user',
            setUser: () => {}
        }}>
            <AppliactionNavView />
        </UserContext.Provider>);

    expect(getByTestId('expenses')).toBeInTheDocument();
})