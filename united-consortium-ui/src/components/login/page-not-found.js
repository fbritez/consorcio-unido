import React from 'react';
import { Box } from '@mui/material';
import { Card } from '../common/mui-components';
import logo from '../../images/medium-icon.png';

const PageNotFoundView = (props) =>{
    return(<Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, background: 'linear-gradient(135deg, #1B2945 0%, #2C4068 55%, #5278C5 100%)' }}>
        <Card sx={{ width: '100%', maxWidth: 430, textAlign: 'center', p: 2 }}>
            <Box component="img" src={logo} alt="Consorcio Unido" sx={{ width: 112, height: 82, objectFit: 'contain', mx: 'auto' }}/>
                <Card.Body>
                    <Card.Title>
                        
                </Card.Title>
                    <Card.Text>
                       Lo sentimos pero esta funcionalidad no esta disponible
                    </Card.Text>
                </Card.Body>
        </Card>
    </Box>
); 
}



export default PageNotFoundView

