import React, { Component } from 'react';
import { Board, Chatroom } from './';
import axios from 'axios';

class App extends Component {
    constructor ({ board }) {
        super();
        this.board = board;
        this.state = {};
    }

    async componentDidMount () {
        const notes = await axios.post(`/notes/multiple`, { ids: this.board.notes }).then(res => res.data);
        const chatroom = await axios.get(`/chatroom/${this.board.chatrooms[0]}`).then(res => res.data);
        this.setState({
            notes,
            chatroom,
            loaded: true
        })
    }

    render () {
        let board = this.board || {};
        if (!this.state.loaded) {
            return null;
        }
        return (
            <div className='poplet-root'>
                <Board id={board.id} object={board} notes={this.state.notes || []} />
                <Chatroom chatroom={this.state.chatroom}/>
            </div>
        )
    }
}

export default App;