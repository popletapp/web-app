import React, { Component } from 'react';

class CustomDragLayer extends Component {
  render () {
    const { item, itemType, isDragging } = this.props;
    function renderItem () {
      console.log(item);
      switch (itemType) {
        case 'note':
          return item;
        default:
          return null;
      }
    }
    if (!isDragging) {
      console.log('dragging!');
      return null;
    }
    return (
      <div>{renderItem()}</div>
    );
  }
}

export default CustomDragLayer;
