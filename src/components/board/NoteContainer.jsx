import React, { Component } from 'react';
import { connect } from 'react-redux';
import { moveNote, beginSelection, endSelection, moveGroup, isNoteInGroup, removeNoteFromGroup } from './../../modules';
import { Note, Group } from './../';
import ComponentTypes from './../../constants/ComponentTypes';
import './Board.scss';

import { DropTarget } from 'react-dnd';

function mapStateToProps (state) {
  return {
    notes: state.notesByBoard[state.selectedBoard],
    groups: state.groupsByBoard[state.selectedBoard],
    object: state.boards[state.selectedBoard],
    id: state.boards[state.selectedBoard].id,
    listView: !!state.viewByBoard[state.selectedBoard],
    zoomLevel: state.zoomLevel[state.selectedBoard]
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
      selecting: false,
      mouseDown: false
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
    const container = document.getElementsByClassName('note-container')[0];
    if (container) {
      const bounding = container.getBoundingClientRect();
      const x3 = Math.min(x1, x2) - bounding.x;
      const x4 = Math.max(x1, x2) - bounding.x;
      const y3 = Math.min(y1, y2) - bounding.y;
      const y4 = Math.max(y1, y2) - bounding.y;

      this.selectArea.style.left = `${x3}px`;
      this.selectArea.style.top = `${y3}px`;
      this.selectArea.style.width = `${x4 - x3}px`;
      this.selectArea.style.height = `${y4 - y3}px`;
    }
  }

  onMouseDown (e) {
    let el = e.target;
    do {
      if (el.matches('.note')) return;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    this.setState({ mouseDown: true, selecting: false, beganSelectionAt: { x: e.clientX, y: e.clientY } });
  }

  onMouseMove (e, touch = false) {
    if (this.state.mouseDown || touch) {
      if (!this.state.selecting && Math.abs((e.clientX + e.clientY) - (this.state.beganSelectionAt.x + this.state.beganSelectionAt.y)) > 2) {
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
    this.selectArea.hidden = 1;
    this.selection = this.defaultSelection;
    this.setState({ mouseDown: false, selecting: false, beganSelectionAt: {} });
    this.selectionPoints = this.defaultSelection;
    endSelection(this.selectionPoints);
  }

  onMouseUp () {
    this.endSelect();
  }

  render () {
    let { object: board, listView, connectDropTarget, groups, notes, zoomLevel } = this.props;
    notes = notes ? Object.values(notes) : [];
    groups = groups ? Object.values(groups) : [];
    const style = zoomLevel === 1 ? {} : { transform: `scale(${zoomLevel})` };

    return connectDropTarget(
      <div
        onMouseDown={(e) => this.onMouseDown(e)}
        onTouchStart={(e) => this.onMouseDown(e, true)}
        onMouseMove={(e) => this.onMouseMove(e)}
        onTouchMove={(e) => this.onMouseMove(e, true)}
        onMouseUp={(e) => this.onMouseUp(e)}
        onTouchEnd={(e) => this.onMouseUp(e)}
        className={`note-container${!listView ? ' drag-container droppable' : ' list-view'}`}>
        <div className='select-area' hidden></div>
        <div className='grid-formation'></div>

        {(() => {
          for (const group of groups) {
            notes = notes.filter(note => !group.items.includes(note.id));
          }
          return notes.map((note, i) => <Note style={style} key={note.id ? note.id : note} id={note.id ? note.id : note} boardId={board.id} />);
        })()}
        {!!groups.length && Object.values(groups).map(group => <Group style={style} key={group.id} id={group.id} boardId={board.id} />)}
      </div>
    );
  }
}

function snapToGrid (x, y) {
  const snappedX = Math.round(x / 32) * 32;
  const snappedY = Math.round(y / 32) * 32;
  return [snappedX, snappedY];
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
        data.position = data.position || {};
        // TODO: current issue is that the position of a note in a group is 0, so x + negative x makes the note go off screen
        // need to somehow get the client X, or get the relative position from the group
        let left = Math.round(data.position.x + delta.x) || 0;
        let top = Math.round(data.position.y + delta.y) || 0;

        // Snap to grid functionality
        if (props.object.type === 1) {
          const [leftPos, topPos] = snapToGrid(left, top);
          left = leftPos;
          top = topPos;
        }

        switch (type) {
          case ComponentTypes.NOTE:
            const group = isNoteInGroup(data.id);
            if (group) {
              left = Math.round(cursor.x);
              top = Math.round(cursor.y);
              removeNoteFromGroup(props.id, group, data.id);
              setTimeout(() => moveNote(props.id, data.id, { y: top, x: left }), 100);
            } else {
              moveNote(props.id, data.id, { y: top, x: left });
            }
            break;
          case ComponentTypes.GROUP:
            moveGroup(props.id, data.id, { y: top, x: left });
            break;
          default:
            break;
        }
      }
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(NoteContainer)
);
