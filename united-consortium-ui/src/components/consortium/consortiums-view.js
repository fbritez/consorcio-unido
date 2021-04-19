import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ConsortiumService  from '../../services/consortium/consortium-service'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Redirect } from 'react-router-dom'


export class ConsortiumsView extends React.Component {
    constructor(props) {
        super(props);
        this.service = new ConsortiumService();
        this.state = {
           consortiums : []
        }
    }

    async componentWillMount(){
        const consortiums = await this.service.getConsortiums();
        this.setState({consortiums : consortiums });
    }

    render() {
        return(
            <div className='consortiums'>
                Consorcios disponibles
                <br/>
                {this.state.consortiums.map(consortium => {
                    return(
                        <div onClick={() => this.props.setConsortium(this.props.parent, consortium)}>
                        <div >
                        <Card style={{ width: '18rem', marginTop: '10px', textAlign: 'center' }}>
                            <Card.Img variant="top" src="" />
                            <Card.Body>
                                <Card.Title>{consortium.name}</Card.Title>
                                <Card.Text>
                                    {consortium.address}
                                </Card.Text>  
                            </Card.Body>
                        </Card> 
                        </div>
                        </div>
                    )})}
                
            </div>
        )
    }
}