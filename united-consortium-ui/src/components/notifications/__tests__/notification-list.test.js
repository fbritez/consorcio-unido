import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../../user-provider/user-provider';
import NotificationListView from '../notification-list';
import NotificatioDetailsView from '../notification-details-view';
import notificationService from '../../../services/notification-service/notification-service';

jest.mock('../../../services/notification-service/notification-service', () =>({
    notificationFor: jest.fn()
}));

jest.mock('../notification-details-view');

const mockConsortium = {id: 1};

describe('notification list view', () => {
    
    notificationService.notificationFor.mockReturnValue([{id: 5}, {id: 9}])

    it('should call Notification details view information', async () => {
        
        render(
            <ConsortiumContext.Provider value={{ consortium: mockConsortium , setConsortium: jest.fn() }}>
                <UserContext.Provider value={{
                    user: 'user',
                    setUser: () => { }
                }}>
                    < NotificationListView/>
                </UserContext.Provider>
            </ConsortiumContext.Provider >
        )

        expect(notificationService.notificationFor).toBeCalledWith(mockConsortium);
    })
})