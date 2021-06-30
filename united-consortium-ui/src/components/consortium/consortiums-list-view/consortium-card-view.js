import React, { useContext, useState, useEffect } from 'react';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
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

                <div onClick={() => setSelectedItem(currentConsortium)}>
                    <CardContent style={detectSelected()}>

                            <div data-testid='name'>{currentConsortium.name}</div>

                            <div data-testid='address'>{currentConsortium.address}</div>

                    </CardContent>
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
                
                <div onClick={() => setConsortium(service.createEmptyConsortium())}>
                    <CardContent>
                            Nuevo Consorcio
                    </CardContent>
                </div>
            </Card>
        </div>
    )

}

export { 
    ConsortiumCardView, 
    AddConsortiumCardView
} ;