import React, { Component } from 'react';
import './Button.scss';
import { Flex } from '../..';
import { joinClasses } from '../../../util';

class Checkbox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      checked: null
    }
  }

  onClick () {
    const { onClick } = this.props;
    const { checked } = this.state;
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
    this.setState({ checked: !checked });
  }

  render () {
    const { small, radio, label, className, initialState, checked: customCheck } = this.props;
    let { checked } = this.state;
    if (checked === null) {
      checked = initialState;
    }
    if (customCheck !== undefined) {
      checked = customCheck;
    }
    if (radio) {
      return (
        <Flex direction='row' align='center' onClick={() => this.onClick()} className={joinClasses('radiobutton', className)}>
          <input type='checkbox' checked={checked} onChange={() => void 0}></input>
          <label className='radiobutton-label'>{label}</label>
        </Flex>
      )
    }
    return (
      <Flex direction='row' align='center' onClick={() => this.onClick()} className={joinClasses('checkbox', className)}>
        <input type='checkbox' checked={checked} onChange={() => void 0}></input>
        <label className='checkbox-label'>{label}</label>
      </Flex>
    );
  }
}

export default Checkbox;
