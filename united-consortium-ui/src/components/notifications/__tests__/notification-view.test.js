import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import consortiumService from '../../../services/consortium-service/consortium-service'
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import NotificationView from '../notification-view';
import notificationService from '../../../services/notification-service/notification-service';

jest.mock('../../../services/notification-service/notification-service', () =>({
    notificationFor: jest.fn()
}));

const newMessage = 'my message';
const strDate = '13-10-20'

jest.mock('../../../services/consortium-service/consortium-service', () => ({
    isAdministrator: jest.fn()
}))


describe('notification  view', () => {

    it('should display new notification for administrators', async () => {
        consortiumService.isAdministrator.mockReturnValueOnce(true);
        
        const { getByTestId } = await render(
            <ConsortiumContext.Provider value={{ consortium: 'consortium', setConsortium: jest.fn() }}>
                <UserContext.Provider value={{
                    user: 'user',
                    setUser: () => { }
                }}>
                    < NotificationView/>
                </UserContext.Provider>
            </ConsortiumContext.Provider >
        )
        const news_input = getByTestId('news');

        expect(news_input).toBeInTheDocument()

        userEvent.type(news_input, newMessage);

        const button = getByTestId('button');

        button.click()

        const screenMessage = getByText(newMessage);

        expect(screenMessage).toBeInTheDocument()

    })
})