import React, { Component } from 'react';
import { Avatar, RoundedButton } from './../';
import TimeParser from './../../util/parseTime';
import './Chatroom.scss';

class Comment extends Component {
    constructor ({ author }) {
        super();
        this.author = author;
    }

    render () {
        const comment = this;
        return (
            <div className='chatroom-comment-container'>
                <div style={{ float: 'left' }} className='chatroom-comment-author'>
                    <Avatar style={{ float: 'left' }} url={comment.author.avatar} />
                    <p className='chatroom-comment-author-username'>{comment.author.username}</p>
                </div>
                <br />
                <div className='chatroom-comment-content'>
                    <p>{comment.props.children}</p>
                </div>
            </div>     
        );
    }
}

class Chatroom extends Component {
    constructor ({ chatroom }) {
        super();
        this.chatroom = chatroom;
    }

    render () {
        const chatroom = this.chatroom;
        if (!chatroom) {
            return null;
        }
        return (
            <div className='chatroom-container row'>
                <div className='chatroom-root col'>
                    <div className='chatroom-header'>
                        <div className='chatroom-header-information'>
                            <div className='chatroom-title'>
                                {chatroom.name}
                            </div>
                            <div className='chatroom-last-active-label'>
                                {chatroom.lastMessage ? `Last message sent ${TimeParser.timeAgo(chatroom.lastMessage)}` : 'Not active'}
                            </div>
                        </div>
                        <div className='chatroom-header-btns'>
                            <RoundedButton icon='help' color='grey' small={true} />
                            <RoundedButton icon='close' color='red lighten-3' small={true} />
                        </div>
                    </div>

                    <div className='chatroom-body'>
                        {chatroom.messages && chatroom.messages.map(comment => <Comment key={comment.id} author={comment.author}>{comment.content}</Comment>)}
                    </div>

                    <div className='chatroom-textarea'>
                        <textarea placeholder='Enter text here...' className='materialize-textarea'></textarea>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chatroom;