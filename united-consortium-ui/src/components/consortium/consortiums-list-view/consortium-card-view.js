import React, { useContext, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import consortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';

const ConsortiumCardView = (props) => {

    const currentConsortium = props.consortium;
    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [ selected, setSelected ] = useState(false);

    useEffect(() => {
        if (currentConsortium != consortium){
            setSelected(false)
        }
    }, [consortium]);

    const detectBorderColor = () => selected || currentConsortium?.id == consortium?.id ? 'dark' : '';
    const detectSelected = () => selected || currentConsortium?.id == consortium?.id ? {backgroundColor: '#E3DFDE'} : {}

    const setSelectedItem = (consortium) => {
        setSelected(true)
        setConsortium(consortium)
    }
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card border={detectBorderColor()} style={{ width: '18rem', marginTop: '10px', textAlign: 'center'}}>
                <Card.Img variant="top" src="" />
                <div onClick={() => setSelectedItem(currentConsortium)}>
                    <Card.Body style={detectSelected()}>
                        <Card.Title>
                            <div data-testid='name'>{currentConsortium.name}</div>
                        </Card.Title>
                        <Card.Text>
                            <div data-testid='address'>{currentConsortium.address}</div>
                        </Card.Text>
                    </Card.Body>
                </div>
            </Card>
        </div>
    )
}

const AddConsortiumCardView = (props) => {

    const { setConsortium } = useContext(ConsortiumContext);
    const service = consortiumService;

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                <Card.Img variant="top" src="" />
                <div onClick={() => setConsortium(service.createEmptyConsortium())}>
                    <Card.Body>
                        <Card.Text>
                            Nuevo Consorcio
                        </Card.Text>
                    </Card.Body>
                </div>
            </Card>
        </div>
    )

}

export { 
    ConsortiumCardView, 
    AddConsortiumCardView
} ;