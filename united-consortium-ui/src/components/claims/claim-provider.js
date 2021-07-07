import React, { useState, createContext } from 'react';
const ClaimContext = createContext();

const ClaimContextProvider = (props) => {
    const [claim, setClaim] = useState();
    return (
        <ClaimContext.Provider value={{ 
            claim: claim,
            setClaim : setClaim
        }}>
        	{props.children}
        </ClaimContext.Provider>
    );
}

export {
    ClaimContextProvider,
    ClaimContext
}