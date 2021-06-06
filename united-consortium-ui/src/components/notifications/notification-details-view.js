import React from 'react';
import Card from 'react-bootstrap/Card';
import ImageService from '../../services/image-service/image-service';
import { DownloadButton } from '../common/buttons';
import './notification-view.scss';

const service = new ImageService();

const downloadTicket = file_id => {
    service.downloadImage(file_id)
}

const NotificatioDetailsView = props => {

    const notification = props.notification;

    const formatDate = () => {
        const strDate = notification.publishDate.replace('GMT', '')
        return strDate.substring(4)
    }

    return (
        <div style={{ marginTop: '1%' }}>
            <Card>
                <Card.Body>
                    <Card.Subtitle style={{ fontSize: 'small' }} className="mb-2 text-muted">
                        {formatDate()}
                    </Card.Subtitle>
                    <Card.Text>
                        <div>
                            <hr />
                            {notification.message}
                        </div>
                        <div className='right'>
                            { notification.filename && <DownloadButton onClick={() => downloadTicket(notification.filename)}/>}
                         </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default NotificatioDetailsView