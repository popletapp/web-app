import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from './../components';

class ModalRenderer {
  constructor (modal) {
    this.modal = modal;
    this.element = null;
    this.container = document.querySelector('.modal-container');
    this.listener = (event) => {
      if (event.target.closest('.modal')) return;
      this.obliterate();
    }
    document.addEventListener('click', this.listener, false);
  }

  create () {
    const container = document.querySelector('.modal-container')
    container.style.display = 'block';
    this.element = <Modal title={this.modal.title} content={this.modal.content} />;
    ReactDOM.render(this.element, document.querySelector('.modal-container'));
  }

  destroy () {
    // TODO: Add single modal destruction
  }

  obliterate () {
    const container = document.querySelector('.modal-container');
    ReactDOM.render(null, container);
    container.style.display = 'none';
    document.removeEventListener('click', this.listener, false);
  }
}

export default ModalRenderer;