import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './SelectableItem.scss';

class SelectableItem extends Component {
  onClick (event) {
    const { onClick, onRightClick } = this.props;
    if (typeof onClick === 'function') {
      if (event.nativeEvent.which === 3) {
        event.preventDefault();
        onRightClick(event);
      } else if (event.nativeEvent.which === 1) {
        onClick(event);
      }
    }
  }

  render () {
    const { selected, className, children } = this.props;
    return (
      <div className='selectable-item' onClick={e => this.onClick(e)} onContextMenu={e => this.onClick(e)}>
        <div className={joinClasses('selectable-item-content', className, selected ? 'selectable-item-selected' : null)}>
          {children}
        </div>
      </div>
    );
  }
}

export default SelectableItem;
