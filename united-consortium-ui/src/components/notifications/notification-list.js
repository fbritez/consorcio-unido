import React, { useState, useContext, useEffect } from 'react';
import notificationService from '../../services/notification-service/notification-service';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import NotificatioDetailsView from './notification-details-view';

const NotificationListView = props => {

    const { consortium } = useContext(ConsortiumContext);
    const [ notifications, setNotifications ] = useState([])

    useEffect(async () => {
        setNotifications([]);
        const result = await notificationService.notificationFor(consortium);
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