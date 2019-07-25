import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveNote, updateNote, beginSelection, endSelection, updateGroup } from './../../modules';
import { beginCreateNote } from './../../actions/note';
import { TopBar, Note, Group } from './../';
import ComponentTypes from './../../constants/ComponentTypes';
import './Board.scss';

import { DropTarget } from 'react-dnd';

function mapStateToProps (state) {
  return {
    notes: state.notes,
    groups: state.groups,
    listView: !!state.viewByBoard[state.selectedBoard]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    beginCreateNote: () => dispatch(beginCreateNote()),
    updateNote: note => dispatch(updateNote(note))
  };
}

class Board extends Component {
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

  async moveNote (note, top, left) {
    note.options = note.options || {};
    note.options.position = { x: left, y: top };
    await saveNote(this.props.object.id, note);
    return note;
  }

  async moveGroup (group, top, left) {
    group.options = group.options || {};
    group.options.position = { x: left, y: top };
    await updateGroup(this.props.object.id, group);
    return group;
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
      console.log(this.state.selecting, Math.abs((e.clientX + e.clientY) - (this.state.beganSelectionAt.x + this.state.beganSelectionAt.y)));
      if (!this.state.selecting && Math.abs((e.clientX + e.clientY) - (this.state.beganSelectionAt.x + this.state.beganSelectionAt.y)) > 30) {
        this.selectArea.hidden = 0;
        this.setState({ selecting: true });
        beginSelection(this.defaultSelection);
        console.log('Change inner selection point to ', this.state.beganSelectionAt.x, this.state.beganSelectionAt.y);
        this.changeSelectionPoint('x1', this.state.beganSelectionAt.x);
        this.changeSelectionPoint('y1', this.state.beganSelectionAt.y);
        this.changeSelectionPoint('x2', e.clientX);
        this.changeSelectionPoint('y2', e.clientY);
        this.calculateSelection();
      }

      if (this.state.mouseDown && this.state.selecting) {
        console.log('Change outer selection point to ', e.clientX, e.clientY);
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
    let notes = this.props.notes.items;
    const groups = this.props.groups;
    const { object: board, listView, connectDropTarget } = this.props;
    console.log('Render board', notes, groups);
    return connectDropTarget(
      <div className='board'>
        <TopBar board={board} />
        <div className='select-area' hidden></div>
        <div onMouseDown={(e) => this.onMouseDown(e)}
          onTouchStart={(e) => this.onMouseDown(e)}
          onMouseMove={(e) => this.onMouseMove(e)}
          onTouchMove={(e) => this.onMouseMove(e)}
          onMouseUp={(e) => this.onMouseUp(e)}
          onTouchEnd={(e) => this.onMouseUp(e)}
          className={`note-container${!listView ? ' drag-container droppable' : ' list-view'}`}>
          {(() => {
            for (const group of Object.values(groups)) {
              notes = notes.filter(note => !group.items.includes(note.id));
            }
            return notes.map(note => <Note key={note.id} id={note.id} boardId={board.id} />);
          })()}
          {groups && Object.values(groups).map(group => <Group key={group.id} id={group.id} boardId={board.id} notes={group.items} />)}
        </div>
      </div>
    );
  }
}

export default
connect(mapStateToProps, mapDispatchToProps)(
  DropTarget(
    [ComponentTypes.NOTE, ComponentTypes.GROUP],
    {
      drop (props, monitor, component) {
        if (!component || component.constructor !== Board) {
          return;
        }
        const delta = monitor.getDifferenceFromInitialOffset();
        const item = monitor.getItem();
        const type = monitor.getItemType();
        if (delta) {
          item.options = item.options || {};
          item.options.position = item.options.position || { x: 0, y: 0 };
          const left = Math.round(item.options.position.x + delta.x);
          const top = Math.round(item.options.position.y + delta.y);
          switch (type) {
            case ComponentTypes.NOTE:
              component.moveNote(item, top, left);
              break;
            case ComponentTypes.GROUP:
              component.moveGroup(item, top, left);
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
  )(Board)
);
