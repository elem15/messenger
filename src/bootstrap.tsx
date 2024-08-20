import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './app/styles/index.scss';
import { Provider } from 'react-redux';
import store from './app/api/appStore';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import Messenger from "@/components/Messenger";

TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Messenger />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
