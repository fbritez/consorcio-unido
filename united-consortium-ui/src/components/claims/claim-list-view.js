import React, { useEffect, useState, useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import claimService from '../../services/claims-service/claims-service';
import { ClaimContext } from './claim-provider';
import StateBadge from './state-badge-view';

const ClaimListView = props => {

    const { user } = useContext(UserContext);
    const { consortium } = useContext(ConsortiumContext);
    const [claims, setClaims] = useState([]);
    const { claim, setClaim } = useContext(ClaimContext);

    useEffect(async () => {
        if (consortium) {
            var data;
            const isAdmin = consortium.isAdministrator(user);
            if (isAdmin) {
                data = await claimService.getClaims(consortium);
            } else {
                const member = consortium.getMember(user)
                data = await claimService.claimsFor(consortium, member.member_name);
            }
            if(props.filterFuction) {
                data = data.filter(props.filterFuction)
            }
            data = data.reverse()
            setClaims(data)
        }
    }, [consortium, claim]);

    const handleClaim = claim => {
        setClaim(claim); 
        if(props.sideEffect){
            props.sideEffect()
        }
        
    }

    return (
        <div className='scrollbar-dinamically'>
            <div style={{ marginTop: '3%', fontSize: 'small' }}>
                <ListGroup>
                    {claims?.map(claim => {
                        return (
                            <ListGroup.Item
                                action
                                onClick={() => handleClaim(claim)}
                                as='div'>
                                <div>
                                    {claim.identifier}
                                    {' - '}
                                    <StateBadge state={claim?.state}/>
                                </div>

                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
        </div>
    )
}

export default ClaimListView