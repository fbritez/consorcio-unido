import React, { useContext } from 'react'
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
var consortium = new Consortium('', '', undefined, [], [])
const expectedConsortium = new Consortium(name, address, undefined, [mockEmail], [])

describe('add member view', () => {
    
    describe('shoudl handle changes', () => {
        consortiumService.createModel.mockImplementationOnce(data => new Consortium(data?.name, data?.address, data?.id, data?.members, data?.administrators));
        settingService.getConsortiumSettings.mockReturnValue([]);

        it('inputs changes', async () => {
            const { setConsortium } = useContext(ConsortiumContext)
            setConsortium(consortium)
            
            const { getByTestId } = render(
                <ConsortiumContext.Provider>
                    <UserContext.Provider value={{
                        user: {email : mockEmail},
                        setUser: () => { }}}>
                        < ConsortiumDetails />
                    </UserContext.Provider>
                </ConsortiumContext.Provider >
            )
            const name_input = getByTestId('consortium-name')
            const address_input = getByTestId('consortium-address')

            userEvent.type(name_input, name);
            userEvent.type(address_input, address);
            const button = getByTestId('save-button')
           
            await fireEvent.click(button)
            
            expect(name_input).toBeInTheDocument()
            expect(consortiumService.update).toHaveBeenCalledWith(expectedConsortium)
        })
    })
})