import React from 'react';
import Card from 'react-bootstrap/Card';

const NotificatioDetailsView = props => {

    const notification = props.notification;
    debugger
    return (
        <Card.Body>
            <Card.Text>
                <div>
                    <div style={{ fontSize: 'small' }}>
                        {notification.publishDate}
                    </div>
                    {notification.message}
                </div>
            </Card.Text>
        </Card.Body>
    )
}

export default NotificatioDetailsView