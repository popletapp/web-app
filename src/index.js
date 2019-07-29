import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './index.scss';
import './App.scss';
import Application from './components/internal/main/App';
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
  store
};

export default Poplet;

async function render () {
  store.subscribe(() => console.log(store.getState()))
  ReactDOM.render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
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
