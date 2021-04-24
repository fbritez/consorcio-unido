
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import './expense-item.scss';

export class ExpensesItemView extends React.Component {

    constructor(props) {
        super(props);
        const currentItem = this.props.item ? this.props.item : { title: '', description: '', amount: null }
        this.state = {
            currentItem: currentItem,
            oldItem: currentItem,
            description: this.props.actionDescription,
            shouldBeDisable: (this.props.actionDescription === "Eliminar"),
            valid: false
        }
    }

    handleExpenseItem() {
        this.props.showExpensesCRUD(false)
        this.props.handleAction({ newItem: this.state.currentItem, oldItem :this.state.oldItem});
        this.setState({ description: null , valid: true})
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
        this.handleExpenseItem()
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
                        <Form noValidate validated={this.state.valid} onSubmit={(event) => this.handleSubmit(event)}>

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
                                <Form.Control className="form-control"
                                    aria-label="Monto"
                                    type="number"
                                    required
                                    onChange={event => this.handleChange({ 'amount': parseFloat(event.target.value) })}
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
                            <Form.Row>
                                <Form.Group controlId="validateTicket">
                                    <Form.Label>Agregar comprobante</Form.Label>
                                    <div>
                                        <input type='file' disabled={this.state.shouldBeDisable} />
                                    </div>
                                </Form.Group>
                            </Form.Row>
                            <hr />
                            <div className='buttons'>
                                <Button className={this.detectActionClassName()} type="submit">
                                    {this.state.description}
                                </Button>
                                <Button variant="secondary" className={'cancel-button'} onClick={() => this.props.showExpensesCRUD(false)}>
                                    Cancelar
                            </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

}


export default ExpensesItemView
