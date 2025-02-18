import React from 'react';
import ReactDOM from 'react-dom/client';
import 'boxicons/css/boxicons.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Context } from './components/ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Context>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </Context>
    </ErrorBoundary>
  </React.StrictMode>
);

