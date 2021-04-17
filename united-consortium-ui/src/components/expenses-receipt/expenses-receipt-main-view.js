
import React, { useState } from 'react';
import { ConsortiumsView } from '../consortium/consortiums-view'
import { ExpensesReceiptView }from './expenses-receipt-view'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

export class ExpensesReceiptMainView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            consortium : null
        }
    }
    setConsortium(view, selectedConsortium){
        debugger
        view.setState({consortium : selectedConsortium})
    }
    render() {
        return(
            <Container>
                <div className='expenses-receipt'>
                    <Row>
                        <Col xs={6}>{
                            <div>
                                <ConsortiumsView parent={this} setConsortium={this.setConsortium}/>
                            </div>
                            }
                        </Col>
                        <Col xs={5}>{
                            <div>
                                <ExpensesReceiptView consortium={this.state.consortium}/>
                            </div>
                        }
                        </Col>
                    </Row>
                </div>
            </Container>
        )
    }

}