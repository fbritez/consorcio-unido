import React, { useContext } from 'react';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs';
import { AiOutlinePaperClip, AiFillCaretDown } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import './buttons.scss'
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';

const UpdateItemButton = props => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    return (
        <Button
            className='option-button'
            onClick={() => props.onClick()}
            disabled={!expensesReceipt?.isOpen()}
        >
            <BsPencil />
        </Button>
    )
}

const RemoveItemButton = props => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext);

    return (
        <Button className='option-button' disabled={!expensesReceipt?.isOpen()} onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const BasicRemoveItemButton = props => {

    return (
        <Button className='option-button' onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const AddItemButton = props => {
    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    const disabled = props.disabled ? (expensesReceipt && !expensesReceipt.isOpen()) : false;
    return (
        <Button
            className='add-button'
            onClick={() => props.onClick()}
            disabled={disabled}
        >
            {props.description ? props.description : 'Agregar'}
        </Button>
    )
}

const FileUploaderButton = props => {
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        props.handleFile(fileUploaded);
    };
    return (
        <div>
            <Button
                className={props.className}
                onClick={handleClick}>
                <AiOutlinePaperClip />
            </Button>
            <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

const DownloadButton = props => {
    return(
        <Button className={props.className ? props.className: 'option-button'} onClick={props.onClick}>
            <AiFillCaretDown />
        </Button>
    )
}


export {
    AddItemButton,
    UpdateItemButton,
    RemoveItemButton,
    BasicRemoveItemButton,
    FileUploaderButton,
    DownloadButton
}
