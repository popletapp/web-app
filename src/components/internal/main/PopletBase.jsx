import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect as popletConnect } from './../../../modules';
import { connect } from 'react-redux';
import { Loader, CriticalFailure } from '../..';

function mapStateToProps (state) {
  return {
    user: state.user
  };
}

class PopletBase extends Component {
  constructor () {
    super();
    this.state = {
      connecting: false,
      connected: false
    };
  }

  async init () {
    const { user } = this.props;
    const { connecting, connected } = this.props;

    if (!connected && !connecting && ((user && !user.id) || !user)) {
      this.setState({ connecting: true });
      ReactDOM.render(<Loader />, document.querySelector('#loader'));
      await popletConnect()
        .then(() => {
          this.setState({ connected: true, connecting: false });
        })
        .catch(() => {
          ReactDOM.render(<CriticalFailure />, document.querySelector('#root'));
        });
    }
  }
}

connect(mapStateToProps, null)(PopletBase);
export default PopletBase;
