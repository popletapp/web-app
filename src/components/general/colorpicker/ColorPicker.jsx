import { TwitterPicker } from 'react-color';
import React, { Component } from 'react';
import { Popout, Flex, FlexChild } from '../../';

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

    const ColorPickerPopout = class ColorPickerPopout extends Popout {
      content () {
        return (<Flex className='popout'>
          <FlexChild className='popout-content'>
            <TwitterPicker style={{ backgroundColor: '#212121', padding: 0 }} triangle='hide' width='205px' onChangeComplete={(color) => onChangeComplete(color)} />
          </FlexChild>
        </Flex>)
      }
    }

    return (<ColorPickerPopout>
    <div className='color-picker'>
      <button
        style={{ backgroundColor: color, width: '50px', height: '25px', border: 'none', cursor: 'pointer' }}
        data-for='color-picker-popout'
        data-tip='1'
        data-event='click'></button>
      </div>
    </ColorPickerPopout>);
  }
}

export default ColorPicker;
