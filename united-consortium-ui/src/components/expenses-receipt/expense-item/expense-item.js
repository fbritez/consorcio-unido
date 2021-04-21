
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import NumericInput from 'react-numeric-input';
import './expense-item.scss';

export class ExpensesItemView extends React.Component {

    constructor(props) {
        super(props);
        const currentItem = this.props.item ? this.props.item : { title: null, description: null, amount: null }
        
        this.state = {
            currentItem: currentItem,
            description: this.props.actionDescription,
            shouldBeDisable:(this.props.actionDescription === "Eliminar")
        }
    }



    handleExpenseItem() {
        this.props.showExpensesCRUD(false)
        this.props.handleAction(this.state.currentItem);
        this.setState({description: null})
    }


    handleChange(newValue) {
        const updatedItem = {
            ...this.state.currentItem,
            ...newValue
        }
        this.setState({ currentItem: updatedItem })
    }

    detectActionClassName(){
        const action = this.state.description;
        let ret;
        switch(action){
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
                        <input type='file'/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.showExpensesCRUD(false)}>
                        Cancelar
                            </Button>
                    <Button className= {this.detectActionClassName()} onClick={() => {debugger; this.handleExpenseItem()}}>
                        {this.state.description}
                            </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}


export default ExpensesItemView
