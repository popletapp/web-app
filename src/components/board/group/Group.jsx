import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Note } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import './Group.scss';
import { addNoteToGroup } from '../../../modules';

function mapStateToProps (state, props) {
  return {
    notes: state.notesByBoard[props.boardId].items.filter(note => props.notes.includes(note.id)),
    group: state.groups[props.id],
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

class Group extends Component {
  constructor ({ boardId, group }) {
    super();
    this.boardId = boardId;
    this.group = group;
    this.state = {};
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

  render () {
    const { group, notes, boardId, listView, connectDragSource, connectDropTarget, dragging } = this.props;
    const { style } = this.state;

    if (!group || this.state.unmounted) {
      return null;
    }

    group.options = group.options || {};
    console.log('Rendering group with notes ', notes);
    return connectDropTarget(connectDragSource(
      <div className='group-container'
        style={{ ...(!listView ? style : {}), backgroundColor: group.options.color || '' }}>
        <div className='group-header'>
          {group.name}
          <div className='group-header-note-count'>
            {group.items.length} note{group.items.length === 1 ? '' : 's'}
          </div>
        </div>
        <div className='group'>
          {notes && notes.map(note => <Note key={note.id} id={note.id} boardId={boardId} />)}
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
        if (!component) {
          return;
        }

        const item = monitor.getItem();
        console.log(item);
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
        return group;
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
