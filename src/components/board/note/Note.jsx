import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Editor, NoteDetailedView, MinimalisticButton, Flex, FlexChild } from './../../';
import './Note.scss';
import { updateNote, createNote, saveNote, createModal } from './../../../modules';
import { permissions } from './../../../util';
import ComponentTypes from './../../../constants/ComponentTypes';

import { DragSource } from 'react-dnd';

function mapStateToProps (state, props) {
  return {
    note: props.id ? (state.notesByBoard[props.boardId] || {})[props.id] : props.note,
    selectedArea: state.selectionArea,
    listView: !!state.viewByBoard[state.selectedBoard],
    board: state.boards[props.boardId]
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

    // Whether or not this note is currently being created
    this.state = {
      selected: false,
      editing: false,
      exists: this.note ? !!this.note.id : false,
      style: { }
    };
    if (!this.preview) {
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
      };
      document.addEventListener('click', this.listener);
    }
  }

  view (event) {
    event.preventDefault();
    if (!this.state.selected) {
      createModal(<NoteDetailedView noteId={this.props.note.id} boardId={this.boardId} />);
    }
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
    }
    this.setState({ boxSelection: false, selected: false, editing: false });
  }

  onInput (event, type) {
    const { note } = this.props;
    const content = event.target.innerText.replace(/<br\s*[\\/]?>/gi, '\n');
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
  }

  async onBlur (event, type) {
    let { note } = this.props;
    const { selected, editing } = this.state;

    if (selected && editing) {
      const content = event.target.innerText.replace(/<br\s*[\\/]?>/gi, '\n');
      note = this.didSizeChange() || note;
      const newNote = { ...note, [type]: content };

      this.setState({
        editing: false,
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
    this.setState({
      style: {
        top: note.position ? note.position.y : 0,
        left: note.position ? note.position.x : 0
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
    document.removeEventListener('click', this.listener);
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
    const { note, selectedArea, isDragging } = this.props;

    this.highlight();
    const { style } = this.state;

    if (note && note.position) {
      if (style.top !== note.position.y || style.left !== note.position.x) {
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

  renderContent () {
    const { note,  board } = this.props;
    const { editing } = this.state;
    const { compact = false } = board;
    let MAX_LENGTH = compact ? 127 : 255;
    return editing ? note.content : (note.content.length > MAX_LENGTH ? `${note.content.slice(0, MAX_LENGTH - 3)}...` : note.content)
  }

  render () {
    let { note, listView, connectDragSource, preview, isDragging, style: styleProps = {}, board } = this.props;
    const { editing, selected, style } = this.state;
    const { compact = false } = board;

    if (!note || this.state.unmounted) {
      return null;
    }

    if (isDragging) {
      this.wasDraggedByClient = true;
      setTimeout(() => { this.wasDraggedByClient = false; }, 300);
    }
    note.title = note.title || '';
    note.content = note.content || '';
    note.options = note.options || {};

    if (!permissions.has('MOVE_NOTES')) {
      connectDragSource = (value) => value; 
    }

    return connectDragSource(
      <div ref={this.noteRef}
        data-id={note.id.toString()}
        onClick={(event) => note.id && this.view(event)}
        className={`note ${!note.options.color ? 'blue-grey ' : ''}darken-1${selected && !preview ? ' selected' : ''}${compact ? ' note-compact' : ''}`}
        style={{ 
          ...(this.wasDraggedByClient ? { transition: 'none' } : {}),
          ...(!listView && !preview ? style : {}),
          width: 'fit-content',
          backgroundColor: note.options.color || '',
          opacity: isDragging ? 0 : 1,
          ...styleProps,
        }}>
        {selected && !preview && <div className='selected-checkmark'><i className='material-icons'>checkmark</i></div>}
        <div className='note-content white-text'>
          <Editor
            type='title'
            editing={selected}
            onInput={(e) => this.onInput(e, 'title')}
            onBlur={(e) => this.onBlur(e, 'title')}
            style={{ display: note.title ? 'block' : 'none' }}
            placeholder='Title'
            className='note-header'>
            {editing ? note.title : (note.title.length > 64 ? `${note.title.slice(0, 61)}...` : note.title)}
          </Editor>
          <Editor
            type='content'
            editing={selected}
            onInput={(e) => this.onInput(e, 'content')}
            onBlur={(e) => this.onBlur(e, 'content')}
            parseMarkdown={!editing}
            placeholder='Content'
            className='note-body'>
            {this.renderContent()}
          </Editor>
        </div>
        <Flex direction='row' align='center' className='note-footer'>
          <FlexChild align='left' direction='row'>
            {permissions.has('MANAGE_NOTES') && !preview 
            && <MinimalisticButton size='15px' icon='edit' onClick={(e) => this.select(e)} className='note-btn-view'>Edit</MinimalisticButton>}
          </FlexChild>

          <FlexChild align='right' direction='row' justify='end'>
            {/* TODO: Implement comments */}
            {true && <div className='note-footer-comments-container'>
              <i className='material-icons' style={{ fontSize: '14px' }}>comment</i> 0
            </div>}
          </FlexChild>
        </Flex>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(
  DragSource(
    ComponentTypes.NOTE,
    {
      beginDrag (props) {
        if (props.board.type === 1) {
          const container = document.getElementsByClassName('note-container')[0];
          container.style.backgroundSize = '32px 32px';
          container.style.backgroundImage = 'radial-gradient(circle, #424242 1px, transparent 1px)';
        }
        
        const { note, boardId } = props;
        note.position = note.position || { x: 0, y: 0 };
        return { item: note, boardId };
      },

      endDrag () {
        const container = document.getElementsByClassName('note-container')[0];
        container.style.backgroundSize = '';
        container.style.backgroundImage = '';
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    })
  )(Note)
);
