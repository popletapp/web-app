import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import './Button.scss';

class CloseButton extends Component {
  render () {
    const { filled, className, style, onClick } = this.props;
    return (
      <button
        style={style}
        onClick={onClick}
        className={joinClasses('close-button', filled ? 'close-button-filled' : null, className)}>
        <i className="material-icons">close</i>
      </button>
    );
  }
}

export default CloseButton;
