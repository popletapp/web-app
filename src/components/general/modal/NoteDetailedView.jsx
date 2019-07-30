import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import { ColorPicker, Editor, Scroller, Button } from './../../';
import { updateNote, saveNote, deleteNote } from './../../../modules';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import './Modal.scss';

function mapStateToProps (state, props) {
  return {
    note: state.notesByBoard[props.boardId][props.noteId],
    boardId: state.selectedBoard
  };
}

class NoteDetailedView extends Modal {
  constructor ({ noteId, boardId }) {
    super();
    this.noteId = noteId;
    this.boardId = boardId;
    this.state = {
      focused: false
    };
  }

  async handleColorChange (color) {
    const { note } = this.props;
    this.setState({ color: color.hex });
    const newNote = note;
    newNote.options.color = color.hex;
    await updateNote(this.boardId, newNote);
  }

  highlight () {
    const block = document.querySelector('pre:not(.hljs)');
    block && hljs.highlightBlock(block);
  }

  componentDidUpdate () {
    this.highlight();
  }

  onFocus () {
    this.setState({ focused: true });
  }

  onInput (event, type) {
    const { note } = this.props;
    const content = event.target.textContent.replace('<br>', '\\n');
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
  }

  async onBlur (event, type) {
    const { note } = this.props;

    const content = event.target.textContent.replace('<br>', '\\n');
    const newNote = { ...note, [type]: content };

    this.setState({
      focused: false,
      saving: true
    });
    if (note[type] !== newNote[type]) {
      await saveNote(this.boardId, newNote);
    }
    this.setState({ saving: false });
  }

  render () {
    const { note, boardId } = this.props;
    const { focused } = this.state;

    return (
      <div className='note-detailed-view' style={{ display: 'block' }}>
        <div className='modal-content'>
          <div className='modal-note-content-text'>
            <div className='modal-header'>
              <Editor
                type='title'
                editing={true}
                onFocus={(e) => this.onFocus(e, 'title')}
                onInput={(e) => this.onInput(e, 'title')}
                onBlur={(e) => this.onBlur(e, 'title')}
                className='note-header'>
                {focused ? note.title : (note.title > 128 ? `${note.title.slice(0, 125)}...` : note.title)}
              </Editor>

            </div>
            <div className='modal-body'>
              <Scroller>
                <Editor
                  type='content'
                  editing={true}
                  onFocus={(e) => this.onFocus(e, 'content')}
                  onInput={(e) => this.onInput(e, 'content')}
                  onBlur={(e) => this.onBlur(e, 'content')}
                  parseMarkdown={!focused}
                  className='note-body'>
                  {note.content}
                </Editor>
              </Scroller>
            </div>
          </div>
          <div className='vertical-rule' style={{ height: '460px', borderColor: '#616161', margin: '16px' }} />
          <div className='modal-note-settings'>
            <div className='modal-note-settings-header'>Color</div>
            <ColorPicker
              color={note.options.color || '#546e7a'}
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

            <br />
            <Button color='red' onClick={() => deleteNote(boardId, note.id)}>Delete Note</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(NoteDetailedView);
