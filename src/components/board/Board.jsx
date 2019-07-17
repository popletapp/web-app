import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateNote } from './../../modules';
import { beginCreateNote } from './../../actions/note';
import { TopBar, Note } from './../';
import './Board.scss'

function mapStateToProps (state) {
    return {
        notes: state.notes,
        listView: !!state.viewByBoard[state.selectedBoard]
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
        await updateNote(this.props.object.id, note);        
    }

    render () {
        const notes = this.props.notes.items;
        const { object: board, listView } = this.props;
        console.log('Render board', notes, board)
        return (
            <div className='board'>
                <TopBar board={board} />
                <div onDragOver={(event) => this.onDragOver(event)}
                onDrop={(event) => this.onDrop(event)}
                className={`note-container${!listView ? ' drag-container droppable' : ' list-view'}`}>
                    {notes && notes.map(note => <Note key={note.id} boardId={board.id} note={note} listView={listView} />)}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);