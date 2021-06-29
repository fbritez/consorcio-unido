import React from 'react';
import { BiFile, BiXCircle } from "react-icons/bi";
import Row from 'react-bootstrap/Row';

const FileSelectedItem = props => {

    const formatName = () => {
        return props.selectedFile?.name?.split('/')[1]
    }
    return (
        <div>
            {props.selectedFile?.name ?
                <div>
                    <Row >
                        <BiFile size={35}/>              
                        <BiXCircle onClick={() => props.setSelectedFile(undefined)}/>
                    </Row>
                    <div style={{ fontSize: 'smaller' }}>
                        {formatName()}
                    </div>
                </div>
                :
                <div />
            }
        </div>
    )
}


export default FileSelectedItem