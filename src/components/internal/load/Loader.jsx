import React, { Component } from 'react';
import './Loader.scss';

class Loader extends Component {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    return (
      <div className='poplet-loading'>
        <div className='poplet-loading-icon fadeOutZoomIn'>
          <img src='./assets/icons/poplet_white_no_bg_window.svg' alt=''></img>
        </div>
      </div>
    );
  }
}

export default Loader;
