import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsortiumService from '../../services/consortium-service/consortium-service';
import Card from 'react-bootstrap/Card';


const service = new ConsortiumService();

const ConsortiumsView = (props) => {

    const [consortiums, setConsortiums] = useState();

    useEffect(async () => {
        const consortiums = await service.getConsortiums();
        setConsortiums(consortiums)
    }, []);

    return (
        <div className='consortiums'>
            <div className='text-center'>
                Consorcios disponibles
                </div>
            <hr />
            {consortiums?.map(consortium => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                            <Card.Img variant="top" src="" />
                            <div onClick={() => { props.setConsortium(consortium) }}>
                                <Card.Body>
                                    <Card.Title>
                                        {consortium.name}
                                    </Card.Title>
                                    <Card.Text>
                                        {consortium.address}
                                    </Card.Text>
                                </Card.Body>
                            </div>
                        </Card>
                    </div>
                )
            })}

        </div>
    )

}

export default ConsortiumsView