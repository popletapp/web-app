import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store.js';

import './index.scss';
import Application from './App';
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

async function render () {
    await axios.get('/gateway/connect')
        .then(() => {
            ReactDOM.render(<Loader />, document.getElementById('root'));
        })
        .catch(() => {
            ReactDOM.render(<CriticalFailure />, document.getElementById('root'));
        });

    store.subscribe(() => console.log('Store: ', store.getState()));

    const ws = new WebSocket(Poplet.ws.BASE_URL);
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        if (data.type) {
            store.dispatch(data);
        } else {
            console.log(`Received websocket but no type information was provided: ${data}`)
        }
    };
    Poplet.ws = { ...Poplet.ws, ...ws };

    const getCurrentUser = () => axios.get(`/user/me`).then(res => res.data);
    const token = localStorage.getItem('token');
    if (!token) {
        return ReactDOM.render(<Login />, document.getElementById('root'));
    } else {
        axios.defaults.headers.common['Authorization'] = token;
        const user = await getCurrentUser();
        console.log(`Logged in as ${user.username} (${user.id})`)
        Poplet.user = user;
    }

    const getUserBoards = () => axios.get(`/user/${Poplet.user.id}/boards`).then(res => res.data);
    const getBoard = (boardID) => axios.get(`/board/${boardID}`).then(res => res.data);
    
    const boards = await getUserBoards();

    Poplet.boards = []; // Array of board objects
    // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
    // Fetch from the API to convert ID's to objects
    Poplet.boards = await Promise.all(boards.map(board => getBoard(board)))
    store.dispatch({ type: 'POPULATE_BOARDS', array: Poplet.boards })

    Poplet.users = [];
    Poplet.notes = [];
    // Same applies for users: fetch all users inside of the board that were fetched above (each board will have a `members` property with IDs)
    for (const board of Poplet.boards) {
        if (board) {
            Poplet.users = Poplet.users.concat(board.members); // Array of cached users
            Poplet.notes = Poplet.notes.concat(board.notes); // Some notes should be cached to prevent having to call the API each time
        }  
    }

    ReactDOM.render(
        <Provider store={store}>
            <Application board={Poplet.boards.selected} />
        </Provider>
    , document.getElementById('root'));
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { render };