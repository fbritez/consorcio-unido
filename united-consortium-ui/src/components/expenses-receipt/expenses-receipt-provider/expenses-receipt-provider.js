import React, { useState, createContext } from 'react';
const ExpensesReceiptContext = createContext();

const ExpensesReceiptContextProvider = (props) => {
    const [expensesReceipt, setExpensesReceipt] = useState();
    return (
        <ExpensesReceiptContext.Provider value={{ 
            expensesReceipt: expensesReceipt,
            setExpensesReceipt : setExpensesReceipt
        }}>
        	{props.children}
        </ExpensesReceiptContext.Provider>
    );
}

export {
    ExpensesReceiptContextProvider,
    ExpensesReceiptContext
}