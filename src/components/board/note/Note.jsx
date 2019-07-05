import React, { Component } from 'react';
import Markdown from 'react-markdown';
import { connect } from 'react-redux';
import { Button } from './../../';
import axios from 'axios';
import './Note.scss';
import { updateNote, createNote } from './../../../actions/note';

function mapDispatchToProps (dispatch) {
    return {
        updateNote: note => dispatch(updateNote(note)),
        createNote: note => dispatch(createNote(note))
    };
}

class Note extends Component {
    constructor ({ note, boardId, exists }) {
        super();
        this.note = note;
        this.boardId = boardId;
        // Whether or not this note is currently being created
        this.exists = exists || true;
        this.state = {
            note: this.note || this.props.note,
            editing: false
        };
    }

    onDragStart (event) {
        event.offset = { x: event.pageX - event.target.offsetLeft, y: event.pageY - event.target.offsetTop }
    	event.obj = this;
    }

    onFocus (event, type) {
        this.setState({
            editing: true
        })
    }

    async onBlur (event, type) {
        const { exists } = this.props;
        const { note } = this.state;
        const content = event.target.textContent.replace('<br>', '\\n');
        const newNote = { ...note, [type]: content };

        this.setState({
            note: newNote,
            editing: false
        })
        if (note[type] !== newNote[type]) {
            if (exists) {
                this.props.updateNote(newNote);
                await axios.post(`/notes/update/${note.id}`, newNote);
            } else {
                // Send to API
                this.props.createNote(newNote);
                await axios.post('/notes/create', { ...note, boardID: this.boardId });
            }
        }
    }
    
    componentDidMount () {
        const note = this.state.note;
        if (note.options && note.options.position) {
            this.setState({
                style: {
                    top: note.options ? note.options.position.y : 0,
                    left: note.options ? note.options.position.x : 0
                }
            })
        }
    }

    render () {
        const { note, editing } = this.state;
        if (!note.options) {
            note.options = {};
        }

        return (
            <div draggable={true} onDragStart={(event) => this.onDragStart(event)}
                className={`draggable note ${note.options.color || 'blue-grey'} darken-1`} 
                style={{ ...(this.state.style || {}), width: 'fit-content' }}>
                <div className='note-content white-text'>
                    <div contenteditable='true' onBlur={(e) => this.onBlur(e, 'title')} className='note-header'>
                        {note.title > 64 ? `${note.title.slice(0, 61)}...` : note.title}
                    </div>
                    <div contenteditable='true' onFocus={(e) => this.onFocus(e, 'content')} onBlur={(e) => this.onBlur(e, 'content')} className='note-body'>
                        {editing ? note.content : <Markdown source={note.content > 255 ? `${note.content.slice(0, 252)}...` : note.content} />}
                    </div>
                </div>
                <div className='note-footer'>
                    <Button text='View' color='red'></Button>
                    <h6 className='note-footer-label'>Last modified on <strong>{new Date(note.lastModified).toDateString()}</strong></h6>
                </div>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Note);