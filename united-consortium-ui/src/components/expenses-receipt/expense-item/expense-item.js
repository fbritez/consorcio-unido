
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import NumericInput from 'react-numeric-input';
import './expense-item.scss';

export class ExpensesItemView extends React.Component {

    constructor(props) {
        super(props);
        const currentItem = this.props.item ? this.props.item : { title: '', description: '', amount: null }
        this.state = {
            currentItem: currentItem,
            description: this.props.actionDescription,
            shouldBeDisable: (this.props.actionDescription === "Eliminar"),
            valid: false
        }
    }

    handleExpenseItem() {
        this.props.showExpensesCRUD(false)
        this.props.handleAction(this.state.currentItem);
        this.setState({ description: null })
    }

    handleChange(newValue) {
        const updatedItem = {
            ...this.state.currentItem,
            ...newValue
        }
        this.setState({ currentItem: updatedItem })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({ valid: true });
    };

    detectActionClassName() {
        const action = this.state.description;
        let ret;
        switch (action) {
            case "Agregar":
                ret = 'add-button'
                break
            case "Modificar":
                ret = 'update-button'
                break
            case "Eliminar":
                ret = 'remove-button'
                break
            default:
                ret = 'update-button'
        }

        return ret
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
                        <Form onSubmit={this.handleSubmit}>
                            
                                <Form.Group controlId="validateTitle">
                                    <Form.Label>Titulo</Form.Label>
                                    <Form.Control
                                        id="basic-title"
                                        aria-describedby="basic-addon3"
                                        required
                                        onChange={event => this.handleChange({ 'title': event.target.value })}
                                        defaultValue={this.props.item?.title}
                                        disabled={this.state.shouldBeDisable} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor defina un titulo
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validateAmount">
                                    <Form.Label>Monto</Form.Label>
                                    <NumericInput className="form-control"
                                        aria-label="Monto"
                                        required
                                        onChange={value => this.handleChange({ 'amount': value })}
                                        defaultValue={this.props.item?.amount}
                                        disabled={this.state.shouldBeDisable}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor defina un monto
                                    </Form.Control.Feedback>
                                    
                                </Form.Group>
                                <Form.Group controlId="validateDescription">
                                    <Form.Label>{'Descripción'}</Form.Label>
                                    <FormControl as="textarea"
                                        aria-label="description"
                                        onChange={event => this.handleChange({ 'description': event.target.value })}
                                        defaultValue={this.props.item?.description}
                                        disabled={this.state.shouldBeDisable} />
                                </Form.Group>
                            <hr />
                            <Form.Row>
                                <Form.Group md="4" controlId="validateTicket">
                                    <Form.Label>titulo</Form.Label>
                                    <div>
                                        <label>Agregar comprobante</label>
                                        <input type='file' disabled={this.state.shouldBeDisable} />
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.showExpensesCRUD(false)}>
                        Cancelar
                            </Button>
                    <Button className={this.detectActionClassName()} type="submit">
                        {this.state.description}
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}


export default ExpensesItemView
