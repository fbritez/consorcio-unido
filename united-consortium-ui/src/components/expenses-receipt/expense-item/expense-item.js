
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import './expense-item.scss';


const ExpensesItemView = (props) => {

    const item = props.item ? props.item : { title: '', description: '', amount: null, ticket: null }
    const shouldBeDisable = (props.actionDescription === "Eliminar")

    const [currentItem, setCurrentItem] = useState(item)
    const [oldItem, setOldItem] = useState(item)
    const [valid, setValid] = useState(false)
    const [description, setDescription] = useState(props.actionDescription)
    const [selectedFile, setSelectedFile] = useState()

    const handleExpenseItem = () => {
        debugger
        props.showExpensesCRUD(false)
        props.handleAction({ newItem: { item: currentItem, updatedFile: selectedFile }, oldItem: oldItem });
        setDescription(null)
        setValid(true)
    }

    const handleChange = (newValue) => {
        const updatedItem = {
            ...currentItem,
            ...newValue
        }
        setCurrentItem(updatedItem)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        handleExpenseItem()
    };

    const getTicketName = (ticketName) => {
        return ticketName? ticketName.split('/')[1] : ''
    }

    const handleClose = () => { }

    const detectActionClassName = () => {
        const action = description;
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

    const onFileChange = (event) => {
        const filename = event.target.files[0]
        const name = generateName(filename.name)
        const file = { filename: filename, name: name }
        setSelectedFile(file)
        handleChange({ ticket: name });
    }

    const generateName = (filename) => {
        return `${new Date().getTime()}/${filename}`
    }

    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton onClick={() => props.showExpensesCRUD(false)}>
                <Modal.Title>Agregar nuevo gasto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <label htmlFor="basic-url">Agregue detalles del gasto</label>
                    </div>
                    <Form noValidate validated={valid} onSubmit={(event) => handleSubmit(event)}>

                        <Form.Group controlId="validateTitle">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control
                                id="basic-title"
                                aria-describedby="basic-addon3"
                                required
                                onChange={event => handleChange({ 'title': event.target.value })}
                                defaultValue={props.item?.title}
                                disabled={shouldBeDisable} />
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
                                onChange={event => handleChange({ 'amount': parseFloat(event.target.value) })}
                                defaultValue={props.item?.amount}
                                disabled={shouldBeDisable}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor defina un monto
                                </Form.Control.Feedback>

                        </Form.Group>
                        <Form.Group controlId="validateDescription">
                            <Form.Label>{'Descripción'}</Form.Label>
                            <FormControl as="textarea"
                                aria-label="description"
                                onChange={event => handleChange({ 'description': event.target.value })}
                                defaultValue={props.item?.description}
                                disabled={shouldBeDisable} />
                        </Form.Group>
                        <hr />
                        <Form.Row>
                            <Form.Group controlId="validateTicket">
                                <Form.Label>Comprobante</Form.Label>
                                <div>
                                    <p>
                                        {`Archivo actual: ${getTicketName(currentItem.ticket)}`}
                                    </p>
                                </div>
                                <div>
                                    <input type='file' onChange={onFileChange} disabled={shouldBeDisable} />
                                </div>
                            </Form.Group>
                        </Form.Row>
                        <hr />
                        <div className='buttons'>
                            <Button className={detectActionClassName()} type="submit">
                                {description}
                            </Button>
                            <Button variant="secondary" className={'cancel-button'} onClick={() => props.showExpensesCRUD(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )

}


export default ExpensesItemView
