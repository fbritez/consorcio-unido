import React, { useState, useContext } from 'react';
import { UserContext } from "../user-provider/user-provider";
import Login from "./login-view";


const authenticationHandler = (functionComponent) => {


    const AuthenticationHandlerComponent = (props) => {
        //const { user, setUser } = useContext(UserContext);
        //debugger
        //return user ? functionComponent(props) : window.location.href = '/login'
        return functionComponent(props)
    }

    return AuthenticationHandlerComponent
}

export default authenticationHandler