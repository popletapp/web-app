import React, { Component } from 'react';
import './CriticalFailure.scss';
import { Messages } from '../../../i18n';

class Connecting extends Component {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    return (
      <div className='center-on-page critical-failure animated fadeIn'>
        <h1>{Messages.CONNECTING_TITLE}</h1>
        <h2>{Messages.CONNECTING_BODY_LINE_1}</h2>
        <h4>{Messages.CONNECTING_BODY_LINE_2}</h4>
        <h5>{Messages.CONNECTING_BODY_LINE_3}</h5>
      </div>
    );
  }
}

export default Connecting;
