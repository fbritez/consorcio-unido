import React from 'react';
import { BsFillTrashFill, BsPencil, BsFileEarmarkArrowDown } from 'react-icons/bs'
import { Button } from 'react-bootstrap';
import './buttons.scss'

const UpdateItemButton = props => {
    return (
        <Button 
            className='option-button' 
            onClick={() => props.onClick()}>
                <BsPencil />
        </Button>
    )
}

const RemoveItemButton = props => {
    return(
        <Button className='option-button' onClick={() => props.onClick()}><BsFillTrashFill /></Button>
    )
}

const AddItemButton = props => {
    return(
        <Button 
        className='add-button'
        onClick={() => props.onClick()}> 
            {props.description? props.description : 'Agregar'}
        </Button>
    )
}

export {
    AddItemButton,
    UpdateItemButton,
    RemoveItemButton
}
