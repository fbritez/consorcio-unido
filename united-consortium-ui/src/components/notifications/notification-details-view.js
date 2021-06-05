import React from 'react';
import Card from 'react-bootstrap/Card';
import './notification-view.scss';

const NotificatioDetailsView = props => {

    const notification = props.notification;

    const formatDate = () => {
        const strDate = notification.publishDate.replace('GMT', '')
        return strDate.substring(4)
    }

    return (
        <div style={{ marginTop: '1%'}}>
            <Card>
                <Card.Body>
                    <Card.Subtitle style={{fontSize: 'small'}} className="mb-2 text-muted">
                        {formatDate()}
                    </Card.Subtitle>
                    <Card.Text>
                        <div>
                            <hr/>
                            {notification.message}
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default NotificatioDetailsView