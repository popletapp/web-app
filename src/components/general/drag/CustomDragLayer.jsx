import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import ComponentTypes from './../../../constants/ComponentTypes';

function getItemStyles (props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3
  };
}

class CustomDragLayer extends Component {
  render () {
    const { itemType, isDragging } = this.props;
    function renderItem () {
      switch (itemType) {
        case ComponentTypes.NOTE:
          return null; // <Note preview key='dragging-1' id={note.item.id} boardId={note.boardId} />;
        default:
          return null;
      }
    }
    if (!isDragging) {
      return null;
    }

    return (
      <div style={getItemStyles(this.props)}>
        <div>
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
