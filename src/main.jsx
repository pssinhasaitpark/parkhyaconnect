import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId="130350895686-alvovl0rqcao7j767pcdmp2k67nmgnrc.apps.googleusercontent.com">
        <App />
        <ToastContainer />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);


