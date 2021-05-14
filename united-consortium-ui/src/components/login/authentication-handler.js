import React, { useContext } from 'react';
import { UserContext } from "../user-provider/user-provider";
import { Redirect } from "react-router-dom";


const authenticationHandler = (functionComponent) => {

    const AuthenticationHandlerComponent = (props) => {
        const { user, setUser } = useContext(UserContext);
        return user ? functionComponent(props) : <Redirect to={'/login'} />
        
    }

    return AuthenticationHandlerComponent
}

export default authenticationHandler