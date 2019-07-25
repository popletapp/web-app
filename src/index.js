import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

import './index.scss';
import './App.scss';
import Application from './components/internal/main/App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

const BASE_URL = 'http://localhost:7777/api/v1';

axios.defaults.baseURL = BASE_URL;

const Poplet = {
  API: {
    BASE_URL
  },
  constants: {
    WS_BASE_URL: 'ws://localhost:7777'
  },
  store
};

export default Poplet;

async function render () {
  store.subscribe(() => console.log('Store: ', store.getState()));

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Application />
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
