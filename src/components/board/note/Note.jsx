import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Editor, NoteDetailedView, MinimalisticButton, Flex, FlexChild } from './../../';
import './Note.scss';
import { endCreateNote } from './../../../actions/note';
import { updateNote, createNote, saveNote, createModal } from './../../../modules';
import ComponentTypes from './../../../constants/ComponentTypes';

import { DragSource } from 'react-dnd';

function mapStateToProps (state, props) {
  return {
    note: props.id ? (state.notesByBoard[props.boardId] || {})[props.id] : props.note,
    selectedArea: state.selectionArea,
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    endCreateNote: board => dispatch(endCreateNote(board))
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
    const { exists, selected, editing } = this.state;

    if (selected && editing) {
      const content = event.target.innerText.replace(/<br\s*[\\/]?>/gi, '\n');
      note = this.didSizeChange() || note;
      const newNote = { ...note, [type]: content };

      this.setState({
        editing: false,
        saving: true
      });
      if (note[type] !== newNote[type]) {
        if (exists) {
          await saveNote(this.boardId, newNote);
        } else {
          this.setState({
            unmounted: true,
            exists: true
          });
          await createNote(this.boardId, newNote);
          this.props.endCreateNote(this.boardId);
        }
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
      await saveNote(this.boardId, size);
    }
  }

  componentDidUpdate (oldProps) {
    this.highlight();
    const { note, selectedArea, isDragging } = this.props;
    const { style } = this.state;
    if (note && oldProps.selectedArea !== selectedArea) {
      const bounding = ReactDOM.findDOMNode(this.noteRef.current).getBoundingClientRect();
      if (selectedArea.y1 > bounding.y &&
        selectedArea.y2 < bounding.bottom &&
        selectedArea.x1 < bounding.x &&
        selectedArea.x2 > bounding.right) {
        console.log('overlapping!!!!', note);
        this.setState({ selected: true, boxSelection: true });
      }
    }

    if (!isDragging && oldProps.isDragging) {
      this.wasDraggedByClient = true;
      setTimeout(() => { this.wasDraggedByClient = false; }, 500);
    }

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

  render () {
    const { note, listView, connectDragSource, preview, isDragging } = this.props;
    const { editing, selected, style } = this.state;

    if (!note || this.state.unmounted) {
      return null;
    }
    note.title = note.title || '';
    note.content = note.content || '';
    note.options = note.options || {};

    return connectDragSource(
      <div ref={this.noteRef}
        onClick={(event) => note.id && this.view(event)}
        className={`note ${!note.options.color ? 'blue-grey ' : ''}darken-1${selected && !preview ? ' selected' : ''}`}
        style={{
          ...(this.wasDraggedByClient ? { transition: 'none' } : {}),
          ...(!listView && !preview ? style : {}),
          width: 'fit-content',
          backgroundColor: note.options.color || '',
          opacity: isDragging ? 0 : 1
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
            {editing ? note.content : (note.content.length > 255 ? `${note.content.slice(0, 252)}...` : note.content)}
          </Editor>
        </div>
        <Flex direction='row' align='center' className='note-footer'>
          <FlexChild align='left' direction='row'>
            {!preview && <MinimalisticButton size='15px' icon='edit' onClick={(e) => this.select(e)} className='note-btn-view'>Edit</MinimalisticButton>}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  DragSource(
    ComponentTypes.NOTE,
    {
      beginDrag (props) {
        const { note, boardId } = props;
        note.position = note.position || { x: 0, y: 0 };
        return { item: note, boardId };
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    })
  )(Note)
);
