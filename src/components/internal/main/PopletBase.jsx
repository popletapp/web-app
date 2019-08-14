import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Poplet from './../../../';
import { connect as popletConnect } from './../../../modules';
import { Loader, CriticalFailure } from '../..';

class PopletBase extends Component {
  constructor () {
    super();
    this.state = {
      connecting: false,
      connected: false
    };
  }

  async init () {
    const store = Poplet.store;
    const state = store.getState();
    const { user = {}, connected } = state;
    const { connecting } = this.state;

    if (!connected && !connecting && (user && !user.id)) {
      this.setState({ connecting: true });
      const loader = document.querySelector('#loader');
      ReactDOM.render(<Loader />, loader);
      await popletConnect()
        .then(() => {
          this.setState({ connecting: false });
          setTimeout(() => {
            loader.style.display = 'none';
          }, 2000);
        })
        .catch(() => {
          ReactDOM.render(<CriticalFailure />, document.querySelector('#root'));
        });
    }
  }
}

export default PopletBase;
