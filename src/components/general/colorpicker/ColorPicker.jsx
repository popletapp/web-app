import { TwitterPicker } from 'react-color';
import React, { Component } from 'react';
import { createPopout } from '../../../modules';

class ColorPicker extends Component {
  constructor ({ color, onChangeComplete }) {
    super();
    this.color = color;
    this.onChangeComplete = onChangeComplete;
  }

  render () {
    let { color, onChangeComplete } = this.props;
    if (!onChangeComplete) {
      onChangeComplete = () => void 0;
    }
    const popout = <TwitterPicker style={{ backgroundColor: '#212121', padding: 0 }} triangle='hide' width='205px' onChangeComplete={(color) => onChangeComplete(color)} />;
    return (<div className='color-picker'>
      <button
        onClick={(e) => createPopout('color-picker', popout, { position: { x: e.clientX, y: e.clientY } })}
        style={{ backgroundColor: color, width: '50px', height: '25px', border: 'none' }}
        data-for='color-picker-popout'
        data-tip='1'
        data-event='click'></button>
    </div>);
  }
}

export default ColorPicker;
