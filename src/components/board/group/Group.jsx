import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Note, Editor } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import './Group.scss';
import { addNoteToGroup, isNoteInGroup, moveNote, updateGroup } from '../../../modules';

function mapStateToProps (state, props) {
  return {
    notes: state.groupsByBoard[state.selectedBoard][props.id].items.map(note => state.notesByBoard[state.selectedBoard][note]),
    group: state.groupsByBoard[state.selectedBoard][props.id],
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

class Group extends Component {
  constructor ({ boardId, group }) {
    super();
    this.boardId = boardId;
    this.group = group;
    this.state = {
      editingName: false
    };
  }

  componentDidMount () {
    const { group, connectDragPreview } = this.props;
    if (group && group.options && group.options.position) {
      this.setPosition(group);
    }
    if (connectDragPreview) {
      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true
      });
    }
  }

  componentDidUpdate (oldProps) {
    const { group } = this.props;
    if (group && oldProps.group !== group && group.options && group.options.position) {
      this.setPosition(group);
    }
  }

  setPosition (group) {
    this.setState({
      style: {
        top: group.options ? group.options.position.y : 0,
        left: group.options ? group.options.position.x : 0
      }
    });
  }

  async updateGroupName (event) {
    const { boardId, group } = this.props;
    const newName = event.target.textContent;
    group.name = newName;
    await updateGroup(boardId, group);
    this.setState({ editingName: false });
  }

  render () {
    const { group, notes, boardId, listView, connectDragSource, connectDropTarget } = this.props;
    const { style, editingName } = this.state;
    console.log(notes)
    if (!group || this.state.unmounted) {
      return null;
    }

    group.options = group.options || {};
    return connectDropTarget(connectDragSource(
      <div className='group-container'
        style={{ ...(!listView ? style : {}), backgroundColor: group.options.color || '' }}>
        <div className='group-header'>
          <Editor
            maxLength='64'
            className='group-header-name'
            editing={editingName.toString()}
            onMouseEnter={() => this.setState({ editingName: true })}
            onBlur={(e) => this.updateGroupName(e)}>
            {group.name}
          </Editor>

          <div className='group-header-note-count'>
            {group.items.length} note{group.items.length === 1 ? '' : 's'}
          </div>
        </div>
        <div className='group'>
          {notes && notes.filter(Boolean).map((note, i) => <Note key={i} id={note.id} boardId={boardId} />)}
        </div>
      </div>
    ));
  }
}

export default connect(mapStateToProps, null)(
  DropTarget(
    ComponentTypes.NOTE,
    {
      drop (props, monitor, component) {
        const { item } = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.options.position.x + delta.x);
        const top = Math.round(item.options.position.y + delta.y);

        if (isNoteInGroup(item.id)) {
          moveNote(props.boardId, item.id, { x: left, y: top });
        }
        addNoteToGroup(props.boardId, props.id, item.id);
      }
    },
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )(DragSource(
    ComponentTypes.GROUP,
    {
      beginDrag (props) {
        const { group } = props;
        group.options = group.options || {};
        group.options.position = group.options.position || { x: 0, y: 0 };
        return { item: group };
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
      dragging: monitor.getItemType()
    })
  )(Group))
);
