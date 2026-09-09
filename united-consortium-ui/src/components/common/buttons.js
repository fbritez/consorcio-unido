import React, { useContext } from 'react';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs';
import { AiOutlinePaperClip, AiFillCaretDown } from "react-icons/ai";
import { Button } from '@mui/material';
import { ExpensesReceiptContext } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';

const UpdateItemButton = props => {

    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    return (
        <Button
            size="small"
            sx={{ minWidth: 36, p: 0.75 }}
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
        <Button size="small" sx={{ minWidth: 36, p: 0.75 }} disabled={!expensesReceipt?.isOpen()} onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const BasicRemoveItemButton = props => {

    return (
        <Button size="small" sx={{ minWidth: 36, p: 0.75 }} onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const BasicUpdateItemButton = props => {

    return (
        <Button size="small" sx={{ minWidth: 36, p: 0.75 }} onClick={() => props.onClick()}> <BsPencil /></Button>
    )
}

const AddItemButton = props => {
    const { expensesReceipt } = useContext(ExpensesReceiptContext)
    const disabled = props.disabled ? (expensesReceipt && !expensesReceipt.isOpen()) : false;
    return (
        <Button
            onClick={() => props.onClick()}
            disabled={disabled}
        >
            {props.description ? props.description : 'Agregar'}
        </Button>
    )
}

const BasicAddItemButton = props => {

    return (
        <Button
            data-testid='add-item-button'
            style={props.style}
            onClick={() => props.onClick()}
            disabled={props.disabled}
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
        const name = generateName(fileUploaded.name)
        const file = { filename: fileUploaded, name: name }
        props.handleFile(file);
    };

    const generateName = (filename) => {
        return `${new Date().getTime()}/${filename}`
    }

    return (
        <React.Fragment>
            <Button
                size="small"
                sx={{ minWidth: 36, p: 0.75 }}
                onClick={handleClick}
                disabled={props.disabled}>
                <AiOutlinePaperClip />
            </Button>
            <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none', width: "1%" }}
            />
        </React.Fragment>
    );
};

const DownloadButton = props => {

    return (
        <Button
            size="small"
            sx={{ minWidth: 36, p: 0.75 }}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <AiFillCaretDown />
        </Button>
    )
}


export {
    AddItemButton,
    UpdateItemButton,
    RemoveItemButton,
    BasicAddItemButton,
    BasicRemoveItemButton,
    BasicUpdateItemButton,
    FileUploaderButton,
    DownloadButton
}
