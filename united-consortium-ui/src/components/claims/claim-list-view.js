import React, { useEffect, useState, useContext } from 'react';
import { Badge } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import claimService from '../../services/claims-service/claims-service';
import { ClaimContext } from './claim-provider';

const ClaimListView = () => {

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
            setClaims(data)
        }
    }, [consortium, claim]);

    const getStatusDescription = item => item.isOpen() ? <Badge variant="success">Abierta</Badge> : <div />

    return (
        <div className='scrollbar-dinamically'>
            <div style={{ marginTop: '3%', fontSize: 'small' }}>
                <ListGroup>
                    {claims?.map(claim => {
                        return (
                            <ListGroup.Item
                                action
                                onClick={() => setClaim(claim)}
                                as='div'>
                                <div>
                                    {claim.identifier}
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