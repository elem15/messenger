import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Messenger from "./components/Messenger";
import { Provider } from 'react-redux';
import store from './api/appStore';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
       <Messenger />  
    </Provider>
  </React.StrictMode>
);