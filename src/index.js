import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.js';

import './index.scss';
import './App.scss';
import Application from './components/internal/main/App';
import CriticalFailure from './components/internal/load/CriticalFailure';
import Login from './components/login/Login';
import Loader from './components/internal/load/Loader';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

const BASE_URL = 'http://localhost:7777/api/v1';

axios.defaults.baseURL = BASE_URL;

const Poplet = {
    API: {
        BASE_URL
    },
    ws: {
        BASE_URL: 'ws://localhost:7979'
    },
    store
};

console.log(Poplet)
export default Poplet;

async function renderStatic () {
    ReactDOM.render(
        <BrowserRouter>
            <Application />
        </BrowserRouter>
    , document.getElementById('root'));
}

async function renderApplication () {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Application board={Poplet.boards[0]} />
            </BrowserRouter>
        </Provider>
    , document.getElementById('root'));
}

renderStatic();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { renderApplication, renderStatic };