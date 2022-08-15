import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './contexts/AuthContext';

// styles
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // all components that need access to the AuthContext state object must be wrapped with AuthContextProvider
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
