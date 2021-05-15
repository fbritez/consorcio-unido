import React from 'react'
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ConsortiumsView from '../consortiums-view';
import Consortium from '../../../model/consortium';

const name = 'name';
const address = 'address';
const consortiums = [new Consortium(name, address, 'id')]

const mockService = {
    getConsortiums: jest.fn().mockReturnValueOnce(consortiums)
};

jest.mock( '../../../services/consortium-service/consortium-service', () => jest.fn())

test('loads and displays greeting', async () => {
    ConsortiumService.mockImplementation(() => (mockService));
    render(<ConsortiumsView />);

    expect(screen.getByText('Consorcios disponibles')).toBeInTheDocument()
})