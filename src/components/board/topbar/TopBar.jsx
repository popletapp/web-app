import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Input, BoardCreationModal, BoardJoinModal, BoardInviteMembersModal, BoardSettingsModal, Flex, FlexChild, CircleButton, Tooltip } from './../../';
import { selectBoard, createBoard, updateView } from './../../../actions/board';
import { adjustZoomLevel } from './../../../actions/note';
import { toggleChatroomVisibility, toggleMemberListVisibility, createGroup, createModal, leaveBoard, createNote } from '../../../modules';
import { Link } from 'react-router-dom';
import MinimalisticButton from '../../general/button/MinimalisticButton';
import { permissions } from './../../../util';

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
    updateView: (board, view) => dispatch(updateView(board, view)),
    setZoomLevel: (board, amount) => dispatch(adjustZoomLevel(board, amount)),
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
                  <Flex direction='row' className='board-info-title dropdown-trigger' data-target='board-dropdown'>
                    <div className='board-info-title-text'>
                      {board.name}
                    </div>
                    <FlexChild align='right'>
                      <MinimalisticButton icon='keyboard_arrow_down' className='board-dropdown-arrow' />
                    </FlexChild>
                  </Flex>
                  <Flex direction='row' align='center' className='board-info-member-count'>
                    <FlexChild align='left'>
                      {board.members ? board.members.length : 0} member{board.members && board.members.length === 1 ? '' : 's'}
                    </FlexChild>       
                    <FlexChild className='member-list-btn' align='right'>
                      <Tooltip content='Member List'>
                        <div>
                          <MinimalisticButton icon='group' onClick={() => toggleMemberListVisibility()} className='board-dropdown-arrow' />
                        </div>
                      </Tooltip>
                    </FlexChild>
                  </Flex>
                </div>
              </div>
              
            </div>
            <ul id='board-dropdown' className='dropdown-content'>
              <div className='board-selection'>
                <li>
                  <Avatar url={board.avatar} alt={board.name} size={32} /><p>{board.name}</p>
                </li>
              </div>
              <li className="divider" tabIndex="-1"></li>
              <div className='board-selection selection-option'>
                {permissions.has(['MODERATOR', 'INVITE_MEMBERS']) && <li className='large-invite-members-btn' onClick={() => createModal(<BoardInviteMembersModal boardID={board.id} />)}>
                  <i className='material-icons' style={{ width: '24px' }}>add_friend</i><p>Invite Members</p>
                </li>}
                {permissions.has('MANAGE_BOARD') && <li onClick={() => createModal(<BoardSettingsModal />)}><i className='material-icons'>settings</i><p>Settings</p></li>}
                <li><i className='material-icons'>notifications_active</i><p>Notification Settings</p></li>
                
                <li onClick={() => leaveBoard(board.id)} className='leave-board'><i className='material-icons'>subdirectory_arrow_right</i><p>Leave Board</p></li>
              </div>
            </ul>
          </div>

          <div className='options-top-section-left'>
            <Flex wrap={true} className='toolbar-container'>
              <FlexChild onClick={() => createNote(board.id, { title: 'Title', content: 'Content' })} className='toolbar-option' direction='row' align='center'>
                <Button disabled={!permissions.has('MANAGE_NOTES')} color='purple lighten-2' icon='note_add' className='toolbar-btn' />
                <p>New Note</p>
              </FlexChild>

              <FlexChild onClick={() => createGroup(board.id, { name: 'Group' })} className='toolbar-option' direction='row' align='center'>
                <Button disabled={!permissions.has('MANAGE_NOTES')} color='purple lighten-1' icon='library_add' className='toolbar-btn' />
                <p>New Group</p>
              </FlexChild>

              <FlexChild onClick={() => this.props.updateView(board.id, listView ? 0 : 1)} className='toolbar-option' direction='row' align='center'>
                <Button
                  icon={!listView ? 'format_list_bulleted' : 'dashboard'}
                  color='pink lighten-2'
                  className='toolbar-btn' />
                <p>{listView ? 'Note View' : 'List View'}</p>
              </FlexChild>

              <FlexChild onClick={() => toggleChatroomVisibility()} className='toolbar-option' direction='row' align='center'>
                <Button icon='chat_bubble' color='pink lighten-1' className='toolbar-btn' />
                <p>Chatroom</p>
              </FlexChild>

              <FlexChild className='zoom-container'>
                <header>Zoom Options</header>
                <div className='zoom-options'>
                  {/* Zoom starts at 1 and increases by 0.5 each time and decreases by 0.25 */}
                  <Tooltip content='Zoom In'>
                    <div onClick={() => this.props.setZoomLevel(board.id, 0.25)} className='zoom-options-plus'>+</div>
                  </Tooltip>
                  <Tooltip content='Zoom Out'>
                    <div onClick={() => this.props.setZoomLevel(board.id, -0.25)} className='zoom-options-minus'>-</div>
                  </Tooltip>
                </div>
              </FlexChild>
            </Flex>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
