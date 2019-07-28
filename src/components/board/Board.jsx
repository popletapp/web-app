import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TopBar, NoteContainer, BoardNavBar } from './../';
import './Board.scss';

function mapStateToProps (state) {
  return {
    notes: state.notes,
    groups: state.groups,
    object: state.boards[state.selectedBoard],
    id: state.boards[state.selectedBoard].id,
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

class Board extends Component {
  constructor ({ object, notes }) {
    super();
    this.object = object;
    this.notes = notes;
  }

  render () {
    const { object: board } = this.props;
    return (
      <div className='board'>
        <BoardNavBar />
        <TopBar board={board} />
        <NoteContainer />
      </div>
    );
  }
}

export default
connect(mapStateToProps, null)(Board);
