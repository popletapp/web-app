import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Note, Editor, FlexChild, Flex, CloseButton, MinimalisticButton, Scroller } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import './Group.scss';
import { addNoteToGroup, isNoteInGroup, moveNote, updateGroup, deleteGroup } from '../../../modules';

function mapStateToProps (state, props) {
  return {
    notes: state.groupsByBoard[props.boardId][props.id]
      ? state.groupsByBoard[props.boardId][props.id].items.map(note => state.notesByBoard[props.boardId][note])
      : [],
    group: state.groupsByBoard[props.boardId][props.id],
    listView: !!state.viewByBoard[props.boardId]
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
    const { style } = this.state;
    if (group && group.options && group.options.position) {
      if (style.top !== group.options.position.y || style.left !== group.options.position.x) {
        this.setPosition(group);
      }
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

  async deleteGroup () {
    const { boardId, group } = this.props;
    await deleteGroup(boardId, group.id);
  }

  render () {
    const { group, notes, boardId, listView, connectDragSource, connectDropTarget } = this.props;
    const { style, editingName } = this.state;
    if (!group || this.state.unmounted) {
      return null;
    }

    group.options = group.options || {};
    return connectDropTarget(connectDragSource(
      <div className='group-container'
        style={{ ...(!listView ? style : {}), backgroundColor: group.options.color || '' }}>
        <Flex direction='row' align='center' className='group-header'>
          <FlexChild direction='row' align='center'>
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
          </FlexChild>

          <FlexChild grow={0} align='right' direction='row'>
            <MinimalisticButton className='group-settings-btn' icon='settings' onClick={() => this.deleteGroup()} />
            <CloseButton icon='close' onClick={() => this.deleteGroup()} />
          </FlexChild>
        </Flex>

        <Scroller>
          <div className='group'>

            {notes && notes.filter(Boolean).map((note, i) => <Note key={i} id={note.id} boardId={boardId} />)}

          </div>
        </Scroller>
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
        } else {
          addNoteToGroup(props.boardId, props.id, item.id);
        }
      }
    },
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )(DragSource(
    ComponentTypes.GROUP,
    {
      beginDrag (props) {
        const { group, boardId } = props;
        group.options = group.options || {};
        group.options.position = group.options.position || { x: 0, y: 0 };
        return { item: group, boardId };
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
