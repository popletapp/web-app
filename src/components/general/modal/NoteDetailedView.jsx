import React, { Component } from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';
import { ColorPicker, Scroller, Button, ConfirmModal, Avatar,
  MinimalisticButton, Tooltip, Flex, FlexChild, ListPopout, Modal as ModalComponent,
  LabelCreationModal, DatePickerPopout, CloseButton, Editor, EditRevisionsModal } from './../../';
import { updateNote, saveNote, deleteNote, createModal, getComments, createComment } from './../../../modules';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import './Modal.scss';
import { permissions, joinClasses } from '../../../util';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state, props) {
  return {
    note: props.note || state.notesByBoard[props.boardId][props.noteId],
    boardId: state.selectedBoard,
    board: state.boards[props.boardId],
    user: state.user
  };
}

function mapStateToPropsLabelButton (state, props) {
  return {
    boardId: state.selectedBoard
  };
}

class NoteComment extends Component {
  render () {
    const { comment } = this.props;
    const user = comment.author;
    return (
      <Flex className='modal-note-comments-comment' direction='row'>
        <Avatar className='modal-note-comments-comment-avatar' id={user.id} url={user.avatar} alt={user.username}></Avatar>
        <FlexChild>
          <div className='modal-note-comments-comment-author'>{user.username}</div>
          <div className='modal-note-comments-comment-content'>{comment.content}</div>
        </FlexChild>
      </Flex>
    );
  }
}

class AddLabelButton extends Component {
  click () {
    const { boardId } = this.props;
    createModal(<LabelCreationModal boardID={boardId} />)
  }

  render () {
    const { t } = this.props;
    return (
      <div className='note-label-new' onClick={() => this.click()}>
        <div className='note-label-new-innerbtn'>+</div>
        {t("LABEL_NEW_LABEL")}
      </div>
    )
  }
}
const ConnectedAddLabelButton = withTranslation()(connect(mapStateToPropsLabelButton, null)(AddLabelButton));

class NoteDetailedView extends Modal {
  constructor ({ noteId, boardId }) {
    super();
    this.noteId = noteId;
    this.boardId = boardId;
    this.state = {
      focused: false,
      color: null,
      showingComments: false,
      commentTextValue: '',
      comments: []
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

  async componentDidMount () {
    const { boardId, note } = this.props;
    this.setState({
      comments: await getComments(boardId, note.id)
    })
  }

  componentDidUpdate () {
    this.highlight();
  }

  onFocus () {
    this.setState({ focused: true });
  }

  onClick () {
    this.setState(oldState => {
      if (!oldState.focused) return {
        focused: true
      };
    });
  }

  onValueChanged (value, type) {
    const { note } = this.props;
    const content = value;
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
  }

  async onBlur (value, type) {
    const { note } = this.props;

    const content = value;
    const newNote = { ...note, [type]: content };

    this.setState({
      focused: false,
      saving: true
    });
    await saveNote(this.boardId, newNote);
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
    const { t } = this.props;
    const { note, boardId } = this.props;
    const modal = {
      title: t("MODAL_DELETE_NOTE_TITLE"),
      content: t("MODAL_DELETE_NOTE_BODY_LINE_1")
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

  handleCommentTextareaChange (event) {
    event.stopPropagation();
    this.setState({ commentTextValue: event.target.value });
  }

  handleCommentTextareaInput (event) {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      this.createComment();
      event.target.value = '';
    }
  }

  textareaOptionsClicked (option) {
    const { note, boardId, user } = this.props;
    const { commentTextValue } = this.state;

    switch (option) {
      case 'send': {
        this.createNoteComment(boardId, note, { author: user, content: commentTextValue, timestamp: Date.now() })
      }
    }
  }

  async createNoteComment (boardID, note, comment) {
    return await createComment(boardID, note, comment);
  }

  render () {
    const { note, board, boardId, t } = this.props;
    const { focused, color, showingComments, commentTextValue, comments } = this.state;

    if (!note) return null;
    note.title = note.title || '';

    return (
      <div className='note-detailed-view' style={{ display: 'block' }}>
        <div className='modal-content'>
          <div className={joinClasses('modal-note-content-text', showingComments ? 'modal-note-content-text-with-comments' : null)}>
            <div className='modal-header'>
              <Editor
                type='title'
                onFocus={(e) => this.onFocus(e, 'title')}
                onChange={(e) => this.onValueChanged(e, 'title')}
                onBlur={(e) => this.onBlur(e, 'title')}
                onClick={(e) => this.onClick(e, 'title')}
                placeholder='Title'
                parseMarkdown={false}
                readOnly={!permissions.has('MANAGE_NOTES')}
                style={{ fontSize: '28px' }}
                className='note-header'>
                {focused ? note.title : (note.title.length > 128 ? `${note.title.slice(0, 125)}...` : note.title)}
              </Editor>
            </div>

            <div className='modal-body' style={{ maxHeight: showingComments ? '140px' : undefined }}>
              <Scroller>
                <Editor
                  type='content'
                  onFocus={(e) => this.onFocus(e, 'content')}
                  onChange={(e) => this.onValueChanged(e, 'content')}
                  onBlur={(e) => this.onBlur(e, 'content')}
                  onClick={(e) => this.onClick(e, 'content')}
                  doDecorate={focused}
                  parseMarkdown
                  readOnly={!permissions.has('MANAGE_NOTES')}
                  placeholder='Content'
                  className='note-body'>
                  {note.content}
                </Editor>
              </Scroller>
            </div>

            <div className='modal-note-comments'>
              {!showingComments && <div onClick={() => this.setState({ showingComments: true })} className='modal-note-comments-view'>
                {t("NOTE_DETAILED_VIEW_VIEW_COMMENTS")}
              </div>}
              {showingComments && (
                <Flex className='modal-note-comments'>
                  <div onClick={() => this.setState({ showingComments: false })} className={`modal-note-comments-view ${showingComments ? 'modal-note-comments-view-expanded' : ''}`}>
                    {t("NOTE_DETAILED_VIEW_HIDE_COMMENTS")}
                  </div>
                  <Scroller className='modal-note-comments-container'>
                    <FlexChild className='modal-note-comments-addcomment'>
                    <form>
                      <textarea
                        type='text'
                        onChange={(e) => this.handleCommentTextareaChange(e)}
                        onKeyDown={(e) => this.handleCommentTextareaInput(e)}
                        value={commentTextValue}
                        placeholder={t("NOTE_DETAILED_VIEW_COMMENT_TEXTAREA_PLACEHOLDER")}
                        className='modal-note-comments-textarea'></textarea>
                    </form>
                    <div className='modal-note-comments-textarea-options'>
                      <Tooltip placement='left' content='Not working yet!'><div><MinimalisticButton onClick={() => this.textareaOptionsClicked('emoji')} icon='insert_emoticon' /></div></Tooltip>
                      <MinimalisticButton onClick={() => this.textareaOptionsClicked('image')} icon='insert_photo' />
                      <MinimalisticButton onClick={() => this.textareaOptionsClicked('upvote')} icon='thumb_up' />
                      <MinimalisticButton onClick={() => this.textareaOptionsClicked('send')} icon='send' />
                    </div>
                    </FlexChild>
                    {comments.length > 0 && comments.map(c => <NoteComment comment={c} />)}
                  </Scroller>
                </Flex>
              )}
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

            <div className='modal-note-settings-header'>{t("NOTE_DETAILED_VIEW_COLOR_HEADER")}</div>
            <ColorPicker
              color={color || note.options.color || '#546e7a'}
              onChangeComplete={(color) => this.handleColorChange(color)}
            />

            <div className='modal-note-settings-header'>{t("NOTE_DETAILED_VIEW_ASSIGNEES_HEADER")}</div>
            <ListPopout title='Assign Memebrs to this Note' onOptionSelected={(e) => this.optionSelectedAssignees(e)}>
              <div className='add-btn'>+</div>
            </ListPopout>

            <div className='modal-note-settings-header'>{t("NOTE_DETAILED_VIEW_LABELS_HEADER")}</div>
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

            <div className='modal-note-settings-header'>{t("NOTE_DETAILED_VIEW_MODIFIED_HEADER")}</div>
            <div className='modal-note-settings-modified'>
              {new Date(note.modifiedAt).toLocaleDateString()} at {new Date(note.modifiedAt).toLocaleTimeString()}
              <br />
                by <strong>{note.modifiedBy.username}</strong>
              <br />
            </div>
            
            <div onClick={() => createModal(<EditRevisionsModal noteId={note.id} boardID={boardId} />)}
            className='modal-note-settings-editrevision'>{t("NOTE_DETAILED_VIEW_VIEW_EDIT_REVISIONS")}</div>
            <div className='modal-note-settings-header'>{t("NOTE_DETAILED_VIEW_DUE_DATE_HEADER")}</div>
            <DatePickerPopout initial={note.dueDate ? new Date(note.dueDate) : null} 
              placement='top'
              onOptionSelected={(date) => this.setState({ date })} 
              onClose={() => this.saveDueDate(this.state.date)}>
              {!note.dueDate 
                ? <div className='add-btn'>+</div> 
                : <div className='modal-note-settings-duedate'>{new Date(note.dueDate).toLocaleDateString()} at {new Date(note.dueDate).toLocaleTimeString()}</div>}
            </DatePickerPopout>
            <br />
            <br />

            <div className='modal-note-settings-header'>Technical Details</div>
            ID: {note.id}
          </Scroller>
        </div>
      </div>
    );
  }
}

export default withTranslation()(connect(mapStateToProps, null)(NoteDetailedView));
