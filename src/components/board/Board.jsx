import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { beginCreateNote, updateNote } from './../../actions/note';
import { TopBar, Note } from './../';
import './Board.scss'

function mapStateToProps (state) {
    return {
        notes: state.notes
    };
}

function mapDispatchToProps (dispatch) {
    return {
        beginCreateNote: () => dispatch(beginCreateNote()),
        updateNote: note => dispatch(updateNote(note))
    };
}

class Board extends Component {
    constructor ({ object, notes }) {
        super();
        this.object = object;
        this.notes = notes;
    }

    onDragOver (event) {
	    event.preventDefault();
	}

	async onDrop (event) {
        const component = event.obj;
        const note = event.obj.props.note;

        const position = {
            y: event.clientY - event.offset.y,
            x: event.clientX - event.offset.x
        };
	    component.setState({
            style: {
                top: event.clientY - event.offset.y,
                left: event.clientX - event.offset.x
            }
        });
        note.options = note.options || {};
        note.options.position = position;
        this.props.updateNote(note);
        await axios.post(`/notes/update/${note.id}`, note);
    }

    render () {
        console.log(this.props.notes)
        const notes = this.props.notes.items;
        const board = this.props.object;
        console.log('Render board', notes, board)
        return (
            <div className='board'>
                <TopBar board={board} />
                <div onDragOver={(event) => this.onDragOver(event)}
                onDrop={(event) => this.onDrop(event)}
                className='note-container drag-container droppable'>
                    {notes && notes.map(note => <Note key={note.id} boardId={board.id} exists={!!note.id} note={note} />)}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);