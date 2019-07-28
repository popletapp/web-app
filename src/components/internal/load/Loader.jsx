import React, { Component } from 'react';
import './Loader.scss';

class Loader extends Component {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    return (
      <div className='loading fadeOutZoomIn'>
        <h1 className='poplet-title' style={{ position: 'absolute', left: '45%', top: '35%', margin: '0' }}>Poplet</h1>
        <div className='container' style={{ display: 'flex', flexDirection: 'column' }}>
          <div className='poplet-icon-bg-top' style={{ height: '47.2%', width: '100%' }} />
        </div>
        <div className='container' style={{ display: 'flex', flexDirection: 'row' }}>
          <div className='poplet-icon-bg-left' style={{ height: '100%', width: '48.2%' }} />
          <div className='poplet-icon-bg-bottom' style={{ position: 'absolute', bottom: '0', left: '47%', height: '47.2%', width: '120px' }} />
          <div className='poplet-icon-bg-right' style={{ position: 'absolute', left: '52%', height: '100%', width: '48%' }} />
        </div>
        <div className='poplet-loading'>
          <div className='poplet-loading-icon'>
            <div style={{ width: 258.65, height: 75.92 }}></div>
            <div style={{ display: 'flex', backgroundColor: 'transparent' }}>
              <div style={{ width: 82.22, height: 212.63, margin: '0' }}></div>
              <div className='poplet-icon-window openWindow' style={{ width: 61.35, height: 61.35, marginTop: '0.9em', marginLeft: '1.2em', borderRadius: 10 }}></div>
              <div style={{ width: 77.73, height: 61.35, marginTop: '0.9em', marginLeft: '1.15em', borderRadius: 10 }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loader;
