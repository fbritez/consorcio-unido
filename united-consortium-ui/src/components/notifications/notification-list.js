import React, { useState, useContext, useEffect } from 'react';
import NotificationService from '../../services/notification-service/notification-service';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificatioDetailsView from './notification-details-view';

const service = new NotificationService();

const NotificationListView = props => {

    const { consortium } = useContext(ConsortiumContext);
    const [ notifications, setNotifications ] = useState([])

    useEffect(async () => {
        debugger
        const result = await service.notificationFor(consortium);
        setNotifications(result);
    }, [consortium, props.shouldRefresh]);

    return(
        <div>
        {   notifications?.map(notification => {
                        return (<NotificatioDetailsView notification={notification}/>)
                    })
        }
        </div>
    )
}

export default NotificationListView