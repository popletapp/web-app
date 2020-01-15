import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import * as Sentry from '@sentry/browser';
import { DndProvider } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import mobile from 'is-mobile';

import './index.scss';
import './App.scss';
import Application from './components/internal/main/App';
import { log as Logger } from './util';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:7777/api/v1' : 'https://popletapp.com/api/v1';

axios.defaults.baseURL = BASE_URL;

const Poplet = {
  API: {
    BASE_URL
  },
  constants: {
    WS_BASE_URL: 'wss://popletapp.com:7777'
  },
  store,
  log: new Logger()
};

Poplet.log.prefix('START').debug('Poplet initializing...');

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({ dsn: 'https://c4d63a4af0db44f295ac39635fea9775@sentry.io/1520095' });
}

export default Poplet;

async function render () {
  store.subscribe(() => Poplet.log.prefix(Poplet.log.PREFIX_TYPES.STORE).debug('Current store state', store.getState()));
  ReactDOM.render(
    <Provider store={store}>
      <DndProvider backend={mobile() ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
        <BrowserRouter>
          <Switch>
            <Route path='/' component={Application} />
          </Switch>
        </BrowserRouter>
      </DndProvider>
    </Provider>
    , document.getElementById('root'));
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { render };
