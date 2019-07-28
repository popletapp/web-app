import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './List.scss';

class List extends Component {
  render () {
    const { className, children, style } = this.props;
    return (
      <div style={style} className='list-container'>
        <div className={joinClasses('list', className)}>
          {children}
        </div>
      </div>
    );
  }
}

export default List;
