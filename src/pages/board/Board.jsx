import React, { Component } from 'react';
import Poplet from './../../';
import { connect } from 'react-redux';
import { selectBoard } from './../../actions/board';
import { getNotes } from './../../actions/note';
import { switchBoard } from './../../modules';

import ReactDOM from 'react-dom';
import store from './store.js';

import './index.scss';
import './App.scss';
import CriticalFailure from './components/internal/load/CriticalFailure';
import Login from './components/login/Login';
import Loader from './components/internal/load/Loader';
import axios from 'axios';

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard],
    notes: state.notes
  };
}

function mapDispatchToProps (dispatch) {
  return {
    selectBoard: boardId => dispatch(selectBoard(boardId)),
    getNotes: boardId => dispatch(getNotes(boardId))
  };
}

class App extends Component {
  constructor ({ board }) {
    super();
    this.board = board;
    this.state = {
      loaded: false
    };
  }

  async componentDidMount () {
    const boardID = this.props.match.params.id;
    if (boardID) {
      await switchBoard(boardID);
    } else {
      await switchBoard(Poplet.boards[0].id);
    }

    await axios.get('/gateway/connect')
      .then(() => {
        ReactDOM.render(<Loader />, document.getElementById('loader'));
      })
      .catch(() => {
        ReactDOM.render(<CriticalFailure />, document.getElementById('root'));
      });
    const getCurrentUser = () => axios.get(`/users/me`).then(res => res.data);
    const token = localStorage.getItem('token');
    if (!token) {
      return ReactDOM.render(<Login />, document.getElementById('root'));
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

    this.setState({ loaded: true });
  }

  render () {
    const board = this.props.board;
    if (!this.state.loaded) {
      return null;
    }

    setTimeout(() => {
      window.M.AutoInit();
    }, 20);
    return (
      <div className='poplet-root'>
        <div className='modal-container'></div>
        <Board key={board.id} object={board} notes={[]} />
        <Chatroom chatroom={this.state.chatroom}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
