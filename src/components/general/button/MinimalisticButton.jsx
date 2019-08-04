import React, { Component } from 'react';
import { Flex } from './../../';
import { joinClasses } from './../../../util';
import './Button.scss';

class MinimalisticButton extends Component {
  render () {
    const { icon, className, style, onClick, children, size } = this.props;
    return (
      <button
        style={style}
        onClick={onClick}
        className={joinClasses('minimalistic-button', className)}>
        <Flex direction='row' align='center'>
          <i className={joinClasses('material-icons', children ? 'minimalistic-button-icon' : null)} style={{ fontSize: size || '1.3rem' }}>{icon}</i>
          {children}
        </Flex>
      </button>
    );
  }
}

export default MinimalisticButton;
