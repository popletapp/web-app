import store from './../../store.js';
import axios from 'axios';
import Poplet from './../../';
import openSocket from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { Connecting } from '../../components';

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

    const socket = openSocket('http://localhost:7777');
    console.log(socket);
    Poplet.ws = socket;
  }

  Poplet.ws.emit('authorize', { userID: Poplet.user.id, authToken: token });
  Poplet.ws.on('message', (data) => {
    console.log(data);
    if (data.type) {
      store.dispatch(data);
    } else {
      console.log(`Received websocket but no type information was provided: ${data}`);
    }
  });

  Poplet.ws.emit('heartbeat');
  setInterval(() => {
    Poplet.ws.emit('heartbeat');
    if (Date.now() - LAST_HEARTBEAT_TIMESTAMP > 30e3) {
      ReactDOM.render(<Connecting />, document.querySelector('#root'));
    }
  }, 10000);
  Poplet.ws.on('heartbeat', () => {
    LAST_HEARTBEAT_TIMESTAMP = Date.now();
  });

  const getUserBoards = () => axios.get(`/users/${Poplet.user.id}/boards`).then(res => res.data);

  const boards = await getUserBoards();

  Poplet.boards = []; // Array of board objects
  // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
  // Fetch from the API to convert ID's to objects
  Poplet.boards = boards;
  Poplet.boards = !Poplet.boards.length ? [] : Poplet.boards;
  store.dispatch({ type: 'POPULATE_BOARDS', array: Poplet.boards });

  Poplet.users = [];
  Poplet.notes = [];
  // Same applies for users: fetch all users inside of the board that were fetched above (each board will have a `members` property with IDs)
  for (const board of Poplet.boards) {
    if (board) {
      Poplet.users = Poplet.users.concat(board.members); // Array of cached users
      Poplet.notes = Poplet.notes.concat(board.notes); // Some notes should be cached to prevent having to call the API each time
    }
  }
};
