import React, { Component } from 'react';
import Markdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import { connect } from 'react-redux';
import { Button, NoteDetailedView } from './../../';
import './Note.scss';
import { endCreateNote } from './../../../actions/note';
import { Modal, updateNote, createNote } from './../../../modules';


function mapStateToProps (state, props) {
    return {
        note: (state.notesByBoard[props.boardId] || {}).items ? state.notesByBoard[props.boardId].items.find(note => note.id === props.note.id) : props.note
    }
}

function mapDispatchToProps (dispatch) {
    return {
        endCreateNote: () => dispatch(endCreateNote())
    }
}

class Note extends Component {
    constructor ({ note, boardId }) {
        super();
        this.note = note;
        this.boardId = boardId;

        // Whether or not this note is currently being created
        this.state = {
            selected: false,
            editing: false,
            exists: this.note ? !!this.note.id : false
        };
        this.listener = (event) => {
            let el = event.target;
            if (el.matches('.btn')) return note;
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
        this.setState({ editing: true });
    }

    view (event) {
        event.preventDefault();
        new Modal(<NoteDetailedView note={this.props.note} boardId={this.boardId} />).create()
    }

    onClick () {
        this.setState({ selected: true });
    }

    unselect () {
        this.setState({ selected: false });
    }

    async onBlur (event, type) {
        const { note } = this.props;
        const { exists } = this.state;

        const content = event.target.textContent.replace('<br>', '\\n');
        const newNote = { ...note, [type]: content };

        this.setState({
            editing: false,
            saving: true
        })
        if (note[type] !== newNote[type]) {
            if (exists) {
                await updateNote(this.boardId, newNote);
            } else {
                this.setState({ 
                    unmounted: true, 
                    exists: true 
                });
                await createNote(this.boardId, newNote);
                this.props.endCreateNote();
            }
        }
        this.setState({ saving: false });
    }
    
    componentDidMount () {
        const { note } = this.props;
        if (note && note.options && note.options.position) {
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
        const { note, listView } = this.props;
        const { editing, selected, style } = this.state;
        if (!note || this.state.unmounted) {
            return null;
        }
        if (!note.options) {
            note.options = {};
        }

        return (
            <div draggable={selected}
                onClick={(event) => this.onClick(event)}
                onDragStart={(event) => this.onDragStart(event)}
                className={`note ${!note.options.color ? 'blue-grey ' : ''}darken-1${selected ? ' selected draggable' : ''}`} 
                style={{ ...(!listView ? style : {}), width: 'fit-content', backgroundColor: note.options.color || ''}}>
                {selected && <div className='selected-checkmark'><i className='material-icons'>checkmark</i></div>}
                <div className='note-content white-text'>
                    <div contentEditable={selected ? 'true' : 'false'}
                    suppressContentEditableWarning={true} 
                    onFocus={(e) => this.onFocus(e, 'title')} 
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
                    <Button onClick={(e) => this.view(e)} className='note-btn-view'><i className='material-icons' style={{ fontSize: '13px' }}>description</i> View</Button>
                    <div className='vertical-rule' style={{ height: 24 }}></div>
                    {/* TODO: Implement comments */}
                    {true && <div className='note-footer-comments-container'>
                        <i className='material-icons' style={{ fontSize: '14px' }}>comment</i> 0
                    </div>}
                    <div className='note-footer-settings-container'>
                        <i className='material-icons' style={{ fontSize: '22px' }}>settings</i>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Note);