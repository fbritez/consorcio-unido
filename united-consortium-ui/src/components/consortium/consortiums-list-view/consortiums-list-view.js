import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumCardView } from './consortium-card-view';
import { AddConsortiumCardView } from './consortium-card-view';

const service = new ConsortiumService();

const ConsortiumsListView = (props) => {

    const [consortiums, setConsortiums] = useState();

    useEffect(async () => {
        const consortiums = await service.getConsortiums(props.user);
        setConsortiums(consortiums)
    }, [props.updated]);

    return (
        <div className='consortiums'>
            <div className='text-center'>
                Consorcios disponibles
                </div>
            <hr />
            {consortiums?.map(consortium => {
                return <ConsortiumCardView consortium={consortium} setConsortium={props.setConsortium} />
            })}
            {props.add && <AddConsortiumCardView/>}
        </div>
    )
}

export default ConsortiumsListView