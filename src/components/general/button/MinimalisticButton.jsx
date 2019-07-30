import React, { Component } from 'react';
import { joinClasses } from './../../../util';
import './Button.scss';

class MinimalisticButton extends Component {
  render () {
    const { icon, className, style, onClick } = this.props;
    return (
      <button
        style={style}
        onClick={onClick}
        className={joinClasses('minimalistic-button', className)}>
        <i className="material-icons">{icon}</i>
      </button>
    );
  }
}

export default MinimalisticButton;
