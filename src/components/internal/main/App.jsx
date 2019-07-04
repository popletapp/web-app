import React, { Component } from 'react';
import { Board, Chatroom } from '../..';
import axios from 'axios';
import Poplet from './../../../'
import { connect } from "react-redux";
import { switchBoard } from './../../../actions/board';

function mapStateToProps (state) {
    return {
        board: state.board
    }
}

function mapDispatchToProps (dispatch) {
    return {
        switchBoard: board => dispatch(switchBoard(board))
    };
}

class App extends Component {
    constructor ({ board }) {
        super();
        this.board = board;
        this.state = {
            loaded: false
        };
    }

    componentWillMount () {
        this.props.switchBoard(Poplet.boards.selected)
        this.board = Poplet.boards.selected
    }

    async componentDidMount () {
        const board = this.board;
        const notes = await axios.post(`/notes/multiple`, { ids: board.notes }).then(res => res.data);
        const chatroom = await axios.get(`/chatroom/${board.chatrooms[0]}`).then(res => res.data);
        this.setState({
            notes,
            chatroom,
            loaded: true
        });
    }

    render () {
        console.log('Application re-rendered', this.props.board)
        let board = this.props.board || {};
        if (!this.state.loaded) {
            return null;
        }
        setTimeout(() => {
            window.M.AutoInit();
        }, 100)
        return (
            <div className='poplet-root'>
                <div className='modal-container'></div>
                <Board key={board.id} object={board} notes={this.state.notes || []} />
                <Chatroom chatroom={this.state.chatroom}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);