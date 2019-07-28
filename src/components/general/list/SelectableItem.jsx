import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './SelectableItem.scss';

class SelectableItem extends Component {
  render () {
    const { selected, className, children } = this.props;
    return (
      <div className='selectable-item' onClick={this.props.onClick}>
        <div className={joinClasses('selectable-item-content', className, selected ? 'selectable-item-selected' : null)}>
          {children}
        </div>
      </div>
    );
  }
}

export default SelectableItem;
