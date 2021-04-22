import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsortiumService from '../../services/consortium/consortium-service'
import Card from 'react-bootstrap/Card';
import { BiBuilding } from 'react-icons/bi'


export class ConsortiumsView extends React.Component {
    constructor(props) {
        super(props);
        this.service = new ConsortiumService();
        this.state = {
            consortiums: []
        }
    }

    async componentWillMount() {
        const consortiums = await this.service.getConsortiums();
        this.setState({ consortiums: consortiums });
    }

    render() {
        return (
            <div className='consortiums'>
                <div className='text-center'>
                    Consorcios disponibles
                </div>
                <hr />
                {this.state.consortiums.map(consortium => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                                <Card.Img variant="top" src="" />
                                <div onClick={() => { debugger; this.props.setConsortium(consortium) }}>
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
}