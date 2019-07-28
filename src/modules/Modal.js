import ReactDOM from 'react-dom';

class ModalRenderer {
  constructor (modal) {
    this.element = modal;

    this.container = document.querySelector('.modal-container');
  }

  createBackdrop () {
    const container = document.querySelector('.modal-container');
    container.style.display = 'block';
    container.style.opacity = '1';
    this.listener = (event) => {
      if (event.target.closest('.modal')) return;
      this.obliterate();
    };
    document.addEventListener('click', this.listener, false);
  }

  hideBackdrop () {
    const container = document.querySelector('.modal-container');
    container.style.display = 'none';
    container.style.opacity = '0';
  }

  destroy () {
    // TODO: Add single modal destruction
  }

  obliterate () {
    const container = document.querySelector('.modal-container');
    ReactDOM.render(null, container);
    container.style.display = 'none';
    container.style.opacity = '0';
    document.removeEventListener('click', this.listener, false);
  }
}

export default ModalRenderer;
