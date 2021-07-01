import Login from '../login/login-view';
import PageNotFoundView from '../login/page-not-found';
import { UserContextProvider } from '../user-provider/user-provider';
import ExpensesReceiptMainView from '../expenses-receipt/main-view/expenses-receipt-main-view';
import ConsortiumsMainView from '../consortium/consortiums-main-view/consortiums-main-view';
import { ConsortiumContextProvider } from '../consortium/consortium-provider/consortium-provider'
import NotificationMainView from '../notifications/notification-main-view';
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import AppliactionNavView from '../application-nav/application-nav-view';
import Prueba from './prueba';

const Main = () => {

    return (
        <ConsortiumContextProvider>
        <UserContextProvider>
            <Router>
                <AppliactionNavView/>
                <Switch>
                    <Route path="/notifications">
                        <NotificationMainView />
                    </Route>
                    <Route path="/consortiums">
                        <ConsortiumsMainView />
                    </Route>
                    <Route path="/expenses">
                        <ExpensesReceiptMainView />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/pruebas">
                        <Prueba />
                    </Route>
                    <Route >
                        <PageNotFoundView />
                    </Route>
                </Switch>
            </Router>
        </UserContextProvider>
        </ConsortiumContextProvider>

    )
}

export default Main