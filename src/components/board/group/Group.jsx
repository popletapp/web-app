import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Note, Editor, FlexChild, Flex, CloseButton, MinimalisticButton, GroupSettingsModal, ConfirmModal } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';
import './Group.scss';
import { addNoteToGroup, moveGroup, updateGroup, deleteGroup, createModal } from '../../../modules';
import { permissions } from './../../../util';
import Draggable from 'react-draggable';

function mapStateToProps (state, props) {
  return {
    notes: state.groupsByBoard[props.boardId][props.id]
      ? state.groupsByBoard[props.boardId][props.id].items.map(note => state.notesByBoard[props.boardId][note])
      : [],
    group: state.groupsByBoard[props.boardId][props.id],
    listView: !!state.viewByBoard[props.boardId],
    board: state.boards[props.boardId]
  };
}

class Group extends Component {
  constructor ({ boardId, group }) {
    super();
    this.boardId = boardId;
    this.group = group;
    this.groupRef = React.createRef();
    this.wasDraggedByClient = false;
    this.state = {
      editingName: false,
      style: {},
      position: null
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

  componentDidUpdate (oldProps) {
    const { group } = this.props;
    const { style } = this.state;

    if (group && group.position) {
      if (style.transform !== `translate(${group.position.x}px, ${group.position.y}px)`) {
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

    const transform = `translate(${group.position.x}px, ${group.position.y}px)`;
    this.setState({
      style: {
        ...this.state.style,
        transform,
        WebkitTransform: transform
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
    const modal = {
      title: 'Are you sure?',
      content: 'Deleting this group will also delete all of the notes inside of it.'
    }
    createModal(<ConfirmModal onConfirm={() => deleteGroup(boardId, group.id)} title={modal.title} content={modal.content} />)
  }

  onDragStart () {
    const { group, board } = this.props;
    this.wasDraggedByClient = true;
    if (board.type === 1) {
      const container = document.getElementsByClassName('note-container')[0];
      container.style.backgroundSize = '32px 32px';
      container.style.backgroundImage = 'radial-gradient(circle, #424242 1px, transparent 1px)';
    }
  }

  onDrag (event, data) {
    const { group } = this.props;
    if (data) {
      const newPosition = { x: data.x, y: data.y };
      if (group.position !== newPosition) {
        this.setState({ position: newPosition })
        this.wasDraggedByClient = true;
      }
    }
  }

  async onDragStop () {
    const { group, boardId } = this.props;
    const { position } = this.state;
    const container = document.getElementsByClassName('note-container')[0];
    container.style.backgroundSize = '';
    container.style.backgroundImage = '';
    this.wasDraggedByClient = true;
    setTimeout(() => { this.wasDraggedByClient = false; }, 100);
    await moveGroup(boardId, group.id, position);
  }

  getBounds () {
    const node = this.groupRef.current;
    if (!node) {
      return {
        left: 0,
        top: 0
      }
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
    let { group, notes, boardId, listView, preview, style: styleProps, board } = this.props;
    const { style, editingName } = this.state;
    if (!group || this.state.unmounted) {
      return null;
    }
    const bounds = this.getBounds();

    group.options = group.options || {};
    return <Draggable
      onStart={(...args) => this.onDragStart(...args)}
      onDrag={(...args) => this.onDrag(...args)}
      onStop={(...args) => this.onDragStop(...args)}
      disabled={!permissions.has('MOVE_NOTES')}
      handle='.group-header'
      defaultPosition={group.position}
      bounds={{ top: bounds.top, left: bounds.left }}
      grid={board.type === 1 ? [ 32, 32 ] : void 0}>
      <div className='group-container'
        ref={this.groupRef}
        style={{
          ...styleProps,
          ...(!listView && !preview ? style : {}),
          backgroundColor: group.options.color || '',
          opacity: 1,
          ...(this.wasDraggedByClient ? { transition: 'none' } : {}),
        }}>
        <Flex direction='row' align='center' className='group-header'>
          <FlexChild direction='row' align='center'>
            <div className='group-header-note-count'>
              {group.items.length}
            </div>

            <Editor
              maxLength='64'
              className='group-header-name'
              editing={permissions.has('MANAGE_NOTES') && editingName.toString()}
              onMouseEnter={() => this.setState({ editingName: true })}
              onBlur={(e) => this.updateGroupName(e)}>
              {group.name}
            </Editor>
          </FlexChild>

          <FlexChild grow={0} align='right' direction='row'>
            {permissions.has('MANAGE_NOTES') && <Flex direction='row' align='center'>
              <MinimalisticButton className='group-settings-btn' icon='settings' onClick={() => createModal(<GroupSettingsModal boardID={boardId} groupID={group.id} />)} />
              <CloseButton icon='close' onClick={() => this.deleteGroup()} />
            </Flex>}
          </FlexChild>
        </Flex>

        <div className='group'>
          {notes && notes.filter(Boolean).map((note, i) => <Note key={i} id={note.id} boardId={boardId} />)}
        </div>
      </div>
    </Draggable>
  }
}

export default connect(mapStateToProps, null)(Group);
