import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import ImageService from '../../services/image-service/image-service';
import { DownloadButton } from '../common/buttons';
import './notification-view.scss';

const service = new ImageService();

const downloadTicket = file_id => {
    service.downloadImage(file_id)
}

const NotificatioDetailsView = props => {

    const defaultValue = 150;
    const notification = props.notification;
    const [ text, setText ] = useState(notification.message.length);
    const [useSmallText, setUseSmallText ] = useState(true);

    const shoudlUseSmallText = () => notification.message.length > defaultValue;

    const detectCharacterCounter = () => (useSmallText && shoudlUseSmallText()) ? defaultValue : notification.message.length;

    useEffect(async () => {
        const characterCount = detectCharacterCounter()
        const newString = notification.message.substring(0,characterCount);
        setText(newString)
    }, [useSmallText]);

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
                        <div style={{whiteSpace: 'pre-line'}}>
                            <hr />
                            <text>{text}</text>
                            {
                               shoudlUseSmallText() ?
                                <Button data-testid='button' className='expand' onClick={() => setUseSmallText(!useSmallText)}>
                                    ...
                                </Button>
                                :
                                <div/>
                            }
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