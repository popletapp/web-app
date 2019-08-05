import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Note, Editor, FlexChild, Flex, CloseButton, MinimalisticButton } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';
import { DragSource, DropTarget } from 'react-dnd';
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
      editingName: false,
      style: {}
    };
  }

  componentDidMount () {
    const { group } = this.props;
    if (group && group.position) {
      this.setPosition(group);
    }
    if (group && group.size) {
      this.setSize(group);
    }
  }

  componentDidUpdate () {
    const { group } = this.props;
    const { style } = this.state;
    if (group && group.position) {
      if (style.top !== group.position.y || style.left !== group.position.x) {
        this.setPosition(group);
      }
    }
    if (group && group.size) {
      if (style.height !== group.size.height || style.width !== group.size.width) {
        this.setSize(group);
      }
    }
  }

  setPosition (group) {
    if (group.position.x < 0) {
      group.position.x = 0;
    }
    if (group.position.y < 0) {
      group.position.y = 0;
    }

    this.setState({
      style: {
        ...this.state.style,
        top: group.position ? group.position.y : 0,
        left: group.position ? group.position.x : 0
      }
    });
  }

  setSize (group) {
    if (group.size.width < 0) {
      group.size.width = 100;
    }
    if (group.position.y < 0) {
      group.size.height = 200;
    }

    this.setState({
      style: {
        ...this.state.style,
        width: group.size ? group.size.width : 100,
        height: group.size ? group.size.height : 200
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
    const { group, notes, boardId, listView, connectDragSource, preview, connectDropTarget, isDragging } = this.props;
    const { style, editingName } = this.state;
    if (!group || this.state.unmounted) {
      return null;
    }

    group.options = group.options || {};
    return connectDragSource(connectDropTarget(
      <div className='group-container'
        style={{ ...(!listView && !preview ? style : {}), backgroundColor: group.options.color || '', opacity: isDragging ? 0 : 1 }}>
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
            <Flex direction='row' align='center'>
              <MinimalisticButton className='group-settings-btn' icon='settings' onClick={() => this.deleteGroup()} />
              <CloseButton icon='close' onClick={() => this.deleteGroup()} />
            </Flex>
          </FlexChild>
        </Flex>

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
        const left = Math.round(item.position.x + delta.x);
        const top = Math.round(item.position.y + delta.y);

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
        group.position = group.position || {};
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
