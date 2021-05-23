
import React, { useState, createContext } from 'react';
const ConsortiumContext = createContext();

const ConsortiumContextProvider = (props) => {
    const [consortium, setConsortium] = useState(undefined);
    return (
        <ConsortiumContext.Provider value={{ 
            consortium: consortium,
            setConsortium : setConsortium
        }}>
        	{props.children}
        </ConsortiumContext.Provider>
    );
}

export {
    ConsortiumContextProvider,
    ConsortiumContext
}