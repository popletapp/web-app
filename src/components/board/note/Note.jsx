import React, { Component } from 'react';
import { Button } from './../../';

class Note extends Component {
    constructor ({ note }) {
        super();
        this.note = note;
        this.state = {};
    }

    onDragStart (event) {
        console.log('Started dragging ', this);
        event.offset = { x: event.pageX - event.target.offsetLeft, y: event.pageY - event.target.offsetTop }
    	event.obj = this;
    }

    render (args) {
        const note = this.note;
        if (!note.options) {
            note.options = {};
        }
        return (
            <div draggable={true} onDragStart={(event) => this.onDragStart(event)}
                className={`card draggable note ${note.options.color || 'blue-grey'} darken-1`} style={{ ...(this.state.style || {}), width: 'fit-content' }}>
                <div className='card-content white-text'>
                    <span className='card-title note-header'>{note.title > 64 ? `${note.title.slice(0, 61)}...` : note.title}</span>
                    <p className='note-body'>{note.content > 255 ? `${note.content.slice(0, 252)}...` : note.content}</p>
                </div>
                <div className='card-action note-footer'>
                    <Button text='View' color='red'></Button>
                    <h6 className='note-footer-label'>Last modified on <strong>{new Date(note.lastModified).toDateString()}</strong></h6>
                </div>
            </div>
        )
    }
}

export default Note;