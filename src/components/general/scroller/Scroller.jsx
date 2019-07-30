import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './Scroller.scss';

class Scroller extends Component {
  render () {
    const { className, children, style } = this.props;
    return (
      <div style={style} className='scroller-container'>
        <div className={joinClasses('scroller', className)}>
          {children}
        </div>
      </div>
    );
  }
}

export default Scroller;
