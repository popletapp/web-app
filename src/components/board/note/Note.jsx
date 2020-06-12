import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { NoteDetailedView, MinimalisticButton, Flex, FlexChild, Editor, RichTextbox } from './../../';
import './Note.scss';
import { updateNote, createNote, saveNote, moveNote, createModal, removeNoteFromGroup, 
  isNoteInGroup, addNoteToGroup, createContextMenu } from './../../../modules';
import { permissions, findAncestor, hasClass, joinClasses, isMouseWithinBounds } from './../../../util';
import Draggable from 'react-draggable';
import { withTranslation } from 'react-i18next';

function mapStateToProps (state, props) {
  return {
    note: props.id ? (state.notesByBoard[props.boardId] || {})[props.id] : props.note,
    groups: state.groupsByBoard[props.boardId],
    selectedArea: state.selectionArea,
    listView: !!state.viewByBoard[state.selectedBoard],
    board: state.boards[props.boardId] || {}
  };
}

class Note extends Component {
  constructor ({ note, boardId, preview }) {
    super();
    this.note = note;
    this.noteRef = React.createRef();
    this.boardId = boardId;
    this.preview = preview;
    this.wasDraggedByClient = false;
    this.currentMousePosition = {};

    this.state = {
      selected: false,
      editing: false,
      exists: this.note ? !!this.note.id : false,
      style: { },
      position: null
    };
    if (true || !this.preview) {
      this.listener = (event) => {
        let element = event.target;
        let invalid = false;
        let unselect = false;

        do {
          if (hasClass(element, 'note-footer')) invalid = true;
          if (hasClass(element, 'note-container')) unselect = true;
          if (hasClass(element, 'note')) break;
          element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);
        if (invalid) return;
        if (element && element.dataset && element.dataset.id === note.id) {
          this.onClick(event);
        } else {
          if (unselect) this.unselect();
        }
      };
      window.listeners.subscribe('click', this.listener);
    }
  }

  view (event) {
    if (this.wasDraggedByClient) {
      return false;
    };
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!this.state.selected) {
      createModal(<NoteDetailedView noteId={this.props.note.id} boardId={this.props.boardId} note={this.props.note || undefined} />);
    }
  }

  onClick (event) {
    this.view(event);
  }

  select (e) {
    const { preview } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (!preview) {
      this.setState({ selected: true, editing: true });
    }
  }

  unselect () {
    if (!this.state.boxSelection) {
      this.setState({ selected: false, editing: false });
    } else {
      this.setState({ boxSelection: false, selected: false, editing: false });
    }
  }

  onChange (value, type) {
    const { note } = this.props;
    const content = value;
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
    /*if (event.which === 13 && !event.shiftKey) { // ENTER pressed
      this.onBlur(event, type);
    }*/
  }

  async onBlur (value, type) {
    let { note } = this.props;
    const { selected, editing } = this.state;

    if (selected && editing) {
      const content = value;
      note = this.didSizeChange() || note;
      const newNote = { ...note, [type]: content };

      this.setState({
        saving: true
      });
      if (note[type] !== newNote[type]) {
        await saveNote(this.boardId, newNote);
      }
      this.setState({ saving: false });
    }
  }

  setPosition (note) {
    if (note.position.x < 0) {
      note.position.x = 0;
    }
    if (note.position.y < 0) {
      note.position.y = 0;
    }

    const transform = `translate(${note.position.x}px, ${note.position.y}px)`;
    this.setState({
      style: {
        transform,
        WebkitTransform: transform
      }
    });
  }

  didSizeChange () {
    const { note } = this.props;
    const node = ReactDOM.findDOMNode(this.noteRef.current);
    if (!node) {
      return null;
    }

    const box = node.getBoundingClientRect();

    const newNote = note;
    newNote.size = newNote.size || {};
    newNote.size.width = box.width;
    newNote.size.height = box.height;
    if (note.size.width !== newNote.size.width || note.size.height !== newNote.size.height) {
      return note;
    } else {
      return null;
    }
  }

  componentWillUnmount () {
    window.listeners.unsubscribe('click', this.listener);
  }

  highlight () {
    const block = document.querySelector('pre:not(.hljs)');
    block && hljs.highlightBlock(block);
  }

  async componentDidMount () {
    const { note } = this.props;

    if (note && note.position) {
      this.setPosition(note);
    }
    const size = this.didSizeChange();
    if (size) {
      saveNote(this.boardId, size);
    }
  }

  componentDidUpdate (oldProps) {
    const { note } = this.props;

    this.highlight();
    const { style } = this.state;

    if (note && note.position) {
      if (style.transform !== `translate(${note.position.x}px, ${note.position.y}px)`) {
        this.setPosition(note);
      }
    }
    if (note && note.size) {
      const size = this.didSizeChange();
      if (size) {
        saveNote(this.boardId, size);
      }
    }
  }

  onDragStart () {
    const { note, board } = this.props;
    if (board.type === 1) {
      const container = document.getElementsByClassName('note-container')[0];
      container.style.backgroundSize = '32px 32px';
      container.style.backgroundImage = 'radial-gradient(circle, #424242 1px, transparent 1px)';
    }
  }

  onDrag (event, data) {
    const { note, board, boardId, groups } = this.props;
    
    if (data) {
      // TODO: use pos data to detect if note is over group to add it to group
      this.currentMousePosition = event;
      const newPosition = { x: data.x, y: data.y };
      if (note.position !== newPosition) {
        this.setState({ position: newPosition })
        this.wasDraggedByClient = true;
      }
    }
  }

  async onDragStop () {
    const { note, boardId, groups } = this.props;
    const { position } = this.state;
    const container = document.getElementsByClassName('note-container')[0];
    container.style.backgroundSize = '';
    container.style.backgroundImage = '';
    setTimeout(() => { this.wasDraggedByClient = false; }, 200);

    if (this.wasDraggedByClient) {
      for (const id in groups) {
        const group = groups[id];
        const boundaries = isMouseWithinBounds(this.currentMousePosition, group);
        const existingGroup = isNoteInGroup(note.id);
        if (boundaries.overlapping) {
          if (existingGroup) {
            await moveNote(boardId, note.id, position);
          } else {
            addNoteToGroup(boardId, group.id, note.id);
          }
        } else {
          if (existingGroup) {
            await removeNoteFromGroup(boardId, group, note.id);
          } else {
            await moveNote(boardId, note.id, position);
          }
        }
      }
    }
  }

  renderContent () {
    const { note, board } = this.props;
    const { editing } = this.state;
    const { compact = false } = board;
    const MAX_LENGTH = compact ? 127 : 255;
    return editing ? note.content : (note.content.length > MAX_LENGTH ? `${note.content.slice(0, MAX_LENGTH - 3)}...` : note.content)
  }

  getBounds () {
    const node = this.noteRef.current;
    if (!node) {
      return {
        left: 0,
        top: 0
      };
    }
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    const boundNode = node.parentNode;
    const nodeStyle = ownerWindow.getComputedStyle(node);
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
    return {
      left: -node.offsetLeft + parseInt(boundNodeStyle.paddingLeft) + parseInt(nodeStyle.marginLeft),
      top: -node.offsetTop + parseInt(boundNodeStyle.paddingTop) + parseInt(nodeStyle.marginTop)
    }
  }

  render () {
    let { note, listView, preview, style: styleProps = {}, board = {}, t, className } = this.props;
    const { editing, selected, style } = this.state;
    const { compact = false } = board;
    const insideGroup = isNoteInGroup(note.id);

    if (!note || this.state.unmounted) {
      return null;
    }
    note.options = note.options || {};

    return <Draggable
      onStart={(...args) => this.onDragStart(...args)}
      onDrag={(...args) => this.onDrag(...args)}
      onStop={(...args) => this.onDragStop(...args)}
      disabled={selected || listView || preview || !permissions.has('MOVE_NOTES')}
      defaultPosition={preview ? void 0 : note.position}
      bounds='parent'
      grid={board.type === 1 ? [ 32, 32 ] : void 0}>
        <div ref={this.noteRef}
        data-id={note.id.toString()}
        className={joinClasses('note', !note.options.color ? 'blue-grey' : '', 'darken-1', 
        selected && !preview ? 'selected' : '', compact ? ' note-compact' : '', className)}
        onContextMenu={(event) => {
          event.preventDefault();
          createContextMenu('contextmenu', [
            {
              name: 'View Note',
              onClick: () => this.view()
            },
            insideGroup ? {
              name: 'Remove Note from Group',
              onClick: () => removeNoteFromGroup(board.id, insideGroup, note.id)
            } : undefined,
          ], { x: event.clientX, y: event.clientY })
        }}
        style={{ 
          ...(!listView && !preview ? style : {}),
          backgroundColor: note.options.color || '',
          opacity: 1,
          ...styleProps,
          ...(this.wasDraggedByClient ? { transition: 'none' } : {}),
        }}>
          {selected && !preview && <div className='selected-checkmark'><i className='material-icons'>checkmark</i></div>}
          <div className='note-content'>
            <RichTextbox
              type='title'
              parseMarkdown={false}
              editable={editing}
              onChange={(e) => this.onChange(e, 'title')}
              onBlur={(e) => this.onBlur(e, 'title')}
              style={{ display: note.title ? 'block' : 'none' }}
              placeholder='Title'
              className='note-header'>
              {editing ? note.title : (note.title.length > 64 ? `${note.title.slice(0, 61)}...` : note.title)}
            </RichTextbox>
            <RichTextbox
              type='content'
              editable={editing}
              parseMarkdown={!editing}
              doDecorate={editing}
              onChange={(e) => this.onChange(e, 'content')}
              onBlur={(e) => this.onBlur(e, 'content')}
              placeholder='Content'
              className='note-body'>
              {this.renderContent()}
            </RichTextbox>
          </div>
          <Flex direction='row' align='center' className='note-footer'>
            <FlexChild align='left' direction='column'>
              {permissions.has('MANAGE_NOTES') && 
              <MinimalisticButton size='15px' icon='edit' onClick={(e) => this.select(e)} className={`note-btn-edit${preview ? ' note-btn-edit-disabled' : ''}`}>
                {t("EDIT")}
              </MinimalisticButton>}
              {editing && <div className='note-footer-hint'>press ENTER to save</div>}
            </FlexChild>

            <FlexChild align='right' direction='row' justify='end'>
              {/* TODO: Implement comments */}
              {true && <div className='note-footer-comments-container'>
                <i className='material-icons' style={{ fontSize: '13px' }}>comment</i> 0
              </div>}
            </FlexChild>
          </Flex>
        </div>
      </Draggable>
  }
}

export default withTranslation()(connect(mapStateToProps, null)(Note));

