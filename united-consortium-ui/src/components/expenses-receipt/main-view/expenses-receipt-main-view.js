
import React from 'react';
import { ConsortiumsView } from '../../consortium/consortiums-view';
import { ExpensesReceiptView } from '../view/expenses-receipt-view';
import { AppliactionNavView } from '../../application-nav/application-nav-view';
import './expenses-receipt-main-view.scss';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

export class ExpensesReceiptMainView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consortium: null
        }
    }
    setConsortium(selectedConsortium) {
        debugger
        this.setState({ consortium: selectedConsortium })
    }

    render() {
        debugger
        return (
            <div className='expenses-receipt'>
                <AppliactionNavView />
                <Container>
                    <div>
                        <Row style={ {marginTop: '1%'}}>
                            <Col sm={3}>{
                                <div>
                                    <ConsortiumsView setConsortium={(consortium) => this.setConsortium(consortium)} />
                                </div>
                            }
                            </Col>
                            <Col sm={9}>{
                                    
                                    this.state.consortium ?   
                                    <div>
                                        <ExpensesReceiptView consortium={this.state.consortium} />
                                    </div>
                                    :
                                    <div className='text-center'>
                                        <lable > Por favor seleccione un consorcio</lable>
                                    </div>
                                   
                            }
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div >
        )
    }

}