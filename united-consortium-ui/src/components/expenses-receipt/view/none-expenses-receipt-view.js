import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';

const NoneExpensesReceipt = () => {

    const { consortium } = useContext(ConsortiumContext);

    return(
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card >
            <Card.Img variant="top" src="" />
            <div >
                <Card.Body>
                    <Card.Title>
                        Sin expensas
                    </Card.Title>
                    <Card.Text>
                        {`${consortium.name} todavia no tiene un resumen de expensas. Aguarde a que la administración cargue las correspondientes a este mes.`}
                        {`Si tiene dudas ponganse en contacto con la administracion ${consortium.administrators[0]}`}
                    </Card.Text>
                </Card.Body>
            </div>
        </Card>
    </div>
    )
}

export default NoneExpensesReceipt;