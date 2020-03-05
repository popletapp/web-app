import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/tomorrow-night.css';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Editor, NoteDetailedView, MinimalisticButton, Flex, FlexChild, RichTextbox } from './../../';
import './Note.scss';
import { updateNote, createNote, saveNote, moveNote, createModal, removeNoteFromGroup, isNoteInGroup } from './../../../modules';
import { permissions } from './../../../util';
import ComponentTypes from './../../../constants/ComponentTypes';
import Draggable from 'react-draggable';

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

    this.state = {
      selected: false,
      editing: false,
      exists: this.note ? !!this.note.id : false,
      style: { },
      position: null
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
      window.listeners.subscribe('click', this.listener);
    }
  }

  view (event) {
    console.log(this.wasDraggedByClient)
    if (this.wasDraggedByClient) {
      return false;
    };
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
    } else {
      this.setState({ boxSelection: false, selected: false, editing: false });
    }
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
    const { note } = this.props;
    if (data) {
      const newPosition = { x: data.x, y: data.y };
      if (note.position !== newPosition) {
        this.setState({ position: newPosition })
        this.wasDraggedByClient = true;

        const node = this.noteRef.current;
        if (!node) {
          return {
            left: 0,
            top: 0
          };
        }
        const { ownerDocument } = node;
      }
    }
  }

  async onDragStop () {
    const { note, boardId } = this.props;
    const { position } = this.state;
    const container = document.getElementsByClassName('note-container')[0];
    container.style.backgroundSize = '';
    container.style.backgroundImage = '';
    setTimeout(() => { this.wasDraggedByClient = false; }, 100);

    if (this.wasDraggedByClient) {
      const group = isNoteInGroup(note.id);
      if (group) {
        await removeNoteFromGroup(boardId, group, note.id);
      }
      await moveNote(boardId, note.id, position);
    }
  }

  renderContent () {
    const { note,  board } = this.props;
    const { editing } = this.state;
    const { compact = false } = board;
    let MAX_LENGTH = compact ? 127 : 255;
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
    let { note, listView, preview, style: styleProps = {}, board } = this.props;
    const { editing, selected, style } = this.state;
    const { compact = false } = board;
    const bounds = this.getBounds();

    if (!note || this.state.unmounted) {
      return null;
    }
    note.options = note.options || {};

    return <Draggable
      onStart={(...args) => this.onDragStart(...args)}
      onDrag={(...args) => this.onDrag(...args)}
      onStop={(...args) => this.onDragStop(...args)}
      disabled={!permissions.has('MOVE_NOTES')}
      defaultPosition={note.position}
      bounds={{ top: bounds.top, left: bounds.left }}
      grid={board.type === 1 ? [ 32, 32 ] : void 0}>
        <div ref={this.noteRef}
        data-id={note.id.toString()}
        onClick={(event) => note.id && this.view(event)}
        className={`note ${!note.options.color ? 'blue-grey ' : ''}darken-1${selected && !preview ? ' selected' : ''}${compact ? ' note-compact' : ''}`}
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
              onInput={(e) => this.onInput(e, 'title')}
              onBlur={(e) => this.onBlur(e, 'title')}
              style={{ display: note.title ? 'block' : 'none' }}
              placeholder='Title'
              className='note-header'>
              {editing ? note.title : (note.title.length > 64 ? `${note.title.slice(0, 61)}...` : note.title)}
            </RichTextbox>
            <RichTextbox
              type='content'
              editable={editing}
              parseMarkdown={editing}
              doDecorate={editing}
              onInput={(e) => this.onInput(e, 'content')}
              onBlur={(e) => this.onBlur(e, 'content')}
              placeholder='Content'
              className='note-body'>
              {this.renderContent()}
            </RichTextbox>
          </div>
          <Flex direction='row' align='center' className='note-footer'>
            <FlexChild align='center' direction='row'>
              {permissions.has('MANAGE_NOTES') && 
              <MinimalisticButton size='15px' icon='edit' onClick={(e) => this.select(e)} className={`note-btn-edit${preview ? ' note-btn-edit-disabled' : ''}`}>
                Edit
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

export default connect(mapStateToProps, null)(Note);

