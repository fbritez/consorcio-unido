import React from 'react';
import { ConsortiumContextProvider } from './consortium-provider';

const applyConsortiumProvider = (functionalComponent) => {

    const ConsortiumProviderComponent = (props) => {
        return (
            <ConsortiumContextProvider>
                { functionalComponent(props)}
            </ConsortiumContextProvider>
        )
    }

    return ConsortiumProviderComponent
}


export default applyConsortiumProvider