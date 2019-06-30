import React from 'react';
import { Button, Avatar, SearchBar, RoundedButton, Modal } from './';

export default ({ board }) => {
    return (
    <div className='top-section row'>
        <div className='board-top-section-left row col s9'>
            <div className='board-information col s6'>
                <div className='board-details'>
                    <Avatar url={board.avatar} alt='Board Avatar' size={32} />
                    <div className='board-info-text'>
                        <div className='board-info-title'>
                            {board.name}
                        </div>
                        <div className='board-info-member-count'>
                            {board.members ? board.members.length : 0} member{board.members && board.members.length === 1 ? '' : 's'}
                        </div>
                    </div>
                </div>
                <Button className='large-invite-members-btn'>
                    Invite Members
                </Button>
                <div className='board-user-options-btns col'>
                    <Button text='Notification Settings' color='grey' className='board-user-options-btn board-notification-settings-btn' />
                    <Button text='Settings' color='grey' className='board-user-options-btn board-settings-config-btn' />
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