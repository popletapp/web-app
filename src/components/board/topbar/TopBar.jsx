import React from 'react';
import { Button, Avatar, SearchBar, RoundedButton } from './../../';
import { Modal } from '../../../modules';
import Poplet from '../../..';

export default ({ board }) => {
    return (
    <div className='top-section row'>
        <div className='board-top-section-left row col s9'>
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
                <ul id='board-dropdown' class='dropdown-content'>
                    <div className='board-selection'>
                        <li>
                            <Avatar url={board.avatar} alt={board.name} size={32} /><p>{board.name}</p>
                        </li>
                    </div>
                    <li class="divider" tabindex="-1"></li>
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

                    <Button text='Boards' color='red' className='board-selector-btn dropdown-trigger' data-target='board-selector' />
                    <ul id='board-selector' class='dropdown-content'>
                    <div className='board-selection selection-option'>
                        <li><i className='material-icons'>people</i><p>Join a Board</p></li>
                        <li onClick={
                        () => 
                            new Modal({ title: 'Create new Board', content: 
                                <div className='board-creation-modal'>
                                    <input onChange={function (e) { this.setState({ boardName: e.target.value }) }} className='materialize-input' placeholder='Board Name'></input>
                                </div>
                            })
                            .create()
                        }><i className='material-icons'>add_circle</i><p>Create a new Board</p></li>
                    </div>
                    <li class="divider" tabindex="-1"></li>
                    {Poplet.boards.map(item => item.id !== board.id ? 
                        (<div className='board-selection'>
                            <li><Avatar url={item.avatar} alt='Board Avatar' size={32} /><p>{item.name}</p></li>
                        </div>) 
                        : '')}
                </ul>
                </div>
            </div>
            
            <div style={{ height: 90 }} className='vertical-rule'></div>
            <div className='options-top-section-left'>
                <div className='row'>
                    <SearchBar />
                </div>
                <div className='row'>
                    <RoundedButton label='New Note' onClick={() => <Modal />} icon='add' className='top-bar-floating-btn' />
                    <RoundedButton label='Chatroom' icon='chat_bubble' color='green darken-1' className='top-bar-floating-btn' />
                    <RoundedButton label='List View' icon='format_list_bulleted' color='yellow darken-2' className='top-bar-floating-btn' />
                    <RoundedButton label='Help' icon='help' color='grey darken-1' className='top-bar-floating-btn' />
                </div>
            </div>
        </div>
    </div>
    )
}