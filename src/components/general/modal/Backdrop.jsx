import React, { Component } from 'react';
import { popModal } from './../../../modules';

class Backdrop extends Component {
  click () {
    popModal();
  }

  render () {
    return (
      <div
        onClick={(e) => this.click()}
        style={{
          opacity: 0.85,
          backgroundColor: 'rgb(0, 0, 0)',
          transform: 'translateZ(0px)'
        }} className='backdrop' />
    );
  }
}

export default Backdrop;
