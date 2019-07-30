import { TwitterPicker } from 'react-color';
import React, { Component } from 'react';
import { Tooltip } from './../../';

class ColorPicker extends Component {
  constructor ({ color, onChangeComplete }) {
    super();
    this.color = color;
    this.onChangeComplete = onChangeComplete;
  }

  render () {
    return <Tooltip text='HEYO'>
      <div className='color-picker'>
        <button style={{ backgroundColor: this.color, width: '50px', height: '25px', border: 'none' }} data-for='color-picker-popout' data-tip='1' data-event='click'></button>
        <TwitterPicker style={{ backgroundColor: '#212121', padding: 0 }} triangle='hide' width='205px' onChangeComplete={(color) => this.onChangeComplete(color)} />
      </div>
    </Tooltip>;
  }
}

export default ColorPicker;
