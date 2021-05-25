import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';

const ConsortiumCardView = (props) => {

    const selectedConsortium = props.consortium;
    const { setConsortium } = useContext(ConsortiumContext);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                <Card.Img variant="top" src="" />
                <div onClick={() => setConsortium(selectedConsortium)}>
                    <Card.Body>
                        <Card.Title>
                            {selectedConsortium.name}
                        </Card.Title>
                        <Card.Text>
                            {selectedConsortium.address}
                        </Card.Text>
                    </Card.Body>
                </div>
            </Card>
        </div>
    )
}

const AddConsortiumCardView = (props) => {

    const { setConsortium } = useContext(ConsortiumContext);
    const service = new ConsortiumService();

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