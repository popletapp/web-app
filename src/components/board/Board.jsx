import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TopBar, NoteContainer, BoardNavBar, Flex, FlexChild, MembersList } from './../';
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
        <Flex direction='row' shrink={1} grow={1}>
          <FlexChild grow={0} shrink={1} style={{ height: '100%' }}>
            <MembersList />
          </FlexChild>
          <FlexChild className='notes' grow={1} shrink={1}>
            <NoteContainer />
          </FlexChild>
        </Flex>
      </div>
    );
  }
}

export default
connect(mapStateToProps, null)(Board);
