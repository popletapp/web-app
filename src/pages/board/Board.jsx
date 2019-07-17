import React, { Component } from 'react';
import Poplet from './../../';
import { connect } from 'react-redux';
import { selectBoard } from './../../actions/board';
import { getNotes } from './../../actions/note';
import { switchBoard } from './../../modules';

import { Board, Chatroom } from './../../components';

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
