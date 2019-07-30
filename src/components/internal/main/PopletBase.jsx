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
      ReactDOM.render(<Loader />, document.querySelector('#loader'));
      await popletConnect()
        .then(() => {
          this.setState({ connecting: false });
        })
        .catch(() => {
          ReactDOM.render(<CriticalFailure />, document.querySelector('#root'));
        });
    }
  }
}

export default PopletBase;
