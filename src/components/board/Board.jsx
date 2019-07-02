import React, { Component } from 'react';
import { TopBar, Note } from './../';

class Board extends Component {
    constructor ({ id, object, notes }) {
        super();
        this.id = id;
        this.object = object;
        this.notes = notes;
    }

    onDragOver (event) {
	    event.preventDefault();
	}

	onDrop (event) {
        const note = event.obj;
	    note.setState({
            style: {
                top: event.clientY - event.offset.y,
                left: event.clientX - event.offset.x
            }
        });
	}

    render (args) {
        return (
            <div className='board'>
                <TopBar board={this.object} />
                <div onDragOver={(event) => this.onDragOver(event)}
                onDrop={(event) => this.onDrop(event)}
                className='note-container drag-container droppable'>
                    {this.notes && this.notes.map(note => <Note key={note.id} note={note} />)}
                </div>
            </div>
        )
    }
}

export default Board;