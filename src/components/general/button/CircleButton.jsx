import React, { Component } from 'react';
import { joinClasses } from '../../../util';
import './Button.scss';

class CircleButton extends Component {
  render () {
    const { icon, color, onClick, style, className } = this.props;
    return (
      <button
        style={style}
        onClick={onClick}
        className={joinClasses('btn-small btn-circle', color, className)}>
        <i className="material-icons">{icon}</i>
      </button>
    );
  }
}

export default CircleButton;
