import React, { Component } from 'react';
import { popModal } from './../../../modules';

class Backdrop extends Component {
  click () {
    const container = document.getElementsByClassName('modal')[0]
    const backdrop = document.getElementsByClassName('backdrop')[0]
    if (container && backdrop) {
      container.classList.add('modal-exiting');
      backdrop.classList.add('backdrop-exiting');
    }
    setTimeout(() => popModal(), 150);
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
