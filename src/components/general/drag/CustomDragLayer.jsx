import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import ComponentTypes from './../../../constants/ComponentTypes';
import { Note, Group } from './../../'; // eslint-disable-line

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
    const { item, itemType, isDragging } = this.props; // eslint-disable-line
    function renderItem () {
      switch (itemType) {
        case ComponentTypes.NOTE:
          return null; // <Note preview key='dragging-1' id={item.item.id} boardId={item.boardId} />;
        case ComponentTypes.GROUP:
          return null; // <Group preview key='dragging-1' id={item.item.id} boardId={item.boardId} />;
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
