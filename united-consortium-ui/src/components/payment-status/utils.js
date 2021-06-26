import React from 'react';
import { Badge } from 'react-bootstrap';

const poronga = (memberReceipt) =>{
    debugger
    return memberReceipt?.difference() === memberReceipt?.getTotalAmount() 
}

const getStatus = memberReceipt => {
    return (
        <div style={{ float: 'right' }}>
            {memberReceipt?.difference() === 0 ?
                <Badge variant="success">Pago</Badge> :
                poronga(memberReceipt) ?
                <Badge variant="danger">Impago</Badge> :
                <Badge variant="warning">P. Parcial</Badge>
                }
        </div>)
}


export {
    getStatus
}