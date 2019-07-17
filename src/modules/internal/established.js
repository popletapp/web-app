import store from './../../store.js';
import axios from 'axios';
import Poplet from './../../';

export default async (id) => {
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

    const ws = new WebSocket(Poplet.ws.BASE_URL);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.type) {
        store.dispatch(data);
      } else {
        console.log(`Received websocket but no type information was provided: ${data}`);
      }
    };
    Poplet.ws = { ...Poplet.ws, ...ws };
  }

  const getUserBoards = () => axios.get(`/users/${Poplet.user.id}/boards`).then(res => res.data);

  const boards = await getUserBoards();

  Poplet.boards = []; // Array of board objects
  // Get the current list of ID's of the boards that this user is in and create new board objects from the ID's
  // Fetch from the API to convert ID's to objects
  Poplet.boards = boards;
  Poplet.boards = !Poplet.boards.length ? [{ id: '1', name: 'Not a board (default placeholder)', avatar: null, chatrooms: [{}] }] : Poplet.boards;
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
