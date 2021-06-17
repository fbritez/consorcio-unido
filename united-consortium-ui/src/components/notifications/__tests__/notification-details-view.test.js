import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import NotificatioDetailsView from '../notification-details-view';

const mockSetConsortium = jest.fn();

const message = 'my message';
const strDate = '13-10-20'

describe('notification detail view', () => {

    it('should display notification information', async () => {
        
        const notification = { message: message, publishDate: 'XXXX' + strDate };
        
        const { getByText } = render(
            <ConsortiumContext.Provider value={{ consortium: 'consortium', setConsortium: mockSetConsortium }}>
                <UserContext.Provider value={{
                    user: 'user',
                    setUser: () => { }
                }}>
                    < NotificatioDetailsView notification={notification} />
                </UserContext.Provider>
            </ConsortiumContext.Provider >
        )
        const date = getByText(strDate);
        const screenMessage = getByText(message);


        expect(date).toBeInTheDocument()
        expect(screenMessage).toBeInTheDocument()
        expect(screen.queryByText('button')).not.toBeInTheDocument()
    })


    it('should display button', async () => {
        
        const longMessage = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
        const notification = { message: longMessage, publishDate: 'XXXX' + strDate };
        
        const { getByText, getByTestId } = render(
            <ConsortiumContext.Provider value={{ consortium: 'consortium', setConsortium: mockSetConsortium }}>
                <UserContext.Provider value={{
                    user: 'user',
                    setUser: () => { }
                }}>
                    < NotificatioDetailsView notification={notification} />
                </UserContext.Provider>
            </ConsortiumContext.Provider >
        )

        const date = getByText(strDate);
        const button = getByTestId('button');


        expect(date).toBeInTheDocument()
        expect(button).toBeInTheDocument()
    })
})