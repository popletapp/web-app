import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Input, RoundedButton, BoardCreationModal, BoardJoinModal, BoardInviteMembersModal } from './../../';
import { selectBoard, createBoard, updateView } from './../../../actions/board';
import { beginCreateNote } from './../../../actions/note';
import { Modal, switchBoard, toggleChatroomVisibility, createGroup } from '../../../modules';
import Poplet from '../../..';

function mapStateToProps (state) {
  return {
    board: state.boards[state.selectedBoard],
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    selectBoard: boardId => dispatch(selectBoard(boardId)),
    createBoard: board => dispatch(createBoard(board)),
    beginCreateNote: () => dispatch(beginCreateNote()),
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
    const { board, listView } = this.props;
    return (
      <div className='top-section'>
        <div className='board-top-section'>
          <div className='board-information col s6'>
            <div className='dropdown-trigger board-details' data-target='board-dropdown'>
              <Avatar url={board.avatar} alt={board.name} size={32} />
              <div className='board-info-text'>
                <div className='board-info-title'>
                  {board.name}
                </div>
                <div className='board-info-member-count'>
                  {board.members ? board.members.length : 0} member{board.members && board.members.length === 1 ? '' : 's'}
                </div>
              </div>
              <Button onClick={() => new Modal(<BoardInviteMembersModal boardID={board.id} />).create()} color='indigo lighten-2' className='large-invite-members-btn'>Invite Members</Button>
            </div>
            <ul id='board-dropdown' className='dropdown-content'>
              <div className='board-selection'>
                <li>
                  <Avatar url={board.avatar} alt={board.name} size={32} /><p>{board.name}</p>
                </li>
              </div>
              <li className="divider" tabIndex="-1"></li>
              <div className='board-selection selection-option'>
                <li><i className='material-icons'>settings</i><p>Settings</p></li>
                <li><i className='material-icons'>notifications_active</i><p>Notification Settings</p></li>
              </div>
            </ul>

            <div className='user-details col'>
              <Avatar url={Poplet.user.avatar} alt={Poplet.user.username} size={32} />
              <div className='user-info-text'>
                <div className='user-info-title'>
                  {Poplet.user.username}
                </div>
                <div className='user-info-misc-info'>
                  {Poplet.user.id}
                </div>
              </div>

              <Button color='red' className='board-selector-btn dropdown-trigger' data-target='board-selector'>Boards</Button>
              <ul id='board-selector' className='dropdown-content'>
                <div className='board-selection selection-option'>
                  <li className='board-selection-join' onClick={() => new Modal(<BoardJoinModal />).create()}>
                    <i className='material-icons'>people</i>
                    <p>Join a Board</p>
                  </li>
                  <li className='board-selection-create' onClick={() => new Modal(<BoardCreationModal />).create()}>
                    <i className='material-icons'>add_circle</i>
                    <p>Create a new Board</p>
                  </li>
                </div>
                <li className="divider" tabIndex="-1"></li>
                {Poplet.boards.map((item, i) => item.id !== board.id
                  ? (<div key={i} className='board-selection' onClick={async () => switchBoard(item.id)}>
                    <li><Avatar url={item.avatar} alt={item.name} size={32} /><p>{item.name}</p></li>
                  </div>)
                  : '')}
              </ul>
            </div>
          </div>

          <div style={{ height: 90 }} className='vertical-rule'></div>
          <div className='options-top-section-left'>
            <div className='searchbar-container'>
              <Input icon='search' />
            </div>
            <div className='toolbar-container'>
              <RoundedButton label='New Note' color='red' onClick={() => this.props.beginCreateNote()} icon='add' className='top-bar-floating-btn' />
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
