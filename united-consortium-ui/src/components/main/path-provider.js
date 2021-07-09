import React, { useState, createContext } from 'react';

const PathContext = createContext();

const PathContextProvider = (props) => {
    const [path, setPath] = useState();
    return (
        <PathContext.Provider value={{ 
            path: path,
            setPath : setPath
        }}>
        	{props.children}
        </PathContext.Provider>
    );
}

export {
    PathContextProvider,
    PathContext
}