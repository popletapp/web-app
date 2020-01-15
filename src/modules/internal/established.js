import store from './../../store.js';
import axios from 'axios';
import Poplet, { render } from './../../';
import openSocket from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { Connecting } from '../../components';
import { getBoards } from './../../actions/board';

let LAST_HEARTBEAT_TIMESTAMP = Date.now();
const MAX_KEEP_ALIVE_TIME = 50e3;
const HEARTBEAT_INTERVAL = 10e3;
const RETRY_TIMES = [5e2, 1e3, 2e3, 5e3, 10e3, 30e3, 60e3, 120e3];

const connectSocket = () => {
  let socket = null;
  try {
    socket = openSocket(process.env.NODE_ENV === 'development' ? 'ws://localhost:7777' : 'wss://popletapp.com', { transports: ['websocket'] });
  } catch (e) {
    Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).error(`Error whilst trying to open websocket conncection: ${e.message || e}`);
  }
  Poplet.ws = socket;
};

export default async () => {
  const getCurrentUser = () => axios.get(`/users/me`).then(res => res.data);
  const token = localStorage.getItem('token');
  if (!token) {
    document.location.replace('/login');
  } else {
    axios.defaults.headers.common['Authorization'] = token;
    const user = await getCurrentUser();
    Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).info(`Logged in as ${user.username} (${user.id})`);
    store.dispatch({ type: 'INITIALIZE_USER', user });
    Poplet.user = user;
    connectSocket();
  }

  Poplet.ws.emit('authorize', { userID: Poplet.user.id, authToken: token });
  Poplet.ws.on('message', (data) => {
    if (data.type) {
      store.dispatch(data);
    } else {
      Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).warn(`Received websocket but no type information was provided: ${data}`);
    }
  });

  let retries = 0;
  Poplet.ws.emit('heartbeat');
  let disconnected = false;
  let retryTime = RETRY_TIMES[0];
  const reconnect = () => {
    retryTime = Math.min(RETRY_TIMES[retries] || Infinity, 1e4 * 80);
    setTimeout(() => {
      // If the last heartbeat hasn't been returned in more than 50 seconds, render the reconnect view
      if (Date.now() - LAST_HEARTBEAT_TIMESTAMP > MAX_KEEP_ALIVE_TIME) {
        retries++;
        Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).warn(`Heartbeat was not received from server. Retrying in ${retryTime}ms (${retries} attempts)`);
        ReactDOM.render(<Connecting />, document.querySelector('#root'));
        disconnected = true;
        reconnect();
      } else {
        if (disconnected) {
          disconnected = false;
          Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).info(`Reconnected to gateway after ${retries} retries`);
          connectSocket();
          render();
        }
      }
    }, retryTime); // max reconnect time of 120 seconds
  };

  const POLLING_TIME = 500;
  let amountPolled = 0;
  setInterval(() => {
    amountPolled++;
    if (amountPolled * POLLING_TIME > HEARTBEAT_INTERVAL) {
      Poplet.ws.emit('heartbeat');
      Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).debug('Heartbeat sent');
      amountPolled = 0;
    }
    if (Date.now() - LAST_HEARTBEAT_TIMESTAMP > MAX_KEEP_ALIVE_TIME) {
      reconnect();
    }
  }, POLLING_TIME);

  Poplet.ws.on('heartbeat', () => {
    LAST_HEARTBEAT_TIMESTAMP = Date.now();
    Poplet.log.prefix(Poplet.log.PREFIX_TYPES.GATEWAY).debug('Heartbeat received');
  });

  const boards = await store.dispatch(getBoards(Poplet.user.id));
  Poplet.boards = !boards.length ? [] : boards; // Array of board objects
  // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
  // Fetch from the API to convert ID's to objects

  // Initialize variables
  Poplet.users = [];
  Poplet.notes = [];
  // Same applies for users: fetch all users inside of the board that were fetched above (each board will have a `members` property with IDs)
  for (const board of Poplet.boards) {
    if (board) {
      Poplet.users = Poplet.users.concat(board.members); // Array of cached users
      Poplet.notes = Poplet.notes.concat(board.notes); // Some notes should be cached to prevent having to call the API each time
    }
  }

  // Send CONNECT dispatch
  store.dispatch({ type: 'CONNECT' });
};
