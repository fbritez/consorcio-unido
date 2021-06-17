import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import { ConsortiumCardView } from '../consortium-card-view';
import { ConsortiumContext } from '../../consortium-provider/consortium-provider';


const address = 'A';
const id = 1;
const name = "united";
const consortium = { "address": address, "administrators": [], "disabled": false, "id": id, "members": [], "name": name };
const mockSetConsortium = jest.fn()

describe('Consortium Card', () => {

    it('should display conosrtium data', async () => {
        const { getByText } = render(
            <ConsortiumContext.Provider value={{ consortium: 'consortium', setConsortium: mockSetConsortium }}>
                <ConsortiumCardView consortium={consortium} />
            </ConsortiumContext.Provider>);

        const name_description = getByText(name);
        const address_description = getByText(address);

        expect(name_description).toBeInTheDocument();
        expect(address_description).toBeInTheDocument();
    })
})
