
import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import ExpensesReceiptService from '../../../services/expense-receipt-service/expense-receipt-service';
import { ConsortiumContext } from '../../consortium/consortium-provider/consortium-provider';
import { detectActionClassName } from '../../utils/detect-action-button-class';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import './expense-item.scss';

const service = new ExpensesReceiptService();

const ExpensesItemView = (props) => {

    const item = props.item ? props.item : service.createItemModel({ title: '', description: '', amount: null, ticket: null })
    const shouldBeDisable = (props.actionDescription === "Eliminar")

    const [currentItem, setCurrentItem] = useState(item)
    const [oldItem, setOldItem] = useState(item)
    const [valid, setValid] = useState(false)
    const [description, setDescription] = useState(props.actionDescription)
    const [selectedFile, setSelectedFile] = useState()
    const { consortium } = useContext(ConsortiumContext);
    const [members, setMembers] = useState([]);
    const [gridApi, setGridApi] = useState();

    const onGridReady = params => {
        setGridApi(params.api);
        params.api.setRowData(consortium.members);
        params.api.forEachNode(node => checkNode(node));
    };

    const checkNode = (node) => {
        const data = node.data;
        const value = currentItem.members.some(member => member.member_name == data.member_name);
        node.setSelected(value);
    }

    const handleExpenseItem = () => {
        props.showExpensesCRUD(false)
        const members = gridApi.getSelectedNodes().map(node => node.data);
        currentItem.set_members(members)
        props.handleAction({ newItem: { item: currentItem, updatedFile: selectedFile }, oldItem: oldItem });
        setDescription(null)
        setValid(false)
    }

    const handleChange = (newValue) => {
        const updatedItem = {
            ...currentItem,
            ...newValue
        }
        setCurrentItem(service.createItemModel(updatedItem))
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            setValid(true)
            event.preventDefault();
            event.stopPropagation();
        } else {
            handleExpenseItem();
        }
    };

    const getTicketName = (ticketName) => {
        return ticketName ? ticketName.split('/')[1] : ''
    }

    const handleClose = () => { }

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
                    <Form noValidate validated={valid} onSubmit={(event) => handleSubmit(event)}>
                        <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                            <Tab eventKey="general" title="General">
                                <div>
                                    <Form.Group controlId="validateTitle">
                                        <Form.Label>Titulo</Form.Label>
                                        <Form.Control
                                            id="basic-title"
                                            aria-describedby="basic-addon3"
                                            required
                                            onChange={event => handleChange({ 'title': event.target.value })}
                                            value={props.item?.title}
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
                                            value={props.item?.amount}
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
                                </div>
                            </Tab>
                            <Tab eventKey="particular" title="Unidades Funcionales">
                                <div className="ag-theme-material" style={{ height: 310, }}>
                                    <AgGridReact
                                        defaultColDef={{
                                            enableRowGroup: true,
                                            enablePivot: true,
                                            enableValue: true,
                                            sortable: true,
                                            resizable: true,
                                            filter: true,
                                            flex: 1,
                                            minWidth: 50,
                                        }}
                                        rowData={members}
                                        rowSelection={'multiple'}
                                        pagination={true}
                                        paginationPageSize={5}
                                        suppressColumnsToolPanel={true}
                                        onGridReady={onGridReady}>
                                        <AgGridColumn
                                            checkboxSelection={true}
                                            headerName="Unidad Funcional"
                                            field="member_name"
                                        >
                                        </AgGridColumn>
                                        <AgGridColumn
                                            field="user_email"
                                            headerName="Correo de contacto"
                                        >
                                        </AgGridColumn>
                                    </AgGridReact>
                                </div>
                            </Tab>
                        </Tabs>
                        <hr />
                        <div className='buttons'>
                            <Button className={detectActionClassName(description)} type="submit">
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
