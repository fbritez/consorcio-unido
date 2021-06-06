import React from 'react';
import Alert from 'react-bootstrap/Alert';

const ErrorHandler = props => {
    return (
        <div>
            {props.errors.map(errorAndDescription => {
                return (
                    <div>
                        {errorAndDescription.value &&
                            <Alert variant='danger'>
                                {errorAndDescription.description}
                            </Alert>}
                    </div>)
            })}
        </div>)
}

export default ErrorHandler