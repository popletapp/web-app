import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from './../../../modules';
import { CriticalFailure, Loader } from '../..';

class PopletBase extends Component {
  async componentWillMount () {
    ReactDOM.render(<Loader />, document.querySelector('#loader'));
    await connect()
      .catch(() => {
        ReactDOM.render(<CriticalFailure />, document.querySelector('#root'));
      });
  }
}

export default PopletBase;
