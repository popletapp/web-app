import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import './Scroller.scss';

class HorizontalScroller extends Component {
  render () {
    const { className, children, style } = this.props;
    return (
      <div style={style} className='horizontal-scroller-container'>
        <div style={style} className={joinClasses('horizontal-scroller', className)}>
          {children}
        </div>
      </div>
    );
  }
}

export default HorizontalScroller;
