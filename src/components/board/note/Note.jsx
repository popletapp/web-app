import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';

import { connect } from 'react-redux';
import { Button, Editor, NoteDetailedView } from './../../';
import './Note.scss';
import { endCreateNote } from './../../../actions/note';
import { Modal, updateNote, createNote, saveNote } from './../../../modules';
import ComponentTypes from './../../../constants/ComponentTypes';

import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

function mapStateToProps (state, props) {
  return {
    note: (state.notesByBoard[props.boardId] || {}).items ? state.notesByBoard[props.boardId].items.find(note => note.id === props.id) : props.note,
    selectedArea: state.selectionArea,
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    endCreateNote: () => dispatch(endCreateNote())
  };
}

class Note extends Component {
  constructor ({ note, boardId, preview }) {
    super();
    this.note = note;
    this.noteRef = React.createRef();
    this.boardId = boardId;
    this.preview = preview;

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
    };
    document.addEventListener('click', this.listener);
  }

  onFocus () {
    this.setState({ editing: true });
  }

  view (event) {
    event.preventDefault();
    new Modal(<NoteDetailedView note={this.props.note} boardId={this.boardId} />).create();
  }

  onClick () {
    this.setState({ selected: true });
  }

  unselect () {
    if (!this.state.boxSelection) {
      this.setState({ selected: false });
    }
    this.setState({ boxSelection: false });
  }

  onInput (event, type) {
    const { note } = this.props;
    const content = event.target.textContent.replace('<br>', '\\n');
    const newNote = { ...note, [type]: content };
    updateNote(this.boardId, newNote);
  }

  async onBlur (event, type) {
    const { note } = this.props;
    const { exists } = this.state;

    const content = event.target.textContent.replace('<br>', '\\n');
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
        this.props.endCreateNote();
      }
    }
    this.setState({ saving: false });
  }

  setPosition (note) {
    this.setState({
      style: {
        top: note.options ? note.options.position.y : 0,
        left: note.options ? note.options.position.x : 0
      }
    });
  }

  highlight () {
    const block = document.querySelector('pre:not(.hljs)');
    block && hljs.highlightBlock(block);
  }

  componentDidMount () {
    const { note, connectDragPreview } = this.props;
    if (note && note.options && note.options.position) {
      this.setPosition(note);
    }

    if (connectDragPreview) {
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true
      });
    }
  }

  componentDidUpdate (oldProps) {
    this.highlight();
    const { note, selectedArea } = this.props;
    if (note && oldProps.selectedArea !== selectedArea) {
      console.log(this.noteRef);
      const bounding = ReactDOM.findDOMNode(this.noteRef.current).getBoundingClientRect();
      console.log(bounding.top, selectedArea.y1,
        bounding.bottom, selectedArea.y2,
        bounding.left, selectedArea.x1,
        bounding.right, selectedArea.x2);

      console.log(selectedArea.y1 > bounding.top,
        selectedArea.y2 < bounding.bottom,
        selectedArea.x1 < bounding.left,
        selectedArea.x2 > bounding.right);

      if (selectedArea.y1 > bounding.top &&
        selectedArea.y2 < bounding.bottom &&
        selectedArea.x1 < bounding.left &&
        selectedArea.x2 > bounding.right) {
        console.log('overlapping!!!!', note);
        this.setState({ selected: true, boxSelection: true });
      }
    }
    if (note && oldProps.note !== note && note.options && note.options.position) {
      this.setPosition(note);
    }
  }

  render () {
    const { note, listView, connectDragSource, preview } = this.props;
    const { editing, selected, style } = this.state;
    const togglableDragSource = selected && !preview ? connectDragSource : i => i;

    if (!note || this.state.unmounted) {
      return null;
    }
    note.options = note.options || {};

    return togglableDragSource(
      <div ref={this.noteRef}
        onClick={(event) => this.onClick(event)}
        className={`note ${!note.options.color ? 'blue-grey ' : ''}darken-1${selected && !preview ? ' selected' : ''}`}
        style={{ ...(!listView && !preview ? style : {}), width: 'fit-content', backgroundColor: note.options.color || '' }}>
        {selected && !preview && <div className='selected-checkmark'><i className='material-icons'>checkmark</i></div>}
        <div className='note-content white-text'>
          <Editor
            type='title'
            editing={selected}
            onFocus={(e) => this.onFocus(e, 'title')}
            onInput={(e) => this.onInput(e, 'title')}
            onBlur={(e) => this.onBlur(e, 'title')}
            className='note-header'>
            {editing ? note.title : (note.title > 64 ? `${note.title.slice(0, 61)}...` : note.title)}
          </Editor>
          <Editor
            type='content'
            editing={selected}
            onFocus={(e) => this.onFocus(e, 'content')}
            onInput={(e) => this.onInput(e, 'content')}
            onBlur={(e) => this.onBlur(e, 'content')}
            parseMarkdown={!editing}
            className='note-body'>
            {editing ? note.content : (note.content > 255 ? `${note.content.slice(0, 252)}...` : note.content)}
          </Editor>
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DragSource(
    ComponentTypes.NOTE,
    {
      beginDrag (props) {
        const { note } = props;
        return note;
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    })
  )(Note)
);
