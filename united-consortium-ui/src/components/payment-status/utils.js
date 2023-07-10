import React from 'react';
import { Badge } from 'react-bootstrap';

const getStatus = memberReceipt => {
    debugger
    return (
        <div style={{ float: 'right' }}>
            {memberReceipt?.difference() === 0 ?
                <Badge variant="success">Pago</Badge> :
                    memberReceipt?.difference() === memberReceipt?.getTotalAmount() ?
                        <Badge variant="danger">Impago</Badge> :
                        <Badge variant="warning">P. Parcial</Badge>
                }
        </div>)
}


export {
    getStatus
}