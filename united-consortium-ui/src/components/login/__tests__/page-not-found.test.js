import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PageNotFoundView from '../page-not-found';

const errorMessage = 'Lo sentimos pero esta funcionalidad no esta disponible';

describe('Page not found', () => {
    it('shoudl display message', async () => {

        const { getByText } = render(<PageNotFoundView />);

        expect(getByText(errorMessage)).toBeInTheDocument();

    })
})