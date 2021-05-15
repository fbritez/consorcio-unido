import React from 'react';
import './login.scss'
import Card from 'react-bootstrap/Card';
import logo from '../../images/medium-icon.png';

const PageNotFoundView = (props) =>{
    return(<div className='login-background'>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card className='my-card' style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
            <Card.Img variant="top" src={logo} className='imagen-login'/>
            <div>
                <Card.Body>
                    <Card.Title>
                        
                </Card.Title>
                    <Card.Text>
                       Lo sentimos pero esta funcionalidad no esta disponible
                    </Card.Text>
                </Card.Body>
            </div>
        </Card>
    </div>
</div>
); 
}



export default PageNotFoundView

