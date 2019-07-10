import React, { Component } from 'react';
import Markdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

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
            selected: false,
            editing: false
        };
        this.listener = (event) => {
            let el = event.target;
            do {
                if (el.matches('.note')) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);

            if (el && el.classList && el.classList.contains('note')) {
                this.onClick();
            } else {
                this.unselect();
            }
            
        }
        document.addEventListener('click', this.listener, false);
    }

    onDragStart (event) {
        event.offset = { x: event.pageX - event.target.offsetLeft, y: event.pageY - event.target.offsetTop }
    	event.obj = this;
    }

    onFocus () {
        this.setState({
            editing: true
        })
    }

    onClick (event) {
        this.setState({ selected: true })
    }

    unselect () {
        this.setState({ selected: false });
    }

    async onBlur (event, type) {
        const { note, exists } = this.props;

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
        const { note } = this.props;
        if (note.options && note.options.position) {
            this.setState({
                style: {
                    top: note.options ? note.options.position.y : 0,
                    left: note.options ? note.options.position.x : 0
                }
            })
        }
    }

    highlight () {
        const block = document.querySelector('pre:not(.hljs)');
        block && hljs.highlightBlock(block);
    }

    componentDidUpdate () {
        this.highlight();
    }

    render () {
        const { note } = this.props;
        const { editing, selected } = this.state;
        if (!note.options) {
            note.options = {};
        }

        return (
            <div draggable={true}
                onClick={(event) => this.onClick(event)}
                onDragStart={(event) => this.onDragStart(event)}
                className={`draggable note ${note.options.color || 'blue-grey'} darken-1${selected ? ' selected' : ''}`} 
                style={{ ...(this.state.style || {}), width: 'fit-content' }}>
                {selected && <div className='selected-checkmark'><i className='material-icons'>checkmark</i></div>}
                <div className='note-content white-text'>
                    <div contentEditable={selected ? 'true' : 'false'}
                    suppressContentEditableWarning={true} 
                    onBlur={(e) => this.onBlur(e, 'title')} 
                    className='note-header'>
                        {note.title > 64 ? `${note.title.slice(0, 61)}...` : note.title}
                    </div>
                    <div contentEditable={selected ? 'true' : 'false'} 
                    suppressContentEditableWarning={true} 
                    onFocus={(e) => this.onFocus(e, 'content')} 
                    onBlur={(e) => this.onBlur(e, 'content')} 
                    className='note-body'>
                        {editing ? note.content : <Markdown source={note.content > 255 ? `${note.content.slice(0, 252)}...` : note.content} />}
                    </div>
                </div>
                <div className='note-footer'>
                    <Button text='View' color='red'></Button>
                    <h6 className='note-footer-label'>Last modified on <strong>{new Date(note.modifiedAt).toDateString()}</strong></h6>
                    <h6 className='note-footer-label'>by <strong>{note.modifiedBy && note.modifiedBy.username}</strong></h6>
                </div>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Note);