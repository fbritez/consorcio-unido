import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ExpensesReceiptMainView } from './components/expenses-receipt/main-view/expenses-receipt-main-view';


ReactDOM.render(
  <React.StrictMode>
    <ExpensesReceiptMainView />
  </React.StrictMode>,
  document.getElementById('root')
);
