import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import ConsortiumDetails from '../consortium-details-view';
import { ConsortiumContext } from '../../consortium-provider/consortium-provider';
import { UserContext } from '../../../user-provider/user-provider';

const mockSetConsortium = jest.fn();

const expectedConsortium = {"address": undefined, "administrators": undefined, "disabled": false, "id": undefined, "members": undefined, "name": "united"};

describe('add member view', () => {
    describe('shoudl handle changes', () => {
        it('inputs changes', async () => {
            const { getByTestId } = render(
                <ConsortiumContext.Provider value={{ consortium: 'consortium', setConsortium: mockSetConsortium}}>
                    <UserContext.Provider value={{
                        user: 'user',
                        setUser: () => { }}}>
                        < ConsortiumDetails />
                    </UserContext.Provider>
                </ConsortiumContext.Provider >
            )
            const name_input = getByTestId('consortium-name')
            const address_input = getByTestId('consortium-address')

            userEvent.type(name_input, "united");
            userEvent.type(address_input, "address");

            expect(name_input).toBeInTheDocument()
            expect(mockSetConsortium).toHaveBeenCalledWith(expectedConsortium)
        })
    })
})