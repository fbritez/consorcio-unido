import React, { useContext } from 'react';
import { BsFillTrashFill, BsPencil, BsFileEarmarkArrowDown } from 'react-icons/bs'
import { Button } from 'react-bootstrap';
import './buttons.scss'
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';

const UpdateItemButton = props => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    debugger
    const e = !expensesReceipt?.isOpen()
    return (
        <Button 
            className='option-button' 
            onClick={() => props.onClick()}
            disabled={e}
            >
                <BsPencil />
        </Button>
    )
}

const RemoveItemButton = props => {
    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    return(
        <Button className='option-button' disabled={!expensesReceipt?.isOpen()} onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const AddItemButton = props => {
    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    return(
        <Button 
        className='add-button'
        onClick={() => props.onClick()}
        disabled={expensesReceipt && !expensesReceipt.isOpen() }
        > 
            {props.description? props.description : 'Agregar'}
        </Button>
    )
}

export {
    AddItemButton,
    UpdateItemButton,
    RemoveItemButton
}
