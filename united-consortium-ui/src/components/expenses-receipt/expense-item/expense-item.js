
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import NumericInput from 'react-numeric-input';

export class ExpensesItemView extends React.Component {

    constructor(props) {
        super(props);
        const currentItem = this.props.item ? this.props.item : { title: null, description: null, amount: null }
        const shouldDisable = this.props.actionDescription === 'Eliminar'
        console.log(this.props.actionDescription )
        debugger
        this.state = {
            currentItem: currentItem,
            shouldBeDisable: shouldDisable
        }
    }



    handleExpenseItem() {
        this.props.showExpensesCRUD(false)
        this.props.handleAction(this.state.currentItem);
    }


    handleChange(newValue) {
        const updatedItem = {
            ...this.state.currentItem,
            ...newValue
        }
        this.setState({ currentItem: updatedItem })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleCloseAddExpense}>
                <Modal.Header closeButton onClick={() => this.props.showExpensesCRUD(false)}>
                    <Modal.Title>Agregar nuevo gasto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <label htmlFor="basic-url">Agregue detalles del gasto</label>
                        </div>
                        <div>
                            <label htmlFor="basic-url">Titulo</label>
                        </div>
                        <InputGroup className="mb-3">
                            <FormControl    id="basic-title" 
                                            aria-describedby="basic-addon3" 
                                            required
                                            onChange={event => this.handleChange({ 'title': event.target.value })}
                                            defaultValue={this.props.item?.title} 
                                            disabled={this.state.shouldBeDisable}/>
                        </InputGroup>
                        <label htmlFor="costo">Monto/Costo</label>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <NumericInput   className="form-control" 
                                            aria-label="Monto" 
                                            required
                                            onChange={value => this.handleChange({ 'amount': value })}
                                            defaultValue={this.props.item?.amount}
                                            disabled={this.state.shouldBeDisable}
                                             />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Descripcion</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl    as="textarea" 
                                            aria-label="description" 
                                            onChange={event => this.handleChange({ 'description': event.target.value })} 
                                            defaultValue={this.props.item?.description}
                                            disabled={this.state.shouldBeDisable}/>
                        </InputGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.showExpensesCRUD(false)}>
                        Cancelar
                            </Button>
                    <Button variant="primary" onClick={() => this.handleExpenseItem()}>
                        {this.props.actionDescription}
                            </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}


export default ExpensesItemView
