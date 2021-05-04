import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ExpensesReceiptMainView } from './components/expenses-receipt/main-view/expenses-receipt-main-view';
import  Login  from './components/login/login'


ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);
