import React, { Component } from 'react';
import { connect } from 'react-redux';
import { moveNote, beginSelection, endSelection, moveGroup, isNoteInGroup, removeNoteFromGroup } from './../../modules';
import { Note, Group, Flex, FlexChild } from './../';
import ComponentTypes from './../../constants/ComponentTypes';
import './Board.scss';

import { DropTarget } from 'react-dnd';

function mapStateToProps (state) {
  return {
    notes: state.notesByBoard[state.selectedBoard],
    groups: state.groupsByBoard[state.selectedBoard],
    object: state.boards[state.selectedBoard],
    id: state.boards[state.selectedBoard].id,
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

class NoteContainer extends Component {
  constructor ({ object, notes }) {
    super();
    this.object = object;
    this.notes = notes;
    this.defaultSelection = {
      x1: 0,
      x2: 0,
      x3: 0,
      x4: 0,
      y1: 0,
      y2: 0,
      y3: 0,
      y4: 0
    };
    this.selection = this.defaultSelection;
    this.state = {
      beganSelectionAt: {},
      selecting: false
    };
  }

  onDragOver (event) {
    event.preventDefault();
  }

  get selectArea () {
    return document.querySelector('.select-area');
  }

  get selectionPoints () {
    return this.selection;
  }

  set selectionPoints (value) {
    this.selection = value;
  }

  changeSelectionPoint (point, value) {
    this.selection[point] = value;
  }

  calculateSelection () {
    const { x1, x2, y1, y2 } = this.selectionPoints;
    var x3 = Math.min(x1, x2);
    var x4 = Math.max(x1, x2);
    var y3 = Math.min(y1, y2);
    var y4 = Math.max(y1, y2);
    this.selectArea.style.left = `${x3}px`;
    this.selectArea.style.top = `${y3}px`;
    this.selectArea.style.width = `${x4 - x3}px`;
    this.selectArea.style.height = `${y4 - y3}px`;
  }

  onMouseDown (e) {
    let el = e.target;
    do {
      if (el.matches('.note')) return;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    this.setState({ mouseDown: true, selecting: false, beganSelectionAt: { x: e.clientX, y: e.clientY } });
    this.cancelSelect();
  }

  onMouseMove (e) {
    if (this.state.mouseDown) {
      if (!this.state.selecting && Math.abs((e.clientX + e.clientY) - (this.state.beganSelectionAt.x + this.state.beganSelectionAt.y)) > 30) {
        this.selectArea.hidden = 0;
        this.setState({ selecting: true });
        beginSelection(this.defaultSelection);
        this.changeSelectionPoint('x1', this.state.beganSelectionAt.x);
        this.changeSelectionPoint('y1', this.state.beganSelectionAt.y);
        this.changeSelectionPoint('x2', e.clientX);
        this.changeSelectionPoint('y2', e.clientY);
        this.calculateSelection();
      }

      if (this.state.mouseDown && this.state.selecting) {
        this.changeSelectionPoint('x2', e.clientX);
        this.changeSelectionPoint('y2', e.clientY);
        this.calculateSelection();
      }
    }
  }

  endSelect () {
    endSelection(this.selectionPoints);
    this.selectArea.hidden = 1;
    this.selection = this.defaultSelection;
    this.setState({ mouseDown: false, selecting: false, beganSelectionAt: {} });
    this.selectionPoints = this.defaultSelection;
  }

  cancelSelect () {
    this.selectArea.hidden = 1;
    this.selection = this.defaultSelection;
    this.setState({ mouseDown: false, selecting: false, beganSelectionAt: {} });
    this.selectionPoints = this.defaultSelection;
  }

  onMouseUp () {
    this.endSelect();
  }

  render () {
    let { object: board, listView, connectDropTarget, groups, notes } = this.props;
    notes = notes ? Object.values(notes) : [];
    groups = groups ? Object.values(groups) : [];

    return connectDropTarget(
      <div style={{ height: '100%', width: '100%', overflowX: 'scroll' }}>
        <Flex onMouseDown={(e) => this.onMouseDown(e)}
          onTouchStart={(e) => this.onMouseDown(e)}
          onMouseMove={(e) => this.onMouseMove(e)}
          onTouchMove={(e) => this.onMouseMove(e)}
          onMouseUp={(e) => this.onMouseUp(e)}
          onTouchEnd={(e) => this.onMouseUp(e)}
          className={`note-container${!listView ? ' drag-container droppable' : ' list-view'}`}>
          <div className='select-area' hidden></div>
          <FlexChild>
            {(() => {
              for (const group of groups) {
                notes = notes.filter(note => !group.items.includes(note.id));
              }
              console.log(notes);
              return notes.map((note, i) => note.id ? <Note key={note.id} id={note.id} boardId={board.id} /> : <Note key={i} note={note} boardId={board.id} />);
            })()}
            {groups && Object.values(groups).map(group => <Group key={group.id} id={group.id} boardId={board.id} />)}
          </FlexChild>
        </Flex>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DropTarget(
  [ComponentTypes.NOTE, ComponentTypes.GROUP],
  {
    drop (props, monitor, component) {
      if (!component) {
        return;
      }

      const cursor = monitor.getSourceClientOffset();
      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();
      const data = item.item;
      const type = monitor.getItemType();
      if (delta) {
        data.options = data.options || {};
        data.options.position = data.options.position || { x: 0, y: 0 };
        // TODO: current issue is that the position of a note in a group is 0, so x + negative x makes the note go off screen
        // need to somehow get the client X, or get the relative position from the group
        let left = Math.round(data.options.position.x + delta.x);
        let top = Math.round(data.options.position.y + delta.y);
        switch (type) {
          case ComponentTypes.NOTE:
            const group = isNoteInGroup(data.id);
            if (group) {
              left = Math.round(cursor.x + delta.x);
              top = Math.round(cursor.y + delta.y);
              removeNoteFromGroup(component.props.id, group, data.id);
            }
            moveNote(props.id, data.id, { y: top, x: left });
            break;
          case ComponentTypes.GROUP:
            moveGroup(props.id, data.id, { y: top, x: left });
            break;
          default:
            break;
        }
      }

      if (props.snapToGrid) {
      // [left, top] = snapToGrid(left, top);
      }
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(NoteContainer)
);
