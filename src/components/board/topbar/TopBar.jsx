import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Input, RoundedButton, BoardCreationModal, BoardJoinModal, BoardInviteMembersModal, BoardSettingsModal, Flex, FlexChild } from './../../';
import { selectBoard, createBoard, updateView } from './../../../actions/board';
import { beginCreateNote } from './../../../actions/note';
import { toggleChatroomVisibility, toggleMemberListVisibility, createGroup, createModal } from '../../../modules';
import { Link } from 'react-router-dom';

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard],
    boards: state.boards,
    listView: !!state.viewByBoard[state.selectedBoard],
    user: state.user
  };
}

function mapDispatchToProps (dispatch) {
  return {
    selectBoard: boardId => dispatch(selectBoard(boardId)),
    createBoard: board => dispatch(createBoard(board)),
    beginCreateNote: board => dispatch(beginCreateNote(board)),
    updateView: (board, view) => dispatch(updateView(board, view))
  };
}

class TopBar extends Component {
  constructor ({ board }) {
    super();
    this.board = board;
    this.state = {};
  }

  render () {
    const { board, listView, boards } = this.props;
    return (
      <div className='top-section'>
        <div className='board-top-section'>
          <div className='board-information'>
            <div className='user-details'>
              <ul id='board-selector' className='dropdown-content'>
                <div className='board-selection selection-option'>
                  <li className='board-selection-join' onClick={() => createModal(<BoardJoinModal />)}>
                    <i className='material-icons'>people</i>
                    <p>Join a Board</p>
                  </li>
                  <li className='board-selection-create' onClick={() => createModal(<BoardCreationModal />)}>
                    <i className='material-icons'>add_circle</i>
                    <p>Create a new Board</p>
                  </li>
                </div>
                <li className="divider" tabIndex="-1"></li>
                {Object.values(boards).map((item, i) => item.id !== board.id
                  ? (
                    <div key={i} direction='row' className='board-selection'>
                      <li>
                        <Link to={`/boards/${item.id}`}>
                          <Avatar url={item.avatar} alt={item.name} size={32} />
                          <p>{item.name}</p>
                        </Link>
                      </li>
                    </div>
                  )
                  : '')}
              </ul>
            </div>

            <div className='board-details'>
              <div className='board-info'>
                <Avatar url={board.avatar} alt={board.name} size={32} />
                <div className='board-info-text'>
                  <div className='board-info-title dropdown-trigger' data-target='board-dropdown'>
                    {board.name}
                    <i className='material-icons'>keyboard_arrow_down</i>
                  </div>
                  <Flex direction='row' align='center' className='board-info-member-count'>
                    <FlexChild align='left'>
                      {board.members ? board.members.length : 0} member{board.members && board.members.length === 1 ? '' : 's'}
                    </FlexChild>
                    <FlexChild className='member-list-btn' align='right'>
                      <Link onClick={() => toggleMemberListVisibility()}>
                      Member List
                      </Link>
                    </FlexChild>
                  </Flex>
                </div>
              </div>
              <Button onClick={() => createModal(<BoardInviteMembersModal boardID={board.id} />)} color='indigo lighten-2' className='large-invite-members-btn'>Invite Members</Button>
            </div>
            <ul id='board-dropdown' className='dropdown-content'>
              <div className='board-selection'>
                <li>
                  <Avatar url={board.avatar} alt={board.name} size={32} /><p>{board.name}</p>
                </li>
              </div>
              <li className="divider" tabIndex="-1"></li>
              <div className='board-selection selection-option'>
                <li onClick={() => createModal(<BoardSettingsModal />)}><i className='material-icons'>settings</i><p>Settings</p></li>
                <li><i className='material-icons'>notifications_active</i><p>Notification Settings</p></li>
              </div>
            </ul>
          </div>

          <div className='options-top-section-left'>
            <div className='searchbar-container'>
              <Input icon='search' />
            </div>
            <div className='toolbar-container'>
              <RoundedButton label='New Note' color='red' onClick={() => this.props.beginCreateNote(board.id)} icon='add' className='top-bar-floating-btn' />
              <RoundedButton label='New Group' color='orange' onClick={() => createGroup(board.id, { name: 'board' })} icon='add' className='top-bar-floating-btn' />

              <RoundedButton label={listView ? 'Note View' : 'List View'}
                onClick={() => this.props.updateView(board.id, listView ? 0 : 1)}
                icon={!listView ? 'format_list_bulleted' : 'dashboard'}
                color='yellow darken-2'
                className='top-bar-floating-btn' />
              <RoundedButton label='Chatroom' onClick={() => toggleChatroomVisibility()} icon='chat_bubble' color='green' className='top-bar-floating-btn' />

              <RoundedButton label='Help' icon='help' color='grey' className='top-bar-floating-btn' />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
