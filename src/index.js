import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import * as Sentry from '@sentry/browser';
import mobile, { isMobile } from 'is-mobile';

import './index.scss';
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
  log: new Logger(),
  mobile: isMobile()
};

Poplet.log.prefix('START').debug('Poplet initializing...');

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({ dsn: 'https://c4d63a4af0db44f295ac39635fea9775@sentry.io/1520095' });
}

export default Poplet;

class EventListenerHandler {
  constructor () {
    // { type: String, function: Function }
    this.functions = [];
    this.listenerTriggered = this.listenerTriggered.bind(this)
    this.listeners = [];
    const EVENTS = [
      'click',
      'keydown',
      'mousemove',
      'mouseup',
      'mousedown',
      'oncontextmenu'
    ]
    for (const type of EVENTS) {
      const listener = document.addEventListener(type, (event) => this.listenerTriggered(type, event));
      this.listeners.push(listener);
    }
  }

  subscribe (type, func) {
    if (!Array.isArray(type)) {
      this.functions.push({ type, function: func });
    } else {
      for (const t of type) {
        this.functions.push({ type: t, function: func });
      }
    }
  }

  unsubscribe (type, func) {
    for (let i = 0; i < this.functions.length; i++) {
      let listener = this.functions[i];
      if (listener && listener.type === type && listener.function === func) {
        this.functions.splice(i, 1);
      }
    }
  }

  listenerTriggered (type, event) {
    for (let i = 0; i < this.functions.length; i++) {
      let listener = this.functions[i];
      if (listener && listener.type === type) {
        listener.function.call(null, event);
      }
    }
  }
}
window.listeners = new EventListenerHandler();

async function render () {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Application} />
        </Switch>
      </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { render };
