import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import consortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumCardView } from './consortium-card-view';
import { AddConsortiumCardView } from './consortium-card-view';

const service = consortiumService;

const ConsortiumsListView = (props) => {

    const [consortiums, setConsortiums] = useState();

    useEffect(async () => {
        service.getConsortiums(props.user).then((c) => { setConsortiums(c) });
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
            {props.add && <AddConsortiumCardView />}
        </div>
    )
}

export default ConsortiumsListView