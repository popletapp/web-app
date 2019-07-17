import React from 'react';
import Modal from './Modal';
import { ColorPicker } from './../../';
import { updateNote } from './../../../modules';
import Markdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import './Modal.scss';

class NoteDetailedView extends Modal {
    constructor ({ note, boardId }) {
        super();
        this.note = note;
        this.boardId = boardId;
        this.state = {
            color: note.options.color || '#546e7a'
        }
    }

    async handleColorChange (color) {
        const { note } = this.props;
        // this.setState({ color: color.hex });
        const newNote = note;
        newNote.options.color = color.hex;
        await updateNote(this.boardId, newNote)
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
        return (
            <div className='modal poplet-modal note-detailed-view fadeInZoomOut' style={{ display: 'block' }}>
                <div className='modal-content'>
                    <div className='modal-note-content-text'>
                        <div className='modal-header'>
                            {note.title}
                        </div>
                        <div className='modal-body'>
                            <Markdown source={note.content} />
                        </div>
                    </div>
                    <div className='vertical-rule' style={{ height: '460px', borderColor: '#616161', margin: '16px' }} />
                    <div className='modal-note-settings'>
                        <div className='modal-note-settings-header'>Color</div>
                        <ColorPicker
                            color={this.state.color}
                            onChangeComplete={(color) => this.handleColorChange(color)}
                        />

                        <div className='modal-note-settings-header'>Assignees</div>
                        N/A

                        <div className='modal-note-settings-header'>Labels</div>
                        No labels

                        <div className='modal-note-settings-header'>Modified</div>
                        {new Date(note.modifiedAt).toLocaleDateString()} at {new Date(note.modifiedAt).toLocaleTimeString()}
                        <br />
                        by {note.modifiedBy.username}
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteDetailedView;