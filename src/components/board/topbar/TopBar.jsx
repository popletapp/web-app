import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Avatar, Input, RoundedButton, BoardCreationModal } from './../../';
import { selectBoard, createBoard } from './../../../actions/board';
import { beginCreateNote } from './../../../actions/note';
import { Modal, getBoard, switchBoard } from '../../../modules';
import Poplet from '../../..';

function mapStateToProps (state) {
    return {
        board: state.boards[state.selectedBoard]
    };
}

function mapDispatchToProps (dispatch) {
    return {
        selectBoard: boardId => dispatch(selectBoard(boardId)),
        createBoard: board => dispatch(createBoard(board)),
        beginCreateNote: () => dispatch(beginCreateNote())
    };
}

class TopBar extends Component {
    constructor ({ board }) {
        super();
        this.board = board;
        this.state = {};
    }

    render () {
        const board = this.props.board;
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
                            <Button color='indigo lighten-2' className='large-invite-members-btn'>Invite Members</Button>
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
                                <div className='user-info-member-count'>
                                    {Poplet.user.id}
                                </div>
                            </div>
        
                            <Button color='red' className='board-selector-btn dropdown-trigger' data-target='board-selector'>Boards</Button>
                            <ul id='board-selector' className='dropdown-content'>
                            <div className='board-selection selection-option'>
                                <li>
                                    <i className='material-icons'>people</i>
                                    <p>Join a Board</p>
                                </li>
                                <li onClick={() => new Modal(<BoardCreationModal />).create()}>
                                    <i className='material-icons'>add_circle</i>
                                    <p>Create a new Board</p>
                                </li>
                            </div>
                            <li className="divider" tabIndex="-1"></li>
                            {Poplet.boards.map((item, i) => item.id !== board.id ? 
                                (<div key={i} className='board-selection' onClick={() => switchBoard(item.id)}>
                                    <li><Avatar url={item.avatar} alt='Board Avatar' size={32} /><p>{item.name}</p></li>
                                </div>) 
                                : '')}
                        </ul>
                        </div>
                    </div>
                    
                    <div style={{ height: 90 }} className='vertical-rule'></div>
                    <div className='options-top-section-left'>
                        <div className='searchbar-container'>
                            <Input />
                        </div>
                        <div className='toolbar-container'>
                            <RoundedButton label='New Note' onClick={() => this.props.beginCreateNote()} icon='add' className='top-bar-floating-btn' />
                            <RoundedButton label='Chatroom' icon='chat_bubble' color='green' className='top-bar-floating-btn' />
                            <RoundedButton label='List View' icon='format_list_bulleted' color='yellow darken-2' className='top-bar-floating-btn' />
                            <RoundedButton label='Help' icon='help' color='grey' className='top-bar-floating-btn' />
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);