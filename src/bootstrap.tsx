import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Messenger from './components/Messanger';
import { Provider } from 'react-redux';
import store from './app/api/appStore';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Messenger />
    </Provider>
  </React.StrictMode>
);
