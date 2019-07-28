import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import { Note } from './../../';
import ComponentTypes from './../../../constants/ComponentTypes';

function getItemStyles (props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  const { x, y } = currentOffset;
  console.log(x, y);
  const transform = `translate(${y}px, ${x}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends Component {
  render () {
    const { item: note, itemType, isDragging } = this.props;
    function renderItem () {
      switch (itemType) {
        case ComponentTypes.NOTE:
          return <Note key='dragging-1' id={note.item.id} boardId={note.boardId} />;
        default:
          return null;
      }
    }
    if (!isDragging) {
      return null;
    }

    return (
      <div style={getItemStyles(this.props)}>
        <div style={{ transform: 'rotate(-7deg)' }}>
          {renderItem()}
        </div>
      </div>
    );
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(CustomDragLayer);
