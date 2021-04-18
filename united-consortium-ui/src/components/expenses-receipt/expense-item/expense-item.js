
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
        this.state = {
            currentItem: currentItem,
            showAddExpense: false
        }
    }

    handleAddExpense(value) {
        this.setState({ showAddExpense: value })
    }

    addExpenseItem() {

    }


    handleChange(newValue){
        const updatedItem = {
            ...this.state.currentItem,
            ...newValue
        }
        debugger
        this.setState(updatedItem)
    }

    render() {

        return (
            <div>
                <div>
                    <p>{' '}</p>
                </div>
                <div>
                    <Button onClick={() => this.handleAddExpense(true)}> Agregar gasto </Button>

                    <Modal show={this.state.showAddExpense} onHide={this.handleCloseAddExpense}>
                        <Modal.Header closeButton onClick={() => this.handleAddExpense(false)}>
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
                                    <FormControl id="basic-url" aria-describedby="basic-addon3" />
                                </InputGroup>
                                <label htmlFor="costo">Monto/Costo</label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>$</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <NumericInput className="form-control" aria-label="Monto" onChange={value => { debugger; this.handleChange({'amount': value})}}/>
                                </InputGroup>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Descripcion</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl as="textarea" aria-label="description" />
                                </InputGroup>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleAddExpense(false)}>
                                Cancelar
                                                </Button>
                            <Button variant="primary" onClick={() => this.addExpenseItem()}>
                                Agregar
                                                </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            </div>
        )
    }

}


export default ExpensesItemView
