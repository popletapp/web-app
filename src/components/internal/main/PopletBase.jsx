import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from './../../../modules';
import { Loader, CriticalFailure } from '../..';

class PopletBase extends Component {
  constructor () {
    super();
    this.state = {
      connected: false
    };
  }

  async init () {
    if (!this.state.connected) {
      ReactDOM.render(<Loader />, document.querySelector('#loader'));
      await connect()
        .then(() => {
          console.log('connected');
          this.setState({ connected: true });
        })
        .catch(() => {
          ReactDOM.render(<CriticalFailure />, document.querySelector('#root'));
        });
    }
  }
}

export default PopletBase;
