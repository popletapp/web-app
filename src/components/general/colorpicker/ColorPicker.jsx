import { TwitterPicker } from 'react-color';
import React, { Component } from 'react';
import Tooltip from 'react-tooltip';

class ColorPicker extends Component {
  constructor ({ color, onChangeComplete }) {
    super();
    this.color = color;
    this.onChangeComplete = onChangeComplete;
  }

  render () {
    return <div className='color-picker'>
      <button style={{ backgroundColor: this.color, width: '50px', height: '25px', border: 'none' }} data-for='color-picker-popout' data-tip='1' data-event='click' data-event-off='dblclick'></button>
      <Tooltip id='color-picker-popout' clickable={true} getContent={() => <TwitterPicker triangle='hide' width='205px' onChangeComplete={(color) => this.onChangeComplete(color)} />}></Tooltip>
    </div>
  }
}

export default ColorPicker; 