
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
    setConsortium(view, selectedConsortium) {
        view.setState({ consortium: selectedConsortium })
    }

    render() {
        return (
            <div className='expenses-receipt'>
                <AppliactionNavView />
                <Container>
                    <div>
                        <Row>
                            <Col sm={3}>{
                                <div>
                                    <ConsortiumsView parent={this} setConsortium={this.setConsortium} />
                                </div>
                            }
                            </Col>
                            <Col sm={9}>{
                                <div>
                                    <ExpensesReceiptView consortium={this.state.consortium} />
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