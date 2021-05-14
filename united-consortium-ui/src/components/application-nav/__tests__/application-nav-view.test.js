import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AppliactionNavView from '../application-nav-view';


test('loads and displays greeting', async () => {

    render(<AppliactionNavView />);

    expect(screen.getByText('Expensas')).toBeInTheDocument();
    expect(screen.getByText('Consorcios')).toBeInTheDocument();
})