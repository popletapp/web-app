import React, { Component } from 'react';
import { popModal } from './../../../modules';

class Backdrop extends Component {
  click () {
    const modals = Array.from(document.getElementsByClassName('modal'));
    const modal = modals.sort((a, b) => new Date(b.dataset.timestamp) - new Date(a.dataset.timestamp)).reverse()[0];

    const backdrop = document.getElementsByClassName('backdrop')[0];
    if (modal && backdrop) {
      modal.classList.add('modal-exiting');
      if (modals.length - 1 < 1) {
        backdrop.classList.add('backdrop-exiting');
      }
    }
    setTimeout(() => popModal(), 150);
  }

  render () {
    return (
      <div
        onClick={(e) => this.click()}
        data-timestamp={Date.now()}
        style={{
          opacity: 0.85,
          backgroundColor: 'rgb(0, 0, 0)',
          transform: 'translateZ(0px)'
        }} className='backdrop' />
    );
  }
}

export default Backdrop;
