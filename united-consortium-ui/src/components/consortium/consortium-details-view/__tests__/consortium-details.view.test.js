import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import ConsortiumDetails from '../consortium-details-view';
import { ConsortiumContext } from '../../consortium-provider/consortium-provider';
import { UserContext } from '../../../user-provider/user-provider';
import consortiumService from '../../../../services/consortium-service/consortium-service';
import Consortium from '../../../../model/consortium';
import memberTable from '../../consortium-members-table/consortium-members-table'
import settingService from '../../../../services/setting-service/setting-service'

const mockSetConsortium = jest.fn();

jest.mock('../../../../services/consortium-service/consortium-service', () => ({
    update: jest.fn(),
    createModel: jest.fn()
}))

jest.mock('../../consortium-members-table/consortium-members-table', () => ('table'))

jest.mock('../../../../services/setting-service/setting-service', () => ({
    getConsortiumSettings: jest.fn()
}))

const name = 'name'
const address = 'address'
const mockEmail = 'fake@fake.com'
const consortium = new Consortium(name, address, undefined, [], [])

describe('add member view', () => {
    
    describe('shoudl handle changes', () => {
        consortiumService.createModel.mockReturnValue();
        settingService.getConsortiumSettings.mockReturnValue([]);

        it('inputs changes', async () => {
            const { getByTestId } = render(
                <ConsortiumContext.Provider value={{ consortium: consortium, setConsortium: mockSetConsortium}}>
                    <UserContext.Provider value={{
                        user: {email : mockEmail},
                        setUser: () => { }}}>
                        < ConsortiumDetails />
                    </UserContext.Provider>
                </ConsortiumContext.Provider >
            )
            const name_input = getByTestId('consortium-name')
            const address_input = getByTestId('consortium-address')

            userEvent.type(name_input, "united");
            userEvent.type(address_input, "address");
            const button = getByTestId('save-button')
           
            await fireEvent.click(button)
            
            consortium.addAdministrator(mockEmail)

            expect(name_input).toBeInTheDocument()
            expect(consortiumService.update).toHaveBeenCalledWith(consortium)
        })
    })
})