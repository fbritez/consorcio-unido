
import React, { useState, createContext } from 'react';
const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState();
    return (
        <UserContext.Provider value={{ 
            user: user,
            setUser : setUser
        }}>
        	{props.children}
        </UserContext.Provider>
    );
}

export {
    UserContextProvider,
    UserContext
}