import store from './../../store.js';
import axios from 'axios';
import Poplet from './../../';
import openSocket from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { Connecting } from '../../components';
import { getBoards } from './../../actions/board';

let LAST_HEARTBEAT_TIMESTAMP = Date.now();

export default async () => {
  const getCurrentUser = () => axios.get(`/users/me`).then(res => res.data);
  const token = localStorage.getItem('token');
  if (!token) {
    document.location.replace('/login');
  } else {
    axios.defaults.headers.common['Authorization'] = token;

    const user = await getCurrentUser();
    console.log(`Logged in as ${user.username} (${user.id})`);
    store.dispatch({ type: 'INITIALIZE_USER', user });
    Poplet.user = user;

    let socket = null;
    try {
      socket = openSocket(process.env.NODE_ENV === 'development' ? 'ws://localhost:7777' : 'wss://popletapp.com', { transports: ['websocket'] });
    } catch (e) {
      console.log(e);
    }

    Poplet.ws = socket;
  }

  Poplet.ws.emit('authorize', { userID: Poplet.user.id, authToken: token });
  Poplet.ws.on('message', (data) => {
    if (data.type) {
      store.dispatch(data);
    } else {
      console.log(`Received websocket but no type information was provided: ${data}`);
    }
  });

  let reconnecting = false;
  Poplet.ws.emit('heartbeat');
  setInterval(() => {
    Poplet.ws.emit('heartbeat');
    if (Date.now() - LAST_HEARTBEAT_TIMESTAMP > 50e3) {
      ReactDOM.render(<Connecting />, document.querySelector('#root'));
      reconnecting = true;
    } else {
      if (reconnecting) {
        window.location.reload();
      }
    }
  }, 10000);
  Poplet.ws.on('heartbeat', () => {
    LAST_HEARTBEAT_TIMESTAMP = Date.now();
  });

  const boards = await store.dispatch(getBoards(Poplet.user.id));
  Poplet.boards = []; // Array of board objects
  // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
  // Fetch from the API to convert ID's to objects
  Poplet.boards = boards;
  Poplet.boards = !Poplet.boards.length ? [] : Poplet.boards;

  Poplet.users = [];
  Poplet.notes = [];
  // Same applies for users: fetch all users inside of the board that were fetched above (each board will have a `members` property with IDs)
  for (const board of Poplet.boards) {
    if (board) {
      Poplet.users = Poplet.users.concat(board.members); // Array of cached users
      Poplet.notes = Poplet.notes.concat(board.notes); // Some notes should be cached to prevent having to call the API each time
    }
  }
  store.dispatch({ type: 'CONNECT' });
};
