import React from 'react';
import Poplet from './../../';
import { connect } from 'react-redux';
import { selectBoard } from './../../actions/board';
import { getNotes } from './../../actions/note';
import { switchBoard } from './../../modules';
import { Link } from 'react-router-dom';

import './Board.scss';

import { Board, Chatroom, PopletBase, CustomDragLayer, NavBar } from './../../components';

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

class BoardComponent extends PopletBase {
  constructor ({ board }) {
    super();
    this.board = board;
    this.state = {
      loaded: false
    };
  }

  async load () {
    const boardID = this.props.match.params.id || Poplet.boards[0].id;
    if (boardID) {
      await switchBoard(boardID);
    } else {
      this.props.history.push('/home');
    }
    this.setState({ loaded: true });
  }

  async componentDidMount () {
    await this.init();
    this.load();
  }

  async componentDidUpdate (oldProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      this.load();
    }
  }

  render () {
    const board = this.props.board;
    if (!this.state.loaded) {
      return null;
    }

    if (!board) {
      return (
        <div>
          <NavBar />
          <div className='board-invalid'>
            <h1>Board not found</h1>
            <h4>This board either doesn't exist, or you don't have access to see it.</h4>
            <Link to='/home'>Go back home</Link>
          </div>
        </div>
      );
    }

    setTimeout(() => {
      window.M.AutoInit();
    }, 20);
    return (
      <div className='poplet-root'>
        <div className='modal-container'></div>
        <Board key={board.id} id={board.id} />
        <CustomDragLayer />
        <Chatroom id={board.chatrooms[0]}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardComponent);
