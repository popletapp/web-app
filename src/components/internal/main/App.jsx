import React, { Component } from 'react';
import { Board, Chatroom } from '../..';
import axios from 'axios';
import Poplet from './../../../'
import { connect } from "react-redux";
import { selectBoard } from './../../../actions/board';
import { getNotes } from './../../../actions/note';
import { switchBoard } from './../../../modules';

function mapStateToProps (state) {
    return {
        board: state.selectedBoard,
        notes: state.notes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        selectBoard: boardId => dispatch(selectBoard(boardId)),
        getNotes: boardId => dispatch(getNotes(boardId))
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

    async changeBoard (id) {
        let { board, notes } = await switchBoard(id)
        this.board = board;
        console.log('Switching to', board.name, board.id)
        if ('notes' in notes) {
            notes = notes.notes;
        }
        const chatroom = board.chatrooms.length ? await axios.get(`/chatroom/${board.chatrooms[0]}`).then(res => res.data) : null;
        this.setState({
            notes,
            chatroom,
            loaded: true
        });
    }

    async componentDidMount () {
        await this.changeBoard(Poplet.boards.selected.id);
    }

    async componentDidUpdate (prevProps, prevState) {
        // If the component updated (not including the load state changing)
        if (prevProps.board !== this.props.board && (this.state.loaded && !prevState.loaded)) {
            await this.changeBoard(this.props.board);
        }
    }

    render () {
        const board = this.board || {};
        if (!this.state.loaded) {
            return null;
        }
        console.log(board)
        setTimeout(() => {
            window.M.AutoInit();
        }, 20)
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