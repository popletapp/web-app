import React from 'react';
import Poplet from './../../';
import { connect } from 'react-redux';
import { selectBoard } from './../../actions/board';
import { getNotes } from './../../actions/note';
import { switchBoard } from './../../modules';

import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Board, Chatroom, PopletBase, CustomDragLayer } from './../../components';

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

  async componentDidMount () {
    await this.init();
    const boardID = this.props.match.params.id || Poplet.boards[0].id;
    if (boardID) {
      await switchBoard(boardID);
    } else {
      this.props.history.push('/home');
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
        <DndProvider backend={HTML5Backend}>
          <Board key={board.id} object={board} notes={[]} />
          <CustomDragLayer />
          <Chatroom chatroom={this.state.chatroom}/>
        </DndProvider>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardComponent);
