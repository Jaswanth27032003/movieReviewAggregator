import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import cleanupLocalStorage from './utils/localStorageCleanup';

// Clean up localStorage on app start
cleanupLocalStorage();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // React.StrictMode can cause components to mount and unmount twice in development
  // which might be causing issues with context. Let's temporarily remove it.
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
