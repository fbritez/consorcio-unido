import React from 'react';
import './login.scss'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardMedia';

import logo from '../../images/medium-icon.png';

const PageNotFoundView = (props) => {
    return (<div className='login-background'>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card className='my-card' style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                <CardActionArea>
                    <CardMedia
                        className='imagen-login'
                        image='src/images/medium-icon.png'
                        title="Logo"
                    />
                    <CardContent>
                        Lo sentimos pero esta funcionalidad no esta disponible
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    </div>
    );
}



export default PageNotFoundView

