import React, { Component } from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import { ColorPicker, Editor, Scroller, Button, ConfirmModal, 
  MinimalisticButton, Tooltip, Flex, ListPopout, Modal as ModalComponent,
  LabelCreationModal, DatePickerPopout, CloseButton, RichTextbox, EditRevisionsModal } from './../../';
import { updateNote, saveNote, deleteNote, createModal } from './../../../modules';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import './Modal.scss';
import { permissions } from '../../../util';

function mapStateToProps (state, props) {
  return {
    note: state.notesByBoard[props.boardId][props.noteId],
    boardId: state.selectedBoard,
    board: state.boards[props.boardId]
  };
}

function mapStateToPropsLabelButton (state, props) {
  return {
    boardId: state.selectedBoard
  };
}

class AddLabelButton extends Component {
  click () {
    const { boardId } = this.props;
    createModal(<LabelCreationModal boardID={boardId} />)
  }

  render () {
    return (
      <div className='note-label-new' onClick={() => this.click()}>
        <div className='note-label-new-innerbtn'>+</div>
        New label
      </div>
    )
  }
}
const ConnectedAddLabelButton = connect(mapStateToPropsLabelButton, null)(AddLabelButton);

class NoteDetailedView extends Modal {
  constructor ({ noteId, boardId }) {
    super();
    this.noteId = noteId;
    this.boardId = boardId;
    this.state = {
      focused: false,
      color: null
    };
  }

  async handleColorChange (color) {
    const { note } = this.props;
    this.setState({ color: color.hex });
    const newNote = note;
    newNote.options.color = color.hex;
    await saveNote(this.boardId, newNote);
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

  onClick () {
    console.log('clicked')
    this.setState(oldState => {
      if (!oldState.focused) return {
        focused: true
      };
    });
  }

  onInput (event, type) {
    const { note } = this.props;
    const content = event.target.innerText;
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
  }

  async onBlur (event, type) {
    const { note } = this.props;

    const content = event.target.innerText;
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

  async saveDueDate (date) {
    const { note } = this.props;
    if (date) {
      date = date.valueOf()
    }
    const newNote = { ...note, dueDate: date };
    this.setState({ saving: true });
    if (note.dueDate !== newNote.dueDate) {
      await saveNote(this.boardId, newNote);
    }
    this.setState({ saving: false });
  }

  onDelete () {
    const { note, boardId } = this.props;
    const modal = {
      title: 'Delete Note',
      content: 'Are you sure you want to delete this note? This cannot be undone.'
    }
    createModal(<ConfirmModal onConfirm={() => deleteNote(boardId, note.id)} title={modal.title} content={modal.content} />)
  }

  async important (importance) {
    const { note } = this.props;
    const newNote = { ...note, importance };

    this.setState({ saving: true });
    if (note.importance !== newNote.importance) {
      await saveNote(this.boardId, newNote);
    }
    this.setState({ saving: false });
  }

  optionSelectedAssignees () {

  }

  async optionSelectedLabels (label) {
    const { note } = this.props;
    note.labels.push(label.id)
    const newNote = note;

    this.setState({ saving: true });
    await saveNote(this.boardId, newNote);
    this.setState({ saving: false });
  }

  async removeLabelFromNote (label) {
    const { note } = this.props;
    note.labels = note.labels.filter(l => l !== label.id);
    const newNote = note;

    this.setState({ saving: true });
    await saveNote(this.boardId, newNote);
    this.setState({ saving: false });
  }

  render () {
    const { note, board, boardId } = this.props;
    const { focused, color } = this.state;

    if (!note) return null;
    note.title = note.title || '';

    return (
      <div className='note-detailed-view' style={{ display: 'block' }}>
        <div className='modal-content'>
          <div className='modal-note-content-text'>
            <div className='modal-header'>
              <RichTextbox
                type='title'
                onFocus={(e) => this.onFocus(e, 'title')}
                onInput={(e) => this.onInput(e, 'title')}
                onBlur={(e) => this.onBlur(e, 'title')}
                onClick={(e) => this.onClick(e, 'title')}
                placeholder='Title'
                editable={focused}
                parseMarkdown={false}
                style={{ fontSize: '28px' }}
                className='note-header'>
                {focused ? note.title : (note.title.length > 128 ? `${note.title.slice(0, 125)}...` : note.title)}
              </RichTextbox>
            </div>

            <div className='modal-body'>
              <Scroller>
                <RichTextbox
                  type='content'
                  onFocus={(e) => this.onFocus(e, 'content')}
                  onInput={(e) => this.onInput(e, 'content')}
                  onBlur={(e) => this.onBlur(e, 'content')}
                  onClick={(e) => this.onClick(e, 'content')}
                  editable={focused}
                  doDecorate={focused}
                  parseMarkdown
                  placeholder='Content'
                  className='note-body'>
                  {note.content}
                </RichTextbox>
              </Scroller>
            </div>

            <div className='modal-note-comments'>
              <div onClick={() => 
                createModal(<ConfirmModal title={'Hey!'} confirmText={'Understandable'} cancelText={'😡'} content={'Sorry, but comments aren\'t available yet.'} />)} 
                className='modal-note-comments-view'>
                View Comments
              </div>
            </div>
          </div>
          <div className='vertical-rule' style={{ height: '460px', borderColor: '#2e2e2e', margin: '16px' }} />
          <Scroller className='modal-note-settings'>
            <Flex className='modal-note-settings-options' direction='row' align='center' justify='space-between'>
              <Tooltip content='Note Settings'>
                <MinimalisticButton className='modal-note-settings-options-btn modal-note-settings-options-btn-settings' icon='settings' onClick={() => this.onDelete()} />
              </Tooltip>
              <Tooltip content='Notification Settings'>
                <MinimalisticButton className='modal-note-settings-options-btn modal-note-settings-options-btn-notifications' icon='notifications' onClick={() => this.onDelete()} />
              </Tooltip>
              {permissions.has('MANAGE_NOTES') && <Tooltip content={note.importance ? 'Mark as Unimportant' : 'Mark as Important'}>
                <MinimalisticButton className='modal-note-settings-options-btn modal-note-settings-options-btn-important' 
                icon={note.importance ? 'low_priority' : 'priority_high'}
                onClick={() => this.important(note.importance ? 0 : 1)} />
              </Tooltip>}
              {permissions.has('MANAGE_NOTES') && <Tooltip content='Delete Note'>
                <MinimalisticButton className='modal-note-settings-options-btn modal-note-settings-options-btn-delete' icon='delete_forever' onClick={() => this.onDelete()} />
              </Tooltip>}
            </Flex>

            <div className='modal-note-settings-header'>Color</div>
            <ColorPicker
              color={color || note.options.color || '#546e7a'}
              onChangeComplete={(color) => this.handleColorChange(color)}
            />

            <div className='modal-note-settings-header'>Assignees</div>
            <ListPopout title='Assign Memebrs to this Note' onOptionSelected={(e) => this.optionSelectedAssignees(e)}>
              <div className='add-btn'>+</div>
            </ListPopout>

            <div className='modal-note-settings-header'>Labels</div>
            {note.labels.map((label, i) => {
              label = board.labels.find(l => l.id === label);
              return <Flex style={{ backgroundColor: label.color || '#757575' }} className='note-label' inline direction='row' justify='center' align='center' grow={0} key={i}>
                <div className='note-label-name'>{label.name}</div>
                <CloseButton className='rank-small-close' onClick={() => this.removeLabelFromNote(label)} />
              </Flex>
            })}
            <ListPopout title='Labels' exclude={board.labels.filter(l => note.labels.includes(l.id))} 
            elements={[ { custom: <ConnectedAddLabelButton /> }, ...board.labels ]} onOptionSelected={(e) => this.optionSelectedLabels(e)}>
              <div className='add-btn'>+</div>
            </ListPopout>

            <div className='modal-note-settings-header'>Modified</div>
            <div className='modal-note-settings-modified'>
              {new Date(note.modifiedAt).toLocaleDateString()} at {new Date(note.modifiedAt).toLocaleTimeString()}
              <br />
                by <strong>{note.modifiedBy.username}</strong>
              <br />
            </div>
            
            <div onClick={() => createModal(<EditRevisionsModal noteId={note.id} boardID={boardId} />)}
            className='modal-note-settings-editrevision'>View Edit Revisions</div>
            <div className='modal-note-settings-header'>Due Date</div>
            <DatePickerPopout initial={note.dueDate ? new Date(note.dueDate) : null} 
              onOptionSelected={(date) => this.setState({ date })} 
              onClose={() => this.saveDueDate(this.state.date)}>
              {!note.dueDate 
                ? <div className='add-btn'>+</div> 
                : <div className='modal-note-settings-duedate'>{new Date(note.dueDate).toLocaleDateString()} at {new Date(note.dueDate).toLocaleTimeString()}</div>}
            </DatePickerPopout>
            <br />
            <br />
          </Scroller>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(NoteDetailedView);
