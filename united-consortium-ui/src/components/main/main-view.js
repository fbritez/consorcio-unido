import Login from '../login/login-view';
import PageNotFoundView from '../login/page-not-found';
import { UserContextProvider } from '../user-provider/user-provider';
import ExpensesReceiptMainView from '../expenses-receipt/main-view/expenses-receipt-main-view';
import ConsortiumsMainView from '../consortium/consortiums-main-view/consortiums-main-view';
import { ConsortiumContextProvider } from '../consortium/consortium-provider/consortium-provider'
import NotificationMainView from '../notifications/notification-main-view';
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import AppliactionNavView from '../application-nav/application-nav-view';
import ClaimMainView from '../claims/claim-main-view';
import { ClaimContextProvider } from '../claims/claim-provider';
import { ExpensesReceiptContextProvider } from '../expenses-receipt/expenses-receipt-provider/expenses-receipt-provider';
import { PathContext, PathContextProvider } from './path-provider';


const UnitedConsortiumRoutes = () => {

    const history = useHistory();
    const { path } = useContext(PathContext)

    useEffect(async () => {
        history?.push(path)
    }, [path]);

    return (
        <React.Fragment>
            <AppliactionNavView />
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
                <Route exact path="/claims">
                    <ClaimMainView />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route >
                    <PageNotFoundView />
                </Route>
            </Switch>
        </React.Fragment>
    )
}
const Main = () => {

    return (
        <ClaimContextProvider>
            <ExpensesReceiptContextProvider>
                <ConsortiumContextProvider>
                    <UserContextProvider>
                        <PathContextProvider>
                            <Router>
                                <UnitedConsortiumRoutes />
                            </Router>
                        </PathContextProvider>
                    </UserContextProvider>
                </ConsortiumContextProvider>
            </ExpensesReceiptContextProvider>
        </ClaimContextProvider>
    )
}

export default Main