import React, { Component } from 'react';
import { Board, Chatroom } from '../..';
import Poplet from './../../../'
import { connect } from "react-redux";
import { selectBoard } from './../../../actions/board';
import { getNotes } from './../../../actions/note';
import { switchBoard } from './../../../modules';

function mapStateToProps (state) {
    return {
        board: state.boards[state.selectedBoard],
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
        await switchBoard(id);
        this.setState({
            loaded: true
        });
    }

    async componentDidMount () {
        await this.changeBoard(Poplet.boards[0].id);
    }

    render () {
        const board = this.props.board || {};
        if (!this.state.loaded) {
            return null;
        }

        setTimeout(() => {
            window.M.AutoInit();
        }, 20)
        return (
            <div className='poplet-root'>
                <div className='modal-container'></div>
                <Board key={board.id} object={board} notes={[]} />
                <Chatroom chatroom={this.state.chatroom}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);