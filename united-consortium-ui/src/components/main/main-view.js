import Login from '../login/login';
import ExpensesReceiptMainView from '../expenses-receipt/main-view/expenses-receipt-main-view';

import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


const Main = () => {

    return (
        <Router>
                <Switch>
                    <Route path="/adm-expenses">
                        <ExpensesReceiptMainView />
                    </Route>
                    <Route path="/expenses">
                        <ExpensesReceiptMainView />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                </Switch>
        </Router>
    )
}

export default Main