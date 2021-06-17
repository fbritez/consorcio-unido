import React from 'react'
import consortiumService from '../../../../services/consortium-service/consortium-service';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ConsortiumsListView from '../consortiums-list-view';
import Consortium from '../../../../model/consortium';
import { UserContext } from '../../../user-provider/user-provider';

const name = 'name';
const address = 'address';
const consortiums = [new Consortium(name, address, 'id')]

jest.mock('../../../../services/consortium-service/consortium-service', () => ({
    getConsortiums: jest.fn()
}))

describe('Consortium List View', () => {
    it('should get title', async () => {
        consortiumService.getConsortiums.mockReturnValueOnce(consortiums);
        render(
            <UserContext.Provider>
                <ConsortiumsListView />
            </UserContext.Provider>);

        expect(screen.getByText('Consorcios disponibles')).toBeInTheDocument();
    })
})